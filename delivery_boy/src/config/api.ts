import { getApiBaseUrl } from './backendConfig';

async function apiRequest<T = any>(endpoint: string, method = 'GET', data?: any): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'API request failed');
    }
    return result;
  } catch (error: any) {
    console.warn(`[API Info] ${method} ${endpoint}:`, error?.message || error);
    throw error;
  }
}

export const deliveryBoyApi = {
  register: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    vehicleType?: string;
    vehicleNumber?: string;
  }) => apiRequest('/register', 'POST', payload),

  login: (payload: {
    email: string;
    password: string;
  }) => apiRequest('/login', 'POST', payload),

  sendOtp: (payload: {
    email: string;
  }) => apiRequest('/send-otp', 'POST', payload),

  verifyOtp: (payload: {
    email: string;
    otp: string;
  }) => apiRequest('/verify-otp', 'POST', payload),

  getProfile: (id?: string) => apiRequest(id ? `/profile/${encodeURIComponent(id)}` : '/profile', 'GET'),

  toggleStatus: (payload: { id?: string; isOnline: boolean }) => apiRequest('/status', 'POST', payload),

  updateLocation: (payload: { id?: string; latitude: number; longitude: number; address?: string }) =>
    apiRequest('/location', 'POST', payload),

  updateProfile: (payload: { id?: string; name?: string; phone?: string; vehicleType?: string; vehicleNumber?: string; drivingLicenseNumber?: string; licenseValidUpto?: string; documents?: any }) =>
    apiRequest('/profile', 'PUT', payload),

  // Check Admin Approval Status (Polling)
  getApprovalStatus: (email: string) => apiRequest(`/approval-status/${encodeURIComponent(email)}`, 'GET'),

  // Get Real Dashboard Stats & Profile Data
  getDashboardStats: (email?: string) => apiRequest(email ? `/dashboard-stats/${encodeURIComponent(email)}` : '/dashboard-stats', 'GET'),

  // Get Assigned Orders (New & Active)
  getAssignedOrders: (email?: string) => apiRequest(email ? `/assigned-orders/${encodeURIComponent(email)}` : '/assigned-orders', 'GET'),

  // Update Order Status (Accept / Decline)
  updateOrderStatus: (id: string, status: string, email?: string) => apiRequest(`/orders/${id}/status`, 'PUT', { status, email }),
};




