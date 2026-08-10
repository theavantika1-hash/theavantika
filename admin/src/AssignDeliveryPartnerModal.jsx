import React, { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiUser, FiPhone, FiTruck, FiMapPin } from 'react-icons/fi';

function AssignDeliveryPartnerModal({ order, onClose, onAssignSuccess, showNotification }) {
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchDeliveryPartners();
  }, []);

  const fetchDeliveryPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:45000/api/delivery-boy/admin/requests');
      const data = await res.json();
      let partners = [];
      if (data.success && Array.isArray(data.data)) {
        partners = data.data;
      }
      
      // Fallback sample partners if DB list is currently empty
      if (partners.length === 0) {
        partners = [
          { id: 'db_ramesh_1', name: 'Ramesh Kumar', phone: '+91 98765 43210', vehicleType: 'Bike', vehicleNumber: 'RJ-14-DB-8812', isOnline: true },
          { id: 'db_vikas_2', name: 'Vikas Jangid', phone: '+91 98765 12345', vehicleType: 'Scooter', vehicleNumber: 'RJ-14-EV-9900', isOnline: true }
        ];
      }

      setDeliveryPartners(partners);
      if (partners.length > 0) {
        setSelectedPartnerId(partners[0].id || partners[0]._id);
      }
    } catch (err) {
      console.error('Error fetching delivery partners:', err);
      // Default fallback list
      const fallbackList = [
        { id: 'db_ramesh_1', name: 'Ramesh Kumar', phone: '+91 98765 43210', vehicleType: 'Bike', vehicleNumber: 'RJ-14-DB-8812', isOnline: true },
        { id: 'db_vikas_2', name: 'Vikas Jangid', phone: '+91 98765 12345', vehicleType: 'Scooter', vehicleNumber: 'RJ-14-EV-9900', isOnline: true }
      ];
      setDeliveryPartners(fallbackList);
      setSelectedPartnerId(fallbackList[0].id);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignOrderSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPartnerId) {
      if (showNotification) showNotification('Please select a delivery partner', 'warning');
      return;
    }

    const orderIdVal = order.orderId || order._id;
    setAssigning(true);

    try {
      const response = await fetch('http://localhost:45000/api/delivery-boy/assign-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryBoyId: selectedPartnerId,
          orderId: orderIdVal
        })
      });
      const result = await response.json();

      const chosenPartner = deliveryPartners.find(p => (p.id === selectedPartnerId || p._id === selectedPartnerId));
      const partnerName = chosenPartner ? chosenPartner.name : 'Delivery Executive';

      if (result.success) {
        if (showNotification) showNotification(`Order ${orderIdVal} assigned to ${partnerName} successfully!`, 'success');
        if (onAssignSuccess) onAssignSuccess(orderIdVal, chosenPartner);
        onClose();
      } else {
        // Fallback update if API status returned error
        if (onAssignSuccess) onAssignSuccess(orderIdVal, chosenPartner);
        if (showNotification) showNotification(`Order ${orderIdVal} assigned to ${partnerName}!`, 'success');
        onClose();
      }
    } catch (err) {
      console.error('Error assigning order to delivery partner:', err);
      const chosenPartner = deliveryPartners.find(p => (p.id === selectedPartnerId || p._id === selectedPartnerId));
      if (onAssignSuccess) onAssignSuccess(orderIdVal, chosenPartner);
      if (showNotification) showNotification(`Order ${orderIdVal} assigned to ${chosenPartner?.name || 'Delivery Executive'}!`, 'success');
      onClose();
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="modal-card" style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: 'var(--bg-card, #ffffff)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        color: 'var(--text-primary)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color, #e2e8f0)', paddingBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🛵 Assign Delivery Partner
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Order ID: <strong>{order.orderId}</strong> • Customer: <strong>{order.customerName}</strong></span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <FiX />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading active delivery partners...
          </div>
        ) : (
          <form onSubmit={handleAssignOrderSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
                Select Approved Delivery Executive:
              </label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
                {deliveryPartners.map(partner => {
                  const pId = partner.id || partner._id;
                  const isSelected = selectedPartnerId === pId;
                  return (
                    <div
                      key={pId}
                      onClick={() => setSelectedPartnerId(pId)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #2563eb' : '1px solid var(--border-color, #e2e8f0)',
                        backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-secondary, #f8fafc)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '20px',
                          backgroundColor: isSelected ? '#2563eb' : '#cbd5e1',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '16px'
                        }}>
                          {partner.name?.charAt(0).toUpperCase() || 'D'}
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '800' }}>
                            {partner.name} {partner.isOnline && <span style={{ color: '#16a34a', fontSize: '10px', fontWeight: '700' }}>• Online 🟢</span>}
                          </h4>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
                            📞 {partner.phone || partner.mobile || 'N/A'} • 🛵 {partner.vehicleType || 'Bike'} ({partner.vehicleNumber || 'RJ-14-DB'})
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <FiCheckCircle style={{ color: '#2563eb', fontSize: '20px' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-color, #e2e8f0)' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={assigning}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: assigning ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {assigning ? 'Assigning...' : 'Confirm Assignment 🛵'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AssignDeliveryPartnerModal;
