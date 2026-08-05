import React, { useState, useEffect } from 'react'
import {
  FiShoppingBag,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiCalendar,
  FiUsers,
  FiMessageSquare,
  FiBookOpen,
  FiBriefcase as FiWallet
} from 'react-icons/fi'

function DashboardPage({ orders = [], customers = [], reviews = [], setReviews, setActiveTab, showNotification }) {
  const [mapFilter, setMapFilter] = useState('weekly')
  const [revenueFilter, setRevenueFilter] = useState('monthly')
  const [dbStats, setDbStats] = useState(null)

  // Fetch Real Dashboard Stats from Backend API
  const fetchStats = () => {
    fetch('http://localhost:45000/api/dashboard/stats')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
          setDbStats(resData.data)
        }
      })
      .catch(err => console.log('Error fetching dashboard stats:', err))
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 4000)
    return () => clearInterval(interval)
  }, [])

  // Derived real data or fallbacks
  const realOrdersCount = dbStats ? dbStats.totalOrders : orders.length
  const realDeliveredCount = dbStats ? dbStats.totalDelivered : orders.filter(o => o.orderStatus === 'Delivered' || o.orderStatus === 'Served').length
  const realCancelledCount = dbStats ? dbStats.totalCancelled : orders.filter(o => o.orderStatus === 'Rejected' || o.orderStatus === 'Cancelled').length
  const realRevenue = dbStats ? dbStats.totalRevenue : orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const realCustomersCount = dbStats ? dbStats.totalCustomers : customers.length

  // Dataset selection based on toggle
  const weeklyData = dbStats?.weeklyRevenue || [
    { label: 'Mon', revenue: 0 },
    { label: 'Tue', revenue: 0 },
    { label: 'Wed', revenue: 0 },
    { label: 'Thu', revenue: 0 },
    { label: 'Fri', revenue: realRevenue },
    { label: 'Sat', revenue: 0 },
    { label: 'Sun', revenue: 0 }
  ]

  const monthlyData = dbStats?.monthlyRevenue || [
    { label: 'Week 1', revenue: 0 },
    { label: 'Week 2', revenue: 0 },
    { label: 'Week 3', revenue: 0 },
    { label: 'Week 4', revenue: realRevenue }
  ]

  const currentRevenueDataset = revenueFilter === 'weekly' ? weeklyData : monthlyData
  const maxRevenueVal = Math.max(...currentRevenueDataset.map(d => d.revenue || 0), 100)

  // Calculate SVG chart coordinates dynamically
  const svgWidth = 560
  const svgStartX = 20
  const stepX = currentRevenueDataset.length > 1 ? svgWidth / (currentRevenueDataset.length - 1) : svgWidth

  const chartNodes = currentRevenueDataset.map((item, idx) => {
    const cx = svgStartX + idx * stepX
    const rev = item.revenue || 0
    // Max height is at y=25, min height (0 rev) is at y=125
    const cy = 125 - (rev / maxRevenueVal) * 95
    return { cx, cy, label: item.label, val: `₹${rev.toLocaleString('en-IN')}` }
  })

  // Build SVG Path strings
  const linePathD = chartNodes.length > 0 
    ? chartNodes.reduce((acc, node, i) => i === 0 ? `M ${node.cx} ${node.cy}` : `${acc} L ${node.cx} ${node.cy}`, '')
    : ''

  const areaPathD = chartNodes.length > 0
    ? `${linePathD} L ${chartNodes[chartNodes.length - 1].cx} 145 L ${chartNodes[0].cx} 145 Z`
    : ''

  return (
    <>
      <div className="dashboard-view-layout">

        {/* ── LEFT COLUMN ── */}
        <div className="dashboard-main-column">

          {/* 4 Metric Cards */}
          <div className="dashboard-cards-row">

            <div className="dash-metric-card card-green" style={{ animationDelay: '0s' }}>
              <div className="card-icon"><FiShoppingBag style={{ color: '#fff' }} /></div>
              <span className="card-label">Total Orders</span>
              <span className="card-value">{realOrdersCount}</span>
              <span className="card-sub">Real database orders</span>
            </div>

            <div className="dash-metric-card card-blue" style={{ animationDelay: '0.1s' }}>
              <div className="card-icon"><FiCheckCircle style={{ color: '#fff' }} /></div>
              <span className="card-label">Total Delivered</span>
              <span className="card-value">{realDeliveredCount}</span>
              <span className="card-sub">{realOrdersCount > 0 ? ((realDeliveredCount / realOrdersCount) * 100).toFixed(1) : 0}% success rate</span>
            </div>

            <div className="dash-metric-card card-red" style={{ animationDelay: '0.2s' }}>
              <div className="card-icon"><FiXCircle style={{ color: '#fff' }} /></div>
              <span className="card-label">Total Cancelled</span>
              <span className="card-value">{realCancelledCount}</span>
              <span className="card-sub">Rejected / Cancelled</span>
            </div>

            <div className="dash-metric-card card-amber" style={{ animationDelay: '0.3s' }}>
              <div className="card-icon" style={{ color: '#fff', fontWeight: '800', fontSize: '18px' }}>₹</div>
              <span className="card-label">Total Revenue</span>
              <span className="card-value" style={{ fontSize: '26px' }}>
                ₹{realRevenue.toLocaleString('en-IN')}
              </span>
              <span className="card-sub">Live Mongo settlements</span>
            </div>

          </div>

          {/* Bottom Row: 3 Premium Donut Charts + Customer Growth */}
          <div className="dashboard-bottom-row">

            {/* Performance Analytics */}
            <div className="perf-chart-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '800' }}>
                  <FiActivity style={{ color: 'var(--accent-color)', fontSize: '18px' }} /> Performance Analytics
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', background: 'var(--border-color)', padding: '3px 8px', borderRadius: '12px' }}>Live Sync</span>
              </div>

              <div className="charts-row" style={{ marginTop: '20px' }}>

                {/* Donut 1: Total Orders */}
                <div className="donut-wrap">
                  <div className="donut-svg-wrap">
                    <svg viewBox="0 0 120 120" style={{ filter: 'drop-shadow(0 6px 16px rgba(22,179,125,0.25))' }}>
                      <defs>
                        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1cd496" />
                          <stop offset="100%" stopColor="#0f8a5f" />
                        </linearGradient>
                      </defs>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(22,179,125,0.08)" strokeWidth="10" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="url(#g1)" strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="173 314"
                        strokeDashoffset="0"
                        style={{ animation: 'donutDraw 1.6s cubic-bezier(0.4,0,0.2,1) forwards' }} />
                    </svg>
                    <div className="donut-center-text">
                      <span className="donut-value" style={{ color: '#16b37d' }}>{realOrdersCount}</span>
                      <span className="donut-unit">Orders</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <span className="donut-label">Total Order</span>
                    <span style={{ fontSize: '11px', color: '#16b37d', fontWeight: '700' }}>↑ {realOrdersCount} in database</span>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ width: '1px', height: '80px', background: 'var(--border-color)', flexShrink: 0 }} />

                {/* Donut 2: Total Revenue */}
                <div className="donut-wrap">
                  <div className="donut-svg-wrap">
                    <svg viewBox="0 0 120 120" style={{ filter: 'drop-shadow(0 6px 16px rgba(59,130,246,0.25))' }}>
                      <defs>
                        <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                      </defs>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="10" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="url(#g2)" strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="94 314"
                        strokeDashoffset="0"
                        style={{ animation: 'donutDraw 1.6s cubic-bezier(0.4,0,0.2,1) 0.15s forwards' }} />
                    </svg>
                    <div className="donut-center-text">
                      <span className="donut-value" style={{ color: '#3b82f6' }}>100%</span>
                      <span className="donut-unit">Revenue</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <span className="donut-label">Total Revenue</span>
                    <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '700' }}>↑ ₹{realRevenue.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ width: '1px', height: '80px', background: 'var(--border-color)', flexShrink: 0 }} />

                {/* Donut 3: Registered Customers */}
                <div className="donut-wrap">
                  <div className="donut-svg-wrap">
                    <svg viewBox="0 0 120 120" style={{ filter: 'drop-shadow(0 6px 16px rgba(245,158,11,0.25))' }}>
                      <defs>
                        <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fcd34d" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                      </defs>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(245,158,11,0.08)" strokeWidth="10" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="url(#g3)" strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="47 314"
                        strokeDashoffset="0"
                        style={{ animation: 'donutDraw 1.6s cubic-bezier(0.4,0,0.2,1) 0.3s forwards' }} />
                    </svg>
                    <div className="donut-center-text">
                      <span className="donut-value" style={{ color: '#f59e0b' }}>{realCustomersCount}</span>
                      <span className="donut-unit">Users</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <span className="donut-label">Total Customers</span>
                    <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '700' }}>↑ {realCustomersCount} accounts</span>
                  </div>
                </div>

              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px' }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#16b37d' }}></span>
                Live data synced directly from MongoDB database.
              </div>
            </div>

            {/* Customer Base Bar Chart */}
            <div className="map-reviews-card" style={{ flex: 1.2, position: 'relative', background: 'var(--bg-card)', borderRadius: '24px', padding: '24px', boxShadow: 'var(--card-shadow)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>DEMOGRAPHICS</span>
                  <h3 style={{ border: 'none', margin: '4px 0 0 0', padding: 0, fontSize: '18px', fontWeight: '800' }}>👥 Customer Base</h3>
                </div>

                <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-input)', padding: '4px', borderRadius: '12px' }}>
                  <button
                    onClick={() => setMapFilter('weekly')}
                    style={{
                      border: 'none',
                      background: mapFilter === 'weekly' ? 'var(--accent-color)' : 'transparent',
                      color: mapFilter === 'weekly' ? '#fff' : 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '6px 12px',
                      borderRadius: '9px',
                      cursor: 'pointer'
                    }}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setMapFilter('monthly')}
                    style={{
                      border: 'none',
                      background: mapFilter === 'monthly' ? 'var(--accent-color)' : 'transparent',
                      color: mapFilter === 'monthly' ? '#fff' : 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '6px 12px',
                      borderRadius: '9px',
                      cursor: 'pointer'
                    }}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <div style={{ position: 'relative', height: '170px', background: 'linear-gradient(180deg, rgba(240,247,244,0.5) 0%, rgba(255,255,255,0) 100%)', borderRadius: '16px', padding: '16px 10px 10px 10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                {weeklyData.map((item, idx) => {
                  const barHeight = Math.max(10, Math.min(105, (item.revenue / (maxRevenueVal || 1)) * 105))
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '8px' }}>
                      <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--text-secondary)' }}>₹{item.revenue}</span>
                      <div style={{ width: '14px', height: `${barHeight}px`, background: 'linear-gradient(180deg, #1cd496 0%, #0f8a5f 100%)', borderRadius: '6px' }} />
                      <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)' }}>{item.label}</span>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '12px', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Registered: <strong>{realCustomersCount} Users</strong></span>
                <span style={{ color: '#10b981', fontWeight: '800' }}>Live Mongo DB</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="dashboard-side-column">

          {/* Menu Sections Navigation */}
          <div className="menu-nav-card">
            <h3>📋 Menu Sections</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Order List',  icon: <FiCalendar />,        tab: 'orders'    },
                { label: 'Customer',    icon: <FiUsers />,           tab: 'customer'  },
                { label: 'Analytics',   icon: <FiShoppingBag />,     tab: 'analytics' },
                { label: 'Reviews',     icon: <FiMessageSquare />,   tab: 'reviews'   },
                { label: 'Foods',       icon: <FiBookOpen />,        tab: 'menu'      },
                { label: 'Wallet',      icon: <FiWallet />,          tab: 'wallet'    },
              ].map(({ label, icon, tab }) => (
                <button key={tab} className="nav-btn" onClick={() => setActiveTab(tab)}>
                  <span style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-color)' }}>{icon}</span>
                  <span>{label}</span>
                  <span style={{ marginLeft: 'auto', opacity: 0.5 }}>→</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Revenue Wave Chart */}
      <div style={{ marginTop: '24px', width: '100%' }}>
        <div className="map-reviews-card" style={{ position: 'relative', background: 'var(--bg-card)', borderRadius: '24px', padding: '24px', boxShadow: 'var(--card-shadow)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>FINANCIAL PERFORMANCE</span>
              <h3 style={{ border: 'none', margin: '4px 0 0 0', padding: 0, fontSize: '18px', fontWeight: '800' }}>📈 Real Revenue Analytics ({revenueFilter === 'weekly' ? 'Weekly' : 'Monthly'})</h3>
            </div>

            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-input)', padding: '4px', borderRadius: '12px' }}>
              <button
                onClick={() => setRevenueFilter('weekly')}
                style={{
                  border: 'none',
                  background: revenueFilter === 'weekly' ? 'var(--accent-color)' : 'transparent',
                  color: revenueFilter === 'weekly' ? '#fff' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '6px 12px',
                  borderRadius: '9px',
                  cursor: 'pointer'
                }}
              >
                Weekly
              </button>
              <button
                onClick={() => setRevenueFilter('monthly')}
                style={{
                  border: 'none',
                  background: revenueFilter === 'monthly' ? 'var(--accent-color)' : 'transparent',
                  color: revenueFilter === 'monthly' ? '#fff' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '6px 12px',
                  borderRadius: '9px',
                  cursor: 'pointer'
                }}
              >
                Monthly
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', height: '210px', background: 'linear-gradient(180deg, rgba(240,247,244,0.3) 0%, rgba(255,255,255,0) 100%)', borderRadius: '16px', padding: '20px 14px 10px 14px', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', height: '140px' }}>
              <svg viewBox="0 0 600 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0.00" />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffb800" />
                    <stop offset="50%" stopColor="var(--accent-color)" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="25" x2="600" y2="25" stroke="var(--border-color)" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.5" />
                <line x1="0" y1="75" x2="600" y2="75" stroke="var(--border-color)" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.5" />
                <line x1="0" y1="125" x2="600" y2="125" stroke="var(--border-color)" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.5" />
                
                {/* Real Dynamic Area and Line paths */}
                <path d={areaPathD} fill="url(#areaGrad)" />
                <path d={linePathD} fill="none" stroke="url(#lineGrad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Dynamic Real Nodes */}
                {chartNodes.map((node, i) => (
                  <g key={i} className="chart-node" style={{ cursor: 'pointer' }}>
                    <circle cx={node.cx} cy={node.cy} r="9" fill="var(--accent-color)" opacity="0.12" />
                    <circle cx={node.cx} cy={node.cy} r="4.5" fill="#fff" stroke="var(--accent-color)" strokeWidth="3" />
                    <text x={node.cx} y={node.cy - 14} textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontWeight="800">
                      {node.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            
            {/* Dynamic Bottom X-Axis Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              {chartNodes.map((node, idx) => (
                <span key={idx} style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)' }}>{node.label}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', marginTop: '4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Total Real Revenue ({revenueFilter === 'weekly' ? 'Weekly' : 'Monthly'}): <strong>₹{realRevenue.toLocaleString('en-IN')}</strong>
            </span>
            <span style={{ color: '#10b981', fontWeight: '800' }}>Live Mongo API Sync</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardPage
