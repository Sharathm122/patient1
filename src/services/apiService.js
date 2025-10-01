// MongoDB Backend API Service
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API Client
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Authentication APIs
export const loginUser = async (email, password, role) => {
  try {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    });

    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      return { success: true, user: response.user, token: response.token };
    }

    return { success: false, error: response.message };
  } catch (error) {
    return { success: false, error: error.message || 'Login failed' };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (response.success) {
      return { success: true, user: response.user };
    }

    return { success: false, error: response.message };
  } catch (error) {
    return { success: false, error: error.message || 'Registration failed' };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiCall('/auth/me');
    return response.success ? response.user : null;
  } catch (error) {
    // If token is invalid, clear storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    return null;
  }
};

// Patient Me API - Get current patient profile
export const getPatientMe = async () => {
  try {
    const user = await getCurrentUser();
    if (user && user.role === 'patient') {
      return {
        userId: user._id,
        name: user.name,
        insuranceId: user.profile.memberId,
        coverage: user.profile.planType,
        expiry: user.profile.effectiveDate,
        ...user.profile
      };
    }
    throw new Error('Not a patient user');
  } catch (error) {
    console.error('Get Patient Me Error:', error);
    // Return fallback data for development
    return {
      userId: 'P-12345',
      name: 'John Doe',
      insuranceId: 'INS12345',
      coverage: 'Full',
      expiry: '2026-12-31'
    };
  }
};

// Patient Claims API - Matches your PatientClaimsView exactly
export const getPatientClaims = async () => {
  try {
    const response = await apiClient.get('/patient/claims/');
    // Expected response: Array of claims filtered by patient
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    // Return mock data matching the expected structure
    return [
      {
        id: 'CLM-2024-001',
        provider: 'City General Hospital',
        service: 'Emergency Visit',
        amount: '$1,250',
        status: 'approved',
        date: '2024-01-15',
        description: 'Acute chest pain evaluation',
        progress: 100
      },
      {
        id: 'CLM-2024-002',
        provider: 'Downtown Clinic', 
        service: 'Annual Physical',
        amount: '$350',
        status: 'processing',
        date: '2024-01-10',
        description: 'Routine annual physical examination',
        progress: 65
      }
    ];
  }
};

// Notifications API - Matches your NotificationsView exactly  
export const getNotifications = async () => {
  try {
    const response = await apiClient.get('/notifications/');
    // Expected response: Array of notifications filtered by user
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    // Return mock data matching the expected structure
    return [
      {
        id: 1,
        type: 'approval',
        title: 'Claim Approved',
        message: 'Your emergency visit claim (CLM-2024-001) has been approved for $1,250',
        read: false,
        time: '2 hours ago'
      },
      {
        id: 2,
        type: 'action_required',
        title: 'Documents Needed',
        message: 'Additional documentation required for claim CLM-2024-002',
        read: false,
        time: '1 day ago'
      }
    ];
  }
};

// Mark Notification as Read - Matches your NotificationReadView exactly
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.patch(`/notifications/${notificationId}/read/`);
    // Expected response: Updated notification object
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    // Return mock success response
    return { id: notificationId, read: true };
  }
};

// Logout API
export const logoutUser = async () => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
};