import React from 'react'

export const ExploreFullMenu = ({
  allFoods,
  recommendedFoods,
  spotlightFoods,
  selectedCatalogueCategory,
  setSelectedCatalogueCategory,
  showAllProductsPage,
  setShowAllProductsPage,
  cart = [],
  updateCartQuantity,
  onOpenCustomization
}) => {
  const combinedFoods = [...allFoods, ...recommendedFoods, ...spotlightFoods]

  return (
    <>
      {/* ===== DYNAMIC FULL RESTAURANT MENU SECTION ===== */}
      <section className="recommended-section dynamic-restaurant-menu">
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 769px) {
            .dynamic-restaurant-menu .menu-cards-container {
              display: grid !important;
              grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
              gap: 30px !important;
              width: 100% !important;
              transform: none !important;
            }
            .dynamic-restaurant-menu .menu-card-item {
              flex: none !important;
              width: 100% !important;
              max-width: 100% !important;
            }
          }
        `}} />
        <div className="section-header">
          <div className="title-area">
            <span className="section-subtitle">Delivering To You</span>
            <h2 className="section-title">Explore Our Full Menu</h2>
          </div>
        </div>

        <div className="foods-slider-container menu-slider-container">
          <div className="foods-slider menu-cards-container">
            {combinedFoods.map((food, idx) => {
              const cartItem = cart.find(item => item.name === food.name)
              const quantity = cartItem ? cartItem.quantity : 0
              return (
                <div key={idx} className="food-card-item menu-card-item">
                  <div className="food-card-img-wrap menu-card-img-wrap">
                    <img src={food.image} alt={food.name} />
                    <span className={`veg-nonveg-indicator ${food.isVeg ? 'veg' : 'nonveg'}`} title={food.isVeg ? 'Veg' : 'Non-Veg'}>
                      <span className="indicator-dot"></span>
                    </span>
                  </div>
                  <div className="food-card-info menu-card-info">
                    <div className="menu-card-header-row">
                      <h3 className="food-card-title menu-card-title">{food.name}</h3>
                      <div className="menu-card-rating">
                        <span>{food.rating || '4.2'}</span>
                        <span className="star-icon">★</span>
                      </div>
                    </div>
                    <div className="menu-card-meta-row">
                      <span className="menu-card-category">{food.category}</span>
                      <span className="menu-card-time">{food.time || '15'} mins</span>
                    </div>
                    <div className="menu-card-action-row">
                      <span className="menu-card-price">{food.price || `₹${food.cost}`}</span>
                      {quantity > 0 ? (
                        <div className="food-card-quantity-controls">
                          <button onClick={() => updateCartQuantity(food.name, -1)}>-</button>
                          <span className="qty-count">{quantity}</span>
                          <button onClick={() => updateCartQuantity(food.name, 1)}>+</button>
                        </div>
                      ) : (
                        <button className="food-card-add-btn menu-card-add-btn" onClick={() => onOpenCustomization(food)}>+ Add</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* All Products Full-Screen Page Modal */}
      {showAllProductsPage && (
        <div className="all-products-page-overlay">
          <div className="all-products-page-container">
            <header className="all-products-header">
              <div className="header-left">
                <span className="all-products-subtitle">Full Catalogue Menu</span>
                <h2 className="all-products-title">Our Food Collection</h2>
              </div>
              <button className="all-products-close-btn" onClick={() => setShowAllProductsPage(false)}>
                ✕ Close Menu
              </button>
            </header>

            {/* Category Filter Tabs Wrapper with Navigation Arrows */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => {
                  const el = document.querySelector('.catalogue-category-tabs');
                  if (el) el.scrollBy({ left: -220, behavior: 'smooth' });
                }}
                style={{
                  position: 'absolute',
                  left: '0',
                  zIndex: 10,
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(45, 63, 118, 0.15)',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(45, 63, 118, 0.12)',
                  fontSize: '12px',
                  color: 'var(--text-dark)'
                }}
              >
                ◀
              </button>

              <div
                className="catalogue-category-tabs"
                style={{ display: 'flex', gap: '10px', overflowX: 'auto', overflowY: 'hidden', flexShrink: 0, padding: '10px 45px', borderBottom: '1px solid rgba(45, 63, 118, 0.08)', msOverflowStyle: 'none', scrollbarWidth: 'none', width: '100%', scrollBehavior: 'smooth' }}
              >
                {['All', ...Array.from(new Set(combinedFoods.map(f => f.category)))].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCatalogueCategory(cat)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: selectedCatalogueCategory === cat ? 'none' : '1px solid rgba(45, 63, 118, 0.15)',
                      background: selectedCatalogueCategory === cat ? '#4CA687' : '#ffffff',
                      color: selectedCatalogueCategory === cat ? '#ffffff' : 'rgba(45, 63, 118, 0.7)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    {cat === 'All' ? '🍽️ All' : cat}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const el = document.querySelector('.catalogue-category-tabs');
                  if (el) el.scrollBy({ left: 220, behavior: 'smooth' });
                }}
                style={{
                  position: 'absolute',
                  right: '0',
                  zIndex: 10,
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(45, 63, 118, 0.15)',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(45, 63, 118, 0.12)',
                  fontSize: '12px',
                  color: 'var(--text-dark)'
                }}
              >
                ▶
              </button>
            </div>

            <div className="all-products-grid-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {selectedCatalogueCategory === 'All' ? (
                <div className="all-products-grid">
                  {combinedFoods.map((food, idx) => {
                    const cartItem = cart.find(item => item.name === food.name)
                    const quantity = cartItem ? cartItem.quantity : 0
                    return (
                      <div key={idx} className="food-card-item grid-version">
                        <div className="food-card-img-wrap">
                          <img src={food.image} alt={food.name} />
                          <span className={`veg-nonveg-indicator ${food.isVeg ? 'veg' : 'nonveg'}`} title={food.isVeg ? 'Veg' : 'Non-Veg'}>
                            <span className="indicator-dot"></span>
                          </span>
                        </div>
                        <div className="food-card-info">
                          <span className="food-card-tag">{food.category}</span>
                          <h3 className="food-card-title">{food.name}</h3>
                          <div className="food-card-footer">
                            <span className="food-card-price">{food.price || `₹${food.cost}`}</span>
                            {quantity > 0 ? (
                              <div className="food-card-quantity-controls">
                                <button onClick={() => updateCartQuantity(food.name, -1)}>-</button>
                                <span className="qty-count">{quantity}</span>
                                <button onClick={() => updateCartQuantity(food.name, 1)}>+</button>
                              </div>
                            ) : (
                              <button className="food-card-add-btn" onClick={() => onOpenCustomization(food)}>+ Add</button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                (() => {
                  const filtered = combinedFoods.filter(food => food.category === selectedCatalogueCategory)
                  // Group items by subcategory
                  const groups = filtered.reduce((acc, food) => {
                    const sub = food.subcategory || 'General'
                    if (!acc[sub]) acc[sub] = []
                    acc[sub].push(food)
                    return acc
                  }, {})

                  return Object.entries(groups).map(([subcat, items]) => (
                    <div key={subcat} className="subcategory-group-block" style={{ width: '100%', marginBottom: '20px' }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        color: '#2D3F76',
                        borderLeft: '4px solid #4CA687',
                        paddingLeft: '10px',
                        margin: '10px 0 16px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {subcat} ({items.length})
                      </h3>
                      <div className="all-products-grid">
                        {items.map((food, idx) => {
                          const cartItem = cart.find(item => item.name === food.name)
                          const quantity = cartItem ? cartItem.quantity : 0
                          return (
                            <div key={idx} className="food-card-item grid-version">
                              <div className="food-card-img-wrap">
                                <img src={food.image} alt={food.name} />
                                <span className={`veg-nonveg-indicator ${food.isVeg ? 'veg' : 'nonveg'}`} title={food.isVeg ? 'Veg' : 'Non-Veg'}>
                                  <span className="indicator-dot"></span>
                                </span>
                              </div>
                              <div className="food-card-info">
                                <span className="food-card-tag">{food.category}</span>
                                <h3 className="food-card-title">{food.name}</h3>
                                <div className="food-card-footer">
                                  <span className="food-card-price">{food.price || `₹${food.cost}`}</span>
                                  {quantity > 0 ? (
                                    <div className="food-card-quantity-controls">
                                      <button onClick={() => updateCartQuantity(food.name, -1)}>-</button>
                                      <span className="qty-count">{quantity}</span>
                                      <button onClick={() => updateCartQuantity(food.name, 1)}>+</button>
                                    </div>
                                  ) : (
                                    <button className="food-card-add-btn" onClick={() => onOpenCustomization(food)}>+ Add</button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))
                })()
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ExploreFullMenu
