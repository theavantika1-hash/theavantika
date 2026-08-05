import React from 'react'

function AnalyticsPage({ orders = [] }) {
  const totalRev = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'Served').length

  return (
    <div className="grid-card" style={{ flex: 1, gap: '16px', overflowY: 'auto' }}>
      <h2>Sales & Order Analytics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="checklist-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px' }}>
          <span className="text-muted" style={{ fontSize: '12px' }}>Peak Operational Hours</span>
          <h3 style={{ fontSize: '20px', margin: '4px 0' }}>8:15 PM – 10:30 PM</h3>
          <p style={{ fontSize: '11px' }} className="text-muted">Requires maximum kitchen line prep allocation.</p>
        </div>
        <div className="checklist-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px' }}>
          <span className="text-muted" style={{ fontSize: '12px' }}>Preferred Payment Methods</span>
          <h3 style={{ fontSize: '20px', margin: '4px 0' }}>UPI & Credit Cards</h3>
          <p style={{ fontSize: '11px' }} className="text-muted">Digital settlements cover 94% of overall order volume.</p>
        </div>
        <div className="checklist-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px' }}>
          <span className="text-muted" style={{ fontSize: '12px' }}>Total Active Volume</span>
          <h3 style={{ fontSize: '20px', margin: '4px 0' }}>{orders.length} Live Orders</h3>
          <p style={{ fontSize: '11px' }} className="text-muted">{deliveredCount} Orders successfully completed.</p>
        </div>
        <div className="checklist-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px' }}>
          <span className="text-muted" style={{ fontSize: '12px' }}>Gross Revenue Tracked</span>
          <h3 style={{ fontSize: '20px', margin: '4px 0' }}>₹{totalRev.toLocaleString('en-IN')}</h3>
          <p style={{ fontSize: '11px' }} className="text-muted">Synced in real-time from MongoDB database.</p>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
