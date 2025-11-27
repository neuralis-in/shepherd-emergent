import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import api from '../api'
import './AuthCallback.css'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('processing') // processing, success, error
  const [error, setError] = useState('')

  useEffect(() => {
    handleCallback()
  }, [])

  async function handleCallback() {
    // Get the full URL and search params
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const errorParam = urlParams.get('error')
    
    console.log('Auth callback - Full URL:', window.location.href)
    console.log('Auth callback - Code:', code ? 'present' : 'missing')

    if (errorParam) {
      setStatus('error')
      setError('Authentication was cancelled or failed. Please try again.')
      setTimeout(() => navigate('/api-keys?error=auth_failed'), 3000)
      return
    }

    if (!code) {
      setStatus('error')
      setError('No authorization code received. Please try again.')
      setTimeout(() => navigate('/api-keys?error=no_code'), 3000)
      return
    }

    try {
      // Construct redirect URI - must match what's registered in Google OAuth
      // For GitHub Pages: https://neuralis-in.github.io/shepherd/auth/callback
      const baseUrl = window.location.origin
      const basePath = import.meta.env.BASE_URL || '/shepherd/'
      const redirectUri = `${baseUrl}${basePath}auth/callback`.replace(/\/+/g, '/').replace(':/', '://')
      
      console.log('Auth callback - Redirect URI:', redirectUri)
      
      const { token, user } = await api.exchangeCode(code, redirectUri)

      // Store session
      api.setSession(token, user)

      setStatus('success')
      console.log('Auth callback - Success! User:', user?.email)
      
      // Small delay to show success state
      setTimeout(() => {
        navigate('/api-keys')
      }, 1500)

    } catch (err) {
      console.error('Auth error:', err)
      setStatus('error')
      setError(err.message || 'Authentication failed. Please try again.')
      setTimeout(() => navigate('/api-keys?error=auth_failed'), 3000)
    }
  }

  return (
    <div className="auth-callback">
      <div className="auth-callback__card">
        {status === 'processing' && (
          <>
            <div className="auth-callback__icon auth-callback__icon--processing">
              <Loader2 size={32} className="spinner" />
            </div>
            <h2>Signing you in...</h2>
            <p>Please wait while we complete your authentication.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="auth-callback__icon auth-callback__icon--success">
              <CheckCircle size={32} />
            </div>
            <h2>Welcome!</h2>
            <p>Authentication successful. Redirecting to your API keys...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="auth-callback__icon auth-callback__icon--error">
              <AlertCircle size={32} />
            </div>
            <h2>Authentication Failed</h2>
            <p>{error}</p>
            <p className="auth-callback__redirect">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  )
}

