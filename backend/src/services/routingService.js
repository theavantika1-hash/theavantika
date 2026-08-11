const axios = require('axios');

/**
 * Calculate distance between two coordinates in meters using Haversine formula
 */
function getHaversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Decode Google Encoded Polyline algorithm into [{latitude, longitude}]
 */
function decodePolyline(encoded) {
  if (!encoded) return [];
  const points = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }
  return points;
}

/**
 * Project point P(px, py) onto line segment A(ax, ay) -> B(bx, by)
 */
function projectPointOnSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;

  if (dx === 0 && dy === 0) {
    return { lat: ax, lng: ay, distMeters: getHaversineDistanceMeters(px, py, ax, ay) };
  }

  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  const projLat = ax + t * dx;
  const projLng = ay + t * dy;
  const distMeters = getHaversineDistanceMeters(px, py, projLat, projLng);

  return { lat: projLat, lng: projLng, distMeters, segmentIndex: 0 };
}

/**
 * Request road route from Google Routes API v2
 * @param {Array<{latitude: number, longitude: number}>} points Waypoints [origin, destination]
 */
async function getGoogleRoutesApiRoute(points) {
  const apiKey = process.env.GOOGLE_ROUTES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.log('[ROUTES API] No GOOGLE_ROUTES_API_KEY found in env. Using OSRM road engine fallback.');
    return getRoadRoute(points);
  }

  if (!points || points.length < 2) {
    throw new Error('At least 2 points are required for route calculation');
  }

  const origin = points[0];
  const destination = points[points.length - 1];

  const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

  const requestBody = {
    origin: {
      location: {
        latLng: {
          latitude: Number(origin.latitude),
          longitude: Number(origin.longitude)
        }
      }
    },
    destination: {
      location: {
        latLng: {
          latitude: Number(destination.latitude),
          longitude: Number(destination.longitude)
        }
      }
    },
    travelMode: 'TWO_WHEELER',
    routingPreference: 'TRAFFIC_AWARE',
    computeAlternativeRoutes: false,
    languageCode: 'en-US',
    units: 'METRIC'
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.travelAdvisory'
      },
      timeout: 8000
    });

    if (response.data && response.data.routes && response.data.routes[0]) {
      const route = response.data.routes[0];
      const encodedPolyline = route.polyline?.encodedPolyline || '';
      const routePoints = decodePolyline(encodedPolyline);

      const distanceMeters = route.distanceMeters || 0;
      const distanceKm = Math.round((distanceMeters / 1000) * 10) / 10;

      // Duration format in Google Routes API is string e.g. "900s"
      const durationSeconds = parseInt(route.duration || '0', 10) || 0;
      const durationMins = Math.max(1, Math.round(durationSeconds / 60));

      let trafficStatus = 'NORMAL';
      if (route.travelAdvisory && route.travelAdvisory.speedReadingIntervals) {
        trafficStatus = 'MODERATE';
      }

      console.log(`[GOOGLE ROUTES API SUCCESS] Distance: ${distanceKm}km, Duration: ${durationMins}m, Traffic: ${trafficStatus}`);

      return {
        success: true,
        source: 'GOOGLE_ROUTES_API',
        points: routePoints,
        distanceKm,
        durationMins,
        trafficStatus,
        distanceMeters,
        durationSeconds
      };
    }
  } catch (err) {
    console.warn('[ROUTES API ERROR] Primary Google Routes API query notice:', err.response?.data || err.message);
  }

  // Fallback to OSRM road engine if Google Routes API request fails
  return getRoadRoute(points);
}

/**
 * Fetch road route between coordinates via OSRM Driving Engine (Fallback)
 * @param {Array<{latitude: number, longitude: number}>} points List of waypoints
 */
async function getRoadRoute(points) {
  if (!points || points.length < 2) {
    throw new Error('At least 2 points are required to calculate a road route');
  }

  const coordinatesString = points
    .map(p => `${Number(p.longitude).toFixed(6)},${Number(p.latitude).toFixed(6)}`)
    .join(';');

  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordinatesString}?overview=full&geometries=geojson&steps=true`;

  try {
    const response = await axios.get(osrmUrl, { timeout: 8000 });
    if (response.data && response.data.code === 'Ok' && response.data.routes?.[0]) {
      const route = response.data.routes[0];
      const coords = route.geometry.coordinates;

      const routePoints = coords.map(c => ({
        latitude: c[1],
        longitude: c[0]
      }));

      const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
      const durationMins = Math.max(1, Math.round(route.duration / 60));

      return {
        success: true,
        source: 'OSRM_ROAD_NETWORK',
        points: routePoints,
        distanceKm,
        durationMins,
        trafficStatus: 'NORMAL',
        distanceMeters: route.distance,
        durationSeconds: route.duration
      };
    }
  } catch (err) {
    console.warn('[ROUTING] OSRM query notice:', err.message);
  }

  return generateInterpolatedRoadRoute(points);
}

/**
 * Fallback dense interpolation between waypoints
 */
function generateInterpolatedRoadRoute(points) {
  const resultPoints = [];
  let totalDistanceMeters = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const segDist = getHaversineDistanceMeters(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
    totalDistanceMeters += segDist;

    const numSteps = Math.max(5, Math.floor(segDist / 50));
    for (let s = 0; s < numSteps; s++) {
      const ratio = s / numSteps;
      resultPoints.push({
        latitude: p1.latitude + (p2.latitude - p1.latitude) * ratio,
        longitude: p1.longitude + (p2.longitude - p1.longitude) * ratio
      });
    }
  }
  resultPoints.push(points[points.length - 1]);

  const distanceKm = Math.round((totalDistanceMeters / 1000) * 10) / 10;
  const durationMins = Math.max(1, Math.round(distanceKm * 3));

  return {
    success: true,
    source: 'INTERPOLATED_FALLBACK',
    points: resultPoints,
    distanceKm,
    durationMins,
    trafficStatus: 'NORMAL',
    distanceMeters: totalDistanceMeters,
    durationSeconds: durationMins * 60
  };
}

/**
 * Snap GPS position to nearest road segment on route & detect off-route
 */
function snapGpsToRoad(lat, lng, routePoints, thresholdMeters = 50) {
  if (!routePoints || routePoints.length === 0) {
    return { snappedLat: lat, snappedLng: lng, isSnapped: false, distanceToRouteMeters: 0, isOffRoute: false };
  }

  let minDistanceMeters = Infinity;
  let closestPoint = { lat, lng };
  let closestSegmentIndex = 0;

  for (let i = 0; i < routePoints.length - 1; i++) {
    const a = routePoints[i];
    const b = routePoints[i + 1];
    const proj = projectPointOnSegment(lat, lng, a.latitude, a.longitude, b.latitude, b.longitude);

    if (proj.distMeters < minDistanceMeters) {
      minDistanceMeters = proj.distMeters;
      closestPoint = { lat: proj.lat, lng: proj.lng };
      closestSegmentIndex = i;
    }
  }

  const isSnapped = minDistanceMeters <= thresholdMeters;

  return {
    snappedLat: isSnapped ? closestPoint.lat : lat,
    snappedLng: isSnapped ? closestPoint.lng : lng,
    isSnapped,
    distanceToRouteMeters: Math.round(minDistanceMeters * 10) / 10,
    segmentIndex: closestSegmentIndex,
    isOffRoute: minDistanceMeters > thresholdMeters
  };
}

module.exports = {
  getHaversineDistanceMeters,
  decodePolyline,
  getGoogleRoutesApiRoute,
  getRoadRoute,
  snapGpsToRoad
};
