import React, { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiSearch, FiCalendar, FiBox, FiTrendingUp, FiBookOpen, FiSettings, FiCheck } from 'react-icons/fi'
import { FaRupeeSign } from 'react-icons/fa'

function InventoryPage() {
  const [activeSubTab, setActiveSubTab] = useState('stock') // stock, recipes

  // State lists
  const [inventoryList, setInventoryList] = useState([])
  const [recipesList, setRecipesList] = useState([])
  const [menuItems, setMenuItems] = useState([])
  
  // Loading & notification states
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)

  // Form states for Add Stock
  const [name, setName] = useState('')
  const [totalQty, setTotalQty] = useState('')
  const [unit, setUnit] = useState('kg')
  const [price, setPrice] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])

  // Form states for Recipe Mapping
  const [selectedFood, setSelectedFood] = useState('')
  const [recipeIngredients, setRecipeIngredients] = useState([{ inventoryName: '', qtyNeeded: '' }])

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('all') // all, today, yesterday, older

  const showMsg = (msg, type = 'success') => {
    setMessage({ text: msg, type })
    setTimeout(() => setMessage(null), 3000)
  }

  // Fetch Inventory, Recipes and Menu Items
  const fetchData = async () => {
    try {
      setLoading(true)
      
      // 1. Fetch Inventory
      const invRes = await fetch('http://localhost:45000/api/inventory')
      const invData = await invRes.json()
      if (invData.success) {
        setInventoryList(invData.data)
      }

      // 2. Fetch Recipes
      const recRes = await fetch('http://localhost:45000/api/inventory/recipes')
      const recData = await recRes.json()
      if (recData.success) {
        setRecipesList(recData.data)
      }

      // 3. Fetch Menu Items (from food api)
      const foodRes = await fetch('http://localhost:45000/api/foods')
      const foodData = await foodRes.json()
      if (foodData.success && Array.isArray(foodData.data)) {
        setMenuItems(foodData.data)
      }

      setLoading(false)
    } catch (err) {
      console.error('Error fetching inventory/recipe details:', err)
      showMsg('Failed to load data from backend server.', 'danger')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Add Item to Inventory
  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!name.trim() || !totalQty || !price || !date) {
      showMsg('Please fill out all fields', 'warning')
      return
    }

    try {
      const res = await fetch('http://localhost:45000/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          totalQty: parseFloat(totalQty),
          unit,
          price: parseFloat(price),
          date,
          addedBy: 'Admin'
        })
      })

      const data = await res.json()
      if (data.success) {
        showMsg(data.message || 'Inventory item recorded successfully!')
        setName('')
        setTotalQty('')
        setPrice('')
        fetchData()
      } else {
        showMsg(data.message || 'Failed to add item.', 'warning')
      }
    } catch (err) {
      showMsg('Server communication failure.', 'danger')
    }
  }

  // Update Used Quantity (on blur or input finish)
  const handleBlurUsedQty = async (id, val, originalVal) => {
    const parsedVal = val === '' ? 0 : parseFloat(val)
    if (isNaN(parsedVal) || parsedVal === originalVal) return

    try {
      const res = await fetch(`http://localhost:45000/api/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usedQty: parsedVal })
      })

      const data = await res.json()
      if (data.success) {
        showMsg('Stock usage updated.')
        fetchData()
      }
    } catch (err) {
      showMsg('Failed to update used quantity on server.', 'danger')
    }
  }

  // Delete Item from Inventory
  const handleDeleteItem = async (id) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) return

    try {
      const res = await fetch(`http://localhost:45000/api/inventory/${id}`, {
        method: 'DELETE'
      })

      const data = await res.json()
      if (data.success) {
        showMsg('Inventory item deleted.')
        fetchData()
      }
    } catch (err) {
      showMsg('Failed to delete item.', 'danger')
    }
  }

  // Handle Recipe Form Row addition
  const addIngredientToRecipeForm = () => {
    setRecipeIngredients([...recipeIngredients, { inventoryName: '', qtyNeeded: '' }])
  }

  // Remove row from Recipe Form
  const removeIngredientFromRecipeForm = (index) => {
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index))
  }

  // Update Recipe Form rows
  const handleRecipeIngChange = (index, field, value) => {
    const updated = recipeIngredients.map((ing, i) => {
      if (i === index) {
        return { ...ing, [field]: value }
      }
      return ing
    })
    setRecipeIngredients(updated)
  }

  // Save Recipe Mapping
  const handleSaveRecipe = async (e) => {
    e.preventDefault()
    if (!selectedFood) {
      showMsg('Please select a food dish.', 'warning')
      return
    }

    const validIngs = recipeIngredients.filter(ing => ing.inventoryName && ing.qtyNeeded)
    if (validIngs.length === 0) {
      showMsg('Please add at least one valid ingredient with quantity.', 'warning')
      return
    }

    try {
      const res = await fetch('http://localhost:45000/api/inventory/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName: selectedFood,
          ingredients: validIngs.map(ing => ({
            inventoryName: ing.inventoryName,
            qtyNeeded: parseFloat(ing.qtyNeeded)
          }))
        })
      })

      const data = await res.json()
      if (data.success) {
        showMsg('Recipe mapping saved successfully!')
        setSelectedFood('')
        setRecipeIngredients([{ inventoryName: '', qtyNeeded: '' }])
        fetchData()
      } else {
        showMsg(data.message || 'Failed to save recipe.', 'warning')
      }
    } catch (err) {
      showMsg('Failed to save recipe to server.', 'danger')
    }
  }

  // Date Filters
  const getTodayDateString = () => new Date().toISOString().split('T')[0]
  const getYesterdayDateString = () => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d.toISOString().split('T')[0]
  }

  const filteredList = inventoryList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    let matchesDate = true
    const todayStr = getTodayDateString()
    const yesterdayStr = getYesterdayDateString()

    if (dateFilter === 'today') {
      matchesDate = item.date === todayStr
    } else if (dateFilter === 'yesterday') {
      matchesDate = item.date === yesterdayStr
    } else if (dateFilter === 'older') {
      matchesDate = item.date !== todayStr && item.date !== yesterdayStr
    }

    return matchesSearch && matchesDate
  })

  // Stat Calculations (Dynamic)
  const totalCost = filteredList.reduce((sum, item) => sum + item.price, 0)
  
  const totalUsedValue = filteredList.reduce((sum, item) => {
    const unitPrice = item.price / item.totalQty
    return sum + (item.usedQty * unitPrice)
  }, 0)

  const totalRemainingValue = filteredList.reduce((sum, item) => {
    const unitPrice = item.price / item.totalQty
    const remaining = Math.max(0, item.totalQty - item.usedQty)
    return sum + (remaining * unitPrice)
  }, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Toast Notification */}
      {message && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 10000,
          background: message.type === 'danger' ? '#f8d7da' : (message.type === 'warning' ? '#fff3cd' : '#d1e7dd'),
          color: message.type === 'danger' ? '#842029' : (message.type === 'warning' ? '#664d03' : '#0f5132'),
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          fontWeight: '600',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FiCheck />
          <span>{message.text}</span>
        </div>
      )}

      {/* Page Title & Navigation Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Live Inventory & Recipes</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Deduct stock values automatically on customer orders and map ingredients to dishes.</p>
        </div>

        {/* Sub-tabs selector */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveSubTab('stock')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === 'stock' ? 'var(--accent-color)' : 'transparent',
              color: activeSubTab === 'stock' ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
          >
            <FiBox style={{ marginRight: '6px', display: 'inline' }} /> Stock Records
          </button>
          <button
            onClick={() => setActiveSubTab('recipes')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === 'recipes' ? 'var(--accent-color)' : 'transparent',
              color: activeSubTab === 'recipes' ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
          >
            <FiBookOpen style={{ marginRight: '6px', display: 'inline' }} /> Recipe Mapping
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div className="splash-loader" style={{ margin: '0 auto 15px auto', width: '40px', height: '40px' }}>
            <div className="splash-progress"></div>
          </div>
          Connecting to MongoDB Database...
        </div>
      ) : activeSubTab === 'stock' ? (
        <>
          {/* Dynamic Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="grid-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3b82f6' }}>
                <FaRupeeSign size={24} />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Total Purchased Cost</p>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '4px 0 0 0', color: 'var(--text-primary)' }}>₹{Math.round(totalCost)}</h3>
              </div>
            </div>

            <div className="grid-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: '#ef4444' }}>
                <FaRupeeSign size={24} />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Used Stock Value</p>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '4px 0 0 0', color: '#ef4444' }}>₹{Math.round(totalUsedValue)}</h3>
              </div>
            </div>

            <div className="grid-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981' }}>
                <FaRupeeSign size={24} />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Remaining / Available Value</p>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '4px 0 0 0', color: '#10b981' }}>₹{Math.round(totalRemainingValue)}</h3>
              </div>
            </div>
          </div>

          {/* Stock inventory content grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
            {/* Left Side: Table */}
            <div className="grid-card" style={{ gap: '16px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Stock & Usage Tracker</h2>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <FiSearch style={{ position: 'absolute', left: '10px', color: 'var(--text-secondary)' }} />
                    <input
                      type="text"
                      placeholder="Search ingredient..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{
                        padding: '6px 12px 6px 30px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <select
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="older">Older</option>
                  </select>
                </div>
              </div>

              {/* Table Container */}
              <div className="table-container" style={{ overflowY: 'auto', maxHeight: '480px' }}>
                <table className="stream-table">
                  <thead>
                    <tr>
                      <th>Ingredient</th>
                      <th>Total Stock</th>
                      <th>Price Paid</th>
                      <th>Used Stock (Editable)</th>
                      <th>Used Value</th>
                      <th>Available / Sold</th>
                      <th>Available Value</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                          No inventory records match your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredList.map((item) => {
                        const pricePerUnit = item.price / item.totalQty
                        const remainingQty = Math.max(0, item.totalQty - item.usedQty)
                        const usedVal = Math.round(item.usedQty * pricePerUnit)
                        const remainingVal = Math.round(remainingQty * pricePerUnit)

                        return (
                          <tr key={item._id || item.id}>
                            <td className="run-name" style={{ fontWeight: '700' }}>{item.name}</td>
                            <td>
                              <span className="badge active-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                {item.totalQty} {item.unit}
                              </span>
                            </td>
                            <td style={{ fontWeight: '700' }}>₹{item.price}</td>
                            <td>
                              {/* Editable Input on Blur */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <input
                                  type="number"
                                  min="0"
                                  max={item.totalQty}
                                  step="any"
                                  defaultValue={item.usedQty}
                                  onBlur={(e) => handleBlurUsedQty(item._id, e.target.value, item.usedQty)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.target.blur()
                                    }
                                  }}
                                  style={{
                                    width: '60px',
                                    padding: '4px 6px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-color)',
                                    background: 'rgba(255,255,255,0.08)',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    fontSize: '12px'
                                  }}
                                />
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.unit}</span>
                              </div>
                            </td>
                            <td style={{ color: '#ef4444', fontWeight: '600' }}>₹{usedVal}</td>
                            <td>
                              <span className="badge active-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                {remainingQty.toFixed(1)} {item.unit}
                              </span>
                            </td>
                            <td style={{ color: '#10b981', fontWeight: '600' }}>₹{remainingVal}</td>
                            <td>
                              <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>{item.date}</span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                onClick={() => handleDeleteItem(item._id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  borderRadius: '6px'
                                }}
                                title="Delete Record"
                              >
                                <FiTrash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Side: Add Entry Form */}
            <div className="grid-card" style={{ gap: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Add Stock Purchase</h2>
              <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>Ingredient Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Paneer (Raw), Tomatoes"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>Quantity</label>
                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      placeholder="e.g. 5"
                      value={totalQty}
                      onChange={e => setTotalQty(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>Unit</label>
                    <select
                      value={unit}
                      onChange={e => setUnit(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="kg">kg</option>
                      <option value="Litre">Litre</option>
                      <option value="pcs">pcs</option>
                      <option value="boxes">boxes</option>
                      <option value="g">gram</option>
                      <option value="ml">ml</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>Total Cost Paid (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 350"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>Arrival Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-yellow" style={{ width: '100%', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <FiPlus />
                  <span>Record Purchase</span>
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
        /* Tab 2: Recipe Mapping */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
          {/* Left Side: Recipe mapping list */}
          <div className="grid-card" style={{ gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Existing Recipe Formulas</h2>
            <div className="table-container" style={{ overflowY: 'auto', maxHeight: '500px' }}>
              <table className="stream-table">
                <thead>
                  <tr>
                    <th>Food Dish Name</th>
                    <th>Ingredients Required</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {recipesList.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                        No recipe mappings configured yet. Configure recipe on the right!
                      </td>
                    </tr>
                  ) : (
                    recipesList.map((recipe) => (
                      <tr key={recipe._id}>
                        <td className="run-name" style={{ fontWeight: '800' }}>{recipe.foodName}</td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {recipe.ingredients.map((ing, i) => {
                              // Find unit
                              const matchedInv = inventoryList.find(item => item.name === ing.inventoryName)
                              const unitStr = matchedInv ? matchedInv.unit : 'units'
                              return (
                                <span key={i} className="badge active-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                                  {ing.inventoryName}: {ing.qtyNeeded} {unitStr}
                                </span>
                              )
                            })}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {new Date(recipe.updatedAt).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side: Map Recipe Form */}
          <div className="grid-card" style={{ gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Configure recipe</h2>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Define ingredient consumption rates per customer order plate.</p>
            
            <form onSubmit={handleSaveRecipe} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Selected Food Item */}
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>Select Food Menu Dish</label>
                <select
                  value={selectedFood}
                  onChange={e => setSelectedFood(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">-- Choose Menu Dish --</option>
                  {menuItems.map((food) => (
                    <option key={food._id || food.foodName} value={food.foodName}>
                      {food.foodName} (₹{food.foodPrice})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Ingredients Rows */}
              <div>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Ingredients List</label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recipeIngredients.map((row, index) => {
                    const matchedInvItem = inventoryList.find(item => item.name === row.inventoryName)
                    const currentUnit = matchedInvItem ? matchedInvItem.unit : ''

                    return (
                      <div key={index} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {/* Ingredient Selector */}
                        <select
                          value={row.inventoryName}
                          onChange={e => handleRecipeIngChange(index, 'inventoryName', e.target.value)}
                          required
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        >
                          <option value="">-- Raw Stock Item --</option>
                          {inventoryList.map((item) => (
                            <option key={item._id} value={item.name}>{item.name}</option>
                          ))}
                        </select>

                        {/* Qty Needed Input */}
                        <div style={{ display: 'flex', alignItems: 'center', width: '100px', gap: '4px' }}>
                          <input
                            type="number"
                            min="0.001"
                            step="any"
                            placeholder="Qty"
                            value={row.qtyNeeded}
                            onChange={e => handleRecipeIngChange(index, 'qtyNeeded', e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              background: 'rgba(255,255,255,0.05)',
                              color: 'var(--text-primary)',
                              fontSize: '12px',
                              outline: 'none'
                            }}
                          />
                          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{currentUnit}</span>
                        </div>

                        {/* Delete Row button */}
                        {recipeIngredients.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeIngredientFromRecipeForm(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>

                <button
                  type="button"
                  onClick={addIngredientToRecipeForm}
                  style={{
                    marginTop: '10px',
                    background: 'transparent',
                    border: '1px dashed var(--border-color)',
                    color: 'var(--text-secondary)',
                    width: '100%',
                    padding: '6px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <FiPlus /> Add Ingredient Row
                </button>
              </div>

              <button type="submit" className="btn btn-primary btn-yellow" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <FiSettings />
                <span>Save recipe Formula</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryPage
