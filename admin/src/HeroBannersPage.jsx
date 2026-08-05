import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiInfo, FiMonitor, FiSmartphone, FiSave } from 'react-icons/fi';

export default function HeroBannersPage({ showNotification }) {
  // Load initial banners from localStorage or fall back to defaults
  const [desktopBanners, setDesktopBanners] = useState(() => {
    const saved = localStorage.getItem('avantika_desktop_banners');
    return saved ? JSON.parse(saved) : ['/avantika resize.jpg.jpeg', '/avantika chef.jpg.jpeg'];
  });

  const [mobileBanners, setMobileBanners] = useState(() => {
    const saved = localStorage.getItem('avantika_mobile_banners');
    return saved ? JSON.parse(saved) : ['/avantika%20banner%202.png', '/AVNTIKA.png'];
  });

  // State for new banner form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDesktopUrl, setNewDesktopUrl] = useState('');
  const [newMobileUrl, setNewMobileUrl] = useState('');

  // Save banners to localStorage
  const handleSaveBanners = (updatedDesktop, updatedMobile) => {
    localStorage.setItem('avantika_desktop_banners', JSON.stringify(updatedDesktop));
    localStorage.setItem('avantika_mobile_banners', JSON.stringify(updatedMobile));
    showNotification('Hero Banners synchronized successfully! 🚀', 'success');
  };

  const handleAddBanner = (e) => {
    e.preventDefault();
    if (desktopBanners.length >= 3) {
      showNotification('Maximum limit of 3 banners reached!', 'warning');
      return;
    }
    if (!newDesktopUrl || !newMobileUrl) {
      showNotification('Please fill in both Desktop and Mobile Banner URLs!', 'warning');
      return;
    }

    const nextDesktop = [...desktopBanners, newDesktopUrl];
    const nextMobile = [...mobileBanners, newMobileUrl];
    
    setDesktopBanners(nextDesktop);
    setMobileBanners(nextMobile);
    handleSaveBanners(nextDesktop, nextMobile);

    // Reset Form
    setNewDesktopUrl('');
    setNewMobileUrl('');
    setShowAddForm(false);
  };

  const handleDeleteBanner = (index) => {
    if (desktopBanners.length <= 2) {
      showNotification('Minimum of 2 banners is required for rotation!', 'warning');
      return;
    }

    if (window.confirm('Are you sure you want to remove this banner set?')) {
      const nextDesktop = desktopBanners.filter((_, i) => i !== index);
      const nextMobile = mobileBanners.filter((_, i) => i !== index);

      setDesktopBanners(nextDesktop);
      setMobileBanners(nextMobile);
      handleSaveBanners(nextDesktop, nextMobile);
    }
  };

  return (
    <div className="grid-card" style={{ flex: 1, gap: '20px', overflowY: 'auto', background: 'transparent', border: 'none', boxShadow: 'none', padding: '24px 28px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1.5px' }}>VISUAL BRANDING COMMAND</span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>Hero Banners</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Configure promotional rotating slides for Desktop and Mobile views.</span>
        </div>
        <button
          className="btn btn-primary btn-yellow"
          disabled={desktopBanners.length >= 3}
          style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', opacity: desktopBanners.length >= 3 ? 0.5 : 1, cursor: desktopBanners.length >= 3 ? 'not-allowed' : 'pointer' }}
          onClick={() => setShowAddForm(true)}
        >
          <FiPlus style={{ fontSize: '16px' }} /> ADD BANNER
        </button>
      </div>

      {/* Constraints Notification Banner */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <FiInfo style={{ fontSize: '20px', color: 'var(--accent-color)' }} />
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          <strong>System Constraints:</strong> Rotation requires a <strong>Minimum of 2 banners</strong> and allows a <strong>Maximum of 3 banners</strong>.
        </div>
      </div>

      {/* Grid of Banners */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px', marginTop: '10px' }}>
        {desktopBanners.map((desktopSrc, index) => {
          const mobileSrc = mobileBanners[index] || '';
          return (
            <div
              key={index}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--card-shadow)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'relative'
              }}
            >
              {/* Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900' }}>
                  SLIDE {index + 1}
                </span>

                <button
                  onClick={() => handleDeleteBanner(index)}
                  disabled={desktopBanners.length <= 2}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: '#ef4444',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: desktopBanners.length <= 2 ? 'not-allowed' : 'pointer',
                    opacity: desktopBanners.length <= 2 ? 0.4 : 1,
                    transition: 'all 0.2s'
                  }}
                  title="Remove Slide"
                >
                  <FiTrash2 style={{ fontSize: '14px' }} />
                </button>
              </div>

              {/* Previews */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Desktop Preview */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    <FiMonitor /> DESKTOP BANNER (Recommended: 1920 x 800)
                  </div>
                  <div style={{ width: '100%', height: '110px', borderRadius: '12px', background: '#000', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <img
                      src={desktopSrc}
                      alt={`Desktop Slide ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://placehold.co/1920x800?text=Invalid+Desktop+Image+URL'; }}
                    />
                  </div>
                  <input
                    type="text"
                    value={desktopSrc}
                    onChange={(e) => {
                      const nextDesktop = [...desktopBanners];
                      nextDesktop[index] = e.target.value;
                      setDesktopBanners(nextDesktop);
                    }}
                    style={{ width: '100%', marginTop: '6px', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '12px', outline: 'none' }}
                    placeholder="Desktop Image path/URL"
                  />
                </div>

                {/* Mobile Preview */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    <FiSmartphone /> MOBILE BANNER (Recommended: 1080 x 1920)
                  </div>
                  <div style={{ width: '80px', height: '110px', borderRadius: '12px', background: '#000', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <img
                      src={mobileSrc}
                      alt={`Mobile Slide ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://placehold.co/1080x1920?text=Invalid+Mobile+Image+URL'; }}
                    />
                  </div>
                  <input
                    type="text"
                    value={mobileSrc}
                    onChange={(e) => {
                      const nextMobile = [...mobileBanners];
                      nextMobile[index] = e.target.value;
                      setMobileBanners(nextMobile);
                    }}
                    style={{ width: '100%', marginTop: '6px', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '12px', outline: 'none' }}
                    placeholder="Mobile Image path/URL"
                  />
                </div>
              </div>

              {/* Save Button for this slide */}
              <button
                onClick={() => handleSaveBanners(desktopBanners, mobileBanners)}
                style={{
                  marginTop: '10px',
                  background: 'var(--accent-color)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px',
                  fontWeight: '900',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <FiSave /> SAVE UPDATES
              </button>
            </div>
          );
        })}
      </div>

      {/* Add New Banner Modal */}
      {showAddForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, background: 'rgba(9, 15, 12, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <form onSubmit={handleAddBanner} style={{ width: '480px', maxWidth: '95vw', background: 'var(--bg-card)', color: 'var(--text-primary)', borderRadius: '24px', padding: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Add Rotating Banner Set</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>Specify URLs or paths to initialize a new rotating banner slide.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Desktop Banner URL / File Path</label>
              <input
                type="text"
                placeholder="/avantika resize.jpg.jpeg"
                required
                style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
                value={newDesktopUrl}
                onChange={e => setNewDesktopUrl(e.target.value)}
              />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Desktop optimization size: e.g. 1920x800 pixels.</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Mobile/Responsive Banner URL / File Path</label>
              <input
                type="text"
                placeholder="/avantika banner 2.png"
                required
                style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
                value={newMobileUrl}
                onChange={e => setNewMobileUrl(e.target.value)}
              />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Mobile optimization size: e.g. 1080x1920 pixels.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '13px', cursor: 'pointer', padding: '10px 16px' }}
              >
                CANCEL
              </button>
              <button
                type="submit"
                style={{ background: 'var(--accent-color)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              >
                ADD SLIDE
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
