import React from 'react'

export const SpotlightFoods = ({
  filteredSpotlightFoods,
  cart = [],
  updateCartQuantity,
  onOpenCustomization
}) => {
  return (
    <section className="spotlight-section">
      <div className="section-header">
        <div className="title-area">
          <span className="section-subtitle">Featured Highlights</span>
          <h2 className="section-title">In the Spotlight</h2>
        </div>
      </div>

      {filteredSpotlightFoods.length === 0 ? (
        <p className="search-empty-message">No matching spotlight highlights found.</p>
      ) : (
        <div className="spotlight-container">
          {filteredSpotlightFoods.map((food, idx) => {
            const cartItem = cart.find(item => item.name === food.name)
            const quantity = cartItem ? cartItem.quantity : 0
            return (
              <div key={idx} className="spotlight-card">
                <div className="spotlight-img-wrap">
                  <img src={food.image} alt={food.name} />
                </div>
                <div className="spotlight-content">
                  <span className="spotlight-tag">{food.category}</span>
                  <h3 className="spotlight-name">{food.name}</h3>
                  <p className="spotlight-desc">{food.description}</p>
                  {quantity > 0 ? (
                    <div className="food-card-quantity-controls" style={{ height: '40px', minWidth: '120px', borderRadius: '14px' }}>
                      <button style={{ fontSize: '18px' }} onClick={() => updateCartQuantity(food.name, -1)}>-</button>
                      <span className="qty-count" style={{ fontSize: '15px' }}>{quantity}</span>
                      <button style={{ fontSize: '18px' }} onClick={() => updateCartQuantity(food.name, 1)}>+</button>
                    </div>
                  ) : (
                    <button className="spotlight-action-btn" onClick={() => onOpenCustomization(food)}>
                      Order Now • {food.price}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default SpotlightFoods
