import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const getEmojiMarkerIcon = (emoji, bg = '#ffffff', borderColor = '#ef4444') => {
  const canvas = document.createElement('canvas');
  canvas.width = 44;
  canvas.height = 44;
  const ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.arc(22, 22, 20, 0, 2 * Math.PI);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = borderColor;
  ctx.stroke();

  ctx.font = '22px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 22, 22);

  return canvas.toDataURL();
};

/**
 * OrderTrackingModal Component - Swiggy / Zomato Premium Real-Time Live Tracking
 */
export const OrderTrackingModal = ({ order, onClose }) => {
  const mapRef = useRef(null);
  const googleMapInstanceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const restMarkerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const leafletIframeRef = useRef(null);

  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState(false);
  const [distanceText, setDistanceText] = useState('3.5 km');
  const [durationText, setDurationText] = useState('18 mins');
  const [socketConnected, setSocketConnected] = useState(false);
  const [lastGpsUpdateTime, setLastGpsUpdateTime] = useState(null);

  const [apiKey, setApiKey] = useState(
    localStorage.getItem('avantika_google_maps_key') ||
    (import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) ||
    ''
  );
  const [showKeyInput, setShowKeyInput] = useState(false);

  const orderId = order?.orderId || order?._id || order?.id || 'AV-18293746';
  const currentStatus = trackingData?.orderStatus || order?.orderStatus || 'Preparing';
  const itemCount = order?.orderedItems?.length || (order?.items ? order.items.split(',').length : 2);
  const restaurantName = trackingData?.restaurantLocation?.name || 'Avantika Restaurant';

  // 1. Fetch initial tracking details from backend
  const fetchTrackingInfo = async () => {
    try {
      const res = await fetch(`http://localhost:45000/api/orders/track/${orderId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setTrackingData(json.data);
      }
    } catch (err) {
      console.warn('[USER TRACKING] HTTP fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Real-Time Socket.IO Location Stream Subscription
  useEffect(() => {
    fetchTrackingInfo();

    let socket = null;
    try {
      socket = io('http://localhost:45000', {
        transports: ['websocket', 'polling'],
        reconnection: true,
      });

      socket.on('connect', () => {
        console.log('[USER SOCKET] Connected to server, joining room: order:' + orderId);
        socket.emit('join:order', { orderId, role: 'customer' });
        setSocketConnected(true);
      });

      socket.on('disconnect', () => {
        setSocketConnected(false);
      });

      socket.on('delivery:location:update', (data) => {
        console.log('[USER SOCKET] Received Real-Time GPS Update:', data);
        if (data && data.latitude && data.longitude) {
          const newLat = Number(data.latitude);
          const newLng = Number(data.longitude);
          setLastGpsUpdateTime(new Date());

          setTrackingData(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              deliveryBoy: {
                ...(prev.deliveryBoy || {}),
                location: {
                  latitude: newLat,
                  longitude: newLng,
                  heading: data.heading || 0,
                  speed: data.speed || 0,
                  address: 'Live Physical GPS',
                  lastUpdated: new Date()
                }
              }
            };
          });

          // Send real-time update to Leaflet map iframe if loaded
          if (leafletIframeRef.current && leafletIframeRef.current.contentWindow) {
            leafletIframeRef.current.contentWindow.postMessage({
              type: 'UPDATE_RIDER_GPS',
              latitude: newLat,
              longitude: newLng,
              heading: data.heading || 0
            }, '*');
          }
        }
      });
    } catch (err) {
      console.warn('[USER SOCKET ERROR]', err);
    }

    const interval = setInterval(fetchTrackingInfo, 5000);

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.emit('leave:order', { orderId });
        socket.disconnect();
      }
    };
  }, [orderId]);

  // 3. Load Google Maps JS SDK dynamically if API Key is set
  useEffect(() => {
    if (!apiKey) {
      setMapsLoaded(false);
      return;
    }

    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }

    const scriptId = 'google-maps-js-sdk';
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      existingScript.onload = () => setMapsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey.trim()}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapsLoaded(true);
    script.onerror = () => setMapsError(true);
    document.head.appendChild(script);
  }, [apiKey]);

  // 4. Initialize & Update Google Map
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !window.google) return;

    try {
      const restLat = trackingData?.restaurantLocation?.latitude || 27.596704;
      const restLng = trackingData?.restaurantLocation?.longitude || 76.632114;
      const userLat = trackingData?.userLocation?.latitude || 27.6208;
      const userLng = trackingData?.userLocation?.longitude || 76.6436;

      const restPos = { lat: restLat, lng: restLng };
      const userPos = { lat: userLat, lng: userLng };

      if (!googleMapInstanceRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: (restLat + userLat) / 2, lng: (restLng + userLng) / 2 },
          zoom: 14,
          disableDefaultUI: true,
          styles: [
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', stylers: [{ visibility: 'off' }] }
          ]
        });
        googleMapInstanceRef.current = map;
      }

      const map = googleMapInstanceRef.current;

      const directionsService = new window.google.maps.DirectionsService();
      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#f97316',
            strokeWeight: 6,
            strokeOpacity: 0.95
          }
        });
      }

      directionsService.route(
        {
          origin: restPos,
          destination: userPos,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === 'OK' && result) {
            directionsRendererRef.current.setDirections(result);
            const leg = result.routes[0]?.legs[0];
            if (leg) {
              setDistanceText(leg.distance.text);
              setDurationText(leg.duration.text);
            }
          }
        }
      );

      // Restaurant Marker Pin
      if (!restMarkerRef.current) {
        restMarkerRef.current = new window.google.maps.Marker({
          position: restPos,
          map: map,
          title: restaurantName,
          icon: {
            url: getEmojiMarkerIcon('🏪', '#ffffff', '#0f172a'),
            scaledSize: new window.google.maps.Size(40, 40)
          }
        });
      }

      // Customer Marker Pin
      if (!userMarkerRef.current) {
        userMarkerRef.current = new window.google.maps.Marker({
          position: userPos,
          map: map,
          title: 'Customer Address',
          icon: {
            url: getEmojiMarkerIcon('🏠', '#ffffff', '#10b981'),
            scaledSize: new window.google.maps.Size(40, 40)
          }
        });
      }

      // Rider Marker Pin using REAL-TIME GPS coordinates
      const liveRiderLat = trackingData?.deliveryBoy?.location?.latitude || restLat;
      const liveRiderLng = trackingData?.deliveryBoy?.location?.longitude || restLng;
      const riderPos = { lat: Number(liveRiderLat), lng: Number(liveRiderLng) };

      if (!riderMarkerRef.current) {
        riderMarkerRef.current = new window.google.maps.Marker({
          position: riderPos,
          map: map,
          title: trackingData?.deliveryBoy?.name || 'Delivery Partner',
          icon: {
            url: getEmojiMarkerIcon('🛵', '#ef4444', '#ffffff'),
            scaledSize: new window.google.maps.Size(44, 44)
          }
        });
      } else {
        riderMarkerRef.current.setPosition(riderPos);
      }
    } catch (e) {
      console.warn('Google maps rendering notice:', e);
    }
  }, [mapsLoaded, trackingData]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('avantika_google_maps_key', apiKey.trim());
      setShowKeyInput(false);
    }
  };

  const riderName = trackingData?.deliveryBoy?.name || order?.deliveryBoyName || order?.deliveryBoy?.name || 'Ashwani Raj';
  const riderPhone = trackingData?.deliveryBoy?.phone || '+919876543210';
  const liveRiderLat = trackingData?.deliveryBoy?.location?.latitude || 27.6085;
  const liveRiderLng = trackingData?.deliveryBoy?.location?.longitude || 76.6385;
  const restLat = trackingData?.restaurantLocation?.latitude || 27.596704;
  const restLng = trackingData?.restaurantLocation?.longitude || 76.632114;
  const userLat = trackingData?.userLocation?.latitude || 27.6208;
  const userLng = trackingData?.userLocation?.longitude || 76.6436;

  const getStatusTitle = () => {
    if (currentStatus === 'Out for Delivery') return 'Partner is on the way';
    if (currentStatus === 'Delivered') return 'Order Delivered!';
    if (currentStatus === 'Picked Up') return 'Picking your order now';
    return 'Order Received!';
  };

  const getStatusSubtitle = () => {
    if (currentStatus === 'Out for Delivery') return `${riderName} is on the way to deliver your order`;
    if (currentStatus === 'Delivered') return 'Your food package has been handed over successfully';
    return `${riderName} is at the restaurant, and is about to pick your order`;
  };

  // Interactive Leaflet Vector Map HTML template for live tracking when Google key is not set
  const leafletMapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html, #map { width: 100%; height: 100%; margin: 0; padding: 0; background: #0f172a; }
        .pin-card { background: #ffffff; padding: 3px 6px; border-radius: 6px; font-size: 10px; font-weight: 800; color: #0f172a; border: 1px solid #cbd5e1; white-space: nowrap; }
        .cust-card { background: #10b981; color: #fff; border: none; }
        .rider-beacon { width: 40px; height: 40px; border-radius: 50%; background: #ef4444; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(239,68,68,0.4); display: flex; align-items: center; justify-content: center; font-size: 20px; transition: all 0.8s ease; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false }).setView([${(restLat + userLat) / 2}, ${(restLng + userLng) / 2}], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        var restIcon = L.divIcon({ className: '', html: '<div class="pin-card">🏪 ${restaurantName.replace(/'/g, "\\'")}</div>', iconAnchor: [30, 15] });
        var custIcon = L.divIcon({ className: '', html: '<div class="pin-card cust-card">🏠 Customer</div>', iconAnchor: [30, 15] });
        var riderIcon = L.divIcon({ className: '', html: '<div class="rider-beacon">🛵</div>', iconSize: [40, 40], iconAnchor: [20, 20] });

        L.marker([${restLat}, ${restLng}], { icon: restIcon }).addTo(map);
        L.marker([${userLat}, ${userLng}], { icon: custIcon }).addTo(map);

        var riderMarker = L.marker([${liveRiderLat}, ${liveRiderLng}], { icon: riderIcon }).addTo(map);

        var polyline = L.polyline([[${restLat}, ${restLng}], [${liveRiderLat}, ${liveRiderLng}], [${userLat}, ${userLng}]], { color: '#f97316', weight: 5 }).addTo(map);

        var bounds = L.latLngBounds([[${restLat}, ${restLng}], [${userLat}, ${userLng}]]);
        map.fitBounds(bounds, { padding: [40, 40] });

        window.addEventListener('message', function(event) {
          if (event.data && event.data.type === 'UPDATE_RIDER_GPS') {
            var newPos = [event.data.latitude, event.data.longitude];
            riderMarker.setLatLng(newPos);
            polyline.setLatLngs([[${restLat}, ${restLng}], newPos, [${userLat}, ${userLng}]]);
            map.panTo(newPos, { animate: true });
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 20005,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        boxSizing: 'border-box'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '92vh',
          maxHeight: '840px',
          background: '#f8fafc',
          borderRadius: '28px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
          position: 'relative'
        }}
      >
        {/* SWIGGY FLOATING TOP HEADER */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            zIndex: 20
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f172a'
            }}
          >
            ←
          </button>

          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: '#0f172a' }}>
              {restaurantName}
            </h4>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
              Order #{orderId.slice(-6)} • {itemCount} Items
            </span>
          </div>

          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            style={{
              background: '#f1f5f9',
              border: 'none',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            •••
          </button>
        </div>

        {/* API Key Form Bar */}
        {showKeyInput && (
          <div style={{ position: 'absolute', top: '70px', left: '16px', right: '16px', background: '#ffffff', padding: '10px', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', zIndex: 25, display: 'flex', gap: '6px' }}>
            <input
              type="text"
              placeholder="Paste Google Maps Key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px', outline: 'none' }}
            />
            <button
              onClick={handleSaveApiKey}
              style={{ background: '#f97316', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
            >
              Save
            </button>
          </div>
        )}

        {/* REAL-TIME SOCKET & GPS STATUS BADGE */}
        <div style={{ position: 'absolute', top: '74px', left: '20px', zIndex: 18, display: 'flex', gap: '6px' }}>
          <div style={{ background: socketConnected ? '#22c55e' : '#ef4444', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
            {socketConnected ? 'LIVE SOCKET CONNECTED' : 'SOCKET DISCONNECTED'}
          </div>
        </div>

        {/* MAP CANVAS */}
        <div style={{ flex: 1, position: 'relative', background: '#e2e8f0', width: '100%' }}>
          {mapsLoaded && !mapsError ? (
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          ) : (
            <iframe
              ref={leafletIframeRef}
              title="Live Delivery Rider Tracking"
              srcDoc={leafletMapHtml}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          )}
        </div>

        {/* SWIGGY FLOATING BOTTOM STATUS CARD */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '18px 20px',
            margin: '12px',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            zIndex: 20
          }}
        >
          {/* Status Title & Green ETA Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, paddingRight: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                <span style={{ color: '#059669', fontSize: '11px', fontWeight: '900', letterSpacing: '0.5px' }}>
                  {currentStatus === 'Out for Delivery' ? '⚡ LIVE RIDER TRACKING' : '✓ ON TIME'}
                </span>
              </div>
              <h3 style={{ margin: '2px 0 4px 0', fontSize: '20px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.3px' }}>
                {getStatusTitle()}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '500', lineHeight: 1.4 }}>
                {getStatusSubtitle()}
              </p>
            </div>

            {/* Green ETA Badge Pill */}
            <div
              style={{
                backgroundColor: '#059669',
                color: '#ffffff',
                borderRadius: '16px',
                padding: '8px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '56px',
                boxShadow: '0 4px 12px rgba(5,150,105,0.3)'
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: '900', lineHeight: 1 }}>
                {durationText.replace('mins', '').trim()}
              </span>
              <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'lowercase' }}>mins</span>
            </div>
          </div>

          {/* Address & Instructions Bar */}
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderTop: '1px solid #f1f5f9'
            }}
          >
            <span>📍 {trackingData?.userLocation?.address || 'Customer Delivery Address'}</span>
          </div>

          {/* Rider Profile & Call/Message Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '10px',
              borderTop: '1px solid #f1f5f9'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  border: '2px solid #e2e8f0'
                }}
              >
                🧑‍✈️
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
                  {riderName}
                </h4>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                  Delivery Partner • {trackingData?.deliveryBoy?.vehicleNumber || 'RJ-14-DB-8812'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={`tel:${riderPhone}`}
                title="Call Rider"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '700',
                  border: '1px solid #cbd5e1'
                }}
              >
                📞
              </a>
              <a
                href={`https://wa.me/${riderPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Message Rider"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '700',
                  border: '1px solid #cbd5e1'
                }}
              >
                💬
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
