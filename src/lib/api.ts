// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dreamladder-api.azurewebsites.net/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

// Set auth token
export const setAuthToken = (token: string) => {
  localStorage.setItem('adminToken', token);
};

// Remove auth token
export const removeAuthToken = () => {
  localStorage.removeItem('adminToken');
};

// Generic fetch wrapper with auth
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Get response text first
  const text = await response.text();
  
  // Handle empty responses
  if (!text) {
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return null;
  }

  // Parse JSON
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON response: ${text}`);
  }

  if (!response.ok) {
    throw new Error(data.error?.message || data.error || 'API request failed');
  }

  return data;
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    // Don't send Authorization header for login - we're trying to GET a token
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Login failed');
    }

    if (data.success && data.data.token) {
      setAuthToken(data.data.token);
    }
    return data;
  },

  logout: async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      removeAuthToken();
    }
  },

  getCurrentUser: async () => {
    return apiFetch('/auth/me');
  },
};

// Properties API
export const propertiesAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    featured?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiFetch(`/properties${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return apiFetch(`/properties/${id}`);
  },

  create: async (propertyData: any) => {
    return apiFetch('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  update: async (id: string, propertyData: any) => {
    return apiFetch(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  },

  delete: async (id: string) => {
    return apiFetch(`/properties/${id}`, {
      method: 'DELETE',
    });
  },
};

// Enquiries API
export const enquiriesAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return apiFetch(`/enquiries${query ? `?${query}` : ''}`);
  },

  create: async (enquiryData: {
    type: string;
    name: string;
    email?: string;
    phone: string;
    message?: string;
    preferredTime?: string;
    propertyId?: string;
  }) => {
    return apiFetch('/enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiryData),
    });
  },

  updateStatus: async (id: string, status: string, notes?: string) => {
    return apiFetch(`/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },

  delete: async (id: string) => {
    return apiFetch(`/enquiries/${id}`, {
      method: 'DELETE',
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    return apiFetch('/dashboard/stats');
  },
};

// Settings API
export const settingsAPI = {
  getAll: async () => {
    return apiFetch('/settings');
  },
  
  update: async (settings: any) => {
    return apiFetch('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

// Financial API
export const financialAPI = {
  // Transactions
  transactions: {
    list: async (filters?: { type?: string; category?: string; start_date?: string; end_date?: string }) => {
      const params = new URLSearchParams(filters as Record<string, string>);
      const query = params.toString();
      return apiFetch(`/transactions${query ? `?${query}` : ''}`);
    },
    get: async (id: string) => {
      return apiFetch(`/transactions/${id}`);
    },
    create: async (transaction: any) => {
      return apiFetch('/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction),
      });
    },
    update: async (id: string, transaction: any) => {
      return apiFetch(`/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(transaction),
      });
    },
    delete: async (id: string) => {
      return apiFetch(`/transactions/${id}`, {
        method: 'DELETE',
      });
    },
  },
  
  // Receipts
  receipts: {
    list: async () => {
      return apiFetch('/receipts');
    },
    get: async (id: string) => {
      return apiFetch(`/receipts/${id}`);
    },
    create: async (receipt: any) => {
      return apiFetch('/receipts', {
        method: 'POST',
        body: JSON.stringify(receipt),
      });
    },
    update: async (id: string, receipt: any) => {
      return apiFetch(`/receipts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(receipt),
      });
    },
    delete: async (id: string) => {
      return apiFetch(`/receipts/${id}`, {
        method: 'DELETE',
      });
    },
  },
};

// Health check
export const healthCheck = async () => {
  return apiFetch('/health');
};
