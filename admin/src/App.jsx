import React, { useState, useEffect } from 'react'
import {
  FiGrid,
  FiBookOpen,
  FiShoppingBag,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiMoon,
  FiSun,
  FiSearch,
  FiCalendar,
  FiPlus,
  FiAlertTriangle,
  FiShare2,
  FiPlay,
  FiActivity,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCheckSquare,
  FiPrinter,
  FiTrendingUp as FiAnalytics,
  FiBriefcase as FiWallet,
  FiCheckCircle,
  FiXCircle,
  FiLogOut,
  FiUserPlus,
  FiX,
  FiUpload,
  FiPercent,
  FiImage,
  FiPackage
} from 'react-icons/fi'
import { MdOutlineDirectionsBike } from 'react-icons/md'
import { BiSolidFoodMenu } from "react-icons/bi";
import DeliveryPartnerPage from './DeliveryPartnerPage'
import DeliveryRequestsPage from './DeliveryRequestsPage'
import FoodManagementPage from './FoodManagementPage'
import ForgotPasswordPage from './ForgotPasswordPage'
import CouponsPage from './CouponsPage'
import HeroBannersPage from './HeroBannersPage'
import DashboardPage from './DashboardPage'
import OrdersPage from './OrdersPage'
import CustomerPage from './CustomerPage'
import AnalyticsPage from './AnalyticsPage'
import ReviewsPage from './ReviewsPage'
import MenuPage from './MenuPage'
import WalletPage from './WalletPage'
import InventoryPage from './InventoryPage'

