import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiPlus, FiX, FiInfo, FiTrash2, FiEdit, FiUserCheck, FiUsers } from 'react-icons/fi';

/* ─── Assign Coupon to Users Portal Modal ─────────────────────────────────────── */
function AssignCouponModal({ coupon, customers = [], onClose, onAssign }) {
  const [selectedIndices, setSelectedIndices] = useState([]);

  useEffect(() => {
    if (coupon && customers.length > 0) {
      if (coupon.assignedUsers && coupon.assignedUsers.length > 0) {
        const preselected = [];
        customers.forEach((c, idx) => {
          const match = coupon.assignedUsers.some(u => 
            (u.phone && c.phone && c.phone.includes(u.phone)) ||
            (u.name && c.name && u.name === c.name)
          );
          if (match) preselected.push(idx);
        });
        setSelectedIndices(preselected);
      } else {
        // Default: select all if no previous assignment
        setSelectedIndices(customers.map((_, i) => i));
      }
    }
  }, [coupon, customers]);

  if (!coupon) return null;

  const handleSelectAll = () => setSelectedIndices(customers.map((_, i) => i));
  const handleDeselectAll = () => setSelectedIndices([]);
  const handleToggleCustomer = (idx) => {
    setSelectedIndices(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const handleSaveAssignment = () => {
    const selectedUsers = selectedIndices.map(idx => {
      const c = customers[idx];
      return {
        userId: c._id || c.id || c.phone || '',
        name: c.name || 'Patron',
        phone: c.phone || c.phone_number || ''
      };
    });
    onAssign(coupon.code, selectedUsers);
    onClose();
  };

  const overlay = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 999999,
        background: 'rgba(9, 15, 12, 0.45)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          color: '#1e293b',
          borderRadius: '28px',
          width: '560px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.18)',
          border: '1px solid rgba(255, 255, 255, 0.5)'
        }}
      >
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', padding: '22px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '1.2px', opacity: 0.9 }}>User Target Assignment</span>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Assign Coupon <span style={{ background: 'rgba(255,255,255,0.22)', padding: '2px 10px', borderRadius: '8px', fontSize: '18px', fontWeight: '900' }}>{coupon.code}</span>
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%' }}>
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
            Select specific users who will be able to see and apply code <strong>{coupon.code}</strong> when placing orders on the user website/app. Unselected users will not be able to use this coupon.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiUsers /> Select Authorized Users ({selectedIndices.length} / {customers.length})
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleSelectAll} style={{ background: '#f1f5f9', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>Select All</button>
                <button onClick={handleDeselectAll} style={{ background: '#f1f5f9', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>Deselect All</button>
              </div>
            </div>

            <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
              {customers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '13px' }}>
                  No customer profiles found. Place orders first to populate patrons.
                </div>
              ) : (
                customers.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => handleToggleCustomer(i)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 16px', borderRadius: '14px', cursor: 'pointer',
                      background: selectedIndices.includes(i) ? '#e0f2fe' : '#f8fafc',
                      border: selectedIndices.includes(i) ? '1px solid #38bdf8' : '1px solid #e2e8f0',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#1e293b', display: 'block' }}>{c.name}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Phone: {c.phone || c.phone_number || 'N/A'}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: selectedIndices.includes(i) ? '#0284c7' : '#94a3b8', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {selectedIndices.includes(i) ? <><FiUserCheck /> Authorized</> : '+ Grant Access'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12.5px', color: '#475569', fontWeight: '800' }}>
            🎯 {selectedIndices.length} user(s) authorized
          </span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} style={{ background: '#fff', color: '#475569', border: '1px solid #cbd5e1', padding: '11px 20px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>Cancel</button>
            <button
              onClick={handleSaveAssignment}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff', border: 'none', padding: '11px 24px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
              }}
            >
              Assign Coupon to Selected Users 🎯
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}

/* ─── Add / Edit Coupon Portal Modal ─────────────────────────────────────── */
function CouponFormModal({ isOpen, onClose, onSubmit, couponData, setCouponData, isEditing }) {
  if (!isOpen) return null;

  const overlay = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 999999,
        background: 'rgba(9, 15, 12, 0.6)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <form
        onClick={e => e.stopPropagation()}
        onSubmit={onSubmit}
        style={{ width: '640px', maxWidth: '95vw', background: 'var(--bg-card)', color: 'var(--text-primary)', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}
      >
        
        {/* Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>CAMPAIGN COMMAND VAULT</span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'serif', fontStyle: 'italic' }}>
              {isEditing ? `Edit Promo Code: ${couponData.code}` : 'Initialize Promo Code'}
            </h3>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-secondary)' }}><FiX /></button>
        </div>

        {/* Form Fields */}
        <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
          
          {/* Coupon Code */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Coupon Code</label>
            <input
              type="text"
              placeholder="e.g. AVANTIKA2026"
              required
              style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '13px', textTransform: 'uppercase', outline: 'none' }}
              value={couponData.code}
              onChange={e => setCouponData(prev => ({ ...prev, code: e.target.value }))}
            />
          </div>

          {/* Discount Type */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Discount Type</label>
            <select
              style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
              value={couponData.type}
              onChange={e => setCouponData(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="Percentage">Percentage (%)</option>
              <option value="Flat">Flat Amount (₹)</option>
            </select>
          </div>

          {/* Discount Value */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Discount Value</label>
            <input
              type="number"
              placeholder="e.g. 10"
              required
              min="1"
              style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
              value={couponData.value}
              onChange={e => setCouponData(prev => ({ ...prev, value: e.target.value }))}
            />
          </div>

          {/* Minimum Cart Value */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Minimum Cart Value (₹)</label>
            <input
              type="number"
              placeholder="e.g. 500"
              style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
              value={couponData.minCartValue}
              onChange={e => setCouponData(prev => ({ ...prev, minCartValue: e.target.value }))}
            />
          </div>

          {/* Expiration Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Expiration Date</label>
            <input
              type="date"
              style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
              value={couponData.expirationDate}
              onChange={e => setCouponData(prev => ({ ...prev, expirationDate: e.target.value }))}
            />
          </div>

          {/* Usage Limit */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Usage Limit</label>
            <input
              type="text"
              placeholder="100 or Unlimited"
              style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
              value={couponData.usageLimit}
              onChange={e => setCouponData(prev => ({ ...prev, usageLimit: e.target.value }))}
            />
          </div>

          {/* Optional Restrictions */}
          <div style={{ gridColumn: 'span 2', margin: '10px 0 0 0', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h5 style={{ margin: 0, fontSize: '10px', fontWeight: '800', color: 'var(--accent-color)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Optional Restrictions</h5>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Restrict Categories</label>
            <input
              type="text"
              placeholder="e.g. starters, desserts"
              style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
              value={couponData.restrictCategories}
              onChange={e => setCouponData(prev => ({ ...prev, restrictCategories: e.target.value }))}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Restrict Products</label>
            <input
              type="text"
              placeholder="e.g. makhani, pizza-1"
              style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
              value={couponData.restrictProducts}
              onChange={e => setCouponData(prev => ({ ...prev, restrictProducts: e.target.value }))}
            />
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Coupon Status</label>
            <select
              style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
              value={couponData.status}
              onChange={e => setCouponData(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="Active (Live)">Active (Live)</option>
              <option value="Draft (Inactive)">Draft (Inactive)</option>
            </select>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-input)', display: 'flex', justifyContent: 'flex-end', gap: '14px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontWeight: '800', fontSize: '13px', cursor: 'pointer', padding: '10px 16px' }}
          >
            CANCEL
          </button>
          <button
            type="submit"
            style={{ background: 'var(--accent-color)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
          >
            {isEditing ? 'SAVE COUPON CHANGES' : 'INITIALIZE PROMO CODE'}
          </button>
        </div>

      </form>
    </div>
  );

  return createPortal(overlay, document.body);
}

/* ─── Main CouponsPage Component ─────────────────────────────────────────── */
export default function CouponsPage({ customers = [], showNotification }) {
  const [coupons, setCoupons] = useState([]);
  const [selectedAssignCoupon, setSelectedAssignCoupon] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const emptyForm = {
    code: '',
    type: 'Percentage',
    value: '',
    minCartValue: '',
    expirationDate: '',
    usageLimit: 'Unlimited',
    restrictCategories: '',
    restrictProducts: '',
    status: 'Active (Live)'
  };

  const [formData, setFormData] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Coupons from Backend Database
  const fetchDbCoupons = () => {
    fetch('http://localhost:45000/api/coupons')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          setCoupons(resData.data);
        }
      })
      .catch(err => console.log('Error fetching coupons:', err));
  };

  useEffect(() => {
    fetchDbCoupons();
  }, []);

  // Save New Coupon
  const handleAddCouponSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.value) {
      if (showNotification) showNotification("Please fill in Coupon Code and Value!", "warning");
      return;
    }

    try {
      const res = await fetch('http://localhost:45000/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code.toUpperCase().trim(),
          type: formData.type,
          value: parseFloat(formData.value),
          minCartValue: formData.minCartValue ? parseFloat(formData.minCartValue) : 0,
          expirationDate: formData.expirationDate || '',
          usageLimit: formData.usageLimit || 'Unlimited',
          restrictCategories: formData.restrictCategories || '',
          restrictProducts: formData.restrictProducts || '',
          status: formData.status
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData(emptyForm);
        fetchDbCoupons();
        if (showNotification) showNotification(`Coupon ${formData.code.toUpperCase()} created in database!`, 'success');
      } else {
        if (showNotification) showNotification(data.message || 'Failed to create coupon', 'warning');
      }
    } catch (err) {
      console.log('Error adding coupon:', err);
    }
  };

  // Edit Coupon
  const handleEditCouponSubmit = async (e) => {
    e.preventDefault();
    if (!editingCoupon || !editingCoupon._id) return;

    try {
      const res = await fetch(`http://localhost:45000/api/coupons/${editingCoupon._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code.toUpperCase().trim(),
          type: formData.type,
          value: parseFloat(formData.value),
          minCartValue: formData.minCartValue ? parseFloat(formData.minCartValue) : 0,
          expirationDate: formData.expirationDate || '',
          usageLimit: formData.usageLimit || 'Unlimited',
          restrictCategories: formData.restrictCategories || '',
          restrictProducts: formData.restrictProducts || '',
          status: formData.status
        })
      });
      const data = await res.json();
      if (data.success) {
        setEditingCoupon(null);
        setFormData(emptyForm);
        fetchDbCoupons();
        if (showNotification) showNotification(`Coupon ${formData.code.toUpperCase()} updated!`, 'success');
      } else {
        if (showNotification) showNotification(data.message || 'Failed to update coupon', 'warning');
      }
    } catch (err) {
      console.log('Error editing coupon:', err);
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (c) => {
    if (window.confirm(`Are you sure you want to delete coupon ${c.code}?`)) {
      try {
        const idOrCode = c._id || c.code;
        const res = await fetch(`http://localhost:45000/api/coupons/${idOrCode}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (data.success) {
          fetchDbCoupons();
          if (showNotification) showNotification(`Coupon ${c.code} deleted from database.`, 'info');
        }
      } catch (err) {
        console.log('Error deleting coupon:', err);
      }
    }
  };

  // Assign Coupon Users
  const handleAssignUsers = async (code, selectedUsers) => {
    try {
      const res = await fetch('http://localhost:45000/api/coupons/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          assignedUsers: selectedUsers
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchDbCoupons();
        if (showNotification) showNotification(`Coupon ${code} assigned to ${selectedUsers.length} user(s)! Only authorized users can apply this coupon on order.`, 'success');
      } else {
        if (showNotification) showNotification(data.message || 'Failed to assign coupon', 'warning');
      }
    } catch (err) {
      console.log('Error assigning coupon:', err);
    }
  };

  const handleOpenEdit = (c) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      type: c.type || 'Percentage',
      value: c.value || '',
      minCartValue: c.minCartValue || '',
      expirationDate: c.expirationDate || '',
      usageLimit: c.usageLimit || 'Unlimited',
      restrictCategories: c.restrictCategories || '',
      restrictProducts: c.restrictProducts || '',
      status: c.status || 'Active (Live)'
    });
  };

  const filteredCoupons = coupons.filter(c =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid-card" style={{ flex: 1, gap: '20px', overflowY: 'auto', background: 'transparent', border: 'none', boxShadow: 'none', padding: '24px 28px 24px 24px' }}>
      
      {/* Top Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1.5px' }}>CAMPAIGN COMMAND</span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>Strategic Coupons</h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-card)', padding: '6px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRight: '1px solid var(--border-color)', paddingRight: '12px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>{coupons.length}</span>
              <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Mongo</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-yellow"
            style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => {
              setFormData(emptyForm);
              setShowAddModal(true);
            }}
          >
            <FiPlus style={{ fontSize: '16px' }} /> NEW CODE
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '14px', width: '100%', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            type="text"
            placeholder="Search by Coupon Code.."
            style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '13.5px', outline: 'none' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Coupons Grid */}
      {filteredCoupons.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px dashed var(--border-color)', gap: '12px', marginTop: '10px' }}>
          <FiInfo style={{ fontSize: '32px', color: 'var(--accent-color)' }} />
          <h4 style={{ margin: 0, fontWeight: '800', color: 'var(--text-primary)', fontSize: '16px' }}>No Coupons in Database</h4>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Click "+ NEW CODE" above to add a promo code to MongoDB database.</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '24px', marginTop: '12px' }}>
          {filteredCoupons.map((coupon) => {
            const isPercent = coupon.type === 'Percentage';
            const valueLabel = isPercent ? `${coupon.value}% Off` : `₹${coupon.value} Off`;
            const assignedCount = coupon.assignedUsers ? coupon.assignedUsers.length : 0;

            return (
              <div
                key={coupon._id || coupon.code}
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  borderRadius: '24px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--card-shadow)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative'
                }}
              >
                {/* Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ border: '1.5px dashed var(--accent-color)', color: 'var(--accent-color)', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', letterSpacing: '0.5px', background: 'var(--bg-input)' }}>
                    {coupon.code}
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: coupon.status === 'Active (Live)' ? '#10b981' : '#f59e0b' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: coupon.status === 'Active (Live)' ? '#10b981' : '#f59e0b' }}></span>
                    <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}>{coupon.status || 'Active'}</span>
                  </div>
                </div>

                {/* Middle Row with Value & Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <h3 style={{ margin: 0, fontSize: '26px', fontWeight: '800', fontFamily: 'serif', fontStyle: 'italic', color: 'var(--text-primary)' }}>
                    {valueLabel}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenEdit(coupon)}
                      style={{
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--accent-color)',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Edit Coupon"
                    >
                      <FiEdit style={{ fontSize: '14px' }} />
                    </button>

                    <button
                      onClick={() => handleDeleteCoupon(coupon)}
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
                        cursor: 'pointer'
                      }}
                      title="Delete Coupon"
                    >
                      <FiTrash2 style={{ fontSize: '14px' }} />
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />

                {/* Parameters */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Minimum Cart</span>
                    <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                      {coupon.minCartValue ? `₹${coupon.minCartValue.toLocaleString()}` : '₹0'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Target Audience</span>
                    <span style={{ fontWeight: '800', color: assignedCount > 0 ? '#10b981' : 'var(--text-primary)' }}>
                      {assignedCount > 0 ? `${assignedCount} Authorized Users` : 'All Users (Public)'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Expires</span>
                    <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>
                      {coupon.expirationDate ? coupon.expirationDate : 'NEVER'}
                    </span>
                  </div>
                </div>

                {/* Assign Users Button */}
                <button
                  onClick={() => setSelectedAssignCoupon(coupon)}
                  style={{
                    marginTop: '8px',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '11px',
                    fontWeight: '900',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <FiUsers style={{ fontSize: '15px' }} /> Assign Code to Users 🎯
                </button>

              </div>
            );
          })}
        </div>
      )}

      {/* Add Coupon Modal */}
      <CouponFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCouponSubmit}
        couponData={formData}
        setCouponData={setFormData}
        isEditing={false}
      />

      {/* Edit Coupon Modal */}
      <CouponFormModal
        isOpen={!!editingCoupon}
        onClose={() => setEditingCoupon(null)}
        onSubmit={handleEditCouponSubmit}
        couponData={formData}
        setCouponData={setFormData}
        isEditing={true}
      />

      {/* Assign Users Modal */}
      <AssignCouponModal
        coupon={selectedAssignCoupon}
        customers={customers}
        onClose={() => setSelectedAssignCoupon(null)}
        onAssign={handleAssignUsers}
      />

    </div>
  );
}
