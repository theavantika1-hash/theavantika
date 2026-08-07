import React, { useEffect, useState, useRef } from 'react';

/**
 * OrderTrackingModal Component
 * Shows Google Maps order tracking route, restaurant-to-user path, total distance, ETA, 
 * and live delivery boy location.
 */
export const OrderTrackingModal = ({ order, onClose }) => {
  const mapRef = useRef(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState(false);
  const [distanceText, setDistanceText] = useState('4.8 km');
  const [durationText, setDurationText] = useState('18 mins');
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('avantika_google_maps_key') ||
    (import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) ||
    ''
  );
  const [showKeyInput, setShowKeyInput] = useState(false);

  const orderId = order?.orderId || order?._id || order?.id || 'AV-18293746';

  // Fetch live tracking details from backend
  const fetchTrackingInfo = async () => {
    try {
      const res = await fetch(`http://localhost:45000/api/orders/track/${orderId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setTrackingData(json.data);
      } else {
        // Fallback mock structure if backend order isn't found
        setTrackingData({
          orderId,
          orderStatus: order?.orderStatus || 'Preparing',
          deliveryAddress: typeof order?.deliveryAddress === 'string' ? order.deliveryAddress : 'Customer Delivery Address',
          restaurantLocation: {
            name: 'Avantika Central Kitchen',
            address: 'MI Road, Jaipur',
            latitude: 26.9124,
            longitude: 75.7873
          },
          userLocation: {
            address: typeof order?.deliveryAddress === 'string' ? order.deliveryAddress : 'Delivery Location',
            latitude: 26.9220,
            longitude: 75.8000
          },
          deliveryBoy: {
            name: 'Ramesh Kumar',
            phone: '+91 98765 43210',
            vehicleType: 'Bike',
            vehicleNumber: 'RJ-14-DB-8812',
            location: { latitude: 26.9170, longitude: 75.7930, address: 'Near Pink City Towers' }
          }
        });
      }
    } catch (err) {
      console.log('Error fetching order tracking info:', err);
      // Fallback data
      setTrackingData({
        orderId,
        orderStatus: order?.orderStatus || 'Preparing',
        deliveryAddress: typeof order?.deliveryAddress === 'string' ? order.deliveryAddress : 'Customer Delivery Address',
        restaurantLocation: {
          name: 'Avantika Central Kitchen',
          address: 'MI Road, Jaipur',
          latitude: 26.9124,
          longitude: 75.7873
        },
        userLocation: {
          address: typeof order?.deliveryAddress === 'string' ? order.deliveryAddress : 'Delivery Location',
          latitude: 26.9220,
          longitude: 75.8000
        },
        deliveryBoy: {
          name: 'Ramesh Kumar',
          phone: '+91 98765 43210',
          vehicleType: 'Bike',
          vehicleNumber: 'RJ-14-DB-8812',
          location: { latitude: 26.9170, longitude: 75.7930, address: 'Near Pink City Towers' }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingInfo();
    const interval = setInterval(fetchTrackingInfo, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, [orderId]);

  // Load Google Maps JS SDK dynamically
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
    script.onerror = () => {
      setMapsError(true);
    };
    document.head.appendChild(script);
  }, [apiKey]);

  // Render Google Map with Markers, Directions & Route
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
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
        ]
      });

      // Directions Service & Renderer
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#4CA687',
          strokeWeight: 5,
          strokeOpacity: 0.8
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
            // Draw direct polyline fallback if directions fail
            new window.google.maps.Polyline({
              path: [restPos, userPos],
              geodesic: true,
              strokeColor: '#4CA687',
              strokeOpacity: 0.9,
              strokeWeight: 4,
              map: map
            });
          }
        }
      );

      // Restaurant Marker (Store Icon)
      new window.google.maps.Marker({
        position: restPos,
        map: map,
        title: restaurantLocation.name || 'Avantika Restaurant',
        icon: {
          url: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
          scaledSize: new window.google.maps.Size(38, 38)
        }
      });

      // User Marker (Home Icon)
      new window.google.maps.Marker({
        position: userPos,
        map: map,
        title: 'Delivery Address',
        icon: {
          url: 'https://cdn-icons-png.flaticon.com/512/1216/1216895.png',
          scaledSize: new window.google.maps.Size(38, 38)
        }
      });

      // Delivery Boy Marker (Bike Icon)
      if (deliveryBoy && deliveryBoy.location) {
        const dboyPos = {
          lat: deliveryBoy.location.latitude || (restPos.lat + userPos.lat) / 2,
          lng: deliveryBoy.location.longitude || (restPos.lng + userPos.lng) / 2
        };
        new window.google.maps.Marker({
          position: dboyPos,
          map: map,
          title: `Delivery Boy: ${deliveryBoy.name}`,
          icon: {
            url: 'https://cdn-icons-png.flaticon.com/512/2972/2972531.png',
            scaledSize: new window.google.maps.Size(42, 42)
          }
        });
      }

      // Adjust bounds
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(restPos);
      bounds.extend(userPos);
      map.fitBounds(bounds);
    } catch (e) {
      console.log('Google Map render notice:', e.message);
    }
  }, [mapsLoaded, trackingData]);

  const handleSaveApiKey = () => {
    localStorage.setItem('avantika_google_maps_key', apiKey.trim());
    setShowKeyInput(false);
    window.location.reload();
  };

  const statusList = [
    { key: 'Requested', label: 'Order Placed', desc: 'Order received by restaurant', icon: '📝' },
    { key: 'Accepted', label: 'Accepted', desc: 'Order confirmed', icon: '✅' },
    { key: 'Preparing', label: 'Cooking & Packing', desc: 'Kitchen is preparing food', icon: '👨‍🍳' },
    { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider is on the way', icon: '🛵' },
    { key: 'Delivered', label: 'Delivered', desc: 'Enjoy your meal!', icon: '🎉' }
  ];

  const currentStatus = trackingData?.orderStatus || order?.orderStatus || 'Preparing';
  const getStepState = (stepKey, index) => {
    const keys = ['Requested', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered'];
    const currentIdx = keys.indexOf(currentStatus) !== -1 ? keys.indexOf(currentStatus) : 2;
    if (index < currentIdx) return 'completed';
    if (index === currentIdx) return 'active';
    return 'upcoming';
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
        zIndex: 20005,
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
          maxWidth: '540px',
          maxHeight: '92vh',
          background: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header Bar */}
        <header
          style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #2D3F76, #1E2B52)',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>📍</span>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', letterSpacing: '0.3px' }}>
                Live Order Tracking
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>
              Order ID: <strong style={{ color: '#4CA687' }}>{orderId}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🔑 API Key
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>
        </header>

        {/* API Key Modal / Form Bar */}
        {showKeyInput && (
          <div style={{ background: '#f8fafc', padding: '12px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Paste Google Maps JavaScript API Key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', outline: 'none' }}
            />
            <button
              onClick={handleSaveApiKey}
              style={{ background: '#4CA687', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
            >
              Save Key
            </button>
          </div>
        )}

        {/* Map Container */}
        <div style={{ position: 'relative', height: '260px', background: '#e2e8f0', width: '100%' }}>
          {mapsLoaded && !mapsError ? (
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          ) : (
            /* Interactive Simulated Route Canvas / SVG when Google Maps API Key is pending */
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}
            >
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {/* Curved Path */}
                <path
                  d="M 60 180 Q 220 40, 440 180"
                  fill="none"
                  stroke="#4CA687"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  style={{ animation: 'dash 15s linear infinite' }}
                />
              </svg>

              {/* Restaurant Node */}
              <div style={{ position: 'absolute', top: '130px', left: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: '#ef4444', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 4px 12px rgba(239,68,68,0.4)' }}>
                  🏪
                </div>
                <span style={{ color: '#ffffff', fontSize: '10px', fontWeight: '800', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' }}>
                  Avantika Kitchen
                </span>
              </div>

              {/* Delivery Rider Node */}
              <div style={{ position: 'absolute', top: '75px', left: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: '#3b82f6', color: '#fff', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 0 0 6px rgba(59,130,246,0.3)', animation: 'pulse 2s infinite' }}>
                  🛵
                </div>
                <span style={{ color: '#60a5fa', fontSize: '10px', fontWeight: '800', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' }}>
                  Delivery Boy
                </span>
              </div>

              {/* Customer Node */}
              <div style={{ position: 'absolute', top: '130px', right: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: '#10b981', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 4px 12px rgba(16,185,129,0.4)' }}>
                  🏠
                </div>
                <span style={{ color: '#ffffff', fontSize: '10px', fontWeight: '800', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' }}>
                  Your Location
                </span>
              </div>

              {/* Info Overlay Tag */}
              <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 14px', borderRadius: '12px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 'fit-content', zIndex: 2 }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Google Maps Mode:</span>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#4CA687', marginLeft: '6px' }}>
                  {apiKey ? 'API Active' : 'Polyline Mode (Click 🔑 API Key above to embed)'}
                </span>
              </div>
            </div>
          )}

          {/* Floating Route distance & time overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: '16px',
              padding: '10px 16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 3
            }}
          >
            <div>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700', letterSpacing: '0.5px' }}>
                Distance Path
              </span>
              <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '800' }}>
                📏 {distanceText} (Est. {durationText})
              </h4>
            </div>
            <span
              style={{
                background: '#dcfce7',
                color: '#15803d',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
              Live Route
            </span>
          </div>
        </div>

        {/* Modal Body / Status Stepper & Delivery Boy Info */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Assigned Delivery Boy Details Card */}
          {trackingData?.deliveryBoy && (
            <div
              style={{
                background: 'linear-gradient(135deg, #f8fafc, #edf2f7)',
                borderRadius: '16px',
                padding: '14px 16px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#4CA687',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '800',
                    boxShadow: '0 4px 10px rgba(76,166,135,0.3)'
                  }}
                >
                  {trackingData.deliveryBoy.name ? trackingData.deliveryBoy.name.charAt(0) : '🛵'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>
                      {trackingData.deliveryBoy.name || 'Delivery Executive'}
                    </h4>
                    <span style={{ background: '#3b82f6', color: '#fff', fontSize: '9px', fontWeight: '800', padding: '1px 6px', borderRadius: '4px' }}>
                      {trackingData.deliveryBoy.vehicleType || 'Bike'}
                    </span>
                  </div>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                    Vehicle: {trackingData.deliveryBoy.vehicleNumber || 'RJ-14-DB-2026'}
                  </p>
                </div>
              </div>

              {trackingData.deliveryBoy.phone && (
                <a
                  href={`tel:${trackingData.deliveryBoy.phone}`}
                  style={{
                    background: '#4CA687',
                    color: '#ffffff',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(76,166,135,0.25)'
                  }}
                >
                  📞 Call
                </a>
              )}
            </div>
          )}

          {/* Stepper Progress Timeline */}
          <div>
            <h4 style={{ margin: '0 0 14px 0', fontSize: '13px', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Order Progress Status
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '8px' }}>
              {statusList.map((step, idx) => {
                const state = getStepState(step.key, idx);
                return (
                  <div key={step.key} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', position: 'relative' }}>
                    {/* Vertical connecting line */}
                    {idx !== statusList.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '24px',
                          left: '11px',
                          width: '2px',
                          height: 'calc(100% + 4px)',
                          background: state === 'completed' ? '#4CA687' : '#e2e8f0',
                          transition: 'background 0.3s'
                        }}
                      />
                    )}

                    {/* Circle Indicator */}
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: state === 'completed' ? '#4CA687' : (state === 'active' ? '#3b82f6' : '#cbd5e1'),
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: '800',
                        zIndex: 2,
                        boxShadow: state === 'active' ? '0 0 0 4px rgba(59,130,246,0.2)' : 'none'
                      }}
                    >
                      {state === 'completed' ? '✓' : idx + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong
                          style={{
                            fontSize: '13px',
                            color: state === 'upcoming' ? '#94a3b8' : '#0f172a',
                            fontWeight: state === 'active' ? '800' : '700'
                          }}
                        >
                          {step.icon} {step.label}
                        </strong>
                        {state === 'active' && (
                          <span style={{ fontSize: '10px', color: '#3b82f6', background: '#dbeafe', fontWeight: '800', padding: '2px 8px', borderRadius: '100px' }}>
                            In Progress
                          </span>
                        )}
                      </div>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: state === 'upcoming' ? '#cbd5e1' : '#64748b' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address Box */}
          <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '12px 14px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Delivering to Address:
            </span>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#1e293b', lineHeight: '1.4' }}>
              📍 {trackingData?.deliveryAddress || (typeof order?.deliveryAddress === 'string' ? order.deliveryAddress : 'Customer Address')}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderTrackingModal;
