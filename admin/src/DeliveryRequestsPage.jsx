import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiCheck, FiX, FiInfo, FiUser, FiPhone, FiClock, FiFileText } from 'react-icons/fi';
import { MdOutlineDirectionsBike } from 'react-icons/md';

const DUMMY_DL_IMAGE  = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80";
const DUMMY_RC_IMAGE  = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=500&q=80";

/* ─── Portal wrapper ─────────────────────────────────────────────────────── */
function PartnerModal({ partner, onClose, onAccept, onReject }) {
  const elRef = useRef(null);

  // Create a dedicated DOM node appended to <body> on mount
  useEffect(() => {
    const el = document.createElement('div');
    el.setAttribute('id', 'partner-modal-root');
    document.body.appendChild(el);
    elRef.current = el;
    return () => {
      if (document.body.contains(el)) document.body.removeChild(el);
    };
  }, []);

  if (!partner || !elRef.current) return null;

  const overlay = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 999999,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          color: '#1a1a2e',
          borderRadius: '24px',
          width: '600px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 40px 120px rgba(0,0,0,0.5)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>
            🪪 Partner Application Profile
          </h3>
          <button
            onClick={onClose}
            style={{
              background: '#f0f0f0', border: 'none',
              width: '34px', height: '34px', borderRadius: '50%',
              cursor: 'pointer', fontSize: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >✕</button>
        </div>

        {/* Basic Info */}
        <div style={{
          display: 'flex', gap: '16px', alignItems: 'center',
          background: '#f5f7ff', padding: '16px', borderRadius: '14px'
        }}>
          <img
            src={partner.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
            alt={partner.name}
            style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #4CA687', flexShrink: 0 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '900' }}>{partner.name}</h4>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiPhone style={{ color: '#4CA687' }} /> {partner.phone}
              </span>
              <span style={{ fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiClock style={{ color: '#4CA687' }} /> {partner.experience} experience
              </span>
              <span style={{ fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiUser style={{ color: '#4CA687' }} /> ID: {partner.id}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
              <span style={{ background: '#e6f7f1', color: '#10b981', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px' }}>Aadhar ✓</span>
              <span style={{ background: '#e6f7f1', color: '#10b981', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px' }}>DL ✓</span>
              <span style={{ background: '#e6f7f1', color: '#10b981', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '5px' }}>Bike RC ✓</span>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '11px', fontWeight: '800', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Submitted Documents
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

            {/* Driving License */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e0e0', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <div style={{ padding: '10px 12px', background: '#f5f7ff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiFileText style={{ color: '#4CA687' }} />
                <span style={{ fontSize: '11px', fontWeight: '800' }}>Driving License (DL)</span>
                <span style={{ background: '#e6f7f1', color: '#10b981', fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', marginLeft: 'auto' }}>✓ OK</span>
              </div>
              <img src={DUMMY_DL_IMAGE} alt="Driving License" style={{ width: '100%', height: '155px', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '8px 12px', fontSize: '10px', color: '#777', background: '#fafafa' }}>
                DL No: MH-0420-2026-XXXX &nbsp;·&nbsp; Valid till: 2030
              </div>
            </div>

            {/* Bike RC */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e0e0', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <div style={{ padding: '10px 12px', background: '#f5f7ff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MdOutlineDirectionsBike style={{ color: '#4CA687', fontSize: '18px' }} />
                <span style={{ fontSize: '11px', fontWeight: '800' }}>Bike Registration (RC)</span>
                <span style={{ background: '#e6f7f1', color: '#10b981', fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', marginLeft: 'auto' }}>✓ OK</span>
              </div>
              <img src={DUMMY_RC_IMAGE} alt="Bike RC" style={{ width: '100%', height: '155px', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '8px 12px', fontSize: '10px', color: '#777', background: '#fafafa' }}>
                Reg No: UP-32-AB-XXXX &nbsp;·&nbsp; TVS Apache 160 · 2023
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', paddingTop: '6px', borderTop: '1px solid #eee' }}>
          <button
            style={{ flex: 1, background: '#e6f7f1', color: '#0f8a5f', border: '1px solid #10b981', padding: '13px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            onClick={() => { onAccept(partner); onClose(); }}
          >
            <FiCheck /> Approve &amp; Add to Fleet
          </button>
          <button
            style={{ flex: 1, background: '#ffeff1', color: '#ef4444', border: '1px solid #ef4444', padding: '13px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            onClick={() => { onReject(partner.id); onClose(); }}
          >
            <FiX /> Decline Application
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, elRef.current);
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function DeliveryRequestsPage({ deliveryRequests, onAcceptRequest, onRejectRequest }) {
  const [selectedPartner, setSelectedPartner] = useState(null);

  const openModal = (req) => {
    console.log('Opening modal for:', req.id);   // debug log
    setSelectedPartner(req);
  };

  return (
    <div className="grid-card" style={{ flex: 1, gap: '20px', overflowY: 'auto' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>📥 Delivery Partner Requests</h2>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Click on a partner&apos;s ID badge to view their DL, Bike RC &amp; full details.
        </span>
      </div>

      {deliveryRequests.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--bg-input)', borderRadius: '16px', border: '1px dashed var(--border-color)', gap: '10px' }}>
          <FiInfo style={{ fontSize: '28px', color: 'var(--accent-color)' }} />
          <h4 style={{ margin: 0, fontWeight: '700', color: 'var(--text-primary)' }}>No Pending Applications</h4>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>All applications processed.</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {deliveryRequests.map(req => (
            <div
              key={req.id}
              className="partner-request-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                background: 'var(--bg-card)',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--card-shadow)',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              {/* Left: avatar + info */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                <img
                  src={req.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                  alt={req.name}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>{req.name}</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    📞 {req.phone} &nbsp;·&nbsp; 🕒 {req.experience}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* ── Clickable ID badge ── */}
                    <button
                      type="button"
                      onClick={() => openModal(req)}
                      style={{
                        background: '#e6f7f1',
                        color: '#0f8a5f',
                        border: '1px solid #10b981',
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '5px 12px',
                        borderRadius: '7px',
                        cursor: 'pointer',
                        letterSpacing: '0.3px'
                      }}
                    >
                      🪪 {req.id} — View Details
                    </button>
                    <span style={{ background: '#e6f7f1', color: '#10b981', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '5px' }}>Aadhar ✓</span>
                    <span style={{ background: '#e6f7f1', color: '#10b981', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '5px' }}>DL ✓</span>
                  </div>
                </div>
              </div>

              {/* Right: quick approve / decline */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  type="button"
                  style={{ background: '#e6f7f1', color: '#0f8a5f', border: '1px solid #10b981', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={() => onAcceptRequest(req)}
                >
                  <FiCheck /> Approve
                </button>
                <button
                  type="button"
                  style={{ background: '#ffeff1', color: '#ef4444', border: '1px solid #ef4444', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={() => onRejectRequest(req.id)}
                >
                  <FiX /> Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Portal modal – mounts into its own <div> appended to <body> */}
      <PartnerModal
        partner={selectedPartner}
        onClose={() => setSelectedPartner(null)}
        onAccept={onAcceptRequest}
        onReject={onRejectRequest}
      />
    </div>
  );
}
