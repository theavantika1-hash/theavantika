import React, { useEffect, useState, useRef } from 'react';

/**
 * GoogleLocationPickerModal
 * Lets users pick their current delivery location using Google Maps API,
 * browser Geolocation API, reverse geocoding, and draggable pin.
 */
export const GoogleLocationPickerModal = ({ isOpen, onClose, onSelectLocation }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [markerInstance, setMarkerInstance] = useState(null);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState({ lat: 26.9124, lng: 75.7873 }); // Default Jaipur
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('avantika_google_maps_key') ||
    (import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) ||
    ''
  );

  useEffect(() => {
    if (!isOpen) return;

    // Load Google Maps SDK if key exists and not loaded
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
    } else if (apiKey) {
      const scriptId = 'google-maps-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => setMapsLoaded(true);
        document.head.appendChild(script);
      } else {
        setMapsLoaded(true);
      }
    }

    // Auto detect location when modal opens
    handleDetectCurrentLocation();
  }, [isOpen, apiKey]);

  // Initialize Map
  useEffect(() => {
    if (!isOpen || !mapsLoaded || !mapRef.current) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: coords,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });

      const marker = new window.google.maps.Marker({
        position: coords,
        map: map,
        draggable: true,
        title: 'Drag pin to your exact delivery location',
        animation: window.google.maps.Animation.DROP
      });

      setMapInstance(map);
      setMarkerInstance(marker);

      // On marker drag end
      marker.addListener('dragend', () => {
        const pos = marker.getPosition();
        const newCoords = { lat: pos.lat(), lng: pos.lng() };
        setCoords(newCoords);
        reverseGeocode(newCoords);
      });

      // On map click
      map.addListener('click', (e) => {
        const newCoords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        marker.setPosition(newCoords);
        setCoords(newCoords);
        reverseGeocode(newCoords);
      });
    } catch (e) {
      console.log('Location picker map render error:', e.message);
    }
  }, [mapsLoaded, isOpen]);

  // Reverse Geocode (Lat/Lng -> Readable Address)
  const reverseGeocode = async (locationCoords) => {
    setLoadingGeo(true);
    if (window.google && window.google.maps) {
      try {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: locationCoords }, (results, status) => {
          setLoadingGeo(false);
          if (status === 'OK' && results[0]) {
            setAddress(results[0].formatted_address);
          } else {
            fallbackReverseGeocode(locationCoords);
          }
        });
        return;
      } catch (err) {
        console.log('Google geocoder error, switching to fallback:', err);
      }
    }
    fallbackReverseGeocode(locationCoords);
  };

  // Fallback Reverse Geocoder using free Nominatim API
  const fallbackReverseGeocode = async (locationCoords) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${locationCoords.lat}&lon=${locationCoords.lng}&format=json`);
      const data = await res.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress(`${locationCoords.lat.toFixed(4)}° N, ${locationCoords.lng.toFixed(4)}° E - Delivery Address`);
      }
    } catch (e) {
      setAddress(`${locationCoords.lat.toFixed(4)}° N, ${locationCoords.lng.toFixed(4)}° E - Current Location`);
    } finally {
      setLoadingGeo(false);
    }
  };

  // Detect Current Location using Geolocation API
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCoords(currentPos);

        if (mapInstance && markerInstance) {
          mapInstance.setCenter(currentPos);
          mapInstance.setZoom(16);
          markerInstance.setPosition(currentPos);
        }

        reverseGeocode(currentPos);
      },
      (error) => {
        setLoadingGeo(false);
        console.log('Geolocation error:', error.message);
        // Fallback default address if location permission denied
        setAddress('MI Road, City Centre, Jaipur, Rajasthan 302001');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Search Address handler
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoadingGeo(true);
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchQuery }, (results, status) => {
        setLoadingGeo(false);
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location;
          const newCoords = { lat: loc.lat(), lng: loc.lng() };
          setCoords(newCoords);
          setAddress(results[0].formatted_address);

          if (mapInstance && markerInstance) {
            mapInstance.setCenter(newCoords);
            mapInstance.setZoom(16);
            markerInstance.setPosition(newCoords);
          }
        } else {
          alert('Location not found. Please try a different search query.');
        }
      });
    } else {
      // Fallback search using Nominatim
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
        const data = await res.json();
        if (data && data[0]) {
          const newCoords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
          setCoords(newCoords);
          setAddress(data[0].display_name);

          if (mapInstance && markerInstance) {
            mapInstance.setCenter(newCoords);
            mapInstance.setZoom(16);
            markerInstance.setPosition(newCoords);
          }
        } else {
          alert('Location not found.');
        }
      } catch (e) {
        alert('Error searching location.');
      } finally {
        setLoadingGeo(false);
      }
    }
  };

  const handleConfirm = () => {
    if (!address.trim()) {
      alert('Please select or enter a delivery location.');
      return;
    }
    onSelectLocation({
      address: address.trim(),
      latitude: coords.lat,
      longitude: coords.lng
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 20010,
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
          maxWidth: '680px',
          height: '88vh',
          background: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
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
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>
                Select Current Delivery Location
              </h3>
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>
              Powered by Google Maps & GPS Geolocation
            </span>
          </div>

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
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </header>

        {/* Search & Detect Location Bar */}
        <div style={{ padding: '14px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Search area, street, or landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
            />
            <button
              type="submit"
              style={{ background: '#2D3F76', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
            >
              🔍 Search
            </button>
          </form>

          <button
            onClick={handleDetectCurrentLocation}
            disabled={loadingGeo}
            style={{
              width: '100%',
              background: '#e0f2fe',
              color: '#0369a1',
              border: '1px solid #7dd3fc',
              padding: '10px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            {loadingGeo ? '📡 Locating your GPS position...' : '🎯 Detect My Exact Current Location (GPS)'}
          </button>
        </div>

        {/* Interactive Map View */}
        <div style={{ flex: 1, position: 'relative', background: '#e2e8f0', width: '100%' }}>
          {mapsLoaded ? (
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                color: '#fff',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📍</div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>GPS Location Picked</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
              </p>
              <span style={{ fontSize: '11px', color: '#4CA687', marginTop: '8px', fontWeight: '700' }}>
                (Tip: Add Google Maps Key in tracking modal for interactive map canvas)
              </span>
            </div>
          )}

          {/* Floating Instructions Tag */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(15, 23, 42, 0.85)',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '700',
              zIndex: 5,
              pointerEvents: 'none'
            }}
          >
            👇 Drag pin or click map to refine delivery spot
          </div>
        </div>

        {/* Selected Address Display & Confirm Footer */}
        <footer style={{ padding: '16px 20px', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '14px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
              Selected Delivery Address:
            </span>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 14px' }}>
              {loadingGeo ? (
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Fetching exact address...</span>
              ) : (
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#1e293b', lineHeight: '1.4' }}>
                  📍 {address || 'Select a location on map'}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={loadingGeo || !address}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #4CA687, #2D3F76)',
              color: '#ffffff',
              border: 'none',
              padding: '14px',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: '800',
              cursor: (loadingGeo || !address) ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 20px rgba(76,166,135,0.3)',
              opacity: (loadingGeo || !address) ? 0.6 : 1
            }}
          >
            Confirm & Use This Delivery Location
          </button>
        </footer>
      </div>
    </div>
  );
};

export default GoogleLocationPickerModal;
