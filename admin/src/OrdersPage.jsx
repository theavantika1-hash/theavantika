import React from 'react'

function OrdersPage({ orders = [], setSelectedOrder, setStatusChangeOrder, setTrackingOrder, setAssignPartnerOrder }) {
  return (
    <div className="grid-card" style={{ flex: 1, gap: '16px' }}>
      <div className="flex-header">
        <h2>Real-time Order Tickets</h2>
        <span className="badge active-badge">{orders.length} Active Tickets</span>
      </div>
      <div className="table-container" style={{ overflow: 'auto' }}>
        <table className="stream-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Type</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Delivery Partner</th>
              <th style={{ minWidth: '340px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: '800' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No active orders found in database.
                </td>
              </tr>
            ) : (
              orders.map(order => {
                const partnerName = typeof order.deliveryBoy === 'object' ? order.deliveryBoy?.name : (order.deliveryBoyName || order.assignedDeliveryBoyName || null);
                return (
                  <tr key={order.orderId || order._id}>
                    <td className="run-name">{order.orderId}</td>
                    <td><strong style={{ color: 'var(--text-primary)' }}>{order.customerName}</strong></td>
                    <td>{order.phoneNumber || 'N/A'}</td>
                    <td style={{ fontSize: '11px', minWidth: '150px', wordBreak: 'break-word' }}>
                      {order.deliveryAddress || 'Dine-In / Takeaway'}
                    </td>
                    <td><span className="badge draft-badge">{order.diningType} {order.tableNumber && `(T${order.tableNumber})`}</span></td>
                    <td>{(order.orderedItems || order.items || []).map(oi => `${oi.name} x${oi.quantity}`).join(', ')}</td>
                    <td className="run-latency">₹{order.totalAmount}</td>
                    <td>
                      <span
                        className={`status-pill ${order.orderStatus === 'Delivered' || order.orderStatus === 'Served' ? 'pill-closed' : 'pill-live'}`}
                        style={{
                          background: order.orderStatus === 'Accepted' ? '#dcfce7' : (order.orderStatus === 'Rejected' || order.orderStatus === 'Cancelled' ? '#fee2e2' : undefined),
                          color: order.orderStatus === 'Accepted' ? '#15803d' : (order.orderStatus === 'Rejected' || order.orderStatus === 'Cancelled' ? '#b91c1c' : undefined),
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: '800',
                          fontSize: '11px'
                        }}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      {partnerName ? (
                        <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                          🛵 {partnerName}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '11px', fontStyle: 'italic' }}>Unassigned</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', minHeight: '45px' }}>
                      <button className="btn btn-primary" style={{ padding: '5px 9px', fontSize: '11px', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '800' }} onClick={() => setSelectedOrder(order)}>Inspect</button>
                      <button className="btn btn-secondary" style={{ padding: '5px 9px', fontSize: '11px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '800' }} onClick={() => setStatusChangeOrder(order)}>Status</button>
                      <button className="btn btn-secondary" style={{ padding: '5px 9px', fontSize: '11px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '800' }} onClick={() => setAssignPartnerOrder && setAssignPartnerOrder(order)}>🛵 Assign Partner</button>
                      <button className="btn btn-secondary" style={{ padding: '5px 9px', fontSize: '11px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '3px' }} onClick={() => setTrackingOrder && setTrackingOrder(order)}>🗺️ Track</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrdersPage
