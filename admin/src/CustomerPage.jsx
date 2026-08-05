import React from 'react'

function CustomerPage({ customers = [] }) {
  return (
    <div className="grid-card" style={{ flex: 1, gap: '16px' }}>
      <h2>Customer Base & Loyalty</h2>
      <div className="table-container" style={{ overflowY: 'auto' }}>
        <table className="stream-table">
          <thead>
            <tr>
              <th>Patron Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Total Orders</th>
              <th>Total Spend</th>
              <th>Fav Dish</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No customer records found in database.
                </td>
              </tr>
            ) : (
              customers.map((c, i) => (
                <tr key={i}>
                  <td className="run-name">{c.name}</td>
                  <td>{c.phone || c.phone_number || 'N/A'}</td>
                  <td className="text-muted">{c.email || 'N/A'}</td>
                  <td>{c.totalOrders || c.ordersCount || 1} orders</td>
                  <td className="run-latency">₹{c.totalSpending || c.spend || 0}</td>
                  <td><span className="badge active-badge">{c.favouriteDish || 'Chef Special'}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CustomerPage
