import { getApiBaseUrl } from '../config/backendConfig';

export interface RoutePoint {
  latitude: number;
  longitude: number;
}

export interface RouteResult {
  points: RoutePoint[];
  distanceKm: number;
  durationMins: number;
  source: string;
}

export interface SnappingResult {
  snappedLat: number;
  snappedLng: number;
  isSnapped: boolean;
  distanceToRouteMeters: number;
  isOffRoute: boolean;
  closestIndex: number;
}

/**
 * Calculate distance between 2 coordinates in meters using Haversine formula
 */
export function getHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // meters
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
 * Project point P onto line segment A -> B
 */
function projectPointOnSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
) {
  const dx = bx - ax;
  const dy = by - ay;

  if (dx === 0 && dy === 0) {
    return { lat: ax, lng: ay, distMeters: getHaversineDistanceMeters(px, py, ax, ay) };
  }

  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  const projLat = ax + t * dx;
  const projLng = ay + t * dy;
  const distMeters = getHaversineDistanceMeters(px, py, projLat, projLng);

  return { lat: projLat, lng: projLng, distMeters };
}

/**
 * Fetch complete road route for order waypoints via OSRM / Backend API
 */
export async function fetchRoadRoute(
  waypoints: RoutePoint[],
  orderId?: string
): Promise<RouteResult> {
  if (!waypoints || waypoints.length < 2) {
    return {
      points: waypoints || [],
      distanceKm: 0,
      durationMins: 0,
      source: 'INVALID_WAYPOINTS',
    };
  }

  // 1. Try fetching from Backend Route API if orderId is provided
  if (orderId) {
    try {
      const baseUrl = getApiBaseUrl();
      const origin = waypoints[0];
      const res = await fetch(`${baseUrl.replace('/api/delivery-boy', '/api/orders')}/${orderId}/route?lat=${origin.latitude}&lng=${origin.longitude}`);
      const data = await res.json();
      if (data && data.success && data.data?.routePoints?.length > 0) {
        return {
          points: data.data.routePoints,
          distanceKm: data.data.distanceKm || 0,
          durationMins: data.data.durationMins || 0,
          source: data.data.routingSource || 'BACKEND_ROUTING',
        };
      }
    } catch (e) {
      console.warn('[ROUTING] Backend route API notice:', e);
    }
  }

  // 2. Query OSRM Public Driving API directly
  try {
    const coordsStr = waypoints
      .map(w => `${Number(w.longitude).toFixed(6)},${Number(w.latitude).toFixed(6)}`)
      .join(';');

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;
    const response = await fetch(osrmUrl);
    const data = await response.json();

    if (data && data.code === 'Ok' && data.routes?.[0]) {
      const route = data.routes[0];
      const points: RoutePoint[] = route.geometry.coordinates.map((c: number[]) => ({
        latitude: c[1],
        longitude: c[0],
      }));

      const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
      const durationMins = Math.max(1, Math.round(route.duration / 60));

      return {
        points,
        distanceKm,
        durationMins,
        source: 'OSRM_CLIENT',
      };
    }
  } catch (err) {
    console.warn('[ROUTING] OSRM direct query notice:', err);
  }

  // 3. Dense Interpolated Fallback (NEVER simple straight line without density)
  const interpolated: RoutePoint[] = [];
  let totalMeters = 0;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    const dist = getHaversineDistanceMeters(a.latitude, a.longitude, b.latitude, b.longitude);
    totalMeters += dist;

    const steps = Math.max(5, Math.floor(dist / 40));
    for (let s = 0; s < steps; s++) {
      const r = s / steps;
      interpolated.push({
        latitude: a.latitude + (b.latitude - a.latitude) * r,
        longitude: a.longitude + (b.longitude - a.longitude) * r,
      });
    }
  }
  interpolated.push(waypoints[waypoints.length - 1]);

  const distanceKm = Math.round((totalMeters / 1000) * 10) / 10;
  const durationMins = Math.max(1, Math.round(distanceKm * 3));

  return {
    points: interpolated,
    distanceKm,
    durationMins,
    source: 'INTERPOLATED_FALLBACK',
  };
}

/**
 * Snap GPS position to nearest road segment vector
 */
export function snapGpsToRoadPolyline(
  lat: number,
  lng: number,
  polyline: RoutePoint[],
  thresholdMeters = 50
): SnappingResult {
  if (!polyline || polyline.length === 0) {
    return {
      snappedLat: lat,
      snappedLng: lng,
      isSnapped: false,
      distanceToRouteMeters: 0,
      isOffRoute: false,
      closestIndex: 0,
    };
  }

  let minDistanceMeters = Infinity;
  let closestPoint = { lat, lng };
  let closestIndex = 0;

  for (let i = 0; i < polyline.length - 1; i++) {
    const a = polyline[i];
    const b = polyline[i + 1];
    const proj = projectPointOnSegment(lat, lng, a.latitude, a.longitude, b.latitude, b.longitude);

    if (proj.distMeters < minDistanceMeters) {
      minDistanceMeters = proj.distMeters;
      closestPoint = { lat: proj.lat, lng: proj.lng };
      closestIndex = i;
    }
  }

  const isSnapped = minDistanceMeters <= thresholdMeters;

  return {
    snappedLat: isSnapped ? closestPoint.lat : lat,
    snappedLng: isSnapped ? closestPoint.lng : lng,
    isSnapped,
    distanceToRouteMeters: Math.round(minDistanceMeters * 10) / 10,
    isOffRoute: minDistanceMeters > thresholdMeters,
    closestIndex,
  };
}

/**
 * Split route polyline into traveled (gray) and remaining (orange) segments
 */
export function segmentRoute(
  currentLat: number,
  currentLng: number,
  fullRoute: RoutePoint[]
): { traveledRoute: RoutePoint[]; remainingRoute: RoutePoint[] } {
  if (!fullRoute || fullRoute.length === 0) {
    return { traveledRoute: [], remainingRoute: [] };
  }

  const snap = snapGpsToRoadPolyline(currentLat, currentLng, fullRoute, 100);
  const splitIdx = Math.max(0, snap.closestIndex);

  const snappedPoint: RoutePoint = {
    latitude: snap.snappedLat,
    longitude: snap.snappedLng,
  };

  const traveledRoute = [...fullRoute.slice(0, splitIdx + 1), snappedPoint];
  const remainingRoute = [snappedPoint, ...fullRoute.slice(splitIdx + 1)];

  return { traveledRoute, remainingRoute };
}
