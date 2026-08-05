import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authPhone, setAuthPhone] = useState('')
  const [authError, setAuthError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState('')
  const [userData, setUserData] = useState(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  // Restore user session from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('avantika_token')
      const savedUser = localStorage.getItem('avantika_user')
      if (savedToken && savedUser) {
        const parsedUser = JSON.parse(savedUser)
        setUserData(parsedUser)
        setLoggedInUser(parsedUser.user_name || parsedUser.name || (parsedUser.email ? parsedUser.email.split('@')[0] : 'User'))
        setIsLoggedIn(true)
      }
    } catch (err) {
      console.error('Error loading saved auth session:', err)
    }
  }, [])

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')

    const API_BASE = 'http://localhost:45000/api/users'

    if (authMode === 'signup') {
      try {
        const response = await fetch(`${API_BASE}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: authName,
            name: authName,
            email: authEmail,
            phone: authPhone,
            phoneNumber: authPhone,
            password: authPassword
          })
        })
        const data = await response.json()

        if (data.success && data.data) {
          // Automatic login after registration
          try {
            const loginRes = await fetch(`${API_BASE}/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: authEmail,
                phone: authPhone,
                password: authPassword
              })
            })
            const loginData = await loginRes.json()
            if (loginData.success && loginData.data) {
              localStorage.setItem('avantika_token', loginData.token)
              localStorage.setItem('avantika_user', JSON.stringify(loginData.data))
              setUserData(loginData.data)
              setLoggedInUser(loginData.data.user_name || loginData.data.name || authName)
            } else {
              setUserData(data.data)
              setLoggedInUser(data.data.user_name || data.data.name || authName)
            }
          } catch (loginErr) {
            setUserData(data.data)
            setLoggedInUser(data.data.user_name || data.data.name || authName)
          }

          setIsLoggedIn(true)
          setShowAuthModal(false)
          setAuthEmail('')
          setAuthPassword('')
          setAuthName('')
          setAuthPhone('')
        } else {
          setAuthError(data.message || 'User registration failed')
        }
      } catch (err) {
        console.error('Registration API error:', err)
        setAuthError('Connection error to backend authentication server')
      } finally {
        setAuthLoading(false)
      }
    } else {
      // Login mode
      try {
        const response = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: authEmail,
            phone: authPhone,
            identifier: authEmail || authPhone,
            password: authPassword
          })
        })
        const data = await response.json()

        if (data.success && data.data) {
          localStorage.setItem('avantika_token', data.token)
          localStorage.setItem('avantika_user', JSON.stringify(data.data))
          setUserData(data.data)
          setLoggedInUser(data.data.user_name || data.data.name || (authEmail ? authEmail.split('@')[0] : 'User'))
          setIsLoggedIn(true)
          setShowAuthModal(false)
          setAuthEmail('')
          setAuthPassword('')
          setAuthName('')
          setAuthPhone('')
        } else {
          setAuthError(data.message || 'Invalid email/phone or password')
        }
      } catch (err) {
        console.error('Login API error:', err)
        setAuthError('Connection error to backend authentication server')
      } finally {
        setAuthLoading(false)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('avantika_token')
    localStorage.removeItem('avantika_user')
    setIsLoggedIn(false)
    setLoggedInUser('')
    setUserData(null)
    setShowUserDropdown(false)
  }

  return {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
    authName,
    setAuthName,
    authPhone,
    setAuthPhone,
    authError,
    setAuthError,
    isLoggedIn,
    setIsLoggedIn,
    loggedInUser,
    setLoggedInUser,
    userData,
    showUserDropdown,
    setShowUserDropdown,
    authLoading,
    setAuthLoading,
    handleAuthSubmit,
    handleLogout
  }
}

