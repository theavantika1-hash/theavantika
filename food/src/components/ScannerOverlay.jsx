import React from 'react'
import { IoRestaurant } from "react-icons/io5"
import { TbMotorbikeFilled } from "react-icons/tb"

export const ScannerOverlay = ({
  loading,
  diningMode,
  showScanner,
  setShowScanner,
  selectedMode,
  setSelectedMode,
  scanSuccess,
  scanProgress,
  handleModeSelect
}) => {
  return (
    <>
      {/* Initial Splash Loading Screen */}
      {loading && (
        <div className="initial-splash-loader">
          <div className="loader-content">
            <img src="/A logo.png" alt="avantika logo" className="splash-logo-img" />
            <h2 className="splash-title-text">Avantika</h2>
            <p className="splash-subtitle">the fine dine</p>
            <div className="splash-loading-bar">
              <div className="splash-progress"></div>
            </div>
          </div>
        </div>
      )}

      {/* Dining Mode Selection Overlay (Welcome Screen) */}
      {!diningMode && !showScanner && !loading && (
        <div className="welcome-screen-overlay">
          <div className="welcome-modal">
            <h1 className="welcome-logo">avantika</h1>
            <p className="welcome-instruction">Please select a service option to explore the menu</p>

            <div className="mode-selection-container">
              <button className="mode-btn delivery" onClick={() => handleModeSelect('delivery')}>
                <div className="mode-icon-wrap">
                  <TbMotorbikeFilled size={32} />
                </div>
                <span className="mode-title">Delivery</span>
                <span className="mode-desc">Delivered hot to your door</span>
              </button>

              <button className="mode-btn dinein" onClick={() => handleModeSelect('dine-in')}>
                <div className="mode-icon-wrap">
                  <IoRestaurant size={32} />
                </div>
                <span className="mode-title">Dine-In</span>
                <span className="mode-desc">Premium table service</span>
              </button>

              <button className="mode-btn pickup" onClick={() => handleModeSelect('pickup')}>
                <div className="mode-icon-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <span className="mode-title">Pickup</span>
                <span className="mode-desc">Ready for takeaway</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulator Scanner Screen Overlay */}
      {showScanner && (
        <div className="scanner-screen-overlay">
          <div className="scanner-modal">
            <div className="scanner-header-area">
              <h2 className="scanner-title">
                {selectedMode === 'delivery' && 'GPS COORDINATE DETECTOR'}
                {selectedMode === 'dine-in' && 'TABLE QR SCANNER'}
                {selectedMode === 'pickup' && 'TAKEAWAY BARCODE SCANNER'}
              </h2>
              <p className="scanner-subtitle">
                {selectedMode === 'delivery' && 'Scanning for current location coordinates...'}
                {selectedMode === 'dine-in' && 'Align the Table QR Code inside the scan frame...'}
                {selectedMode === 'pickup' && 'Scanning takeaway receipt barcode...'}
              </p>
            </div>

            {/* Viewfinder box with laser line */}
            <div className={`scanner-viewfinder ${scanSuccess ? 'success' : ''}`}>
              <div className="laser-line"></div>
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>

              {/* QR / Barcode mockup depending on selectedMode */}
              <div className="scanner-target-mockup">
                {selectedMode === 'dine-in' && (
                  <svg className="mock-qr" xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v3h-3v-3zm3 3h-3v3h3v-3zm-6-3h3v6h-3v-6zm3 3h3v3h-3v-3zM13 3h2v2h-2V3zm0 4h2v2h-2V7zm4 4h2v2h-2v-2z" />
                  </svg>
                )}
                {selectedMode === 'delivery' && (
                  <svg className="mock-location" xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                  </svg>
                )}
                {selectedMode === 'pickup' && (
                  <svg className="mock-barcode" xmlns="http://www.w3.org/2000/svg" width="140" height="120" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="2" height="16" />
                    <rect x="6" y="4" width="1" height="16" />
                    <rect x="9" y="4" width="3" height="16" />
                    <rect x="14" y="4" width="1" height="16" />
                    <rect x="17" y="4" width="2" height="16" />
                    <rect x="21" y="4" width="1" height="16" />
                  </svg>
                )}
              </div>

              {scanSuccess && (
                <div className="scan-success-checkmark">
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="scanner-progress-section">
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${scanProgress}%` }}></div>
              </div>
              <span className="progress-text">
                {scanSuccess ? 'VERIFICATION SUCCESSFUL!' : `SCANNING CODE... ${scanProgress}%`}
              </span>
            </div>

            <button className="scanner-cancel-btn" onClick={() => { setShowScanner(false); setSelectedMode(null); }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ScannerOverlay
