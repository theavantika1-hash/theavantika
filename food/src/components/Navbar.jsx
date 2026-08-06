import React, { useState, useRef, useEffect } from 'react'
import { FiUser } from "react-icons/fi"

export const Navbar = ({
  diningMode,
  setDiningMode,
  userLocation,
  setTempLocation,
  setShowLocationPopup,
  searchQuery,
  setSearchQuery,
  isLoggedIn,
  setShowAuthModal,
  setAuthMode,
  setShowCartDrawer,
  setCheckoutStep,
  cart,
  setShowProfilePage,
  setProfileActiveTab,
  loggedInUser
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="nav-header">
      <div className="logo-section-wrap">
        <div className="logo">
          {/* Logo container */}
        </div>
        {diningMode && (
          <div className="dining-mode-badge" onClick={() => setDiningMode(null)} title="Change Dining Method">
            <span className="mode-dot"></span>
            <span className="mode-text">{diningMode}</span>
            <span className="mode-change-tip">Change</span>
          </div>
        )}
        {diningMode === 'delivery' && (
          <div className="location-badge" onClick={() => { setTempLocation(userLocation); setShowLocationPopup(true); }} title="Change Location">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="location-text-badge">{userLocation || 'Set Location'}</span>
          </div>
        )}
      </div>

      {/* Centered Search Bar */}
      {diningMode && (
        <div className="nav-search-container">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search delicious food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="nav-search-input"
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')} title="Clear search">×</button>
          )}
        </div>
      )}

      {/* Desktop Nav Actions */}
      {diningMode && (
        <div className="nav-actions nav-actions-desktop">
          {/* Shopping Cart Icon */}
          <button className="icon-btn cart-icon-button" onClick={() => {
            if (!isLoggedIn) {
              setShowAuthModal(true)
              setAuthMode('login')
            } else {
              setShowCartDrawer(true)
              setCheckoutStep('cart')
            }
          }} aria-label="Shopping Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cart.length > 0 && (
              <span className="cart-badge-count">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            )}
          </button>

          {/* User Login/Signup/Profile Button */}
          {isLoggedIn ? (
            <div className="user-profile-menu-container">
              <button className="icon-btn logged-in" onClick={() => { setShowProfilePage(true); setProfileActiveTab('dashboard'); }} aria-label="User Account">
                <FiUser size={22} />
                <span className="user-name-label">{loggedInUser}</span>
              </button>
            </div>
          ) : (
            <button className="icon-btn" onClick={() => { setShowAuthModal(true); setAuthMode('login'); }} aria-label="Login or Sign Up">
              <FiUser size={22} />
            </button>
          )}

          {/* Hamburger Menu Icon */}
          <button className="icon-btn" aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Mobile 3-dot Menu */}
      {diningMode && (
        <div className="nav-actions-mobile" ref={menuRef}>
          <button
            className="icon-btn three-dot-btn"
            aria-label="More Options"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="mobile-dropdown">
              {/* Cart */}
              <button className="mobile-dropdown-item" onClick={() => {
                setMobileMenuOpen(false)
                if (!isLoggedIn) {
                  setShowAuthModal(true)
                  setAuthMode('login')
                } else {
                  setShowCartDrawer(true)
                  setCheckoutStep('cart')
                }
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span>Cart {cart.length > 0 && `(${cart.reduce((sum, item) => sum + item.quantity, 0)})`}</span>
              </button>

              {/* Login / Profile */}
              {isLoggedIn ? (
                <button className="mobile-dropdown-item" onClick={() => {
                  setMobileMenuOpen(false)
                  setShowProfilePage(true)
                  setProfileActiveTab('dashboard')
                }}>
                  <FiUser size={18} />
                  <span>{loggedInUser}</span>
                </button>
              ) : (
                <button className="mobile-dropdown-item" onClick={() => {
                  setMobileMenuOpen(false)
                  setShowAuthModal(true)
                  setAuthMode('login')
                }}>
                  <FiUser size={18} />
                  <span>Login / Signup</span>
                </button>
              )}

              {/* Delivery / Dining Mode */}
              {diningMode && (
                <button className="mobile-dropdown-item" onClick={() => {
                  setMobileMenuOpen(false)
                  setDiningMode(null)
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11l19-9-9 19-2-8-8-2z"></path>
                  </svg>
                  <span>{diningMode} — Change</span>
                </button>
              )}

              {/* Set Location */}
              <button className="mobile-dropdown-item" onClick={() => {
                setMobileMenuOpen(false)
                setTempLocation(userLocation)
                setShowLocationPopup(true)
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{userLocation || 'Set Location'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
export default Navbar
