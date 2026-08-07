import React from 'react'

export const ProfilePage = ({
  showProfilePage,
  setShowProfilePage,
  profileActiveTab,
  setProfileActiveTab,
  loggedInUser,
  setLoggedInUser,
  profileMobile,
  setProfileMobile,
  profileEmail,
  setProfileEmail,
  profileDob,
  setProfileDob,
  profileAnniversary,
  setProfileAnniversary,
  profileGender,
  setProfileGender,
  showGenderDropdown,
  setShowGenderDropdown,
  orderSearchQuery,
  setOrderSearchQuery,
  orderHistory,
  savedAddresses,
  setSavedAddresses,
  selectedAddressId,
  setSelectedAddressId,
  setUserLocation,
  handleLogout,
  filterVeg,
  setFilterVeg,
  darkMode,
  setDarkMode,
  onTrackOrder
}) => {
  if (!showProfilePage) return null

  return (
    <div onClick={() => setShowProfilePage(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 20002, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '440px', maxHeight: '88vh', overflowY: 'auto', overflowX: 'hidden', background: '#f5f6fb', borderRadius: '24px', padding: '24px', boxShadow: '0 25px 60px rgba(45,63,118,0.2)', border: '1px solid rgba(45,63,118,0.1)', boxSizing: 'border-box' }}>
        
        {profileActiveTab === 'dashboard' && (
          <>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                  onClick={() => setShowProfilePage(false)} 
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#2D3F76', display: 'flex', alignItems: 'center', padding: 0 }}
                >
                  ←
                </button>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#2D3F76' }}>My Account</h3>
              </div>
              <button 
                onClick={() => setShowProfilePage(false)} 
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'rgba(45, 63, 118, 0.6)' }}
              >
                ✕
              </button>
            </div>

            {/* Profile Brief Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#ffffff', padding: '18px', borderRadius: '20px', marginBottom: '24px', border: '1px solid rgba(45, 63, 118, 0.08)', boxShadow: '0 4px 16px rgba(45, 63, 118, 0.03)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#4CA687', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '800' }}>
                {loggedInUser ? loggedInUser.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#2D3F76', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {loggedInUser}
                </h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(45, 63, 118, 0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {profileEmail || 'Add your email'}
                </p>
              </div>
              <button 
                onClick={() => setProfileActiveTab('edit_profile')} 
                style={{ background: 'none', border: 'none', color: '#4CA687', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
              >
                EDIT
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* FOOD DELIVERY SECTION */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(45, 63, 118, 0.5)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>FOOD DELIVERY</span>
                <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid rgba(45, 63, 118, 0.08)', overflow: 'hidden' }}>
                  <div onClick={() => setProfileActiveTab('order_history')} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', borderBottom: '1px solid rgba(45, 63, 118, 0.06)', cursor: 'pointer' }}>
                    <span style={{ fontSize: '18px' }}>🛍️</span>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#2D3F76' }}>Order history</h4>
                      <p style={{ margin: 0, fontSize: '11px', color: 'rgba(45, 63, 118, 0.6)' }}>View previous orders</p>
                    </div>
                    <span style={{ fontSize: '14px', color: '#4CA687', fontWeight: '800' }}>›</span>
                  </div>
                  <div onClick={() => setProfileActiveTab('address_book')} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', borderBottom: '1px solid rgba(45, 63, 118, 0.06)', cursor: 'pointer' }}>
                    <span style={{ fontSize: '18px' }}>📍</span>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#2D3F76' }}>Address Book</h4>
                      <p style={{ margin: 0, fontSize: '11px', color: 'rgba(45, 63, 118, 0.6)' }}>Manage saved delivery addresses</p>
                    </div>
                    <span style={{ fontSize: '14px', color: '#4CA687', fontWeight: '800' }}>›</span>
                  </div>
                  <div onClick={() => setProfileActiveTab('payments')} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', borderBottom: '1px solid rgba(45, 63, 118, 0.06)', cursor: 'pointer' }}>
                    <span style={{ fontSize: '18px' }}>💳</span>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#2D3F76' }}>Saved payment methods</h4>
                      <p style={{ margin: 0, fontSize: '11px', color: 'rgba(45, 63, 118, 0.6)' }}>Manage cards & wallets</p>
                    </div>
                    <span style={{ fontSize: '14px', color: '#4CA687', fontWeight: '800' }}>›</span>
                  </div>

                  {/* Veg Mode - Always ON */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', borderBottom: '1px solid rgba(45, 63, 118, 0.06)' }}>
                    <span style={{ fontSize: '18px' }}>🌿</span>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#2D3F76' }}>Veg Mode Only</h4>
                      <p style={{ margin: 0, fontSize: '11px', color: 'rgba(45, 63, 118, 0.6)' }}>Show vegetarian dishes only</p>
                    </div>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: '#ffffff',
                      background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                      padding: '3px 9px',
                      borderRadius: '20px',
                      letterSpacing: '0.5px',
                      boxShadow: '0 2px 6px rgba(46,204,113,0.35)'
                    }}>Always ON</span>
                  </div>

                  {/* Dark Mode / Appearance Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px' }}>
                    <span style={{ fontSize: '18px' }}>✨</span>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#2D3F76' }}>Appearance</h4>
                      <p style={{ margin: 0, fontSize: '11px', color: 'rgba(45, 63, 118, 0.6)' }}>Switch Light / Dark Theme</p>
                    </div>
                    <div 
                      onClick={() => setDarkMode(!darkMode)} 
                      style={{ 
                        width: '40px', 
                        height: '22px', 
                        borderRadius: '100px', 
                        background: darkMode ? '#34495e' : '#f1c40f', 
                        position: 'relative', 
                        cursor: 'pointer', 
                        transition: 'background 0.25s' 
                      }}
                    >
                      <div 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          borderRadius: '50%', 
                          background: '#ffffff', 
                          position: 'absolute', 
                          top: '3px', 
                          left: darkMode ? '21px' : '3px', 
                          transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '9px'
                        }}
                      >
                        {darkMode ? '🌙' : '☀️'}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* LOGOUT BUTTON */}
              <button 
                onClick={() => { handleLogout(); setShowProfilePage(false); }} 
                style={{ width: '100%', background: '#ffffff', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.2)', padding: '16px', borderRadius: '16px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(231, 76, 60, 0.03)', transition: 'background 0.3s' }}
                onMouseEnter={e => e.target.style.background = 'rgba(231, 76, 60, 0.03)'}
                onMouseLeave={e => e.target.style.background = '#ffffff'}
              >
                <span>🚪</span> Log out
              </button>
            </div>
          </>
        )}

        {/* EDIT PROFILE TAB */}
        {profileActiveTab === 'edit_profile' && (
          <>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px' }}>
              <button 
                onClick={() => setProfileActiveTab('dashboard')} 
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#2D3F76', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                ←
              </button>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#2D3F76' }}>Edit profile</h3>
            </div>

            <form onSubmit={e => { e.preventDefault(); setProfileActiveTab('dashboard'); }} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Name Field */}
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-8px', left: '15px', background: '#ffffff', padding: '0 5px', fontSize: '11px', color: '#2D3F76', fontWeight: '700', zIndex: 2 }}>Name</span>
                <input 
                  type="text" 
                  value={loggedInUser} 
                  onChange={e => setLoggedInUser(e.target.value)} 
                  style={{ width: '100%', padding: '14px 40px 14px 15px', border: '1.5px solid rgba(45, 63, 118, 0.12)', borderRadius: '12px', fontSize: '14px', outline: 'none', fontWeight: '600', color: '#2D3F76', background: '#ffffff' }} 
                  required 
                />
                {loggedInUser && (
                  <span onClick={() => setLoggedInUser('')} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#b2bec3', cursor: 'pointer', fontSize: '14px', userSelect: 'none' }}>⨂</span>
                )}
              </div>

              {/* Mobile Field */}
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-8px', left: '15px', background: '#ffffff', padding: '0 5px', fontSize: '11px', color: '#2D3F76', fontWeight: '700', zIndex: 2 }}>Mobile</span>
                <input 
                  type="tel" 
                  value={profileMobile} 
                  onChange={e => setProfileMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                  style={{ width: '100%', padding: '14px 80px 14px 15px', border: '1.5px solid rgba(45, 63, 118, 0.12)', borderRadius: '12px', fontSize: '14px', outline: 'none', fontWeight: '600', color: '#2D3F76', background: '#ffffff' }} 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => { const val = prompt('Enter new mobile number:'); if(val) setProfileMobile(val.replace(/\D/g, '').slice(0, 10)); }} 
                  style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4CA687', fontWeight: '700', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.5px' }}
                >
                  CHANGE
                </button>
              </div>

              {/* Email Field */}
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-8px', left: '15px', background: '#ffffff', padding: '0 5px', fontSize: '11px', color: '#2D3F76', fontWeight: '700', zIndex: 2 }}>Email</span>
                <input 
                  type="email" 
                  value={profileEmail} 
                  onChange={e => setProfileEmail(e.target.value)} 
                  style={{ width: '100%', padding: '14px 80px 14px 15px', border: '1.5px solid rgba(45, 63, 118, 0.12)', borderRadius: '12px', fontSize: '14px', outline: 'none', fontWeight: '600', color: '#2D3F76', background: '#ffffff' }} 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => { const val = prompt('Enter new email:'); if(val) setProfileEmail(val); }} 
                  style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4CA687', fontWeight: '700', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.5px' }}
                >
                  CHANGE
                </button>
              </div>

              {/* DOB Field */}
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-8px', left: '15px', background: '#ffffff', padding: '0 5px', fontSize: '11px', color: '#2D3F76', fontWeight: '700', zIndex: 2 }}>Date of birth</span>
                <input 
                  type="date" 
                  value={profileDob} 
                  onChange={e => setProfileDob(e.target.value)} 
                  style={{ width: '100%', padding: '14px 15px', border: '1.5px solid rgba(45, 63, 118, 0.12)', borderRadius: '12px', fontSize: '14px', outline: 'none', fontWeight: '600', color: '#2D3F76', background: '#ffffff' }} 
                />
              </div>

              {/* Anniversary Field */}
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-8px', left: '15px', background: '#ffffff', padding: '0 5px', fontSize: '11px', color: '#2D3F76', fontWeight: '700', zIndex: 2 }}>Anniversary</span>
                <input 
                  type="date" 
                  value={profileAnniversary} 
                  onChange={e => setProfileAnniversary(e.target.value)} 
                  style={{ width: '100%', padding: '14px 15px', border: '1.5px solid rgba(45, 63, 118, 0.12)', borderRadius: '12px', fontSize: '14px', outline: 'none', fontWeight: '600', color: '#2D3F76', background: '#ffffff' }} 
                />
              </div>

              {/* Gender Field */}
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-8px', left: '15px', background: '#ffffff', padding: '0 5px', fontSize: '11px', color: '#2D3F76', fontWeight: '700', zIndex: 2 }}>Gender</span>
                <div 
                  onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                  style={{ width: '100%', padding: '14px 15px', border: '1.5px solid rgba(45, 63, 118, 0.12)', borderRadius: '12px', fontSize: '14px', fontWeight: '600', color: profileGender ? '#2D3F76' : 'rgba(45, 63, 118, 0.5)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}
                >
                  <span>{profileGender || 'Gender'}</span>
                  <span style={{ fontSize: '10px', color: '#2D3F76' }}>{showGenderDropdown ? '▲' : '▼'}</span>
                </div>

                {showGenderDropdown && (
                  <div style={{ position: 'absolute', bottom: '105%', left: 0, width: '100%', background: '#ffffff', borderRadius: '14px', border: '1px solid rgba(45,63,118,0.12)', boxShadow: '0 -10px 30px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {['Male', 'Female', 'Other', 'Prefer not to disclose'].map(opt => (
                      <div 
                        key={opt}
                        onClick={() => { setProfileGender(opt); setShowGenderDropdown(false); }}
                        style={{ padding: '14px 16px', fontSize: '14px', color: '#2D3F76', cursor: 'pointer', borderBottom: '1px solid rgba(45, 63, 118, 0.05)', textAlign: 'left', background: '#ffffff', fontWeight: '600' }}
                        onMouseEnter={e => e.target.style.background = 'rgba(76, 166, 135, 0.05)'}
                        onMouseLeave={e => e.target.style.background = '#ffffff'}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Update button */}
              <button 
                type="submit" 
                disabled={!loggedInUser || !profileMobile}
                style={{
                  width: '100%',
                  background: (loggedInUser && profileMobile) ? '#4CA687' : 'rgba(45, 63, 118, 0.08)',
                  color: (loggedInUser && profileMobile) ? '#ffffff' : 'rgba(45, 63, 118, 0.4)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: (loggedInUser && profileMobile) ? 'pointer' : 'not-allowed',
                  marginTop: '12px',
                  transition: 'background 0.3s'
                }}
              >
                Update profile
              </button>
            </form>
          </>
        )}

        {/* PAYMENTS TAB */}
        {profileActiveTab === 'payments' && (
          <>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <button 
                onClick={() => setProfileActiveTab('dashboard')} 
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#2D3F76', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                ←
              </button>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#2D3F76' }}>Payment settings</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* CARDS */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(45, 63, 118, 0.5)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>CARDS</span>
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid rgba(45, 63, 118, 0.08)', overflow: 'hidden' }}>
                  <div onClick={() => alert('Add credit or debit card triggered!')} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderBottom: '1px solid rgba(45, 63, 118, 0.06)', cursor: 'pointer' }}>
                    <span style={{ fontSize: '18px' }}>💳</span>
                    <span style={{ flex: 1, fontSize: '14px', fontWeight: '600', color: '#2D3F76' }}>Add credit or debit cards</span>
                    <span style={{ fontSize: '16px', color: '#4CA687', fontWeight: '800' }}>+</span>
                  </div>
                  <div onClick={() => alert('Add Pluxee triggered!')} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', cursor: 'pointer' }}>
                    <span style={{ fontSize: '12px', background: 'rgba(45,63,118,0.06)', padding: '4px 8px', borderRadius: '4px', fontWeight: '800', color: '#2D3F76', fontFamily: 'monospace' }}>pluxee</span>
                    <span style={{ flex: 1, fontSize: '14px', fontWeight: '600', color: '#2D3F76' }}>Add Pluxee</span>
                    <span style={{ fontSize: '16px', color: '#4CA687', fontWeight: '800' }}>+</span>
                  </div>
                </div>
              </div>

              {/* UPI */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(45, 63, 118, 0.5)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>UPI</span>
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px dashed rgba(45, 63, 118, 0.12)', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(45, 63, 118, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⚠️</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#2D3F76' }}>UPI apps not installed/setup</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: 'rgba(45, 63, 118, 0.6)' }}>Install and setup any UPI app to make payments</p>
                  </div>
                </div>
              </div>

              {/* WALLETS */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(45, 63, 118, 0.5)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>WALLETS</span>
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid rgba(45, 63, 118, 0.08)', overflow: 'hidden' }}>
                  <div onClick={() => alert('Amazon Pay triggered!')} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderBottom: '1px solid rgba(45, 63, 118, 0.06)', cursor: 'pointer' }}>
                    <span style={{ fontSize: '12px', background: '#232f3e', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontWeight: '700' }}>pay</span>
                    <span style={{ flex: 1, fontSize: '14px', fontWeight: '600', color: '#2D3F76' }}>Amazon Pay Balance</span>
                    <span style={{ fontSize: '16px', color: '#4CA687', fontWeight: '800' }}>+</span>
                  </div>
                  <div onClick={() => alert('Mobikwik triggered!')} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', cursor: 'pointer' }}>
                    <span style={{ fontSize: '12px', background: '#005387', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontWeight: '700' }}>M~</span>
                    <span style={{ flex: 1, fontSize: '14px', fontWeight: '600', color: '#2D3F76' }}>Mobikwik</span>
                    <span style={{ fontSize: '16px', color: '#4CA687', fontWeight: '800' }}>+</span>
                  </div>
                </div>
              </div>

              {/* PAY LATER */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(45, 63, 118, 0.5)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>PAY LATER</span>
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid rgba(45, 63, 118, 0.08)', overflow: 'hidden' }}>
                  <div onClick={() => alert('Amazon Pay Later triggered!')} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderBottom: '1px solid rgba(45, 63, 118, 0.06)', cursor: 'pointer' }}>
                    <span style={{ fontSize: '12px', background: '#232f3e', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontWeight: '700' }}>pay</span>
                    <span style={{ flex: 1, fontSize: '14px', fontWeight: '600', color: '#2D3F76' }}>Amazon Pay Later</span>
                    <span style={{ fontSize: '16px', color: '#4CA687', fontWeight: '800' }}>+</span>
                  </div>
                  <div onClick={() => alert('LazyPay triggered!')} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', cursor: 'pointer' }}>
                    <span style={{ fontSize: '12px', background: '#f55d42', color: '#fff', padding: '3px 6px', borderRadius: '4px', fontWeight: '700' }}>lazy</span>
                    <span style={{ flex: 1, fontSize: '14px', fontWeight: '600', color: '#2D3F76' }}>LazyPay</span>
                    <span style={{ fontSize: '16px', color: '#4CA687', fontWeight: '800' }}>+</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ORDER HISTORY TAB */}
        {profileActiveTab === 'order_history' && (
          <>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <button 
                onClick={() => setProfileActiveTab('dashboard')} 
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#2D3F76', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                ←
              </button>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#2D3F76' }}>Order history</h3>
            </div>

            {/* Search Bar for orders */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1.5px solid rgba(45, 63, 118, 0.1)', padding: '10px 14px', borderRadius: '12px', marginBottom: '18px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '14px', color: 'rgba(45, 63, 118, 0.4)' }}>🔍</span>
              <input 
                type="text" 
                placeholder="Search orders by item or ID..." 
                value={orderSearchQuery}
                onChange={e => setOrderSearchQuery(e.target.value)}
                style={{ width: '100%', background: 'none', border: 'none', fontSize: '13px', outline: 'none', fontFamily: 'inherit', color: '#2D3F76', fontWeight: '600' }}
              />
              {orderSearchQuery && (
                <button onClick={() => setOrderSearchQuery('')} style={{ background: 'none', border: 'none', color: 'rgba(45, 63, 118, 0.4)', fontSize: '14px', cursor: 'pointer', fontWeight: '700' }}>✕</button>
              )}
            </div>

            {/* Orders list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {orderHistory
                .filter(ord => !orderSearchQuery.trim() || ord.items.toLowerCase().includes(orderSearchQuery.toLowerCase()) || ord.id.toLowerCase().includes(orderSearchQuery.toLowerCase()))
                .length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 10px', color: 'rgba(45,63,118,0.4)' }}>
                    <span style={{ fontSize: '32px' }}>📦</span>
                    <h5 style={{ margin: '8px 0 2px 0', fontSize: '14px', fontWeight: '700' }}>No orders found</h5>
                    <p style={{ margin: 0, fontSize: '12px' }}>Try searching with a different term.</p>
                  </div>
                ) : (
                  orderHistory
                    .filter(ord => !orderSearchQuery.trim() || ord.items.toLowerCase().includes(orderSearchQuery.toLowerCase()) || ord.id.toLowerCase().includes(orderSearchQuery.toLowerCase()))
                    .map(order => (
                      <div key={order.id} style={{ background: '#ffffff', borderRadius: '18px', padding: '16px', border: '1px solid rgba(45, 63, 118, 0.08)', boxShadow: '0 4px 16px rgba(45, 63, 118, 0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(45, 63, 118, 0.06)', paddingBottom: '10px', marginBottom: '10px' }}>
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(45,63,118,0.5)', display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>ORDER ID</span>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#2D3F76' }}>{order.id}</span>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: '800', background: order.status === 'Delivered' ? 'rgba(76, 166, 135, 0.1)' : 'rgba(235, 156, 15, 0.1)', color: order.status === 'Delivered' ? '#4CA687' : '#eb9c0f', padding: '4px 10px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {order.status}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#2d3f76', fontWeight: '600', lineHeight: '1.4' }}>{order.items}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginTop: '10px' }}>
                          <span style={{ color: 'rgba(45,63,118,0.5)', fontWeight: '600' }}>{order.date}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '800', color: '#2D3F76', fontSize: '14px' }}>{order.total}</span>
                            <button
                              onClick={() => {
                                setShowProfilePage(false);
                                if (onTrackOrder) onTrackOrder({ orderId: order.id || order.orderId, orderStatus: order.status || 'Preparing' });
                              }}
                              style={{
                                background: '#4CA687',
                                color: '#ffffff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              🗺️ Track
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
            </div>
          </>
        )}

        {/* ADDRESS BOOK TAB */}
        {profileActiveTab === 'address_book' && (
          <>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <button 
                onClick={() => setProfileActiveTab('dashboard')} 
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#2D3F76', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                ←
              </button>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#2D3F76' }}>Address Book</h3>
            </div>

            {/* Address List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {savedAddresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: 'rgba(45,63,118,0.4)' }}>
                  <span style={{ fontSize: '32px' }}>📍</span>
                  <h5 style={{ margin: '8px 0 2px 0', fontSize: '14px', fontWeight: '700' }}>No saved addresses</h5>
                  <p style={{ margin: 0, fontSize: '12px' }}>Please add an address in checkout.</p>
                </div>
              ) : (
                savedAddresses.map((addr, idx) => {
                  const fullAddressStr = `${addr.houseNo}, ${addr.building}, ${addr.landmark ? addr.landmark + ', ' : ''}${addr.area}, ${addr.city} - ${addr.pincode}`;
                  const isSelected = selectedAddressId === addr.id;
                  const distance = idx === 0 ? '0 m' : idx === 1 ? '109 km' : '116 km';
                  return (
                    <div
                      key={addr.id}
                      onClick={() => { setSelectedAddressId(addr.id); setUserLocation(fullAddressStr); setProfileActiveTab('dashboard'); }}
                      style={{ background: '#ffffff', borderRadius: '20px', padding: '18px', border: isSelected ? '1.5px solid #4CA687' : '1px solid rgba(45,63,118,0.08)', display: 'flex', gap: '14px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(45,63,118,0.03)' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '36px', flexShrink: 0 }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(45,63,118,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                          {addr.type === 'Home' ? '🏠' : addr.type === 'Work' ? '💼' : '📍'}
                        </div>
                        <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(45,63,118,0.6)' }}>{distance}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#2D3F76', marginBottom: '4px' }}>{addr.type || 'Home'}</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(45,63,118,0.7)', lineHeight: '1.5', marginBottom: '4px' }}>{fullAddressStr}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: 'rgba(45,63,118,0.5)', fontWeight: '600' }}>Phone: {addr.phone}</p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <button type="button" onClick={e => { e.stopPropagation(); if(confirm('Delete this address?')) setSavedAddresses(savedAddresses.filter(a => a.id !== addr.id)); }} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(45,63,118,0.12)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '11px' }}>🗑</button>
                          <button type="button" onClick={e => { e.stopPropagation(); alert('Showing on map'); }} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(45,63,118,0.12)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '11px' }}>📍</button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default ProfilePage
