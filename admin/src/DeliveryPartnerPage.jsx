import React, { useState } from 'react';
import { FiUserCheck, FiMapPin, FiTruck, FiPlus, FiAlertCircle } from 'react-icons/fi';
import { MdOutlineDirectionsBike } from 'react-icons/md';

export default function DeliveryPartnerPage({ orders, showNotification, deliveryPartners, setDeliveryPartners }) {
  // deliveryPartners and setDeliveryPartners are managed by App.jsx
  // so accepted requests automatically appear here

  // Form states for adding new delivery boy
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBoyName, setNewBoyName] = useState("");
  const [newBoyPhone, setNewBoyPhone] = useState("");
  const [newBoyLocation, setNewBoyLocation] = useState("");

  const handleAddDeliveryBoy = (e) => {
    e.preventDefault();
    if (!newBoyName || !newBoyPhone) return;

    const newBoy = {
      id: `DB-${100 + deliveryPartners.length + 1}`,
      name: newBoyName,
      phone: newBoyPhone,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 99999)}?auto=format&fit=crop&w=100&q=80`,
      documents: {
        aadhar: "Verified",
        dl: "Pending" // Defaults to pending verification for safety
      },
      currentOrderId: null,
      location: newBoyLocation || "Avantika Central Kitchen Hub",
      status: "Available"
    };

    setDeliveryPartners(prev => [...prev, newBoy]);
    showNotification(`Delivery Boy ${newBoyName} registered successfully!`);
    
    // Reset Form
    setNewBoyName("");
    setNewBoyPhone("");
    setNewBoyLocation("");
    setShowAddForm(false);
  };

  const handleVerifyDL = (id) => {
    setDeliveryPartners(prev => prev.map(db => {
      if (db.id === id) {
        return {
          ...db,
          documents: { ...db.documents, dl: "Verified" }
        };
      }
      return db;
    }));
    showNotification("Driving License verified successfully!");
  };

  const handleAssignOrder = async (dbId, orderId) => {
    try {
      const response = await fetch('http://localhost:45000/api/delivery-boy/assign-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryBoyId: dbId, orderId: orderId })
      });
      const result = await response.json();
      if (result.success) {
        setDeliveryPartners(prev => prev.map(db => {
          if (db.id === dbId) {
            return {
              ...db,
              currentOrderId: orderId,
              status: "On Delivery",
              order_ids: result.data?.order_ids || [...(db.order_ids || []), orderId],
              deliveredOrdersCount: result.data?.deliveredOrdersCount || (db.deliveredOrdersCount || 0) + 1,
              location: "On the way to customer address..."
            };
          }
          return db;
        }));
        showNotification(`Order ${orderId} assigned to delivery boy successfully!`);
      } else {
        showNotification(result.message || "Failed to assign order");
      }
    } catch (err) {
      console.error("Assign order API error:", err);
      showNotification("Failed to connect to backend server");
    }
  };


  return (
    <div className="grid-card" style={{ flex: 1, gap: '20px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>🛵 Delivery Fleet Management</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Track dynamic delivery agents, verify documents & assign orders.</span>
        </div>
        <button 
          className="btn btn-primary btn-yellow" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FiPlus /> Add Agent
        </button>
      </div>

      {/* Dynamic Add Form Modal */}
      {showAddForm && (
        <form onSubmit={handleAddDeliveryBoy} style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fade-up 0.3s ease' }}>
          <h3 style={{ margin: 0, fontSize: '15px' }}>Register New Delivery Agent</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="Rahul Kumar" 
                value={newBoyName}
                onChange={e => setNewBoyName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Phone Number</label>
              <input 
                type="text" 
                required 
                placeholder="+91 98765 43210" 
                value={newBoyPhone}
                onChange={e => setNewBoyPhone(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px', fontWeight: '600' }}>Initial Location / Station</label>
            <input 
              type="text" 
              placeholder="Sector 15, Gurgaon Hub" 
              value={newBoyLocation}
              onChange={e => setNewBoyLocation(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button type="submit" className="btn btn-primary btn-yellow" style={{ padding: '8px 16px' }}>Save Agent</button>
            <button type="button" className="btn btn-secondary" style={{ padding: '8px 16px' }} onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Grid List of Delivery Boys */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {deliveryPartners.map(db => (
          <div 
            key={db.id} 
            className="checklist-item" 
            style={{ 
              flexDirection: 'column', 
              alignItems: 'stretch', 
              padding: '20px', 
              gap: '12px', 
              background: 'var(--bg-card)', 
              borderRadius: '20px', 
              border: '1px solid var(--border-color)', 
              boxShadow: 'var(--card-shadow)',
              transition: 'transform 0.2s'
            }}
          >
            {/* Header info */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <img 
                src={db.avatar} 
                alt={db.name} 
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>{db.name}</h4>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ID: {db.id} · {db.phone}</span>
                <div style={{ marginTop: '4px' }}>
                  <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px' }}>
                    📦 Total Delivered: {db.deliveredOrdersCount !== undefined ? db.deliveredOrdersCount : (db.order_ids ? db.order_ids.length : 0)} Orders
                  </span>
                </div>
              </div>
              <span 
                className="status-pill" 
                style={{ 
                  background: db.status === 'Available' ? 'var(--accent-light)' : '#ffeff1',
                  color: db.status === 'Available' ? 'var(--accent-color)' : 'var(--danger-color)'
                }}
              >
                {db.status}
              </span>
            </div>


            {/* Document Verification Cards */}
            <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Documents:</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge" style={{ background: '#e6f7f1', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiUserCheck /> Aadhar: {db.documents.aadhar}
                </span>
                
                {db.documents.dl === 'Verified' ? (
                  <span className="badge" style={{ background: '#e6f7f1', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiUserCheck /> DL: Verified
                  </span>
                ) : (
                  <button 
                    onClick={() => handleVerifyDL(db.id)}
                    style={{ border: 'none', background: '#ffeff1', color: 'var(--danger-color)', fontSize: '10px', fontWeight: '800', cursor: 'pointer', padding: '2px 8px', borderRadius: '6px' }}
                    title="Click to Verify License"
                  >
                    ⚠ DL: Pending (Verify)
                  </button>
                )}
              </div>
            </div>

            {/* Live Location and Assigned Orders Info */}
            <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <FiMapPin style={{ color: 'var(--accent-color)', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)' }}><strong>Live Location:</strong> {db.location}</span>
              </div>
              
              {/* 🗺 Simulated Live Map Tracking Container */}
              <div style={{ 
                position: 'relative', 
                height: '90px', 
                background: 'radial-gradient(circle, rgba(76,166,135,0.06) 0%, rgba(240,247,244,0.6) 100%)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px', 
                marginTop: '6px', 
                overflow: 'hidden' 
              }}>
                {/* Simulated Grid Road Lines */}
                <div style={{ position: 'absolute', top: '30%', left: 0, right: 0, height: '8px', background: '#e5f0eb' }} />
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '40%', width: '8px', background: '#e5f0eb' }} />
                <div style={{ position: 'absolute', top: '70%', left: 0, right: 0, height: '8px', background: '#e5f0eb' }} />
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '75%', width: '8px', background: '#e5f0eb' }} />

                {/* Central Kitchen Pin */}
                <div style={{ position: 'absolute', left: '40%', top: '70%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-color)', border: '2px solid #fff', boxShadow: '0 0 6px var(--accent-color)' }}></span>
                  <span style={{ fontSize: '8px', fontWeight: '800', background: 'rgba(255,255,255,0.9)', padding: '1px 4px', borderRadius: '4px', border: '1px solid var(--border-color)', marginTop: '2px' }}>Kitchen</span>
                </div>

                {/* Destination Pin (Rendered only if on active task) */}
                {db.currentOrderId && (
                  <div style={{ position: 'absolute', left: '75%', top: '30%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', background: '#ff4a5a', border: '2px solid #fff', boxShadow: '0 0 6px #ff4a5a' }}></span>
                    <span style={{ fontSize: '8px', fontWeight: '800', background: 'rgba(255,255,255,0.9)', padding: '1px 4px', borderRadius: '4px', border: '1px solid var(--border-color)', marginTop: '2px' }}>Client</span>
                  </div>
                )}

                {/* Moving Delivery Agent (Biker) Icon Pin */}
                <div style={{ 
                  position: 'absolute', 
                  left: db.currentOrderId ? '58%' : '40%', 
                  top: db.currentOrderId ? '30%' : '65%', 
                  transform: 'translate(-50%, -50%)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  animation: db.currentOrderId ? 'float-slow 2s ease-in-out infinite' : 'none'
                }}>
                  <div style={{ background: 'var(--accent-color)', color: '#fff', padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(76,166,135,0.35)' }}>
                    <MdOutlineDirectionsBike style={{ fontSize: '12px' }} />
                  </div>
                  <span style={{ fontSize: '8px', fontWeight: '800', color: 'var(--accent-color)', marginTop: '2px' }}>{db.name.split(' ')[0]}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                <MdOutlineDirectionsBike style={{ color: 'var(--accent-color)', fontSize: '15px', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  <strong>Assigned Task: </strong> 
                  {db.currentOrderId ? (
                    <strong style={{ color: 'var(--accent-color)' }}>Delivering {db.currentOrderId}</strong>
                  ) : (
                    <span>No active deliveries</span>
                  )}
                </span>
              </div>
            </div>

            {/* Order Assignment Panel */}
            {!db.currentOrderId && db.documents.dl === 'Verified' && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '4px' }}>
                <label style={{ fontSize: '11px', display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>Assign Delivery Request:</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    id={`assign-select-${db.id}`}
                    style={{ flex: 1, padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '11px' }}
                  >
                    <option value="">-- Choose Order Ticket --</option>
                    {orders.filter(o => o.diningType === 'Delivery' && o.orderStatus !== 'Delivered').map(o => (
                      <option key={o.orderId} value={o.orderId}>{o.orderId} ({o.customerName})</option>
                    ))}
                  </select>
                  <button 
                    className="btn btn-primary btn-yellow"
                    style={{ padding: '4px 12px', fontSize: '11px' }}
                    onClick={() => {
                      const sel = document.getElementById(`assign-select-${db.id}`);
                      if (sel && sel.value) {
                        handleAssignOrder(db.id, sel.value);
                      } else {
                        showNotification("Please select an active delivery ticket!");
                      }
                    }}
                  >
                    Assign
                  </button>
                </div>
              </div>
            )}
            
            {db.documents.dl !== 'Verified' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--danger-color)', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                <FiAlertCircle /> <span>Agent DL must be verified before assigning orders.</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


