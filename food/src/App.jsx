import { useState, useEffect, useRef } from 'react'
import { IoRestaurant } from "react-icons/io5"
import { TbMotorbikeFilled } from "react-icons/tb"
import { FiUser, FiLogOut } from "react-icons/fi"
import './App.css'
import { DISHES, INITIAL_ALL_FOODS, INITIAL_RECOMMENDED_FOODS, INITIAL_SPOTLIGHT_FOODS, POPULAR_CATEGORIES } from './data/foodData'
import { useCart } from './hooks/useCart'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import AuthModal from './components/AuthModal'
import HeroSection from './components/HeroSection'
import PopularCategories from './components/PopularCategories'
import RecommendedFoods from './components/RecommendedFoods'
import SpotlightFoods from './components/SpotlightFoods'
import ExploreFullMenu from './components/ExploreFullMenu'
import ProfilePage from './components/ProfilePage'
import CartDrawer from './components/CartDrawer'
import ScannerOverlay from './components/ScannerOverlay'
import ProductCustomizationModal from './components/ProductCustomizationModal'
import CertificatesSection from './components/CertificatesSection'
import Footer from './components/Footer'
import FloatingMenuButton from './components/FloatingMenuButton'
import OrderTrackingModal from './components/OrderTrackingModal'
import GoogleLocationPickerModal from './components/GoogleLocationPickerModal'
import './styles/customization-modal.css'
import './styles/floating-menu.css'
import { handleDiningModeSelection } from './utils/diningModeHelper'

// Clear guest id on script load so that reload starts with a fresh guest ID and empty cart
localStorage.removeItem('avantika_guest_id')



