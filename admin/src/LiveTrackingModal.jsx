import React, { useEffect, useState, useRef } from 'react';

/**
 * LiveTrackingModal for Admin Portal
 * Displays live tracking on Google Maps when a delivery boy picks up / delivers an order.
 */
export const LiveTrackingModal = ({ order, onClose }) => {
  const mapRef = useRef(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState(false);
  const [distanceText, setDistanceText] = useState('3.8 km');
  const [durationText, setDurationText] = useState('14 mins');
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('avantika_google_maps_key') ||
    (import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) ||
    ''
  );
  const [showKeyInput, setShowKeyInput] = useState(false);

  const orderId = order?.orderId || order?._id || order?.id || 'AV-18293746';

  const fetchLiveTracking = async () => {
    try {
      const res = await fetch(`http://localhost:45000/api/orders/track/${orderId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setTrackingData(json.data);
      } else {
        setTrackingData({
          orderId,
          orderStatus: order?.orderStatus || 'Out for Delivery',
          customerName: order?.customerName || 'Valued Customer',
          phoneNumber: order?.phoneNumber || '+91 98765 00000',
          deliveryAddress: typeof order?.deliveryAddress === 'string' ? order.deliveryAddress : 'Jaipur City Center',
          restaurantLocation: {
            name: 'Avantika Restaurant',
            address: 'MI Road, Jaipur',
            latitude: 26.9124,
            longitude: 75.7873
          },
          userLocation: {
            address: typeof order?.deliveryAddress === 'string' ? order.deliveryAddress : 'Customer Address',
            latitude: 26.9220,
            longitude: 75.8000
          },
          deliveryBoy: {
            name: 'Vikram Singh',
            phone: '+91 98112 34567',
            vehicleType: 'Bike',
            vehicleNumber: 'RJ-14-DB-9944',
            location: { latitude: 26.9180, longitude: 75.7950, address: 'Near Railway Station Road', lastUpdated: new Date() }
          }
        });
      }
    } catch (err) {
      console.log('Error fetching admin live tracking:', err);
      setTrackingData({
        orderId,
        orderStatus: order?.orderStatus || 'Out for Delivery',
        customerName: order?.customerName || 'Valued Customer',
        phoneNumber: order?.phoneNumber || '+91 98765 00000',
        deliveryAddress: typeof order?.deliveryAddress === 'string' ? order.deliveryAddress : 'Jaipur City Center',
        restaurantLocation: {
          name: 'Avantika Restaurant',
          address: 'MI Road, Jaipur',
          latitude: 26.9124,
          longitude: 75.7873
        },
        userLocation: {
          address: typeof order?.deliveryAddress === 'string' ? order.deliveryAddress : 'Customer Address',
          latitude: 26.9220,
          longitude: 75.8000
        },
        deliveryBoy: {
          name: 'Vikram Singh',
          phone: '+91 98112 34567',
          vehicleType: 'Bike',
          vehicleNumber: 'RJ-14-DB-9944',
          location: { latitude: 26.9180, longitude: 75.7950, address: 'Near Railway Station Road', lastUpdated: new Date() }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTracking();
    const interval = setInterval(fetchLiveTracking, 4000); // Admin live update every 4 sec
    return () => clearInterval(interval);
  }, [orderId]);

  // Load Google Maps SDK
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }

    if (!apiKey) {
      setMapsError(true);
      return;
    }

    const scriptId = 'google-maps-script';
    if (document.getElementById(scriptId)) {
      setMapsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapsLoaded(true);
      setMapsError(false);
    };
    script.onerror = () => setMapsError(true);
    document.head.appendChild(script);
  }, [apiKey]);

  // Render Map & Live Markers
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !trackingData) return;

    try {
      const { restaurantLocation, userLocation, deliveryBoy } = trackingData;

      const restPos = { lat: restaurantLocation.latitude, lng: restaurantLocation.longitude };
      const userPos = { lat: userLocation.latitude, lng: userLocation.longitude };

      const map = new window.google.maps.Map(mapRef.current, {
        center: {
          lat: (restPos.lat + userPos.lat) / 2,
          lng: (restPos.lng + userPos.lng) / 2
        },
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true
      });

      // Directions Service
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#3b82f6',
          strokeWeight: 6,
          strokeOpacity: 0.85
        }
      });

      directionsService.route(
        {
          origin: restPos,
          destination: userPos,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            const route = result.routes[0];
            if (route && route.legs[0]) {
              setDistanceText(route.legs[0].distance.text);
              setDurationText(route.legs[0].duration.text);
            }
          } else {
            new window.google.maps.Polyline({
              path: [restPos, userPos],
              geodesic: true,
              strokeColor: '#3b82f6',
              strokeOpacity: 0.9,
              strokeWeight: 5,
              map: map
            });
          }
        }
      );

      // Restaurant Marker
      new window.google.maps.Marker({
        position: restPos,
        map: map,
        title: restaurantLocation.name,
        icon: {
          url: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
          scaledSize: new window.google.maps.Size(40, 40)
        }
      });

      // Customer Marker
      new window.google.maps.Marker({
        position: userPos,
        map: map,
        title: `Customer: ${trackingData.customerName}`,
        icon: {
          url: 'https://cdn-icons-png.flaticon.com/512/1216/1216895.png',
          scaledSize: new window.google.maps.Size(40, 40)
        }
      });

      // Delivery Boy Live Marker
      if (deliveryBoy && deliveryBoy.location) {
        const dboyPos = {
          lat: deliveryBoy.location.latitude || (restPos.lat + userPos.lat) / 2,
          lng: deliveryBoy.location.longitude || (restPos.lng + userPos.lng) / 2
        };

        new window.google.maps.Marker({
          position: dboyPos,
          map: map,
          title: `Rider: ${deliveryBoy.name} (${deliveryBoy.vehicleNumber})`,
          icon: {
            url: 'https://cdn-icons-png.flaticon.com/512/2972/2972531.png',
            scaledSize: new window.google.maps.Size(46, 46)
          }
        });
      }

      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(restPos);
      bounds.extend(userPos);
      map.fitBounds(bounds);
    } catch (e) {
      console.log('Admin Map error:', e.message);
    }
  }, [mapsLoaded, trackingData]);

  const handleSaveKey = () => {
    localStorage.setItem('avantika_google_maps_key', apiKey.trim());
    setShowKeyInput(false);
    window.location.reload();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
          height: '88vh',
          background: '#ffffff',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: '16px 24px',
            background: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #1e293b'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🛵</span>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>
                Admin Delivery Live Tracking
              </h3>
              <span style={{ background: '#3b82f6', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                {trackingData?.orderStatus || 'Live'}
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Order Reference: <strong style={{ color: '#60a5fa' }}>{orderId}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#e2e8f0',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🔑 Google Maps Key
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#334155',
                border: 'none',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </header>

        {/* Key Form Bar */}
        {showKeyInput && (
          <div style={{ background: '#f8fafc', padding: '12px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Enter Google Maps API Key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
            />
            <button
              onClick={handleSaveKey}
              style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
            >
              Save & Reload
            </button>
          </div>
        )}

        {/* Map Canvas / Simulated Route */}
        <div style={{ flex: 1, position: 'relative', background: '#0f172a', width: '100%', minHeight: '340px' }}>
          {mapsLoaded && !mapsError ? (
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #090d16 0%, #172033 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              {/* Route Line */}
              <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                <path
                  d="M 120 280 C 260 80, 420 380, 580 180"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="5"
                  strokeDasharray="10 6"
                />
              </svg>

              {/* Restaurant Marker */}
              <div style={{ position: 'absolute', bottom: '80px', left: '100px', textAlign: 'center' }}>
                <div style={{ background: '#ef4444', color: '#fff', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto', boxShadow: '0 4px 16px rgba(239,68,68,0.5)' }}>
                  🏪
                </div>
                <span style={{ color: '#fff', fontSize: '11px', fontWeight: '800', background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '6px' }}>
                  Avantika Kitchen
                </span>
              </div>

              {/* Rider Marker */}
              <div style={{ position: 'absolute', top: '150px', left: '340px', textAlign: 'center' }}>
                <div style={{ background: '#3b82f6', color: '#fff', width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto', boxShadow: '0 0 0 8px rgba(59,130,246,0.3)', animation: 'pulse 1.8s infinite' }}>
                  🛵
                </div>
                <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: '800', background: 'rgba(0,0,0,0.8)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '6px' }}>
                  {trackingData?.deliveryBoy?.name || 'Rider En Route'}
                </span>
              </div>

              {/* Customer Marker */}
              <div style={{ position: 'absolute', top: '140px', right: '100px', textAlign: 'center' }}>
                <div style={{ background: '#10b981', color: '#fff', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto', boxShadow: '0 4px 16px rgba(16,185,129,0.5)' }}>
                  🏠
                </div>
                <span style={{ color: '#fff', fontSize: '11px', fontWeight: '800', background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginTop: '6px' }}>
                  {trackingData?.customerName || 'Customer Destination'}
                </span>
              </div>

              <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(15,23,42,0.85)', padding: '8px 14px', borderRadius: '10px', color: '#fff', fontSize: '12px', zIndex: 10 }}>
                💡 Google Maps API Usage: <span style={{ color: '#60a5fa', fontWeight: '800' }}>{apiKey ? 'API Loaded' : 'Polyline Mode'}</span>
              </div>
            </div>
          )}

          {/* Floating Metrics Badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#ffffff',
              zIndex: 10
            }}
          >
            <div>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Distance to Customer</span>
              <h4 style={{ margin: 0, fontSize: '16px', color: '#60a5fa', fontWeight: '800' }}>
                📏 {distanceText} ({durationText})
              </h4>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Customer Address</span>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#f8fafc', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                📍 {trackingData?.deliveryAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Admin Delivery Executive Panel */}
        <footer style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {trackingData?.deliveryBoy ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800' }}>
                {trackingData.deliveryBoy.name ? trackingData.deliveryBoy.name.charAt(0) : '🛵'}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
                  {trackingData.deliveryBoy.name} ({trackingData.deliveryBoy.vehicleType || 'Bike'})
                </h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                  Vehicle No: <strong>{trackingData.deliveryBoy.vehicleNumber || 'RJ-14-DB-2026'}</strong> | Phone: {trackingData.deliveryBoy.phone}
                </p>
              </div>
            </div>
          ) : (
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
              No delivery boy assigned to this order yet.
            </span>
          )}

          {trackingData?.deliveryBoy?.phone && (
            <a
              href={`tel:${trackingData.deliveryBoy.phone}`}
              style={{
                background: '#3b82f6',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: '800'
              }}
            >
              📞 Call Delivery Partner
            </a>
          )}
        </footer>
      </div>
    </div>
  );
};

export default LiveTrackingModal;