function App() {
  // ==========================================
  // States & Layout Control
  // ==========================================
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, orders, customer, analytics, reviews, foods, wallet, delivery
  const [showForgot, setShowForgot] = useState(false)
  const [adminCredentials, setAdminCredentials] = useState({
    email: "admin@avantikapremiumbites.com",
    password: "admin123"
  })
  const [activeModal, setActiveModal] = useState(null) // null, 'reserve', 'billing', 'qr'
  const [selectedOrder, setSelectedOrder] = useState(null) // for order detail popup
  const [statusChangeOrder, setStatusChangeOrder] = useState(null) // for status changer popup
  const [notification, setNotification] = useState(null)
  const [revenueFilter, setRevenueFilter] = useState('monthly') // weekly, monthly
  const [mapFilter, setMapFilter] = useState('weekly') // weekly, monthly
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false)
  const [addFoodFormData, setAddFoodFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    prepTime: '',
    foodItems: [{ name: '', quantity: '' }]
  })

  // Auto-dismiss Splash Screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2200)
    return () => clearTimeout(timer)
  }, [])

  // Sync Theme
  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value
    if (email === adminCredentials.email && password === adminCredentials.password) {
      setIsLoggedIn(true)
      showNotification("Welcome back, Chef Avantika!", "success")
    } else {
      showNotification("Invalid Email address or Password code!", "warning")
    }
  }

  // ==========================================
  // Data Repositories
  // ==========================================

  // 1. Orders Database (Loaded dynamically from MongoDB backend API)
  const [orders, setOrders] = useState([])

  // 2. Customers Database (Loaded dynamically from MongoDB backend API)
  const [customers, setCustomers] = useState([])

  // 3. Menu Items List (Loaded dynamically from MongoDB backend API)
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    fetch('http://localhost:45000/api/foods')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setMenuItems(data.data);
        }
      })
      .catch(err => console.log('Backend food fetch error:', err));

    fetch('http://localhost:45000/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setCustomers(data.data);
        }
      })
      .catch(err => console.log('Backend customers fetch error:', err));

    const fetchOrders = () => {
      fetch('http://localhost:45000/api/orders')
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.data)) {
            setOrders(data.data);
          }
        })
        .catch(err => console.log('Backend orders fetch error:', err));
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 4000);
    return () => clearInterval(intervalId);
  }, [activeTab]);

  const handleUpdateOrderStatusBackend = async (targetOrder, newStatus) => {
    const oId = targetOrder.orderId || targetOrder._id
    setOrders(prev => prev.map(o => (o.orderId === oId || o._id === oId) ? { ...o, orderStatus: newStatus } : o))
    try {
      await fetch(`http://localhost:45000/api/orders/status/${oId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus })
      })
    } catch (err) {
      console.log('Error updating order status in backend:', err)
    }
  }

  const handleUpdatePaymentStatusBackend = async (targetOrder, newPaymentStatus) => {
    const oId = targetOrder.orderId || targetOrder._id
    setOrders(prev => prev.map(o => (o.orderId === oId || o._id === oId) ? { ...o, paymentStatus: newPaymentStatus } : o))
    try {
      await fetch(`http://localhost:45000/api/orders/status/${oId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newPaymentStatus })
      })
      if (showNotification) {
        showNotification(`Payment status for Order ${targetOrder.orderId || oId} marked as ${newPaymentStatus}!`, 'success')
      }
    } catch (err) {
      console.log('Error updating payment status in backend:', err)
    }
  }

  // 4. Reviews List
  const [reviews, setReviews] = useState([])

  // 4.5 Coupons Database
  const [coupons, setCoupons] = useState([
    { code: "AVANTIKA10", type: "Percentage", value: 10, description: "10% OFF on luxury dining" },
    { code: "FLAT50", type: "Flat", value: 50, description: "Flat ₹50 OFF on orders" }
  ])

  // 5. Wallet Transactions (Derived directly from real orders in MongoDB)
  const walletTransactions = orders.map(ord => ({
    txId: ord.transactionId || `TXN-${ord.orderId}`,
    desc: `Order ${ord.orderId} (${ord.customerName})`,
    amount: ord.totalAmount,
    method: ord.paymentMethod || 'UPI',
    time: ord.createdAt ? new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (ord.orderTime || 'Today'),
    status: ord.paymentStatus || 'Success'
  }))

  // 6. Delivery Partners (approved fleet)
  const [deliveryPartners, setDeliveryPartners] = useState([])

  // 7. Pending Delivery Partner Applications
  const [deliveryRequests, setDeliveryRequests] = useState([])

  const fetchDeliveryRequests = async () => {
    try {
      const res = await fetch('http://localhost:45000/api/delivery-boy/admin/requests');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const pendingOnly = data.data.filter(r => r.approvalStatus === 'pending');
        setDeliveryRequests(pendingOnly);

        const approvedOnly = data.data.filter(r => r.approvalStatus === 'approved');
        setDeliveryPartners(approvedOnly.map(boy => ({
          id: boy.id,
          name: boy.name,
          phone: boy.phone,
          avatar: boy.avatar,
          documents: { aadhar: 'Verified', dl: 'Verified' },
          currentOrderId: null,
          location: 'Avantika Active Delivery Fleet',
          status: 'Available'
        })));
      }
    } catch (err) {
      console.error('Failed to fetch delivery requests from backend:', err);
    }
  };

  useEffect(() => {
    fetchDeliveryRequests();
    const interval = setInterval(fetchDeliveryRequests, 3000);
    return () => clearInterval(interval);
  }, []);


  // Accept a delivery partner request → move to fleet
  const handleAcceptDeliveryRequest = async (req) => {
    const targetId = req.id || req._id;
    try {
      await fetch(`http://localhost:45000/api/delivery-boy/admin/requests/${targetId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      showNotification(`${req.name} approved & added to Delivery Fleet!`);
      fetchDeliveryRequests();
      setActiveTab('delivery');
    } catch (err) {
      console.error('Error approving request:', err);
      showNotification('Failed to approve request.');
    }
  }

  // Reject a delivery partner request
  const handleRejectDeliveryRequest = async (reqId) => {
    try {
      await fetch(`http://localhost:45000/api/delivery-boy/admin/requests/${reqId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      showNotification('Application declined successfully.');
      fetchDeliveryRequests();
    } catch (err) {
      console.error('Error rejecting request:', err);
      showNotification('Failed to reject request.');
    }
  }


  // ==========================================
  // Modal Action Handlers
  // ==========================================
  const handleReserveTable = (e) => {
    e.preventDefault()
    setActiveModal(null)
    showNotification(`Reservation recorded successfully!`)
  }

  const handleQuickBilling = (e) => {
    e.preventDefault()
    const dishId = parseInt(e.target.dishSelect.value)
    const qty = parseInt(e.target.qtySelect.value)
    const selectedDish = menuItems.find(m => m.id === dishId)

    const newOrder = {
      orderId: `AV-2026-${Math.floor(Math.random() * 900 + 100)}`,
      customerName: "Walk-in Guest",
      phoneNumber: "--",
      diningType: "Dine In",
      tableNumber: 5,
      orderedItems: [{ name: selectedDish.name, quantity: qty, price: selectedDish.price }],
      totalAmount: selectedDish.price * qty,
      paymentMethod: "Cash",
      paymentStatus: "Paid",
      orderStatus: "Served",
      specialInstructions: "Quick bill generator ticket.",
      orderTime: "Just Now"
    }

    setOrders(prev => [newOrder, ...prev])
    setActiveModal(null)
    showNotification(`Invoice generated for ₹${newOrder.totalAmount}. Order served!`)
  }

  return (
    <>
      {/* Background gradients */}
      <div className="bg-gradient-glow"></div>

      {/* Global Notification Bar */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#2D3F76',
          padding: '12px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(8px)',
          fontWeight: '600',
          border: '1px solid rgba(255,255,255,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px'
        }}>
          <span>{notification.message}</span>
        </div>
      )}

      {showSplash ? (
        <div className="splash-wrapper">
          <img src="/logo.png" alt="Avantika Logo" className="splash-logo" />
          <h1 className="splash-title">Avantika – The Fine Dine</h1>
          <div className="splash-loader">
            <div className="splash-progress"></div>
          </div>
        </div>
      ) : showForgot ? (
        <ForgotPasswordPage
          currentEmail={adminCredentials.email}
          onPasswordUpdate={(newPass) => {
            setAdminCredentials(prev => ({ ...prev, password: newPass }));
          }}
          onBackToLogin={() => setShowForgot(false)}
          showNotification={showNotification}
        />
      ) : !isLoggedIn ? (
        <div className="login-screen-wrapper">
          <form onSubmit={handleLogin} className="login-card">
            <div className="login-header">
              <img src="/logo.png" alt="Avantika Logo" className="login-logo" />
              <h2 className="login-title">Avantika – The Fine Dine</h2>
              <p className="login-subtitle">Admin Portal Sign In</p>
            </div>
            <div className="login-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input name="email" type="email" required className="form-input" placeholder="admin@avantikapremiumbites.com" defaultValue={adminCredentials.email} />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Secret PIN / Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '11px', fontWeight: '800', cursor: 'pointer', outline: 'none' }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <input name="password" type="password" required className="form-input" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" defaultValue={adminCredentials.password} />
              </div>
              <button type="submit" className="btn btn-primary btn-yellow" style={{ width: '100%', marginTop: '10px' }}>Sign In</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
              <div className="sidebar-logo" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }} title="Go to Dashboard">
                <img src="/logo.png" alt="Avantika Logo" className="sidebar-logo-image" style={{ width: '72px', height: '72px', objectFit: 'contain', borderRadius: '50%', transition: 'transform 0.2s ease', transform: 'scale(1)' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
              </div>
              <div className="sidebar-tabs">
                <button className={`sidebar-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')} title="Home">
                  <FiGrid className="tab-icon" />
                  <span className="tab-label">Home</span>
                </button>
                <button className={`sidebar-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')} title="Order List">
                  <FiCalendar className="tab-icon" />
                  <span className="tab-label">Order List</span>
                </button>
                <button className={`sidebar-tab ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')} title="Foods">
                  <FiBookOpen className="tab-icon" />
                  <span className="tab-label">Foods</span>
                </button>
                <button className={`sidebar-tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')} title="Analytics">
                  <FiShoppingBag className="tab-icon" />
                  <span className="tab-label">Analytics</span>
                </button>
                <button className={`sidebar-tab ${activeTab === 'customer' ? 'active' : ''}`} onClick={() => setActiveTab('customer')} title="Customer">
                  <FiUsers className="tab-icon" />
                  <span className="tab-label">Customer</span>
                </button>
                <button className={`sidebar-tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')} title="Reviews">
                  <FiMessageSquare className="tab-icon" />
                  <span className="tab-label">Reviews</span>
                </button>
                <button className={`sidebar-tab ${activeTab === 'delivery' ? 'active' : ''}`} onClick={() => setActiveTab('delivery')} title="Delivery Fleet">
                  <MdOutlineDirectionsBike className="tab-icon" style={{ fontSize: '22px' }} />
                  <span className="tab-label">Delivery</span>
                </button>
                <button className={`sidebar-tab ${activeTab === 'delivery-requests' ? 'active' : ''}`} onClick={() => setActiveTab('delivery-requests')} title="Partner Applications" style={{ position: 'relative' }}>
                  <FiUserPlus className="tab-icon" />
                  <span className="tab-label">Requests</span>
                  {deliveryRequests.length > 0 && (
                    <span style={{ position: 'absolute', top: '6px', right: '8px', width: '16px', height: '16px', borderRadius: '50%', background: '#ff4a5a', color: '#fff', fontSize: '9px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{deliveryRequests.length}</span>
                  )}
                </button>
                <button className={`sidebar-tab ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')} title="Wallet">
                  <FiWallet className="tab-icon" />
                  <span className="tab-label">Wallet</span>
                </button>
                <button className={`sidebar-tab ${activeTab === 'coupons' ? 'active' : ''}`} onClick={() => setActiveTab('coupons')} title="Coupons">
                  <FiPercent className="tab-icon" />
                  <span className="tab-label">Coupons</span>
                </button>
                <button className={`sidebar-tab ${activeTab === 'hero-banner' ? 'active' : ''}`} onClick={() => setActiveTab('hero-banner')} title="Hero Banner">
                  <FiImage className="tab-icon" />
                  <span className="tab-label">Hero Banner</span>
                </button>
                <button className={`sidebar-tab ${activeTab === 'food-management' ? 'active' : ''}`} onClick={() => setActiveTab('food-management')} title="Food Items Management">
                  <BiSolidFoodMenu className="tab-icon" />
                  <span className="tab-label">Edit Menu</span>
                </button>
                <button className={`sidebar-tab ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')} title="Inventory">
                  <FiPackage className="tab-icon" />
                  <span className="tab-label">Inventory</span>
                </button>
              </div>
              <div className="sidebar-bottom">
                <button className="sidebar-tab" onClick={() => { setIsLoggedIn(false); showNotification("Logging out... Session ended.", 'warning'); }} title="Log out">
                  <FiLogOut className="tab-icon" />
                  <span className="tab-label">Log out</span>
                </button>
              </div>
            </aside>

            {/* Main Workspace Area */}
            <div className="main-workspace">
              {/* Workspace Header */}
              <header className="workspace-header">
                <div className="header-left">
                  <span className="brand-name">Avantika</span>
                </div>
                <div className="header-center">
                  <div className="search-bar-wrapper">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Search anything" className="search-input" />
                  </div>
                </div>
                <div className="header-right">
                  {/* Theme Switcher */}
                  <button className="theme-toggle-switch" onClick={toggleTheme} title="Toggle Theme">
                    <div className={`switch-knob ${theme === 'dark' ? 'dark' : ''}`}>
                      {theme === 'dark' ? <FiMoon /> : <FiSun />}
                    </div>
                  </button>
                  {/* Notification Bell */}
                  <button className="notification-btn" title="Notifications" onClick={() => showNotification("No new notifications.", "info")}>
                    <FiAlertTriangle />
                    <span className="notification-badge"></span>
                  </button>
                  {/* Avatar */}
                  <div className="header-avatar" onClick={() => setActiveTab('customer')}>
                    <img src="https://images.unsplash.com/photo-1579038773867-044c48829161?auto=format&fit=crop&q=80&w=256" alt="Chef Avantika" />
                  </div>
                </div>
              </header>

              {/* Workspace Content */}
              <main className="workspace-content">
                {/* Tab 1: Dashboard */}
                {activeTab === 'dashboard' && (
                  <DashboardPage
                    orders={orders}
                    customers={customers}
                    reviews={reviews}
                    setReviews={setReviews}
                    setActiveTab={setActiveTab}
                    showNotification={showNotification}
                  />
                )}

                {/* Tab 2: Order List */}
                {activeTab === 'orders' && (
                  <OrdersPage
                    orders={orders}
                    setSelectedOrder={setSelectedOrder}
                    setStatusChangeOrder={setStatusChangeOrder}
                  />
                )}

                {/* Tab 3: Customer Profiles */}
                {activeTab === 'customer' && (
                  <CustomerPage
                    customers={customers}
                  />
                )}

                {/* Tab 4: Analytics */}
                {activeTab === 'analytics' && (
                  <AnalyticsPage
                    orders={orders}
                  />
                )}

                {/* Tab 5: Reviews */}
                {activeTab === 'reviews' && (
                  <ReviewsPage
                    reviews={reviews}
                    setReviews={setReviews}
                    showNotification={showNotification}
                  />
                )}

                {/* Tab 6: Foods (Menu Management) */}
                {activeTab === 'menu' && (
                  <MenuPage
                    menuItems={menuItems}
                  />
                )}

                {/* Tab 7: Wallet Transactions */}
                {activeTab === 'wallet' && (
                  <WalletPage
                    orders={orders}
                    walletTransactions={walletTransactions}
                    onUpdatePaymentStatus={handleUpdatePaymentStatusBackend}
                    showNotification={showNotification}
                  />
                )}

                {/* Tab 8: Delivery Fleet */}
                {activeTab === 'delivery' && (
                  <DeliveryPartnerPage
                    orders={orders}
                    deliveryPartners={deliveryPartners}
                    setDeliveryPartners={setDeliveryPartners}
                    showNotification={showNotification}
                  />
                )}

                {/* Tab 9: Delivery Partner Requests */}
                {activeTab === 'delivery-requests' && (
                  <DeliveryRequestsPage
                    deliveryRequests={deliveryRequests}
                    onAcceptRequest={handleAcceptDeliveryRequest}
                    onRejectRequest={handleRejectDeliveryRequest}
                  />
                )}

                {/* Tab 10: Food Management */}
                {activeTab === 'food-management' && (
                  <FoodManagementPage
                    menuItems={menuItems}
                    setMenuItems={setMenuItems}
                    showNotification={showNotification}
                  />
                )}

                {/* Tab 11: Coupons Management */}
                {activeTab === 'coupons' && (
                  <CouponsPage
                    coupons={coupons}
                    setCoupons={setCoupons}
                    customers={customers}
                    showNotification={showNotification}
                  />
                )}

                {/* Tab 12: Hero Banners Management */}
                {activeTab === 'hero-banner' && (
                  <HeroBannersPage
                    showNotification={showNotification}
                  />
                )}

                {/* Tab 13: Inventory Management */}
                {activeTab === 'inventory' && (
                  <InventoryPage />
                )}

              </main>
            </div>
          </div>

          {/* ==========================================
         Modals Implementation
         ========================================== */}

          {/* 1. Reserve Table Modal */}
          {activeModal === 'reserve' && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
              <form onSubmit={handleReserveTable} className="grid-card" style={{ width: '380px', gap: '16px', background: 'rgba(255,255,255,0.95)', color: '#2D3F76', padding: '24px' }}>
                <h2>Reserve a Dining Table</h2>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Guest Name</label>
                  <input type="text" placeholder="Rohan Malhotra" required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Guest Count</label>
                  <input type="number" min="1" max="8" defaultValue="2" style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn btn-primary btn-yellow" style={{ flex: 1 }}>Submit Booking</button>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setActiveModal(null)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* 2. Quick Billing Modal */}
          {activeModal === 'billing' && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
              <form onSubmit={handleQuickBilling} className="grid-card" style={{ width: '380px', gap: '16px', background: 'rgba(255,255,255,0.95)', color: '#2D3F76', padding: '24px' }}>
                <h2>Create POS Quick Invoice</h2>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Select Dish</label>
                  <select name="dishSelect" style={{ width: '100%', padding: '8px', borderRadius: '8px' }}>
                    {menuItems.map(m => (
                      <option key={m.id} value={m.id}>{m.name} (₹{m.price})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Quantity</label>
                  <input name="qtySelect" type="number" min="1" max="10" defaultValue="1" style={{ width: '100%', padding: '8px', borderRadius: '8px' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn btn-primary btn-yellow" style={{ flex: 1 }}>Process & Print</button>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setActiveModal(null)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* 3. QR Modal */}
          {activeModal === 'qr' && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
              <div className="grid-card" style={{ width: '340px', gap: '16px', background: 'rgba(255,255,255,0.95)', color: '#2D3F76', padding: '24px', alignItems: 'center' }}>
                <h2>Digital Menu QR Code</h2>
                <div style={{ width: '180px', height: '180px', background: '#fff', border: '1px solid #ddd', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', width: '100%', height: '100%' }}>
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} style={{ background: (i % 3 === 0 || i % 4 === 1) ? '#000' : '#fff' }}></div>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>Table customers can scan this code to load the premium bites menu instantly.</p>
                <button className="btn btn-primary btn-yellow" style={{ width: '100%' }} onClick={() => setActiveModal(null)}>Close</button>
              </div>
            </div>
          )}

          {/* 4. Order Detail Inspector Popup */}
          {selectedOrder && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
              <div className="grid-card" style={{ width: '420px', gap: '16px', background: 'rgba(255,255,255,0.95)', color: '#2D3F76', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                  <h2>Order Ticket {selectedOrder.orderId}</h2>
                  <span className="status-pill pill-live">{selectedOrder.orderStatus}</span>
                </div>
                <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Patron Name:</strong> {selectedOrder.customerName}</div>
                  <div><strong>Dining Mode:</strong> {selectedOrder.diningType}</div>
                  <div>
                    <strong>Ordered Items:</strong>
                    <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                      {selectedOrder.orderedItems.map((oi, i) => (
                        <li key={i}>{oi.name} (x{oi.quantity}) - ₹{oi.price * oi.quantity}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '8px', fontWeight: 'bold', fontSize: '15px' }}>
                    <span>Invoice Total:</span>
                    <span>₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                  <button
                    style={{ flex: 1, background: '#4CA687', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                    onClick={() => {
                      handleUpdateOrderStatusBackend(selectedOrder, 'Accepted')
                      setSelectedOrder(null)
                      showNotification(`Order ${selectedOrder.orderId} Accepted!`, 'success')
                    }}
                  >
                    Accept
                  </button>
                  <button
                    style={{ flex: 1, background: '#ffeff1', color: '#ef4444', border: '1px solid #ef4444', padding: '10px 14px', borderRadius: '8px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                    onClick={() => {
                      handleUpdateOrderStatusBackend(selectedOrder, 'Rejected')
                      setSelectedOrder(null)
                      showNotification(`Order ${selectedOrder.orderId} Rejected!`, 'warning')
                    }}
                  >
                    Reject
                  </button>
                  <button
                    style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '10px 14px', borderRadius: '8px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4.5 Change Status Modal */}
          {statusChangeOrder && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
              <div className="grid-card" style={{ width: '420px', gap: '16px', background: 'rgba(255,255,255,0.95)', color: '#2D3F76', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                  <h2>Update Status: {statusChangeOrder.orderId}</h2>
                  <span className="status-pill pill-live">{statusChangeOrder.orderStatus}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                  <button
                    style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '13px' }}
                    onClick={() => {
                      handleUpdateOrderStatusBackend(statusChangeOrder, 'Cooking')
                      setStatusChangeOrder(null)
                      showNotification(`Status updated: Food is preparing.`, 'success')
                    }}
                  >
                    Food is Preparing (Cooking)
                  </button>
                  <button
                    style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '13px' }}
                    onClick={() => {
                      handleUpdateOrderStatusBackend(statusChangeOrder, 'Out for Delivery')
                      setStatusChangeOrder(null)
                      showNotification(`Status updated: Food handed over to delivery boy.`, 'success')
                    }}
                  >
                    Food Handed Over to Delivery Boy
                  </button>
                  <button
                    style={{ background: '#10b981', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '13px' }}
                    onClick={() => {
                      const finalStatus = statusChangeOrder.diningType === 'Delivery' ? 'Delivered' : 'Served'
                      handleUpdateOrderStatusBackend(statusChangeOrder, finalStatus)
                      setStatusChangeOrder(null)
                      showNotification(`Status updated: Order Delivered/Served.`, 'success')
                    }}
                  >
                    Delivered / Served
                  </button>
                  <button
                    style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '10px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', marginTop: '8px', fontSize: '13px' }}
                    onClick={() => setStatusChangeOrder(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. Add Food Product Modal */}
          {isAddFoodModalOpen && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, background: 'rgba(9, 15, 12, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
              <div className="grid-card" style={{ width: '480px', maxHeight: '90vh', overflowY: 'auto', gap: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '28px', borderRadius: '24px', boxShadow: 'var(--card-shadow)', backdropFilter: 'blur(20px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>🍳 Add Food Product</h2>
                  <button onClick={() => setIsAddFoodModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center' }}><FiX /></button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!addFoodFormData.name || !addFoodFormData.price || !addFoodFormData.category) {
                    showNotification("Please fill in Name, Price, and Category!", "warning");
                    return;
                  }
                  const newItem = {
                    id: menuItems.length + 1,
                    name: addFoodFormData.name,
                    price: parseFloat(addFoodFormData.price),
                    category: addFoodFormData.category,
                    description: addFoodFormData.description,
                    image: addFoodFormData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80",
                    prepTime: addFoodFormData.prepTime || "15 mins",
                    veg: true,
                    rating: 5.0,
                    foodItems: addFoodFormData.foodItems.filter(fi => fi.name.trim() !== '')
                  };
                  setMenuItems(prev => [...prev, newItem]);
                  setIsAddFoodModalOpen(false);
                  showNotification(`${addFoodFormData.name} added to menu!`, "success");
                  // Reset form
                  setAddFoodFormData({
                    name: '',
                    price: '',
                    category: '',
                    description: '',
                    image: '',
                    prepTime: '',
                    foodItems: [{ name: '', quantity: '' }]
                  });
                }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                  <div className="form-group">
                    <label className="form-label">Food Name</label>
                    <input type="text" className="form-input" placeholder="e.g. Garlic Butter Naan" value={addFoodFormData.name} onChange={e => setAddFoodFormData(prev => ({ ...prev, name: e.target.value }))} required />
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Price (₹)</label>
                      <input type="number" className="form-input" placeholder="e.g. 150" value={addFoodFormData.price} onChange={e => setAddFoodFormData(prev => ({ ...prev, price: e.target.value }))} required />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Category</label>
                      <input type="text" className="form-input" placeholder="e.g. Indian, Italian" value={addFoodFormData.category} onChange={e => setAddFoodFormData(prev => ({ ...prev, category: e.target.value }))} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preparation Timing (e.g. 15 mins)</label>
                    <input type="text" className="form-input" placeholder="e.g. 15 mins" value={addFoodFormData.prepTime} onChange={e => setAddFoodFormData(prev => ({ ...prev, prepTime: e.target.value }))} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Food Description</label>
                    <textarea className="form-input" placeholder="Enter mouthwatering description..." style={{ minHeight: '60px', resize: 'vertical' }} value={addFoodFormData.description} onChange={e => setAddFoodFormData(prev => ({ ...prev, description: e.target.value }))} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Food Image</label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                        <FiUpload /> Upload Image
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setAddFoodFormData(prev => ({ ...prev, image: reader.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                      {addFoodFormData.image && (
                        <img src={addFoodFormData.image} alt="Preview" style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Ingredients & Quantities</span>
                      <button type="button" onClick={() => setAddFoodFormData(prev => ({ ...prev, foodItems: [...prev.foodItems, { name: '', quantity: '' }] }))} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px' }}>
                        <FiPlus /> Add Ingredient
                      </button>
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto', paddingRight: '4px' }}>
                      {addFoodFormData.foodItems.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input type="text" className="form-input" style={{ flex: 1.5 }} placeholder="Ingredient (e.g. Flour)" value={item.name} onChange={(e) => {
                            const updated = [...addFoodFormData.foodItems];
                            updated[index].name = e.target.value;
                            setAddFoodFormData(prev => ({ ...prev, foodItems: updated }));
                          }} />
                          <input type="text" className="form-input" style={{ flex: 1 }} placeholder="Qty (e.g. 200g)" value={item.quantity} onChange={(e) => {
                            const updated = [...addFoodFormData.foodItems];
                            updated[index].quantity = e.target.value;
                            setAddFoodFormData(prev => ({ ...prev, foodItems: updated }));
                          }} />
                          {addFoodFormData.foodItems.length > 1 && (
                            <button type="button" onClick={() => setAddFoodFormData(prev => ({ ...prev, foodItems: prev.foodItems.filter((_, i) => i !== index) }))} style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              <FiX />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" className="btn btn-primary btn-yellow" style={{ flex: 1, padding: '12px' }}>Save Food Product</button>
                    <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setIsAddFoodModalOpen(false)}>Cancel</button>
                  </div>

                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default App

