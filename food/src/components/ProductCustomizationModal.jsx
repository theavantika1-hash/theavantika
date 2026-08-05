import React, { useState, useEffect } from 'react'

export const ProductCustomizationModal = ({
  product,
  onClose,
  onAddCustomized
}) => {
  if (!product) return null

  // Determine options based on category
  const getCustomizationOptions = () => {
    const cat = product.category || ''
    
    if (cat.toLowerCase().includes('italian') || cat.toLowerCase().includes('pizza') || cat.toLowerCase().includes('pasta')) {
      return {
        groups: [
          {
            id: 'crust_style',
            title: 'Choice of Crust / Style',
            subtitle: 'Required • Select any 1 option',
            required: true,
            type: 'radio',
            options: [
              { name: 'Pan Crust / Penne Pasta', price: 0 },
              { name: 'Thin Crust / Spaghetti', price: 0 },
              { name: 'Cheese Burst Crust / Extra Creamy', price: 60 }
            ]
          },
          {
            id: 'toppings',
            title: 'Extra Toppings',
            subtitle: 'Select options',
            required: false,
            type: 'checkbox',
            options: [
              { name: 'Extra Cheese', price: 40 },
              { name: 'Add Mushroom', price: 30 },
              { name: 'Add Olives & Jalapenos', price: 25 }
            ]
          }
        ]
      }
    }

    if (cat.toLowerCase().includes('beverages') || cat.toLowerCase().includes('desserts')) {
      return {
        groups: [
          {
            id: 'size',
            title: 'Choice of Size',
            subtitle: 'Required • Select any 1 option',
            required: true,
            type: 'radio',
            options: [
              { name: 'Regular Size', price: 0 },
              { name: 'Large Size / Double Scoop', price: 40 }
            ]
          },
          {
            id: 'addons',
            title: 'Add-ons & Toppings',
            subtitle: 'Select options',
            required: false,
            type: 'checkbox',
            options: [
              { name: 'Whipped Cream / Extra Sauce', price: 20 },
              { name: 'Chocolate Chips / Dryfruits', price: 15 },
              { name: 'Vanilla Ice Cream scoop', price: 30 }
            ]
          }
        ]
      }
    }

    // Default template (matching the subway/rolls screenshots)
    return {
      groups: [
        {
          id: 'bread',
          title: 'Choice of Bread',
          subtitle: 'Required • Select any 1 option',
          required: true,
          type: 'radio',
          options: [
            { name: 'Multigrain 10cm', price: 0 },
            { name: 'White Italian 10cm', price: 0 },
            { name: 'Wheat Bread 10cm', price: 0 }
          ]
        },
        {
          id: 'prep',
          title: 'Choice of Preparation',
          subtitle: 'Required • Select any 1 option',
          required: true,
          type: 'radio',
          options: [
            { name: 'Toasted', price: 0 },
            { name: 'Non-Toasted', price: 0 }
          ]
        },
        {
          id: 'extra',
          title: 'Make your Sub EXTRA yummy',
          subtitle: 'Select up to 1 option',
          required: false,
          type: 'radio', // Select up to 1 option -> acts as radio or single checkbox
          options: [
            { name: 'Extra Cheese Slice', price: 30 },
            { name: 'Double Cheese Sauce', price: 45 }
          ]
        }
      ]
    }
  }

  const { groups } = getCustomizationOptions()

  // State to hold selected options
  const [selections, setSelections] = useState({})
  const [quantity, setQuantity] = useState(1)

  // Initialize default radio options on load
  useEffect(() => {
    const initial = {}
    groups.forEach(group => {
      if (group.required && group.type === 'radio') {
        initial[group.id] = group.options[0].name // default to first option
      }
    })
    setSelections(initial)
    setQuantity(1)
  }, [product])

  // Handle choice selection
  const handleSelectRadio = (groupId, optionName) => {
    setSelections(prev => ({
      ...prev,
      [groupId]: optionName
    }))
  }

  const handleToggleCheckbox = (groupId, optionName) => {
    setSelections(prev => {
      const currentList = prev[groupId] || []
      const newList = currentList.includes(optionName)
        ? currentList.filter(name => name !== optionName)
        : [...currentList, optionName]
      return {
        ...prev,
        [groupId]: newList
      }
    })
  }

  // Calculate final item price
  const baseCost = product.cost || parseFloat((product.price || '0').replace(/[^\d]/g, '')) || 299
  
  let addedCost = 0
  groups.forEach(group => {
    const selected = selections[group.id]
    if (selected) {
      if (Array.isArray(selected)) {
        // Checkboxes
        selected.forEach(optName => {
          const optObj = group.options.find(o => o.name === optName)
          if (optObj) addedCost += optObj.price
        })
      } else {
        // Radio
        const optObj = group.options.find(o => o.name === selected)
        if (optObj) addedCost += optObj.price
      }
    }
  })

  const finalItemPrice = baseCost + addedCost
  const totalPrice = finalItemPrice * quantity

  // Format selections text summary for cart item details
  const getCustomizationsSummary = () => {
    const summary = []
    groups.forEach(group => {
      const val = selections[group.id]
      if (val) {
        if (Array.isArray(val) && val.length > 0) {
          summary.push(`${group.title}: ${val.join(', ')}`)
        } else if (typeof val === 'string') {
          summary.push(`${group.title}: ${val}`)
        }
      }
    })
    return summary.join(' | ')
  }

  const handleAddClick = () => {
    const customizedProduct = {
      ...product,
      cost: finalItemPrice,
      price: `₹${finalItemPrice}`,
      customizations: getCustomizationsSummary(),
      customDetails: selections, // RAW selection details
      quantity: quantity
    }
    onAddCustomized(customizedProduct)
    onClose()
  }

  return (
    <div className="customization-overlay" onClick={(e) => e.target.className === 'customization-overlay' && onClose()}>
      <div className="customization-sheet">
        <button className="customization-close-btn" onClick={onClose} aria-label="Close modal">✕</button>

        {/* Top Product Image */}
        <div className="customization-image-wrap">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Scrollable Customization Content */}
        <div className="customization-content">
          <div className="customization-details">
            <div className="customization-meta">
              <span className={`veg-nonveg-indicator inline-mode ${product.isVeg ? 'veg' : 'nonveg'}`} />
              <span className="customization-tag">{product.category}</span>
              <div className="customization-rating">
                <span className="star">★</span>
                <span>{product.rating || '4.5'}</span>
              </div>
            </div>
            <h2 className="customization-title">{product.name}</h2>
            <p className="customization-desc">{product.description || 'Prepared fresh with premium ingredients, chef-selected spices, and customized to your taste.'}</p>
          </div>

          {/* Render Groups */}
          {groups.map(group => (
            <div key={group.id} className="customization-group">
              <div className="customization-group-header">
                <h4 className="customization-group-title">{group.title}</h4>
                <span className="customization-group-subtitle">{group.subtitle}</span>
              </div>

              <div className="customization-options-list">
                {group.options.map(option => {
                  const isChecked = group.type === 'checkbox'
                    ? (selections[group.id] || []).includes(option.name)
                    : selections[group.id] === option.name

                  return (
                    <div 
                      key={option.name} 
                      className="customization-option-row"
                      onClick={() => {
                        if (group.type === 'checkbox') {
                          handleToggleCheckbox(group.id, option.name)
                        } else {
                          handleSelectRadio(group.id, option.name)
                        }
                      }}
                    >
                      <div className="option-left">
                        <span className="option-label">{option.name}</span>
                        {option.price > 0 && <span className="option-price">+₹{option.price}</span>}
                      </div>

                      <div className="option-right">
                        {group.type === 'radio' ? (
                          <span className={`custom-radio ${isChecked ? 'checked' : ''}`} />
                        ) : (
                          <span className={`custom-checkbox ${isChecked ? 'checked' : ''}`} />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Footer */}
        <div className="customization-footer">
          <div className="customization-footer-qty">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>

          <button className="customization-add-btn" onClick={handleAddClick}>
            <span>Add item</span>
            <span>
              {quantity > 1 && <span className="original-price-strike">₹{baseCost * quantity}</span>}
              ₹{totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCustomizationModal
