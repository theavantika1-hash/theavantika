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
 * Project point P(px, py) onto line segment A(ax, ay) -> B(bx, by)
 */
function projectPointOnSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;

  if (dx === 0 && dy === 0) {
    return { lat: ax, lng: ay, distMeters: getHaversineDistanceMeters(px, py, ax, ay) };
  }

  // Parameter t for projection line
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  const projLat = ax + t * dx;
  const projLng = ay + t * dy;
  const distMeters = getHaversineDistanceMeters(px, py, projLat, projLng);

  return { lat: projLat, lng: projLng, distMeters, segmentIndex: 0 };
}

/**
 * Fetch road route between coordinates via OSRM Driving Engine
 * @param {Array<{latitude: number, longitude: number}>} points List of waypoints [origin, ...waypoints, destination]
 */
async function getRoadRoute(points) {
  if (!points || points.length < 2) {
    throw new Error('At least 2 points are required to calculate a road route');
  }

  // Format OSRM coordinate string: "lng1,lat1;lng2,lat2;..."
  const coordinatesString = points
    .map(p => `${Number(p.longitude).toFixed(6)},${Number(p.latitude).toFixed(6)}`)
    .join(';');

  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordinatesString}?overview=full&geometries=geojson&steps=true`;

  try {
    const response = await axios.get(osrmUrl, { timeout: 8000 });
    if (response.data && response.data.code === 'Ok' && response.data.routes?.[0]) {
      const route = response.data.routes[0];
      const coords = route.geometry.coordinates; // [[lng, lat], ...]

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
        distanceMeters: route.distance,
        durationSeconds: route.duration
      };
    }
  } catch (err) {
    console.warn('[ROUTING] OSRM primary query notice:', err.message);
  }

  // Secondary Fallback: Generate dense road-interpolated points if OSRM service is unreachable
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

    const numSteps = Math.max(5, Math.floor(segDist / 50)); // Step every ~50 meters
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
  const durationMins = Math.max(1, Math.round(distanceKm * 3)); // ~20 km/h avg speed

  return {
    success: true,
    source: 'INTERPOLATED_FALLBACK',
    points: resultPoints,
    distanceKm,
    durationMins,
    distanceMeters: totalDistanceMeters,
    durationSeconds: durationMins * 60
  };
}

/**
 * Snap GPS position to nearest road segment on route
 * @param {number} lat Current GPS Latitude
 * @param {number} lng Current GPS Longitude
 * @param {Array<{latitude: number, longitude: number}>} routePoints Active route polyline points
 * @param {number} thresholdMeters Threshold distance for snapping (default 50m)
 */
function snapGpsToRoad(lat, lng, routePoints, thresholdMeters = 50) {
  if (!routePoints || routePoints.length === 0) {
    return { snappedLat: lat, snappedLng: lng, isSnapped: false, distanceToRouteMeters: 0 };
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
  getRoadRoute,
  snapGpsToRoad
};
