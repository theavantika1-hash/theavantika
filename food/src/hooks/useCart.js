import { useState, useEffect } from 'react'

const getEffectiveUserId = () => {
  let savedUser = null
  try {
    const raw = localStorage.getItem('avantika_user')
    if (raw) savedUser = JSON.parse(raw)
  } catch (e) {}

  if (savedUser && (savedUser._id || savedUser.id)) {
    return savedUser._id || savedUser.id
  }

  let guestId = localStorage.getItem('avantika_guest_id')
  if (!guestId) {
    guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9)
    localStorage.setItem('avantika_guest_id', guestId)
  }
  return guestId
}

const formatBackendCartItems = (backendCart) => {
  if (!backendCart || !Array.isArray(backendCart.items)) return []

  return backendCart.items.map(item => {
    let crustText = item.choiceOfCrust?.name ? `Choice: ${item.choiceOfCrust.name}` : ''
    let toppingsText = Array.isArray(item.extraToppings) && item.extraToppings.length > 0
      ? `Toppings: ${item.extraToppings.map(t => t.name).join(', ')}`
      : ''
    let customizationsArr = [crustText, toppingsText, item.specialInstructions].filter(Boolean)
    let customizationsSummary = item.customizations || customizationsArr.join(' | ')

    return {
      _id: item._id,
      itemId: item._id,
      id: item.foodId || item._id,
      name: item.foodName,
      cost: item.itemTotalPrice / (item.quantity || 1),
      price: `₹${item.foodPrice}`,
      image: item.foodImage || '',
      quantity: item.quantity,
      customizations: customizationsSummary,
      choiceOfCrust: item.choiceOfCrust,
      extraToppings: item.extraToppings,
      specialInstructions: item.specialInstructions
    }
  })
}

export const useCart = (isLoggedIn, setShowAuthModal, setAuthMode, diningMode) => {
  const [cart, setCart] = useState([])
  const [showCartDrawer, setShowCartDrawer] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState('cart') // 'cart', 'payment', 'success'
  const [paymentMode, setPaymentMode] = useState('') // 'upi', 'card', 'cod'
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [cookingRequest, setCookingRequest] = useState('')
  const [editingAddress, setEditingAddress] = useState(false)
  const [inlineAddressInput, setInlineAddressInput] = useState('')
  const [showCouponSection, setShowCouponSection] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState('')

  // Load user cart from backend API on mount & auth / diningMode change
  useEffect(() => {
    if (diningMode === 'delivery' && !isLoggedIn) {
      setCart([])
      return
    }

    const userId = getEffectiveUserId()
    fetch(`http://localhost:45000/api/cart/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const items = formatBackendCartItems(data.data)
          setCart(items)
        }
      })
      .catch(err => console.log('Backend fetch cart info:', err))
  }, [isLoggedIn, diningMode])

  const addToCart = async (product, quantity = 1, customizations = '') => {
    const isGuestFlow = diningMode === 'dine-in' || diningMode === 'pickup'
    if (!isLoggedIn && !isGuestFlow) {
      setShowAuthModal(true)
      setAuthMode('login')
      return
    }

    const userId = getEffectiveUserId()
    const foodId = product.id || product._id || product.foodId

    let choiceOfCrust = { name: "", price: 0 }
    let extraToppings = []

    if (product.customDetails) {
      Object.keys(product.customDetails).forEach(key => {
        const val = product.customDetails[key]
        if (typeof val === 'string' && val) {
          choiceOfCrust = { name: val, price: 0 }
        } else if (Array.isArray(val)) {
          val.forEach(tName => {
            extraToppings.push({ name: tName, price: 0 })
          })
        }
      })
    } else if (customizations) {
      choiceOfCrust = { name: customizations, price: 0 }
    }

    try {
      const response = await fetch('http://localhost:45000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          foodId,
          foodName: product.name || product.foodName,
          foodPrice: product.cost || parseFloat(String(product.price || '0').replace(/[^\d.]/g, '')) || 0,
          foodImage: product.image || product.foodImage || '',
          choiceOfCrust,
          extraToppings,
          quantity,
          specialInstructions: product.specialInstructions || ''
        })
      })
      const resData = await response.json()
      if (resData.success && resData.data) {
        const items = formatBackendCartItems(resData.data)
        setCart(items)
      } else {
        throw new Error(resData.message || 'Failed to add')
      }
    } catch (err) {
      console.error('API addToCart error:', err)
      setCart((prevCart) => {
        const existingIdx = prevCart.findIndex(item => 
          item.name === product.name && (item.customizations || '') === (customizations || '')
        )
        if (existingIdx > -1) {
          const newCart = [...prevCart]
          newCart[existingIdx].quantity += quantity
          return newCart
        }
        const costVal = product.cost || parseFloat(String(product.price || '$9.99').replace(/[^\d.]/g, '')) || 9.99
        return [...prevCart, { ...product, cost: costVal, quantity, customizations }]
      })
    }
  }

  const updateCartQuantity = async (name, delta, customizations) => {
    const userId = getEffectiveUserId()
    const targetItem = cart.find(item => item.name === name && (customizations === undefined || (item.customizations || '') === (customizations || '')))
    
    if (targetItem && (targetItem._id || targetItem.itemId)) {
      const itemId = targetItem._id || targetItem.itemId
      const newQty = targetItem.quantity + delta
      try {
        const response = await fetch(`http://localhost:45000/api/cart/item/${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, quantity: newQty })
        })
        const resData = await response.json()
        if (resData.success && resData.data) {
          const items = formatBackendCartItems(resData.data)
          setCart(items)
          return
        }
      } catch (err) {
        console.error('API updateCartQuantity error:', err)
      }
    }

    setCart((prevCart) => {
      let matched = false
      return prevCart.map(item => {
        if (item.name === name && (customizations === undefined || (item.customizations || '') === (customizations || '')) && !matched) {
          matched = true
          const newQty = item.quantity + delta
          return newQty > 0 ? { ...item, quantity: newQty } : null
        }
        return item
      }).filter(Boolean)
    })
  }

  const removeFromCart = async (name, customizations = '') => {
    const userId = getEffectiveUserId()
    const targetItem = cart.find(item => item.name === name && (item.customizations || '') === (customizations || ''))

    if (targetItem && (targetItem._id || targetItem.itemId)) {
      const itemId = targetItem._id || targetItem.itemId
      try {
        const response = await fetch(`http://localhost:45000/api/cart/item/${itemId}?userId=${userId}`, {
          method: 'DELETE'
        })
        const resData = await response.json()
        if (resData.success && resData.data) {
          const items = formatBackendCartItems(resData.data)
          setCart(items)
          return
        }
      } catch (err) {
        console.error('API removeFromCart error:', err)
      }
    }

    setCart((prevCart) => prevCart.filter(item => 
      !(item.name === name && (item.customizations || '') === (customizations || ''))
    ))
  }

  const clearCart = async () => {
    const userId = getEffectiveUserId()
    try {
      await fetch(`http://localhost:45000/api/cart/clear/${userId}`, {
        method: 'DELETE'
      })
    } catch (err) {
      console.error('API clearCart error:', err)
    }
    setCart([])
  }

  return {
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
  }
}

