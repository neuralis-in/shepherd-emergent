// API Client for Shepherd
// Handles authentication and API key management

const API_URL = import.meta.env.PROD 
  ? 'https://shepherd-api-48963996968.us-central1.run.app'
  : 'https://shepherd-api-48963996968.us-central1.run.app';

const api = {
  // ========================================
  // Auth Helpers
  // ========================================
  
  getToken() {
    return localStorage.getItem('session_token');
  },
  
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isLoggedIn() {
    return !!this.getToken();
  },
  
  headers() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },
  
  // ========================================
  // Google OAuth
  // ========================================
  
  async getGoogleAuthUrl() {
    const response = await fetch(`${API_URL}/auth/google/url`);
    if (!response.ok) {
      throw new Error('Failed to get auth URL');
    }
    return response.json();
  },
  
  async exchangeCode(code, redirectUri) {
    const response = await fetch(`${API_URL}/auth/google/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: redirectUri })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Authentication failed');
    }
    
    return response.json();
  },
  
  // ========================================
  // User
  // ========================================
  
  async getMe() {
    const response = await fetch(`${API_URL}/auth/me`, { 
      headers: this.headers() 
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
      }
      throw new Error('Not authenticated');
    }
    
    return response.json();
  },
  
  async logout() {
    try {
      await fetch(`${API_URL}/auth/logout`, { 
        method: 'POST', 
        headers: this.headers() 
      });
    } catch (error) {
      // Ignore logout errors
    }
    this.clearSession();
  },
  
  clearSession() {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user');
  },
  
  setSession(token, user) {
    localStorage.setItem('session_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  // ========================================
  // API Keys
  // ========================================
  
  async listApiKeys() {
    const response = await fetch(`${API_URL}/v1/accounts/me/api-keys`, { 
      headers: this.headers() 
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      throw new Error('Failed to list API keys');
    }
    
    const data = await response.json();
    
    // Handle different response formats
    // Could be: [...], { api_keys: [...] }, { keys: [...] }, or { data: [...] }
    if (Array.isArray(data)) {
      return data;
    }
    if (data.api_keys && Array.isArray(data.api_keys)) {
      return data.api_keys;
    }
    if (data.keys && Array.isArray(data.keys)) {
      return data.keys;
    }
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    
    // If it's an object but not in expected format, return empty array
    console.warn('Unexpected API keys response format:', data);
    return [];
  },
  
  async createApiKey(name = 'Default') {
    const response = await fetch(`${API_URL}/v1/accounts/me/api-keys`, {
      method: 'POST',
      headers: {
        ...this.headers(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to create API key');
    }
    
    const data = await response.json();
    
    // Handle different response formats
    // Could be: { api_key, key_prefix, name } or wrapped in another object
    if (data.api_key || data.key) {
      return data;
    }
    if (data.data && (data.data.api_key || data.data.key)) {
      return data.data;
    }
    if (data.key_data && (data.key_data.api_key || data.key_data.key)) {
      return data.key_data;
    }
    
    // Return as-is if we can't determine the structure
    return data;
  },
  
  async revokeApiKey(keyId) {
    const response = await fetch(`${API_URL}/v1/accounts/me/api-keys/${keyId}`, {
      method: 'DELETE',
      headers: this.headers()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      throw new Error('Failed to revoke API key');
    }
    
    return response.json();
  },
  
  // ========================================
  // Usage
  // ========================================
  
  async getUsage() {
    const response = await fetch(`${API_URL}/v1/accounts/me`, {
      headers: this.headers()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      throw new Error('Failed to fetch usage');
    }
    
    return response.json();
  },
  
  // ========================================
  // Razorpay Subscriptions
  // ========================================
  
  async createSubscriptionOrder({ clientId, amount, planId, billingDetails }) {
    const response = await fetch(`${API_URL}/v1/subscriptions/create`, {
      method: 'POST',
      headers: {
        ...this.headers(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        amount: amount,
        plan_id: planId,
        billing_details: billingDetails
      })
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to create subscription');
    }
    
    return response.json();
  },
  
  async verifySubscription({ razorpay_payment_id, razorpay_subscription_id, razorpay_signature }) {
    const response = await fetch(`${API_URL}/v1/subscriptions/verify`, {
      method: 'POST',
      headers: {
        ...this.headers(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature
      })
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Payment verification failed');
    }
    
    return response.json();
  },
  
  async getSubscription() {
    const response = await fetch(`${API_URL}/v1/subscriptions/current`, {
      headers: this.headers()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      if (response.status === 404) {
        return null; // No active subscription
      }
      throw new Error('Failed to fetch subscription');
    }
    
    return response.json();
  },
  
  async cancelSubscription() {
    const response = await fetch(`${API_URL}/v1/subscriptions/current/cancel`, {
      method: 'POST',
      headers: this.headers()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      throw new Error('Failed to cancel subscription');
    }
    
    return response.json();
  },
  
  async getBillingHistory() {
    const response = await fetch(`${API_URL}/v1/billing/history`, {
      headers: this.headers()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      throw new Error('Failed to fetch billing history');
    }
    
    return response.json();
  }
};

// ========================================
// Utility Functions
// ========================================

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
}

export async function signInWithGoogle() {
  const { url } = await api.getGoogleAuthUrl();
  window.location.href = url;
}

export default api;

