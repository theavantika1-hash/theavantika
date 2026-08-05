import React, { useState, useEffect, useRef } from 'react'

export const FloatingMenuButton = ({
  allFoods = [],
  recommendedFoods = [],
  spotlightFoods = [],
  selectedCategory,
  onSelectCategory,
  setShowAllProductsPage,
  cartVisible = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const popupRef = useRef(null)

  // Merge foods to get correct counts
  const combinedFoods = [...allFoods, ...recommendedFoods, ...spotlightFoods]

  // Count items per category
  const categoryCounts = combinedFoods.reduce((acc, food) => {
    const cat = food.category || 'Other'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  // List of categories
  const categoriesList = Object.keys(categoryCounts).filter(cat => cat !== 'Other')

  const handleCategoryClick = (categoryName) => {
    onSelectCategory(categoryName)
    setShowAllProductsPage(true)
    setIsOpen(false)
  }

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={popupRef} style={{ position: 'fixed', bottom: cartVisible ? '110px' : '40px', right: '24px', zIndex: 26000, transition: 'bottom 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>

      {/* Dropdown Popover — opens above button */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 12px)',
            right: 0,
            width: '220px',
            background: '#ffffff',
            borderRadius: '18px',
            boxShadow: '0 20px 50px rgba(45, 63, 118, 0.18)',
            border: '1px solid rgba(45, 63, 118, 0.08)',
            overflow: 'hidden',
            transformOrigin: 'bottom right',
            animation: 'menuPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <style>{`
            @keyframes menuPopIn {
              from { opacity: 0; transform: scale(0.85) translateY(8px); }
              to   { opacity: 1; transform: scale(1)   translateY(0); }
            }
          `}</style>

          {/* Header */}
          <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid rgba(45, 63, 118, 0.06)' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#4CA687', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Select Category</span>
          </div>

          {/* All Products */}
          <div
            onClick={() => handleCategoryClick('All')}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 18px', cursor: 'pointer',
              background: selectedCategory === 'All' ? 'rgba(76, 166, 135, 0.08)' : 'transparent',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(76, 166, 135, 0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = selectedCategory === 'All' ? 'rgba(76, 166, 135, 0.08)' : 'transparent'}
          >
            <span style={{ fontSize: '14px', fontWeight: '600', color: selectedCategory === 'All' ? '#4CA687' : '#2D3F76' }}>All Products</span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(45,63,118,0.4)', background: 'rgba(45,63,118,0.06)', padding: '2px 7px', borderRadius: '20px' }}>{combinedFoods.length}</span>
          </div>

          {/* Categories list */}
          <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
            {categoriesList.map(cat => (
              <div
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 18px', cursor: 'pointer',
                  background: selectedCategory === cat ? 'rgba(76, 166, 135, 0.08)' : 'transparent',
                  transition: 'background 0.15s',
                  borderTop: '1px solid rgba(45, 63, 118, 0.04)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(76, 166, 135, 0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = selectedCategory === cat ? 'rgba(76, 166, 135, 0.08)' : 'transparent'}
              >
                <span style={{ fontSize: '14px', fontWeight: '600', color: selectedCategory === cat ? '#4CA687' : '#2D3F76' }}>{cat}</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(45,63,118,0.4)', background: 'rgba(45,63,118,0.06)', padding: '2px 7px', borderRadius: '20px' }}>{categoryCounts[cat]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Pill Button */}
      <button
        className="floating-menu-btn"
        style={{ position: 'static' }}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Open categories menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
        <span>Menu</span>
      </button>

    </div>
  )
}

export default FloatingMenuButton