function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentDish = DISHES[currentIndex]

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DISHES.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DISHES.length) % DISHES.length)
  }

  // Initial Welcome Loader State
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2800) // Shows the splash screen for 2.8 seconds
    return () => clearTimeout(timer)
  }, [])

  // Dining Mode State
  const [diningMode, setDiningMode] = useState(null)

  // Live Order Tracking State
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null)

  const [lastTrackedOrder, setLastTrackedOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('avantika_last_tracked_order');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (activeTrackingOrder) {
      setLastTrackedOrder(activeTrackingOrder);
      localStorage.setItem('avantika_last_tracked_order', JSON.stringify(activeTrackingOrder));
    }
  }, [activeTrackingOrder]);


  // Location States
  const [showLocationPopup, setShowLocationPopup] = useState(false)
  const [showGoogleLocationPicker, setShowGoogleLocationPicker] = useState(false)
  const [userLocation, setUserLocation] = useState('')
  const [tempLocation, setTempLocation] = useState('')

  const handleConfirmLocation = () => {
    setUserLocation(tempLocation)
    setShowLocationPopup(false)
  }

  // Scanner States
  const [selectedMode, setSelectedMode] = useState(null)
  const [showScanner, setShowScanner] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanSuccess, setScanSuccess] = useState(false)

  const handleModeSelect = (mode) => {
    handleDiningModeSelection(mode, setDiningMode, setShowAllProductsPage)
  }

  // Dynamic Foods State
  const [allFoods, setAllFoods] = useState(INITIAL_ALL_FOODS)
  const [recommendedFoods, setRecommendedFoods] = useState(INITIAL_RECOMMENDED_FOODS)
  const [spotlightFoods, setSpotlightFoods] = useState(INITIAL_SPOTLIGHT_FOODS)

  // Search State
  const [searchQuery, setSearchQuery] = useState('')

  // Auth hook
  const {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
    authName,
    setAuthName,
    authPhone,
    setAuthPhone,
    authError,
    setAuthError,
    isLoggedIn,
    setIsLoggedIn,
    loggedInUser,
    setLoggedInUser,
    showUserDropdown,
    setShowUserDropdown,
    authLoading,
    setAuthLoading,
    handleAuthSubmit,
    handleLogout
  } = useAuth()

  useEffect(() => {
    if (!isLoggedIn) {
      setLastTrackedOrder(null);
      localStorage.removeItem('avantika_last_tracked_order');
    }
  }, [isLoggedIn]);

  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [showPaymentMethodsModal, setShowPaymentMethodsModal] = useState(false)
  const [showOrdersModal, setShowOrdersModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showAddressBookModal, setShowAddressBookModal] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [orderHistory, setOrderHistory] = useState([])
  const [showProfilePage, setShowProfilePage] = useState(false)
  const [profileActiveTab, setProfileActiveTab] = useState('dashboard')
  const [orderSearchQuery, setOrderSearchQuery] = useState('')
  const [profileName, setProfileName] = useState('')
  const [profileMobile, setProfileMobile] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profileDob, setProfileDob] = useState('')
  const [profileAnniversary, setProfileAnniversary] = useState('')
  const [profileGender, setProfileGender] = useState('')
  const [showGenderDropdown, setShowGenderDropdown] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
  }, [darkMode])


  const [showAllProductsPage, setShowAllProductsPage] = useState(false)
  const [selectedCatalogueCategory, setSelectedCatalogueCategory] = useState('All')

  // Cart & Checkout States
  // Cart & Checkout hook
  const {
    cart,
    setCart,
    showCartDrawer,
    setShowCartDrawer,
    checkoutStep,
    setCheckoutStep,
    paymentMode,
    setPaymentMode,
    paymentLoading,
    setPaymentLoading,
    cookingRequest,
    setCookingRequest,
    editingAddress,
    setEditingAddress,
    inlineAddressInput,
    setInlineAddressInput,
    showCouponSection,
    setShowCouponSection,
    couponCode,
    setCouponCode,
    appliedDiscount,
    setAppliedDiscount,
    couponMsg,
    setCouponMsg,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
  } = useCart(isLoggedIn, setShowAuthModal, setAuthMode, diningMode)
  const [selectedProductForCustomization, setSelectedProductForCustomization] = useState(null)
  const [showAddressSheet, setShowAddressSheet] = useState(false)
  const [showAddAddressSheet, setShowAddAddressSheet] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [newAddrName, setNewAddrName] = useState('')
  const [newAddrPhone, setNewAddrPhone] = useState('')
  const [newAddrHouse, setNewAddrHouse] = useState('')
  const [newAddrBuilding, setNewAddrBuilding] = useState('')
  const [newAddrLandmark, setNewAddrLandmark] = useState('')
  const [newAddrArea, setNewAddrArea] = useState('')
  const [newAddrCity, setNewAddrCity] = useState('')
  const [newAddrPincode, setNewAddrPincode] = useState('')
  const [newAddrType, setNewAddrType] = useState('Home')
  const [addrFormError, setAddrFormError] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [upiAddress, setUpiAddress] = useState('')
  const [showQrModal, setShowQrModal] = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState('')

  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  const getEffectiveUserId = () => {
    let savedUser = null
    try {
      const raw = localStorage.getItem('avantika_user')
      if (raw) savedUser = JSON.parse(raw)
    } catch (e) {}
    if (savedUser && (savedUser._id || savedUser.id)) return savedUser._id || savedUser.id
    let guestId = localStorage.getItem('avantika_guest_id')
    if (!guestId) {
      guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9)
      localStorage.setItem('avantika_guest_id', guestId)
    }
    return guestId
  }

  // Load user addresses and order history from backend API
  useEffect(() => {
    const userId = getEffectiveUserId()
    fetch(`http://localhost:45000/api/users/address/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setSavedAddresses(data.data)
          if (data.data.length > 0) {
            const first = data.data[0]
            setSelectedAddressId(first.id || first._id)
            const fullStr = `${first.houseNo || ''}, ${first.building || ''}, ${first.landmark ? first.landmark + ', ' : ''}${first.area || ''}, ${first.city || ''} - ${first.pincode || ''}`
            setUserLocation(fullStr)
          }
        }
      })
      .catch(err => console.log('Backend addresses fetch error:', err))

    fetch(`http://localhost:45000/api/orders/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const formatted = data.data.map(ord => ({
            id: ord.orderId,
            date: ord.createdAt ? new Date(ord.createdAt).toISOString().split('T')[0] : (ord.orderTime || 'Today'),
            total: `₹${ord.totalAmount}`,
            status: ord.orderStatus || 'Preparing',
            items: (ord.orderedItems || ord.items || []).map(i => `${i.quantity}x ${i.name}`).join(', ')
          }))
          setOrderHistory(formatted)

          // Find active non-delivered order so tracking persists until delivered
          const activeOrder = data.data.find(ord => {
            const st = (ord.orderStatus || '').toLowerCase()
            return st !== 'delivered' && st !== 'cancelled' && st !== 'served'
          })

          if (activeOrder) {
            setLastTrackedOrder(activeOrder.orderId)
            localStorage.setItem('avantika_last_tracked_order', activeOrder.orderId)
          }
        }
      })
      .catch(err => console.log('Backend order history fetch error:', err))
  }, [isLoggedIn])

  const handleEditAddressClick = (addr, e) => {
    if (e) e.stopPropagation()
    setEditingAddressId(addr.id || addr._id)
    setNewAddrName(addr.name || '')
    setNewAddrPhone(addr.phone || '')
    setNewAddrHouse(addr.houseNo || '')
    setNewAddrBuilding(addr.building || '')
    setNewAddrLandmark(addr.landmark || '')
    setNewAddrArea(addr.area || '')
    setNewAddrCity(addr.city || '')
    setNewAddrPincode(addr.pincode || '')
    setNewAddrType(addr.type || 'Home')
    setAddrFormError('')
    setShowAddAddressSheet(true)
  }

  const handleDeleteAddressClick = async (addr, e) => {
    if (e) e.stopPropagation()
    const addrId = addr.id || addr._id
    const userId = getEffectiveUserId()
    try {
      const res = await fetch(`http://localhost:45000/api/users/address/${addrId}?userId=${userId}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setSavedAddresses(data.data)
        if (selectedAddressId === addrId) {
          if (data.data.length > 0) {
            const first = data.data[0]
            setSelectedAddressId(first.id || first._id)
            const fullStr = `${first.houseNo || ''}, ${first.building || ''}, ${first.landmark ? first.landmark + ', ' : ''}${first.area || ''}, ${first.city || ''} - ${first.pincode || ''}`
            setUserLocation(fullStr)
          } else {
            setSelectedAddressId('')
            setUserLocation('')
          }
        }
      }
    } catch (err) {
      console.error('Error deleting address API:', err)
    }
  }




  const handlePlaceOrder = async () => {
    setPaymentLoading(true)
    const userId = getEffectiveUserId()
    const orderIdVal = 'AV-' + Math.floor(10000000 + Math.random() * 90000000)

    const subtotal = cart.reduce((sum, item) => sum + item.cost * item.quantity, 0)
    const gstVal = Math.round(subtotal * 0.05)
    const deliveryChargeVal = diningMode === 'dine-in' ? 0 : 49
    const grandTotalVal = Math.max(0, subtotal - appliedDiscount + deliveryChargeVal + gstVal)

    let txnId = ''
    if (paymentMode === 'upi') {
      txnId = upiAddress ? `UPI_${upiAddress}_${Date.now()}` : `UPI_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    } else if (paymentMode === 'card') {
      txnId = cardNumber ? `CARD_${cardNumber.slice(-4)}_${Date.now()}` : `CARD_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    } else if (paymentMode === 'cod') {
      txnId = `COD_${Date.now()}`
    } else {
      txnId = `TXN_${paymentMode.toUpperCase()}_${Date.now()}`
    }

    const activeAddrObj = savedAddresses.find(a => (a.id === selectedAddressId || a._id === selectedAddressId))
    const isGuestFlow = diningMode === 'dine-in' || diningMode === 'pickup'
    const custName = isGuestFlow ? (guestName || 'Valued Patron') : (loggedInUser?.name || loggedInUser?.user_name || profileName || activeAddrObj?.name || 'Valued Patron')
    const custPhone = isGuestFlow ? (guestPhone || '9876543210') : (loggedInUser?.phone || loggedInUser?.phone_number || profileMobile || activeAddrObj?.phone || '9876543210')
    const custEmail = isGuestFlow ? (guestEmail || '') : (loggedInUser?.email || profileEmail || activeAddrObj?.email || '')

    const orderPayload = {
      orderId: orderIdVal,
      userId,
      customerName: custName,
      phoneNumber: custPhone,
      customerEmail: custEmail,
      deliveryAddress: userLocation || (diningMode === 'dine-in' ? 'Dine-In Table' : 'Pickup Store'),
      diningType: diningMode === 'dine-in' ? 'Dine In' : (diningMode === 'takeaway' || diningMode === 'pickup' ? 'Takeaway' : 'Delivery'),
      orderedItems: cart.map(item => ({
        foodId: item.id || item._id || item.name,
        name: item.name,
        cost: item.cost,
        price: item.cost,
        quantity: item.quantity,
        customizations: item.customizations || '',
        image: item.image || ''
      })),
      itemTotal: subtotal,
      deliveryCharge: deliveryChargeVal,
      taxes: gstVal,
      discountAmount: appliedDiscount,
      totalAmount: grandTotalVal,
      paymentMethod: paymentMode === 'upi' ? 'UPI' : (paymentMode === 'card' ? 'Credit Card' : (paymentMode === 'cod' ? 'Cash on Delivery' : paymentMode.toUpperCase())),
      transactionId: txnId,
      orderStatus: 'Requested',
      specialInstructions: cookingRequest || ''
    }

    try {
      const response = await fetch('http://localhost:45000/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      })
      const resData = await response.json()
      if (resData.success && resData.data) {
        const newOrderId = resData.data.orderId || orderIdVal
        setPlacedOrderId(newOrderId)
        setLastTrackedOrder(newOrderId)
        localStorage.setItem('avantika_last_tracked_order', newOrderId)
        setShowTrackingModal(true)
        const itemsSummaryStr = cart.map(item => `${item.quantity}x ${item.name}`).join(', ')
        setOrderHistory(prev => [
          { id: newOrderId, date: new Date().toISOString().split('T')[0], total: `₹${grandTotalVal}`, status: 'Requested', items: itemsSummaryStr },
          ...prev
        ])
      } else {
        setPlacedOrderId(orderIdVal)
        setLastTrackedOrder(orderIdVal)
        localStorage.setItem('avantika_last_tracked_order', orderIdVal)
        setShowTrackingModal(true)
      }
    } catch (err) {
      console.error('Error placing order API:', err)
      setPlacedOrderId(orderIdVal)
      setLastTrackedOrder(orderIdVal)
      localStorage.setItem('avantika_last_tracked_order', orderIdVal)
      setShowTrackingModal(true)
    }

    setPaymentLoading(false)
    setCheckoutStep('success')
    setCart([])
    setAppliedDiscount(0)
    setCouponCode('')
    setCouponMsg('')
  }



  // Filter & Sorting States
  const [showFilters, setShowFilters] = useState(false)
  const [filterRating, setFilterRating] = useState(false)
  const [sortCost, setSortCost] = useState('none') // 'none', 'low-high', 'high-low'
  const [filterTime, setFilterTime] = useState(false)
  const [filterPrice, setFilterPrice] = useState('All') // 'All', '<10', '10-15', '>15'
  const [filterQuantity, setFilterQuantity] = useState('All') // 'All', 'Single', 'Double'
  const [filterIngredient, setFilterIngredient] = useState('All') // 'All', 'Cheese', 'Beef', 'Chicken', 'Veggie', 'Mushroom'
  const [filterAddons, setFilterAddons] = useState('All') // 'All', 'Fries + Coke', 'Extra Cheese', 'Guacamole'
  const [filterVeg, setFilterVeg] = useState(false)

  // Mobile Filter Panel States
  const [showMobileFilterPanel, setShowMobileFilterPanel] = useState(false)
  const [activeMobileCategory, setActiveMobileCategory] = useState('sort')

  const handleFiltersClick = () => {
    if (window.innerWidth <= 768) {
      setShowMobileFilterPanel(true)
    } else {
      setShowFilters(!showFilters)
    }
  }

  const hasActiveFilters = filterRating || sortCost !== 'none' || filterTime || filterPrice !== 'All' || filterQuantity !== 'All' || filterIngredient !== 'All' || filterAddons !== 'All' || filterVeg

  const clearAllFilters = () => {
    setFilterRating(false)
    setSortCost('none')
    setFilterTime(false)
    setFilterPrice('All')
    setFilterQuantity('All')
    setFilterIngredient('All')
    setFilterAddons('All')
    setFilterVeg(false)
  }

  // Computed Filtered Lists based on Search & Zomato Filters
  const processList = (list) => {
    let result = [...list]

    // 1. Search Query
    if (searchQuery) {
      result = result.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 2. Rating 4.0+
    if (filterRating) {
      result = result.filter(food => food.rating >= 4.0)
    }

    // 3. Fast Prep Time (<= 20 mins)
    if (filterTime) {
      result = result.filter(food => food.time <= 20)
    }

    // 4. Dish Price Range
    if (filterPrice !== 'All') {
      if (filterPrice === '<10') result = result.filter(food => food.cost < 150)
      else if (filterPrice === '10-15') result = result.filter(food => food.cost >= 150 && food.cost <= 300)
      else if (filterPrice === '>15') result = result.filter(food => food.cost > 300)
    }

    // 5. Quantity
    if (filterQuantity !== 'All') {
      result = result.filter(food => food.quantity === filterQuantity)
    }

    // 6. Main Ingredient
    if (filterIngredient !== 'All') {
      result = result.filter(food => food.mainIngredient === filterIngredient)
    }

    // 7. Add-ons
    if (filterAddons !== 'All') {
      result = result.filter(food => food.addons === filterAddons)
    }

    // 7.5. Veg Only
    if (filterVeg) {
      result = result.filter(food => food.isVeg)
    }

    // 8. Cost / Price Sorting
    if (sortCost === 'low-high') {
      result.sort((a, b) => a.cost - b.cost)
    } else if (sortCost === 'high-low') {
      result.sort((a, b) => b.cost - a.cost)
    }

    return result
  }

  const filteredAllFoods = processList(allFoods)
  const filteredRecommendedFoods = processList(recommendedFoods)
  const filteredSpotlightFoods = processList(spotlightFoods)



  // Admin Panel States
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [newFoodName, setNewFoodName] = useState('')
  const [newFoodCategory, setNewFoodCategory] = useState('')
  const [newFoodSection, setNewFoodSection] = useState('popular')
  const [newFoodImage, setNewFoodImage] = useState('/burger.png')
  const [newFoodDesc, setNewFoodDesc] = useState('')

  const handleAddFood = (e) => {
    e.preventDefault()
    if (!newFoodName || !newFoodCategory) return

    const newFood = {
      name: newFoodName.toUpperCase(),
      category: newFoodCategory,
      image: newFoodImage,
      description: newFoodDesc || (newFoodSection === 'recommended' ? 'Premium handpicked dish.' : 'Featured Signature Creation.')
    }

    if (newFoodSection === 'popular') {
      setAllFoods([...allFoods, newFood])
    } else if (newFoodSection === 'recommended') {
      setRecommendedFoods([...recommendedFoods, newFood])
    } else if (newFoodSection === 'spotlight') {
      setSpotlightFoods([...spotlightFoods, newFood])
    }

    // Reset Form
    setNewFoodName('')
    setNewFoodCategory('')
    setNewFoodDesc('')
    setShowAdminPanel(false)
  }

  // Background Image Rotator state
  const [bgImageIndex, setBgImageIndex] = useState(0)
  const bgImages = ['/avantika resize.jpg.jpeg', '/avantika chef.jpg.jpeg']

  // Mobile Background Image Rotator state
  const [mobileBgImageIndex, setMobileBgImageIndex] = useState(0)
  const mobileBgImages = ['/avantika%20banner%202.png', '/AVNTIKA.png']

  useEffect(() => {
    const interval = setInterval(() => {
      setBgImageIndex((prev) => (prev + 1) % bgImages.length)
      setMobileBgImageIndex((prev) => (prev + 1) % mobileBgImages.length)
    }, 5000) // Change image every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Welcome / Scanner / Loader Screen Overlay */}
      <ScannerOverlay
        loading={loading}
        diningMode={diningMode}
        showScanner={showScanner}
        setShowScanner={setShowScanner}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        scanSuccess={scanSuccess}
        scanProgress={scanProgress}
        handleModeSelect={handleModeSelect}
      />

      {/* Location Popup Modal */}
      {showLocationPopup && (
        <div className="location-popup-overlay">
          <div className="location-popup-modal">
            <button className="location-close-btn" onClick={() => setShowLocationPopup(false)} aria-label="Close popup">×</button>
            <div className="location-icon-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h2 className="location-title">Enter Delivery Address</h2>
            <p className="location-subtitle-text">Provide your address so we can customize your delivery experience.</p>
            <button
              onClick={() => {
                setShowLocationPopup(false);
                setShowGoogleLocationPicker(true);
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(2,132,199,0.3)'
              }}
            >
              <span>🎯</span> Select via Google Maps & GPS
            </button>
            <div className="location-input-wrapper">
              <input
                type="text"
                placeholder="Enter street, city, or zip code..."
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                className="location-input-field"
                onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmLocation(); }}
              />
            </div>
            <button onClick={handleConfirmLocation} className="location-confirm-btn">
              Confirm Location
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal Overlay */}
      <AuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        handleAuthSubmit={handleAuthSubmit}
        authName={authName}
        setAuthName={setAuthName}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPhone={authPhone}
        setAuthPhone={setAuthPhone}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authError={authError}
        setAuthError={setAuthError}
        authLoading={authLoading}
      />

      <HeroSection
        bgImages={bgImages}
        bgImageIndex={bgImageIndex}
        mobileBgImages={mobileBgImages}
        mobileBgImageIndex={mobileBgImageIndex}
        currentDish={currentDish}
        handlePrev={handlePrev}
        handleNext={handleNext}
        navbarProps={{
          diningMode,
          setDiningMode,
          userLocation,
          setTempLocation,
          setShowLocationPopup,
          searchQuery,
          setSearchQuery,
          isLoggedIn,
          setShowAuthModal,
          setAuthMode,
          setShowCartDrawer,
          setCheckoutStep,
          cart,
          setShowProfilePage,
          setProfileActiveTab,
          loggedInUser
        }}
      />

      {/* Zomato Filters Trigger Section (Above Popular Categories) */}
      <div className="main-filters-section-container">
        <div className="main-filters-header-row">
          <button
            className={`main-filters-trigger-btn ${hasActiveFilters ? 'active-filters' : ''} ${showFilters ? 'panel-open' : ''}`}
            onClick={() => handleFiltersClick()}
            title="Toggle Food Filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            <span>Filters</span>
          </button>

          {/* Active filters indicators count badge */}
          {hasActiveFilters && (
            <span className="active-filters-count-badge">Active</span>
          )}
        </div>

        {/* Zomato-style Filters and Sorting Pill Bar (shows only when showFilters is true) */}
        {showFilters && (
          <div className="zomato-filter-bar-wrapper">
            <div className="zomato-filter-bar anim-expand-filters">
              {/* 0. Veg Only Toggle */}
              <button
                className={`filter-pill filter-veg-toggle ${filterVeg ? 'active' : ''}`}
                onClick={() => setFilterVeg(!filterVeg)}
              >
                <span className="veg-indicator-dot"></span>
                Veg Only
              </button>

              {/* 1. Rating 4.0+ Toggle */}
              <button
                className={`filter-pill ${filterRating ? 'active' : ''}`}
                onClick={() => setFilterRating(!filterRating)}
              >
                Rating: 4.0+ ★
              </button>

              {/* 2. Cost sorting dropdown */}
              <div className="filter-dropdown-wrapper">
                <select
                  value={sortCost}
                  onChange={(e) => setSortCost(e.target.value)}
                  className={`filter-select-pill ${sortCost !== 'none' ? 'active' : ''}`}
                >
                  <option value="none">Cost / Price ⇅</option>
                  <option value="low-high">Cost: Low to High</option>
                  <option value="high-low">Cost: High to Low</option>
                </select>
              </div>

              {/* 3. Prep Time Toggle */}
              <button
                className={`filter-pill ${filterTime ? 'active' : ''}`}
                onClick={() => setFilterTime(!filterTime)}
              >
                Prep Time: Fast (≤20m) ⏱
              </button>

              {/* 4. Dish Price Range Dropdown */}
              <div className="filter-dropdown-wrapper">
                <select
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(e.target.value)}
                  className={`filter-select-pill ${filterPrice !== 'All' ? 'active' : ''}`}
                >
                  <option value="All">Dish Price (All)</option>
                  <option value="<10">Under ₹150</option>
                  <option value="10-15">₹150 to ₹300</option>
                  <option value=">15">Over ₹300</option>
                </select>
              </div>

              {/* 5. Quantity Dropdown */}
              <div className="filter-dropdown-wrapper">
                <select
                  value={filterQuantity}
                  onChange={(e) => setFilterQuantity(e.target.value)}
                  className={`filter-select-pill ${filterQuantity !== 'All' ? 'active' : ''}`}
                >
                  <option value="All">Quantity (All)</option>
                  <option value="Single">Single Server</option>
                  <option value="Double">Double Server</option>
                </select>
              </div>

              {/* 6. Main Ingredient Dropdown */}
              <div className="filter-dropdown-wrapper">
                <select
                  value={filterIngredient}
                  onChange={(e) => setFilterIngredient(e.target.value)}
                  className={`filter-select-pill ${filterIngredient !== 'All' ? 'active' : ''}`}
                >
                  <option value="All">Ingredient (All)</option>
                  <option value="Paneer">Paneer</option>
                  <option value="Cheese">Cheese</option>
                  <option value="Potato">Potato</option>
                  <option value="Veggie">Veggie</option>
                  <option value="Mushroom">Mushroom</option>
                  <option value="Corn">Corn</option>
                </select>
              </div>

              {/* 7. Add-ons Dropdown */}
              <div className="filter-dropdown-wrapper">
                <select
                  value={filterAddons}
                  onChange={(e) => setFilterAddons(e.target.value)}
                  className={`filter-select-pill ${filterAddons !== 'All' ? 'active' : ''}`}
                >
                  <option value="All">Add-ons (All)</option>
                  <option value="Fries + Coke">Fries + Coke</option>
                  <option value="Extra Cheese">Extra Cheese</option>
                  <option value="Guacamole">Guacamole</option>
                </select>
              </div>

              {/* Reset Filters button if any active */}
              {(filterRating || sortCost !== 'none' || filterTime || filterPrice !== 'All' || filterQuantity !== 'All' || filterIngredient !== 'All' || filterAddons !== 'All' || filterVeg) && (
                <button className="filter-reset-btn" onClick={() => {
                  setFilterRating(false);
                  setSortCost('none');
                  setFilterTime(false);
                  setFilterPrice('All');
                  setFilterQuantity('All');
                  setFilterIngredient('All');
                  setFilterAddons('All');
                  setFilterVeg(false);
                }}>
                  Clear All ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <PopularCategories
        setShowAllProductsPage={setShowAllProductsPage}
        setSelectedCatalogueCategory={setSelectedCatalogueCategory}
      />

      {/* Recommended Foods Section */}
      <RecommendedFoods
        filteredRecommendedFoods={filteredRecommendedFoods}
        addToCart={addToCart}
        cart={cart}
        updateCartQuantity={updateCartQuantity}
        onOpenCustomization={setSelectedProductForCustomization}
      />

      {/* In the Spotlight Section */}
      <SpotlightFoods
        filteredSpotlightFoods={filteredSpotlightFoods}
        addToCart={addToCart}
        cart={cart}
        updateCartQuantity={updateCartQuantity}
        onOpenCustomization={setSelectedProductForCustomization}
      />

      {/* Explore Our Full Menu Section & Catalogue Modal */}
      <ExploreFullMenu
        allFoods={allFoods}
        recommendedFoods={recommendedFoods}
        spotlightFoods={spotlightFoods}
        selectedCatalogueCategory={selectedCatalogueCategory}
        setSelectedCatalogueCategory={setSelectedCatalogueCategory}
        showAllProductsPage={showAllProductsPage}
        setShowAllProductsPage={setShowAllProductsPage}
        addToCart={addToCart}
        cart={cart}
        updateCartQuantity={updateCartQuantity}
        onOpenCustomization={setSelectedProductForCustomization}
      />

      {/* Trust & Quality Certifications Section */}
      <CertificatesSection />

      {/* Main Page Footer */}
      <Footer />

      {/* Shopping Cart Drawer / Checkout Page */}
      <CartDrawer
        showCartDrawer={showCartDrawer}
        setShowCartDrawer={setShowCartDrawer}
        checkoutStep={checkoutStep}
        setCheckoutStep={setCheckoutStep}
        cart={cart}
        setCart={setCart}
        diningMode={diningMode}
        userLocation={userLocation}
        savedAddresses={savedAddresses}
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
        upiAddress={upiAddress}
        setUpiAddress={setUpiAddress}
        showQrModal={showQrModal}
        setShowQrModal={setShowQrModal}
        cardHolder={cardHolder}
        setCardHolder={setCardHolder}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        cardExpiry={cardExpiry}
        setCardExpiry={setCardExpiry}
        cardCvv={cardCvv}
        setCardCvv={setCardCvv}
        paymentLoading={paymentLoading}
        appliedDiscount={appliedDiscount}
        setAppliedDiscount={setAppliedDiscount}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        couponMsg={couponMsg}
        setCouponMsg={setCouponMsg}
        cookingRequest={cookingRequest}
        setCookingRequest={setCookingRequest}
        showCouponSection={showCouponSection}
        setShowCouponSection={setShowCouponSection}
        placedOrderId={placedOrderId}
        setShowAddressSheet={setShowAddressSheet}
        handlePlaceOrder={handlePlaceOrder}
        removeFromCart={removeFromCart}
        updateCartQuantity={updateCartQuantity}
        addToCart={addToCart}
        allFoods={allFoods}
        recommendedFoods={recommendedFoods}
        spotlightFoods={spotlightFoods}
        guestName={guestName}
        setGuestName={setGuestName}
        guestPhone={guestPhone}
        setGuestPhone={setGuestPhone}
        guestEmail={guestEmail}
        setGuestEmail={setGuestEmail}
        onTrackOrder={(ord) => setActiveTrackingOrder(ord)}
      />
      {/* ===== MOBILE FILTER PANEL (Zomato Style) ===== */}
      {showMobileFilterPanel && (
        <div className="mfp-overlay" onClick={() => setShowMobileFilterPanel(false)}>
          <div className="mfp-panel" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="mfp-header">
              <span className="mfp-title">Filters and sorting</span>
              <button className="mfp-clear-all" onClick={clearAllFilters}>Clear all</button>
            </div>

            {/* Body: Sidebar + Content */}
            <div className="mfp-body">

              {/* Left Sidebar */}
              <div className="mfp-sidebar">
                {[
                  {
                    id: 'sort', label: 'Sort By', icon: (
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="9" y2="18" /></svg>
                    ), active: sortCost !== 'none'
                  },
                  {
                    id: 'time', label: 'Time', icon: (
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    ), active: filterTime
                  },
                  {
                    id: 'rating', label: 'Rating', icon: (
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    ), active: filterRating
                  },
                  {
                    id: 'price', label: 'Dish Price', icon: (
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    ), active: filterPrice !== 'All'
                  },
                  {
                    id: 'veg', label: 'Pure Veg', icon: (
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="12" cy="12" r="4" /></svg>
                    ), active: filterVeg
                  },
                  {
                    id: 'quantity', label: 'Quantity', icon: (
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
                    ), active: filterQuantity !== 'All'
                  },
                  {
                    id: 'ingredient', label: 'Ingredient', icon: (
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    ), active: filterIngredient !== 'All'
                  },
                  {
                    id: 'addons', label: 'Add-ons', icon: (
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                    ), active: filterAddons !== 'All'
                  },
                ].map(cat => (
                  <button
                    key={cat.id}
                    className={`mfp-sidebar-item ${activeMobileCategory === cat.id ? 'mfp-sidebar-active' : ''} ${cat.active ? 'mfp-sidebar-has-filter' : ''}`}
                    onClick={() => setActiveMobileCategory(cat.id)}
                  >
                    <span className="mfp-sidebar-icon">{cat.icon}</span>
                    <span className="mfp-sidebar-label">{cat.label}</span>
                    {cat.active && <span className="mfp-sidebar-dot" />}
                  </button>
                ))}
              </div>

              {/* Right Content Panel */}
              <div className="mfp-content">

                {/* Sort By */}
                {activeMobileCategory === 'sort' && (
                  <div className="mfp-section">
                    <h3 className="mfp-section-title">Sort by</h3>
                    <div className="mfp-options-grid">
                      {[
                        { val: 'none', label: 'Relevance', icon: '↕' },
                        { val: 'low-high', label: 'Price: Low to High', icon: '↑' },
                        { val: 'high-low', label: 'Price: High to Low', icon: '↓' },
                      ].map(opt => (
                        <button
                          key={opt.val}
                          className={`mfp-option-card ${sortCost === opt.val ? 'mfp-option-active' : ''}`}
                          onClick={() => setSortCost(opt.val)}
                        >
                          <span className="mfp-option-icon">{opt.icon}</span>
                          <span className="mfp-option-label">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Time */}
                {activeMobileCategory === 'time' && (
                  <div className="mfp-section">
                    <h3 className="mfp-section-title">Delivery Time</h3>
                    <div className="mfp-options-grid">
                      <button
                        className={`mfp-option-card ${filterTime ? 'mfp-option-active' : ''}`}
                        onClick={() => setFilterTime(!filterTime)}
                      >
                        <span className="mfp-option-icon">⚡</span>
                        <span className="mfp-option-label">Fast (≤20 min)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Rating */}
                {activeMobileCategory === 'rating' && (
                  <div className="mfp-section">
                    <h3 className="mfp-section-title">Restaurant Rating</h3>
                    <div className="mfp-options-grid">
                      <button
                        className={`mfp-option-card ${filterRating ? 'mfp-option-active' : ''}`}
                        onClick={() => setFilterRating(!filterRating)}
                      >
                        <span className="mfp-option-icon">★</span>
                        <span className="mfp-option-label">Rated 4.0+</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Dish Price */}
                {activeMobileCategory === 'price' && (
                  <div className="mfp-section">
                    <h3 className="mfp-section-title">Dish Price</h3>
                    <div className="mfp-options-grid">
                      {[
                        { val: 'All', label: 'All', icon: '—' },
                        { val: '<10', label: 'Under ₹150', icon: '₹' },
                        { val: '10-15', label: '₹150 – ₹300', icon: '₹₹' },
                        { val: '>15', label: 'Above ₹300', icon: '₹₹₹' },
                      ].map(opt => (
                        <button
                          key={opt.val}
                          className={`mfp-option-card ${filterPrice === opt.val ? 'mfp-option-active' : ''}`}
                          onClick={() => setFilterPrice(opt.val)}
                        >
                          <span className="mfp-option-icon">{opt.icon}</span>
                          <span className="mfp-option-label">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pure Veg */}
                {activeMobileCategory === 'veg' && (
                  <div className="mfp-section">
                    <h3 className="mfp-section-title">Food Type</h3>
                    <div className="mfp-options-grid">
                      <button
                        className={`mfp-option-card ${filterVeg ? 'mfp-option-active mfp-option-veg' : ''}`}
                        onClick={() => setFilterVeg(!filterVeg)}
                      >
                        <span className="mfp-option-icon mfp-veg-icon">🌿</span>
                        <span className="mfp-option-label">Pure Veg</span>
                      </button>
                      <button
                        className={`mfp-option-card ${!filterVeg ? 'mfp-option-active' : ''}`}
                        onClick={() => setFilterVeg(false)}
                      >
                        <span className="mfp-option-icon">🍽</span>
                        <span className="mfp-option-label">All</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Quantity */}
                {activeMobileCategory === 'quantity' && (
                  <div className="mfp-section">
                    <h3 className="mfp-section-title">Serving Size</h3>
                    <div className="mfp-options-grid">
                      {[
                        { val: 'All', label: 'All', icon: '📦' },
                        { val: 'Single', label: 'Single', icon: '1️⃣' },
                        { val: 'Double', label: 'Double', icon: '2️⃣' },
                      ].map(opt => (
                        <button
                          key={opt.val}
                          className={`mfp-option-card ${filterQuantity === opt.val ? 'mfp-option-active' : ''}`}
                          onClick={() => setFilterQuantity(opt.val)}
                        >
                          <span className="mfp-option-icon">{opt.icon}</span>
                          <span className="mfp-option-label">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ingredient */}
                {activeMobileCategory === 'ingredient' && (
                  <div className="mfp-section">
                    <h3 className="mfp-section-title">Main Ingredient</h3>
                    <div className="mfp-options-grid">
                      {['All', 'Paneer', 'Cheese', 'Potato', 'Veggie', 'Mushroom', 'Corn'].map(ing => (
                        <button
                          key={ing}
                          className={`mfp-option-card ${filterIngredient === ing ? 'mfp-option-active' : ''}`}
                          onClick={() => setFilterIngredient(ing)}
                        >
                          <span className="mfp-option-label">{ing}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add-ons */}
                {activeMobileCategory === 'addons' && (
                  <div className="mfp-section">
                    <h3 className="mfp-section-title">Add-ons</h3>
                    <div className="mfp-options-grid">
                      {['All', 'Fries + Coke', 'Extra Cheese', 'Guacamole'].map(addon => (
                        <button
                          key={addon}
                          className={`mfp-option-card ${filterAddons === addon ? 'mfp-option-active' : ''}`}
                          onClick={() => setFilterAddons(addon)}
                        >
                          <span className="mfp-option-label">{addon}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Footer */}
            <div className="mfp-footer">
              <button className="mfp-close-btn" onClick={() => setShowMobileFilterPanel(false)}>Close</button>
              <button className="mfp-results-btn" onClick={() => setShowMobileFilterPanel(false)}>Show results</button>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic Sticky Bottom Cart Bar */}
      <style>{`
        .sticky-bottom-cart-bar {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%) translateY(130%);
          width: 92%;
          max-width: 480px;
          background: rgba(45, 63, 118, 0.96);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 25000;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
          opacity: 0;
          pointer-events: none;
        }
        .sticky-bottom-cart-bar.visible {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
          pointer-events: auto;
        }
        .catalogue-category-tabs::-webkit-scrollbar {
          display: none;
        }
        .address-sheet-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 20000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: fadeInOverlay 0.3s ease-out;
        }
        .address-sheet-panel {
          width: 100%;
          max-width: 640px;
          background: #ffffff;
          border-top-left-radius: 24px !important;
          border-top-right-radius: 24px !important;
          border-bottom-left-radius: 0px !important;
          border-bottom-right-radius: 0px !important;
          margin-top: auto !important;
          margin-bottom: 0px !important;
          margin-left: auto !important;
          margin-right: auto !important;
          box-shadow: 0 -10px 30px rgba(0,0,0,0.15);
          max-height: 85vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          animation: slideUpPanel 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (min-width: 768px) {
          .address-sheet-overlay {
            align-items: center !important;
          }
          .address-sheet-panel {
            margin: auto !important;
            border-bottom-left-radius: 24px !important;
            border-bottom-right-radius: 24px !important;
            max-height: 90vh;
            animation: fadeInModal 0.3s ease-out !important;
          }
        }
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .address-sheet-header {
          padding: 18px 20px;
          border-bottom: 1px solid rgba(45, 63, 118, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
        }
        .address-sheet-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
          color: var(--text-dark);
        }
        .address-sheet-close {
          background: none;
          border: none;
          font-size: 20px;
          color: rgba(45, 63, 118, 0.5);
          cursor: pointer;
        }
        .address-sheet-body {
          padding: 20px;
          overflow-y: auto;
          flex-grow: 1;
        }
        .address-sheet-action-btn {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: none;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s;
          background: rgba(76, 166, 135, 0.08);
          color: #4CA687;
        }
        .address-sheet-action-btn:hover {
          background: rgba(76, 166, 135, 0.15);
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpPanel {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .floating-track-order-btn {
          position: fixed;
          bottom: 140px;
          right: 24px;
          background: linear-gradient(135deg, #fc8019 0%, #e25c38 100%);
          color: #fff;
          padding: 12px 20px;
          border-radius: 50px;
          box-shadow: 0 8px 24px rgba(252,128,25,0.4);
          cursor: pointer;
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          font-size: 13px;
          border: 2px solid #ffffff;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .floating-track-order-btn:hover {
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .floating-track-order-btn {
            bottom: 120px;
            right: 16px;
            padding: 10px 16px;
            font-size: 12px;
          }
        }
      `}</style>
      <div className={`sticky-bottom-cart-bar ${cart.length > 0 && !showCartDrawer && diningMode ? 'visible' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Overlapping circular thumbnails of the first 3 items */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {cart.slice(0, 3).map((item, index) => (
              <img
                key={index}
                src={item.image}
                alt={item.name}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #ffffff',
                  marginLeft: index > 0 ? '-10px' : '0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                  zIndex: 3 - index,
                  backgroundColor: '#ffffff'
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700' }}>
              {cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'Item' : 'Items'} Added
            </span>
            <span style={{ color: '#4CA687', fontSize: '14px', fontWeight: '800' }}>
              ₹{cart.reduce((sum, item) => sum + item.cost * item.quantity, 0).toFixed(0)}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            setShowCartDrawer(true);
            setCheckoutStep('cart');
          }}
          style={{
            backgroundColor: '#4CA687',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'background 0.2s, transform 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#389172'; e.currentTarget.style.transform = 'scale(1.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4CA687'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Continue
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Address Selection Bottom Sheet */}
      {showAddressSheet && (
        <div className="address-sheet-overlay" onClick={() => setShowAddressSheet(false)}>
          <div className="address-sheet-panel" onClick={e => e.stopPropagation()}>
            <div className="address-sheet-header">
              <h3>Select Delivery Address</h3>
              <button className="address-sheet-close" onClick={() => setShowAddressSheet(false)}>✕</button>
            </div>

            <div className="address-sheet-body">
              <button
                className="address-sheet-action-btn"
                onClick={() => {
                  setShowAddressSheet(false);
                  setShowGoogleLocationPicker(true);
                }}
              >
                🎯 Detect Current Location via Google Maps (GPS)
              </button>

              <button
                className="address-sheet-action-btn"
                style={{ background: 'none', color: '#4CA687', border: '1px dashed #4CA687', marginTop: '10px' }}
                onClick={() => {
                  setAddrFormError('');
                  setShowAddAddressSheet(true);
                }}
              >
                ➕ Add New Address
              </button>

              <div className="saved-addresses-list" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'rgba(45, 63, 118, 0.6)' }}>Saved Addresses</h4>

                {savedAddresses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: 'rgba(45, 63, 118, 0.4)' }}>
                    <span style={{ fontSize: '32px' }}>📍</span>
                    <h5 style={{ margin: '8px 0 2px 0', fontWeight: '700' }}>No Address Found</h5>
                    <p style={{ margin: 0, fontSize: '12px' }}>Please add a delivery address.</p>
                    <button
                      onClick={() => {
                        setAddrFormError('');
                        setShowAddAddressSheet(true);
                      }}
                      style={{ marginTop: '12px', background: '#4CA687', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Add New Address
                    </button>
                  </div>
                ) : (
                  savedAddresses.map(addr => {
                    const addrId = addr.id || addr._id;
                    const isSelected = selectedAddressId === addrId;
                    const fullAddressStr = `${addr.houseNo || ''}, ${addr.building || ''}, ${addr.landmark ? addr.landmark + ', ' : ''}${addr.area || ''}, ${addr.city || ''} - ${addr.pincode || ''}`;
                    return (
                      <div
                        key={addrId}
                        onClick={() => {
                          setSelectedAddressId(addrId);
                          setUserLocation(fullAddressStr);
                          setShowAddressSheet(false);
                        }}
                        style={{
                          padding: '14px',
                          border: isSelected ? '2px solid #4CA687' : '1px solid rgba(45, 63, 118, 0.1)',
                          borderRadius: '14px',
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(76, 166, 135, 0.03)' : '#ffffff',
                          transition: 'border 0.2s, background 0.2s',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <h5 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'var(--text-dark)' }}>
                            {addr.name || 'Delivery Address'}
                          </h5>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <span style={{
                              fontSize: '9px',
                              fontWeight: '700',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: addr.type === 'Home' ? 'rgba(76, 166, 135, 0.1)' : 'rgba(45, 63, 118, 0.08)',
                              color: addr.type === 'Home' ? '#4CA687' : 'rgba(45, 63, 118, 0.7)',
                              textTransform: 'uppercase'
                            }}>
                              {addr.type === 'Home' ? '🏠 Home' : addr.type === 'Work' ? '💼 Work' : '📍 Other'}
                            </span>
                            <button
                              onClick={(e) => handleEditAddressClick(addr, e)}
                              title="Edit address"
                              style={{ background: 'none', border: '1px solid rgba(45, 63, 118, 0.15)', borderRadius: '6px', padding: '2px 6px', fontSize: '10px', fontWeight: '700', color: '#3b82f6', cursor: 'pointer' }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={(e) => handleDeleteAddressClick(addr, e)}
                              title="Delete address"
                              style={{ background: 'none', border: '1px solid rgba(231, 76, 60, 0.2)', borderRadius: '6px', padding: '2px 6px', fontSize: '10px', fontWeight: '700', color: '#e74c3c', cursor: 'pointer' }}
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                        <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: 'rgba(45, 63, 118, 0.7)', lineHeight: '1.4' }}>
                          {fullAddressStr}
                        </p>
                        <span style={{ fontSize: '11px', color: 'rgba(45, 63, 118, 0.5)' }}>
                          📞 {addr.phone}
                        </span>
                        {isSelected && (
                          <div style={{
                            position: 'absolute',
                            bottom: '12px',
                            right: '12px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: '#4CA687',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New / Edit Address Bottom Sheet */}
      {showAddAddressSheet && (
        <div className="address-sheet-overlay" style={{ zIndex: 20001 }} onClick={() => setShowAddAddressSheet(false)}>
          <div className="address-sheet-panel" style={{ maxHeight: '90%' }} onClick={e => e.stopPropagation()}>
            <div className="address-sheet-header">
              <h3>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
              <button className="address-sheet-close" onClick={() => { setShowAddAddressSheet(false); setEditingAddressId(null); }}>✕</button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newAddrName.trim() || !newAddrPhone.trim() || !newAddrHouse.trim() || !newAddrBuilding.trim() || !newAddrArea.trim() || !newAddrCity.trim() || !newAddrPincode.trim()) {
                  setAddrFormError('Please fill in all required fields.');
                  return;
                }
                if (!/^\d{10}$/.test(newAddrPhone.trim())) {
                  setAddrFormError('Please enter a valid 10-digit phone number.');
                  return;
                }
                if (!/^\d{6}$/.test(newAddrPincode.trim())) {
                  setAddrFormError('Please enter a valid 6-digit pincode.');
                  return;
                }

                const userId = getEffectiveUserId()
                const addressPayload = {
                  userId,
                  name: newAddrName,
                  fullName: newAddrName,
                  phone: newAddrPhone,
                  houseNo: newAddrHouse,
                  building: newAddrBuilding,
                  landmark: newAddrLandmark,
                  area: newAddrArea,
                  city: newAddrCity,
                  pincode: newAddrPincode,
                  type: newAddrType
                }

                try {
                  let url = `http://localhost:45000/api/users/address/${userId}`
                  let method = 'POST'

                  if (editingAddressId) {
                    url = `http://localhost:45000/api/users/address/${editingAddressId}?userId=${userId}`
                    method = 'PUT'
                  }

                  const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(addressPayload)
                  })
                  const data = await res.json()

                  if (data.success && Array.isArray(data.data)) {
                    setSavedAddresses(data.data)
                    const activeAddr = data.data.find(a => (a.id === editingAddressId || a._id === editingAddressId)) || data.data[0]
                    if (activeAddr) {
                      const fullAddrStr = `${activeAddr.houseNo || ''}, ${activeAddr.building || ''}, ${activeAddr.landmark ? activeAddr.landmark + ', ' : ''}${activeAddr.area || ''}, ${activeAddr.city || ''} - ${activeAddr.pincode || ''}`
                      setSelectedAddressId(activeAddr.id || activeAddr._id)
                      setUserLocation(fullAddrStr)
                    }
                  }
                } catch (err) {
                  console.error('Error saving address API:', err)
                }

                // Reset form fields
                setEditingAddressId(null)
                setNewAddrName('');
                setNewAddrPhone('');
                setNewAddrHouse('');
                setNewAddrBuilding('');
                setNewAddrLandmark('');
                setNewAddrArea('');
                setNewAddrCity('');
                setNewAddrPincode('');
                setNewAddrType('Home');
                setAddrFormError('');

                // Close bottom sheets
                setShowAddAddressSheet(false);
                setShowAddressSheet(false);
              }}
              style={{ padding: '16px 20px 30px 20px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}
            >
              {addrFormError && (
                <div style={{ color: '#e74c3c', fontSize: '12px', fontWeight: '600', padding: '8px 12px', background: 'rgba(231, 76, 60, 0.05)', borderRadius: '8px', border: '1px solid rgba(231, 76, 60, 0.1)' }}>
                  ⚠️ {addrFormError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(45, 63, 118, 0.6)' }}>Receiver Name *</label>
                  <input type="text" value={newAddrName} onChange={e => setNewAddrName(e.target.value)} placeholder="e.g. Jane Doe" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(45, 63, 118, 0.15)', fontSize: '12px', outline: 'none' }} required />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(45, 63, 118, 0.6)' }}>Phone Number *</label>
                  <input type="tel" value={newAddrPhone} onChange={e => setNewAddrPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit number" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(45, 63, 118, 0.15)', fontSize: '12px', outline: 'none' }} required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(45, 63, 118, 0.6)' }}>House / Flat Number *</label>
                  <input type="text" value={newAddrHouse} onChange={e => setNewAddrHouse(e.target.value)} placeholder="e.g. Flat 402" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(45, 63, 118, 0.15)', fontSize: '12px', outline: 'none' }} required />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(45, 63, 118, 0.6)' }}>Apartment / Building *</label>
                  <input type="text" value={newAddrBuilding} onChange={e => setNewAddrBuilding(e.target.value)} placeholder="e.g. Royal Residency" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(45, 63, 118, 0.15)', fontSize: '12px', outline: 'none' }} required />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(45, 63, 118, 0.6)' }}>Landmark (optional)</label>
                <input type="text" value={newAddrLandmark} onChange={e => setNewAddrLandmark(e.target.value)} placeholder="e.g. Near Central Park" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(45, 63, 118, 0.15)', fontSize: '12px', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(45, 63, 118, 0.6)' }}>Area / Locality *</label>
                  <input type="text" value={newAddrArea} onChange={e => setNewAddrArea(e.target.value)} placeholder="e.g. HSR Layout" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(45, 63, 118, 0.15)', fontSize: '12px', outline: 'none' }} required />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(45, 63, 118, 0.6)' }}>Pincode *</label>
                  <input type="text" value={newAddrPincode} onChange={e => setNewAddrPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6 digits" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(45, 63, 118, 0.15)', fontSize: '12px', outline: 'none' }} required />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(45, 63, 118, 0.6)' }}>City *</label>
                <input type="text" value={newAddrCity} onChange={e => setNewAddrCity(e.target.value)} placeholder="e.g. Bengaluru" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(45, 63, 118, 0.15)', fontSize: '12px', outline: 'none' }} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(45, 63, 118, 0.6)' }}>Save As</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['Home', 'Work', 'Other'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAddrType(type)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        border: newAddrType === type ? '2px solid #4CA687' : '1px solid rgba(45, 63, 118, 0.15)',
                        background: newAddrType === type ? 'rgba(76, 166, 135, 0.05)' : '#ffffff',
                        color: newAddrType === type ? '#4CA687' : 'rgba(45, 63, 118, 0.7)',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {type === 'Home' ? '🏠 Home' : type === 'Work' ? '💼 Work' : '📍 Other'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                style={{
                  background: '#4CA687',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mock QR Code Modal */}
      {showQrModal && (
        <div className="address-sheet-overlay" style={{ zIndex: 20002 }} onClick={() => setShowQrModal(false)}>
          <div className="address-sheet-panel" style={{ maxWidth: '360px', padding: '24px', alignItems: 'center', justifyContent: 'center', textAlign: 'center', margin: 'auto' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '800', color: 'var(--text-dark)' }}>Scan & Pay (Mock QR)</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: 'rgba(45, 63, 118, 0.6)' }}>Scan this code with any UPI app to complete payment simulation</p>
            <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '16px', border: '1px solid rgba(45, 63, 118, 0.08)', marginBottom: '15px', display: 'inline-block' }}>
              <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v3h-3v-3zm3 3h-3v3h3v-3zm-6-3h3v6h-3v-6zm3 3h3v3h-3v-3zM13 3h2v2h-2V3zm0 4h2v2h-2V7zm4 4h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 4h2v2h-2v-2z" />
              </svg>
            </div>
            <button
              onClick={() => {
                setUpiAddress('mockpay@avantika');
                setShowQrModal(false);
              }}
              style={{ width: '100%', background: '#4CA687', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
            >
              Simulate Successful Scan
            </button>
          </div>
        </div>
      )}

      {/* Profile Dashboard / Account Overlay Page (Zomato-style Full Page Overlay) */}
      <ProfilePage
        showProfilePage={showProfilePage}
        setShowProfilePage={setShowProfilePage}
        profileActiveTab={profileActiveTab}
        setProfileActiveTab={setProfileActiveTab}
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
        profileName={profileName}
        setProfileName={setProfileName}
        profileMobile={profileMobile}
        setProfileMobile={setProfileMobile}
        profileEmail={profileEmail}
        setProfileEmail={setProfileEmail}
        profileDob={profileDob}
        setProfileDob={setProfileDob}
        profileAnniversary={profileAnniversary}
        setProfileAnniversary={setProfileAnniversary}
        profileGender={profileGender}
        setProfileGender={setProfileGender}
        showGenderDropdown={showGenderDropdown}
        setShowGenderDropdown={setShowGenderDropdown}
        orderSearchQuery={orderSearchQuery}
        setOrderSearchQuery={setOrderSearchQuery}
        orderHistory={orderHistory}
        savedAddresses={savedAddresses}
        setSavedAddresses={setSavedAddresses}
        selectedAddressId={selectedAddressId}
        setSelectedAddressId={setSelectedAddressId}
        setUserLocation={setUserLocation}
        handleLogout={handleLogout}
        filterVeg={filterVeg}
        setFilterVeg={setFilterVeg}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onTrackOrder={(ord) => setActiveTrackingOrder(ord)}
      />

      {/* Floating Menu Button (Zomato Style) */}
      {diningMode && (
        <FloatingMenuButton
          allFoods={allFoods}
          recommendedFoods={recommendedFoods}
          spotlightFoods={spotlightFoods}
          selectedCategory={selectedCatalogueCategory}
          onSelectCategory={setSelectedCatalogueCategory}
          setShowAllProductsPage={setShowAllProductsPage}
          cartVisible={cart.length > 0 && !showCartDrawer}
        />
      )}

      {/* Product Customization bottom sheet modal */}
      {selectedProductForCustomization && (
        <ProductCustomizationModal
          product={selectedProductForCustomization}
          onClose={() => setSelectedProductForCustomization(null)}
          onAddCustomized={(customizedProduct) => {
            addToCart(customizedProduct, customizedProduct.quantity, customizedProduct.customizations)
          }}
        />
      )}

      {/* Live Order Tracking Modal with Google Maps */}
      {activeTrackingOrder && (
        <OrderTrackingModal
          order={typeof activeTrackingOrder === 'object' ? activeTrackingOrder : { orderId: activeTrackingOrder }}
          onClose={() => setActiveTrackingOrder(null)}
        />
      )}

      {/* Google Location & GPS Picker Modal */}
      <GoogleLocationPickerModal
        isOpen={showGoogleLocationPicker}
        onClose={() => setShowGoogleLocationPicker(false)}
        onSelectLocation={(selectedLoc) => {
          setUserLocation(selectedLoc.address);
          setTempLocation(selectedLoc.address);
          setSelectedAddressId('gps_google');
        }}
      />
      {/* Floating Track Order Button */}
      {isLoggedIn && lastTrackedOrder && !activeTrackingOrder && (
        <div
          className="floating-track-order-btn"
          onClick={() => setActiveTrackingOrder(lastTrackedOrder)}
        >
          🛵 Track Active Order
        </div>
      )}
    </>
  )
}

export default App
