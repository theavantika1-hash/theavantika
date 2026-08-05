import React from 'react'

export const RecommendedFoods = ({
  filteredRecommendedFoods,
  cart = [],
  updateCartQuantity,
  onOpenCustomization
}) => {
  return (
    <section className="recommended-section">
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1200px) {
          .recommended-section .foods-slider-container {
            overflow-x: auto !important;
            scroll-behavior: smooth !important;
            margin-left: 16px !important;
            margin-right: 16px !important;
            width: calc(100% - 32px) !important;
          }
          .recommended-section .foods-slider-container::-webkit-scrollbar {
            display: none !important;
          }
          .recommended-foods-slider-mobile-override {
            transform: none !important;
            transition: none !important;
            gap: 10px !important;
            width: 100% !important;
            display: flex !important;
          }
          .recommended-foods-slider-mobile-override .food-card-item {
            flex: 0 0 calc(50% - 5px) !important;
            width: calc(50% - 5px) !important;
            max-width: calc(50% - 5px) !important;
            padding: 8px !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
          .recommended-foods-slider-mobile-override .food-card-item .food-card-img-wrap {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1 / 1 !important;
          }
          .recommended-foods-slider-mobile-override .food-card-item .food-card-img-wrap img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }
          .recommended-foods-slider-mobile-override .food-card-item .food-card-info {
            width: 100% !important;
            box-sizing: border-box !important;
            min-width: 0 !important;
          }
          .recommended-foods-slider-mobile-override .food-card-item .food-card-footer {
            display: flex !important;
            flex-wrap: nowrap !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 4px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .recommended-foods-slider-mobile-override .food-card-item .food-card-add-btn {
            padding: 2px 6px !important;
            font-size: 9px !important;
            flex-shrink: 0 !important;
            white-space: nowrap !important;
            max-width: 48px !important;
            border-radius: 6px !important;
            line-height: 1.5 !important;
          }
          .recommended-foods-slider-mobile-override .food-card-item .food-card-price {
            font-size: 12px !important;
            font-weight: 800 !important;
            flex-shrink: 1 !important;
            min-width: 0 !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
          }
        }
      `}} />
      <div className="section-header">
        <div className="title-area">
          <span className="section-subtitle">Chef's Choice</span>
          <h2 className="section-title">Recommended For You</h2>
        </div>
      </div>

      {filteredRecommendedFoods.length === 0 ? (
        <p className="search-empty-message">No matching dishes found in Recommended list.</p>
      ) : (
        <div className="foods-slider-container">
          <div className="foods-slider recommended-foods-slider-mobile-override">
            {filteredRecommendedFoods.map((food, idx) => {
              const cartItem = cart.find(item => item.name === food.name)
              const quantity = cartItem ? cartItem.quantity : 0
              return (
                <div key={idx} className="food-card-item">
                  <div className="food-card-img-wrap">
                    <img src={food.image} alt={food.name} />
                    <span className={`veg-nonveg-indicator ${food.isVeg ? 'veg' : 'nonveg'}`} title={food.isVeg ? 'Veg' : 'Non-Veg'}>
                      <span className="indicator-dot"></span>
                    </span>
                  </div>
                  <div className="food-card-info" style={{ width: '100%', boxSizing: 'border-box', minWidth: 0 }}>
                    <span className="food-card-tag">{food.category}</span>
                    <h3 className="food-card-title">{food.name}</h3>
                    <div className="food-card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', width: '100%', boxSizing: 'border-box' }}>
                      <span className="food-card-price" style={{ flexShrink: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{food.price || `₹${food.cost}`}</span>
                      {quantity > 0 ? (
                        <div className="food-card-quantity-controls">
                          <button onClick={() => updateCartQuantity(food.name, -1)}>-</button>
                          <span className="qty-count">{quantity}</span>
                          <button onClick={() => updateCartQuantity(food.name, 1)}>+</button>
                        </div>
                      ) : (
                        <button
                          className="food-card-add-btn"
                          onClick={() => onOpenCustomization(food)}
                          style={{ padding: '3px 8px', fontSize: '10px', flexShrink: 0, whiteSpace: 'nowrap', lineHeight: '1.4', borderRadius: '6px' }}
                        >+ Add</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

export default RecommendedFoods
