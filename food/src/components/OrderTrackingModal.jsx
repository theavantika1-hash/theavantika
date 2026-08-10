import React, { useEffect, useState, useRef } from 'react';

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
 * OrderTrackingModal Component - Swiggy / Zomato Premium UI Style
 */
export const OrderTrackingModal = ({ order, onClose }) => {
  const mapRef = useRef(null);
  const googleMapInstanceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const restMarkerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState(false);
  const [distanceText, setDistanceText] = useState('3.8 km');
  const [durationText, setDurationText] = useState('18 mins');
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('avantika_google_maps_key') ||
    (import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) ||
    ''
  );
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [zoom, setZoom] = useState(14);
  const [riderProgress, setRiderProgress] = useState(0.35);

  const orderId = order?.orderId || order?._id || order?.id || 'AV-18293746';
  const currentStatus = trackingData?.orderStatus || order?.orderStatus || 'Preparing';
  const itemCount = order?.orderedItems?.length || 2;
  const restaurantName = trackingData?.restaurantLocation?.name || 'Avantika Restaurant';

  // Live rider movement ticker along the route
  useEffect(() => {
    const interval = setInterval(() => {
      setRiderProgress(prev => (prev >= 0.92 ? 0.25 : prev + 0.04));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch live tracking details from backend
  const fetchTrackingInfo = async () => {
    try {
      const res = await fetch(`http://localhost:45000/api/orders/track/${orderId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setTrackingData(json.data);
      } else {
        setTrackingData({
          orderId,
          orderStatus: order?.orderStatus || 'Preparing',
          deliveryAddress: typeof order?.deliveryAddress === 'string' ? order.deliveryAddress : 'To Office | 197 c, Alwar, Rajasthan',
          restaurantLocation: {
            name: 'Avantika Restaurant',
            address: 'SH 25, near Telco circle, Bhagwanpura, Alwar, Rajasthan 301001',
            latitude: 27.596704286992576,
            longitude: 76.63211439999625
          },
          userLocation: {
            address: typeof order?.deliveryAddress === 'string' ? order.deliveryAddress : 'Delivery Address, Alwar',
            latitude: 27.6208,
            longitude: 76.6436
          },
          deliveryBoy: {
            name: order?.deliveryBoyName || order?.deliveryBoy?.name || 'Ashwani Raj',
            phone: '+91 98765 43210',
            vehicleType: 'Bike',
            vehicleNumber: 'RJ-14-DB-8812',
            location: { latitude: 27.6085, longitude: 76.6385, address: 'En Route on Alwar Rd' }
          }
        });
      }
    } catch (err) {
      setTrackingData({
        orderId,
        orderStatus: order?.orderStatus || 'Preparing',
        deliveryAddress: typeof order?.deliveryAddress === 'string' ? order.deliveryAddress : 'To Office | 197 c, Alwar, Rajasthan',
        restaurantLocation: {
          name: 'Avantika Restaurant',
          address: 'SH 25, near Telco circle, Bhagwanpura, Alwar, Rajasthan 301001',
          latitude: 27.596704286992576,
          longitude: 76.63211439999625
        },
        userLocation: {
          address: typeof order?.deliveryAddress === 'string' ? order.deliveryAddress : 'Delivery Address, Alwar',
          latitude: 27.6208,
          longitude: 76.6436
        },
        deliveryBoy: {
          name: order?.deliveryBoyName || order?.deliveryBoy?.name || 'Ashwani Raj',
          phone: '+91 98765 43210',
          vehicleType: 'Bike',
          vehicleNumber: 'RJ-14-DB-8812',
          location: { latitude: 27.6085, longitude: 76.6385, address: 'En Route on Alwar Rd' }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingInfo();
    const interval = setInterval(fetchTrackingInfo, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  // Load Google Maps JS SDK dynamically
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

  // Initialize & Render Google Map
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

      // Swiggy Orange / Red Polyline
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

      // Rider Marker Pin
      const riderLat = restPos.lat + (userPos.lat - restPos.lat) * riderProgress;
      const riderLng = restPos.lng + (userPos.lng - restPos.lng) * riderProgress;
      const riderPos = { lat: riderLat, lng: riderLng };

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
  }, [mapsLoaded, trackingData, riderProgress]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('avantika_google_maps_key', apiKey.trim());
      setShowKeyInput(false);
    }
  };

  const riderName = trackingData?.deliveryBoy?.name || order?.deliveryBoyName || order?.deliveryBoy?.name || 'Ashwani Raj';
  const riderPhone = trackingData?.deliveryBoy?.phone || '+919876543210';

  // Dynamic status messages matching Swiggy / Zomato
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

  const riderLeftPx = `${30 + riderProgress * 480}px`;

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
              03:36 PM • {itemCount} Items
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

        {/* MAP CANVAS */}
        <div style={{ flex: 1, position: 'relative', background: '#e2e8f0', width: '100%' }}>
          {mapsLoaded && !mapsError ? (
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          ) : (
            /* SWIGGY STYLE MAP SVG VIEW WHEN API KEY PENDING */
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#e5e7eb',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {/* Roads Background */}
                <rect width="100%" height="100%" fill="#f1f5f9" />
                <path d="M 60 0 V 800 M 180 0 V 800 M 320 0 V 800" stroke="#ffffff" strokeWidth="22" />
                <path d="M 0 160 H 600 M 0 340 H 600 M 0 520 H 600" stroke="#ffffff" strokeWidth="22" />

                {/* Bright Orange Route Path */}
                <path
                  d="M 60 220 L 180 220 L 180 480 L 340 480"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Restaurant Pin Tag */}
              <div style={{ position: 'absolute', top: '190px', left: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                <div style={{ background: '#ffffff', color: '#0f172a', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', marginBottom: '4px', whiteSpace: 'nowrap' }}>
                  {restaurantName}
                </div>
                <div style={{ background: '#0f172a', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  🏪
                </div>
              </div>

              {/* Live Delivery Rider Vehicle */}
              <div style={{ position: 'absolute', top: '200px', left: riderLeftPx, transform: 'translate(-50%, -50%)', transition: 'left 1s linear', zIndex: 12 }}>
                <div style={{ background: '#ef4444', color: '#ffffff', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 4px 16px rgba(239,68,68,0.4)', border: '3px solid #ffffff' }}>
                  🛵
                </div>
              </div>

              {/* Customer Destination Pin */}
              <div style={{ position: 'absolute', top: '450px', left: '310px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                <div style={{ background: '#ffffff', color: '#0f172a', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', marginBottom: '4px', whiteSpace: 'nowrap' }}>
                  To Office | Customer Address
                </div>
                <div style={{ background: '#10b981', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  🏠
                </div>
              </div>
            </div>
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
                  {currentStatus === 'Out for Delivery' ? '⚡ BEFORE TIME' : '✓ ON TIME'}
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
            <span>Address & instructions ›</span>
          </div>

          {/* Rider Profile & Call/Message Actions */}
          <div
            style={{
              display: 'flex',
              justify: 'space-between',
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
                  Delivery Partner • {trackingData?.deliveryBoy?.vehicleNumber || 'RJ-14-DB'}
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
