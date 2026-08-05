import React from 'react'

function MenuPage({ menuItems = [] }) {
  return (
    <div className="grid-card" style={{ flex: 1, gap: '16px' }}>
      <div className="flex-header">
        <h2>Avantika Premium Menu ({menuItems.length} items)</h2>
      </div>
      <div className="table-container" style={{ overflowY: 'auto' }}>
        <table className="stream-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Dish Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Prep Time</th>
              <th>Price</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No menu items found in database.
                </td>
              </tr>
            ) : (
              menuItems.map(item => (
                <tr key={item.id || item._id}>
                  <td className="run-name">{item.name} {item.bestseller && '⭐'}</td>
                  <td><span className="badge active-badge">{item.category}</span></td>
                  <td className="text-muted" style={{ fontSize: '11px' }}>{item.description}</td>
                  <td>{item.prepTime || '15 mins'}</td>
                  <td className="run-latency">₹{item.price}</td>
                  <td>{item.rating || 4.8} / 5</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MenuPage
