import React from 'react'

function OrdersPage({ orders = [], setSelectedOrder, setStatusChangeOrder }) {
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
              <th style={{ minWidth: '220px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: '800' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No active orders found in database.
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.orderId || order._id}>
                  <td className="run-name">{order.orderId}</td>
                  <td>{order.customerName}</td>
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
                  <td style={{ textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '45px' }}>
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '11px', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '800' }} onClick={() => setSelectedOrder(order)}>Inspect</button>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '800' }} onClick={() => setStatusChangeOrder(order)}>Change Status</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrdersPage
