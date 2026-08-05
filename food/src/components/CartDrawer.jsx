import React from 'react'

export const CartDrawer = ({
  showCartDrawer,
  setShowCartDrawer,
  checkoutStep,
  setCheckoutStep,
  cart,
  setCart,
  diningMode,
  userLocation,
  savedAddresses,
  paymentMode,
  setPaymentMode,
  upiAddress,
  setUpiAddress,
  showQrModal,
  setShowQrModal,
  cardHolder,
  setCardHolder,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  paymentLoading,
  appliedDiscount,
  setAppliedDiscount,
  couponCode,
  setCouponCode,
  couponMsg,
  setCouponMsg,
  cookingRequest,
  setCookingRequest,
  showCouponSection,
  setShowCouponSection,
  placedOrderId,
  setShowAddressSheet,
  handlePlaceOrder,
  removeFromCart,
  updateCartQuantity,
  addToCart,
  allFoods,
  recommendedFoods,
  spotlightFoods
}) => {
  if (!showCartDrawer) return null

  return (
    <div className="cart-drawer-overlay" onClick={() => setShowCartDrawer(false)}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <header className="cart-drawer-header">
          <h2>My Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</h2>
          <button className="cart-drawer-close" onClick={() => setShowCartDrawer(false)}>✕</button>
        </header>

        {checkoutStep === 'cart' && (
          <div className="cart-drawer-body">
            {cart.length === 0 ? (
              <div className="empty-cart-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(45, 63, 118, 0.3)', marginBottom: '15px' }}>
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <p>Your cart is empty.</p>
                <button className="cart-shop-now-btn" onClick={() => setShowCartDrawer(false)}>Browse Menu</button>
              </div>
            ) : (
              <>
                {/* Restaurant Origin Banner */}
                <div className="cart-origin-banner">
                  <div className="cart-origin-left">
                    <img src="/A logo.png" alt="Avantika" className="cart-origin-logo" />
                    <div className="cart-origin-info">
                      <span className="cart-origin-label">Delivering from</span>
                      <strong className="cart-origin-name">Avantika Restaurant</strong>
                    </div>
                  </div>
                  {userLocation && (
                    <div className="cart-origin-address-pill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{userLocation}</span>
                    </div>
                  )}
                </div>

                {diningMode === 'delivery' && userLocation && (
                  <div style={{ margin: '12px 0', padding: '10px 14px', border: '1px solid rgba(45, 63, 118, 0.08)', borderRadius: '12px', background: 'rgba(76, 166, 135, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
                      <span style={{ fontSize: '11px', color: '#4CA687', fontWeight: '700', textTransform: 'uppercase' }}>Delivering to:</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-dark)', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>{userLocation}</span>
                    </div>
                    <button
                      onClick={() => setShowAddressSheet(true)}
                      style={{ background: 'none', border: 'none', color: '#4CA687', fontSize: '12px', fontWeight: '700', cursor: 'pointer', flexShrink: 0 }}
                    >
                      Change
                    </button>
                  </div>
                )}

                {/* Cart Items List */}
                <div className="cart-items-list">
                  {cart.map((item, idx) => (
                    <div key={idx} className="cart-item-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', borderBottom: '1px solid rgba(45, 63, 118, 0.08)' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className="cart-item-img-wrap" style={{ flexShrink: 0 }}>
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="cart-item-info" style={{ flexGrow: 1 }}>
                          <div className="item-name-tag-row" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className={`veg-nonveg-indicator inline-mode ${item.isVeg ? 'veg' : 'nonveg'}`}>
                              <span className="indicator-dot"></span>
                            </span>
                            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>{item.name}</h4>
                          </div>
                          {item.customizations && (
                            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#4CA687', fontWeight: '600', lineHeight: '1.3', fontStyle: 'italic' }}>
                              Customized: {item.customizations}
                            </p>
                          )}
                          {item.description && (
                            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'rgba(45, 63, 118, 0.6)', lineHeight: '1.3' }}>
                              {item.description}
                            </p>
                          )}
                          <span className="cart-item-price" style={{ display: 'block', marginTop: '6px', fontWeight: '700', color: 'var(--text-dark)' }}>
                            ₹{item.cost}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <button
                          onClick={() => removeFromCart(item.name, item.customizations)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#e74c3c',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          🗑 Remove
                        </button>
                        <div className="cart-item-quantity-controls" style={{ margin: 0 }}>
                          <button onClick={() => updateCartQuantity(item.name, -1, item.customizations)}>-</button>
                          <span style={{ fontSize: '13px', fontWeight: '700' }}>{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.name, 1, item.customizations)}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cooking Request Box */}
                <div className="cart-cooking-request-box">
                  <label className="cooking-request-label">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#4CA687' }}>
                      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Add a cooking request <span className="optional-tag">(optional)</span>
                  </label>
                  <textarea
                    className="cooking-request-input"
                    placeholder="No Onion, Less Spicy, Extra Cheese..."
                    value={cookingRequest}
                    onChange={(e) => setCookingRequest(e.target.value.slice(0, 250))}
                    rows={2}
                    maxLength={250}
                  />
                  <span className="cooking-char-count">{cookingRequest.length}/250</span>
                </div>

                {/* Collapsible Coupon Section */}
                <div className="cart-coupon-section" style={{ margin: '15px 0', border: '1px solid rgba(45, 63, 118, 0.1)', borderRadius: '12px', overflow: 'hidden', background: '#ffffff' }}>
                  <button
                    onClick={() => setShowCouponSection(!showCouponSection)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: 'none',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: 'var(--text-dark)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🏷️ Apply Coupon
                    </span>
                    <span>{showCouponSection ? '▼' : '▶'}</span>
                  </button>

                  {showCouponSection && (
                    <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(45, 63, 118, 0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Enter coupon code..."
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          style={{
                            flexGrow: 1,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(45, 63, 118, 0.15)',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <button
                          onClick={async () => {
                            if (!couponCode.trim()) {
                              setCouponMsg('');
                              setAppliedDiscount(0);
                              return;
                            }
                            try {
                              let userObj = {};
                              try {
                                const raw = localStorage.getItem('avantika_user');
                                if (raw) userObj = JSON.parse(raw);
                              } catch(e) {}

                              const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                              const res = await fetch('http://localhost:45000/api/coupons/validate', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  code: couponCode.trim(),
                                  userPhone: userObj.phone || userObj.phone_number || '',
                                  userId: userObj._id || userObj.id || '',
                                  cartTotal: subtotal
                                })
                              });
                              const data = await res.json();
                              if (data.success && data.data) {
                                setAppliedDiscount(data.data.discountAmount);
                                setCouponMsg(`${data.data.code} applied! ₹${data.data.discountAmount} discount added.`);
                              } else {
                                setAppliedDiscount(0);
                                setCouponMsg(data.message || 'Invalid promo code for your account.');
                              }
                            } catch (err) {
                              setAppliedDiscount(0);
                              setCouponMsg('Error validating coupon code.');
                            }
                          }}
                          style={{
                            padding: '8px 16px',
                            background: '#4CA687',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          Apply
                        </button>
                      </div>
                      {couponMsg && (
                        <span style={{ fontSize: '11px', color: appliedDiscount > 0 ? '#4CA687' : '#e74c3c', fontWeight: '600' }}>
                          {couponMsg}
                        </span>
                      )}

                      {/* Dynamic Available Coupons for logged in user */}
                      <UserCouponsList
                        setCouponCode={setCouponCode}
                        setAppliedDiscount={setAppliedDiscount}
                        setCouponMsg={setCouponMsg}
                        cartSubtotal={cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                      />
                    </div>
                  )}
                </div>

                {/* Bill details */}
                {(() => {
                  const itemTotal = cart.reduce((sum, item) => sum + item.cost * item.quantity, 0);
                  const taxes = Math.round(itemTotal * 0.05); // 5% GST
                  const deliveryCharge = diningMode === 'dine-in' ? 0 : 49;
                  const discount = Math.min(appliedDiscount, itemTotal);
                  const grandTotal = Math.max(0, itemTotal - discount + deliveryCharge + taxes);

                  return (
                    <div className="cart-bill-details">
                      <h3>Bill Details</h3>
                      <div className="bill-row">
                        <span>Item Total</span>
                        <span>₹{itemTotal.toFixed(0)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="bill-row" style={{ color: '#4CA687', fontWeight: '600' }}>
                          <span>Coupon Discount</span>
                          <span>-₹{discount.toFixed(0)}</span>
                        </div>
                      )}
                      <div className="bill-row">
                        <span>Delivery Charge</span>
                        <span>{diningMode === 'dine-in' ? 'FREE' : `₹${deliveryCharge}`}</span>
                      </div>
                      <div className="bill-row">
                        <span>GST / Taxes (5%)</span>
                        <span>₹{taxes.toFixed(0)}</span>
                      </div>
                      <div className="bill-row total">
                        <span>Grand Total</span>
                        <span>₹{grandTotal.toFixed(0)}</span>
                      </div>
                    </div>
                  );
                })()}

                <button
                  className="cart-proceed-btn"
                  onClick={() => {
                    if (diningMode === 'delivery') {
                      if (!userLocation || !savedAddresses || savedAddresses.length === 0) {
                        setShowAddressSheet(true);
                      } else {
                        setCheckoutStep('payment');
                      }
                    } else {
                      setCheckoutStep('payment');
                    }
                  }}
                >
                  {diningMode === 'delivery'
                    ? (userLocation && savedAddresses && savedAddresses.length > 0 ? 'Continue To Payment' : 'Proceed To Checkout')
                    : 'Proceed to Pay'}
                </button>
              </>
            )}
          </div>
        )}

        {checkoutStep === 'payment' && (
          <div className="cart-drawer-body">
            <div className="payment-step-container" style={{ padding: '0 4px 30px 4px' }}>

              {/* Order Summary Section */}
              <div style={{ marginBottom: '20px', padding: '16px', border: '1px solid rgba(45, 63, 118, 0.08)', borderRadius: '16px', background: '#ffffff' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'rgba(45, 63, 118, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Summary</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{item.name} <span style={{ color: 'rgba(45, 63, 118, 0.5)' }}>x {item.quantity}</span></span>
                      <span style={{ fontWeight: '700' }}>₹{(item.cost * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Address Section */}
              {diningMode === 'delivery' && userLocation && (
                <div style={{ marginBottom: '20px', padding: '16px', border: '1px solid rgba(45, 63, 118, 0.08)', borderRadius: '16px', background: '#ffffff' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'rgba(45, 63, 118, 0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery Address</h4>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--text-dark)', fontWeight: '600' }}>{savedAddresses[0]?.name || 'Receiver'}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'rgba(45, 63, 118, 0.7)', lineHeight: '1.4' }}>{userLocation}</p>
                </div>
              )}

              {/* Payment Options Section */}
              <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 12px 0', color: 'var(--text-dark)' }}>Select Payment Method</h3>
              <div className="payment-options-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                {/* UPI Option */}
                <label className={`payment-option-card ${paymentMode === 'upi' ? 'selected' : ''}`} style={{ cursor: 'pointer' }}>
                  <input type="radio" name="payment" value="upi" checked={paymentMode === 'upi'} onChange={() => setPaymentMode('upi')} />
                  <span className="payment-custom-radio"></span>
                  <div className="payment-option-details">
                    <h4>UPI (GPay / PhonePe / Paytm)</h4>
                    <p>Pay instantly using any UPI app</p>
                  </div>
                </label>

                {paymentMode === 'upi' && (
                  <div style={{ padding: '12px', border: '1px solid rgba(76, 166, 135, 0.2)', borderRadius: '12px', background: 'rgba(76, 166, 135, 0.02)', display: 'flex', flexDirection: 'column', gap: '8px', animation: 'fadeInOverlay 0.2s ease' }}>
                    <input
                      type="text"
                      placeholder="Enter your UPI ID (e.g. username@okaxis)"
                      value={upiAddress}
                      onChange={e => setUpiAddress(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(45, 63, 118, 0.15)', fontSize: '12px', outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowQrModal(true)}
                      style={{ background: 'none', border: '1px dashed #4CA687', color: '#4CA687', padding: '6px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      📱 Generate Mock QR Code
                    </button>
                  </div>
                )}

                {/* Card Option */}
                <label className={`payment-option-card ${paymentMode === 'card' ? 'selected' : ''}`} style={{ cursor: 'pointer' }}>
                  <input type="radio" name="payment" value="card" checked={paymentMode === 'card'} onChange={() => setPaymentMode('card')} />
                  <span className="payment-custom-radio"></span>
                  <div className="payment-option-details">
                    <h4>Credit or Debit Card</h4>
                    <p>Visa, MasterCard, RuPay supported</p>
                  </div>
                </label>

                {paymentMode === 'card' && (
                  <div style={{ padding: '14px', border: '1px solid rgba(76, 166, 135, 0.2)', borderRadius: '12px', background: 'rgba(76, 166, 135, 0.02)', display: 'flex', flexDirection: 'column', gap: '8px', animation: 'fadeInOverlay 0.2s ease' }}>
                    <input
                      type="text"
                      placeholder="Card Holder Name"
                      value={cardHolder}
                      onChange={e => setCardHolder(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(45, 63, 118, 0.15)', fontSize: '12px', outline: 'none' }}
                    />
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(45, 63, 118, 0.15)', fontSize: '12px', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Expiry (MM/YY)"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value.slice(0, 5))}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(45, 63, 118, 0.15)', fontSize: '12px', outline: 'none' }}
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(45, 63, 118, 0.15)', fontSize: '12px', outline: 'none' }}
                      />
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                <label className={`payment-option-card ${paymentMode === 'netbanking' ? 'selected' : ''}`} style={{ cursor: 'pointer' }}>
                  <input type="radio" name="payment" value="netbanking" checked={paymentMode === 'netbanking'} onChange={() => setPaymentMode('netbanking')} />
                  <span className="payment-custom-radio"></span>
                  <div className="payment-option-details">
                    <h4>Net Banking</h4>
                    <p>Pay directly through your bank account</p>
                  </div>
                </label>

                {paymentMode === 'netbanking' && (
                  <div style={{ padding: '12px', border: '1px solid rgba(76, 166, 135, 0.2)', borderRadius: '12px', background: 'rgba(76, 166, 135, 0.02)', display: 'flex', flexWrap: 'wrap', gap: '8px', animation: 'fadeInOverlay 0.2s ease' }}>
                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'KOTAK'].map(bank => (
                      <span key={bank} style={{ padding: '6px 12px', border: '1px solid rgba(45, 63, 118, 0.15)', borderRadius: '8px', fontSize: '11px', fontWeight: '700', color: 'var(--text-dark)', cursor: 'pointer', background: '#ffffff' }}>🏛️ {bank}</span>
                    ))}
                  </div>
                )}

                {/* Wallets */}
                <label className={`payment-option-card ${paymentMode === 'wallet' ? 'selected' : ''}`} style={{ cursor: 'pointer' }}>
                  <input type="radio" name="payment" value="wallet" checked={paymentMode === 'wallet'} onChange={() => setPaymentMode('wallet')} />
                  <span className="payment-custom-radio"></span>
                  <div className="payment-option-details">
                    <h4>Wallets (Paytm / PhonePe Wallet)</h4>
                    <p>Pay using saved balance in your wallets</p>
                  </div>
                </label>

                {/* Cash On Delivery */}
                <label className={`payment-option-card ${paymentMode === 'cod' ? 'selected' : ''}`} style={{ cursor: 'pointer' }}>
                  <input type="radio" name="payment" value="cod" checked={paymentMode === 'cod'} onChange={() => setPaymentMode('cod')} />
                  <span className="payment-custom-radio"></span>
                  <div className="payment-option-details">
                    <h4>Cash on Delivery (COD)</h4>
                    <p>Pay with cash when your food arrives</p>
                  </div>
                </label>

              </div>

              {/* Bill Summary Block */}
              {(() => {
                const itemTotal = cart.reduce((sum, item) => sum + item.cost * item.quantity, 0);
                const taxes = Math.round(itemTotal * 0.05);
                const deliveryCharge = diningMode === 'dine-in' ? 0 : 49;
                const discount = Math.min(appliedDiscount, itemTotal);
                const grandTotal = Math.max(0, itemTotal - discount + deliveryCharge + taxes);

                return (
                  <div className="cart-bill-details" style={{ marginTop: '24px' }}>
                    <h3>Bill Details</h3>
                    <div className="bill-row">
                      <span>Item Total</span>
                      <span>₹{itemTotal.toFixed(0)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="bill-row" style={{ color: '#4CA687', fontWeight: '600' }}>
                        <span>Coupon Discount</span>
                        <span>-₹{discount.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="bill-row">
                      <span>Delivery Charge</span>
                      <span>{diningMode === 'dine-in' ? 'FREE' : `₹${deliveryCharge}`}</span>
                    </div>
                    <div className="bill-row">
                      <span>GST / Taxes (5%)</span>
                      <span>₹{taxes.toFixed(0)}</span>
                    </div>
                    <div className="bill-row total">
                      <span>Grand Total</span>
                      <span>₹{grandTotal.toFixed(0)}</span>
                    </div>
                  </div>
                );
              })()}

              <button
                className={`cart-pay-now-btn ${paymentMode === '' ? 'btn-disabled' : ''}`}
                onClick={() => {
                  if (paymentMode === 'card') {
                    if (!cardHolder.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
                      alert('Please enter complete Card Details to place order.');
                      return;
                    }
                  }
                  if (paymentMode === 'upi') {
                    if (!upiAddress.trim()) {
                      alert('Please enter UPI ID or generate QR code.');
                      return;
                    }
                  }
                  handlePlaceOrder();
                }}
                disabled={paymentLoading || paymentMode === ''}
                style={{ marginTop: '20px', width: '100%' }}
              >
                {paymentLoading ? 'Processing Order...' : (paymentMode === '' ? 'Select Payment Method' : 'Place Order')}
              </button>

              <button className="cart-back-btn" onClick={() => setCheckoutStep('cart')}>
                ← Back to Cart
              </button>
            </div>
          </div>
        )}

        {checkoutStep === 'success' && (
          <div className="cart-drawer-body success-view">
            <div className="success-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="#4CA687" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2>Order Placed Successfully!</h2>
            <p className="success-order-msg">Your food is being prepared with love and will arrive shortly.</p>
            <div className="order-details-box">
              <div className="detail-row">
                <span>Order ID</span>
                <strong style={{ color: '#4CA687' }}>{placedOrderId || 'AV-18293746'}</strong>
              </div>
              <div className="detail-row">
                <span>Status</span>
                <strong style={{ color: '#4CA687' }}>Preparing Food</strong>
              </div>
              <div className="detail-row">
                <span>Estimated Time</span>
                <strong>25 - 30 Mins</strong>
              </div>
              {userLocation && (
                <div className="detail-row">
                  <span>Delivery Address</span>
                  <p className="address-text-mini">{userLocation}</p>
                </div>
              )}
            </div>
            <button className="success-close-btn" onClick={() => {
              setCart([]);
              setAppliedDiscount(0);
              setCouponCode('');
              setCouponMsg('');
              setPaymentMode('');
              setUpiAddress('');
              setCardHolder('');
              setCardNumber('');
              setCardExpiry('');
              setCardCvv('');
              setShowCartDrawer(false);
            }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function UserCouponsList({ setCouponCode, setAppliedDiscount, setCouponMsg, cartSubtotal }) {
  const [userCoupons, setUserCoupons] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let userObj = {}
    try {
      const raw = localStorage.getItem('avantika_user')
      if (raw) userObj = JSON.parse(raw)
    } catch (e) {}

    const phone = userObj.phone || userObj.phone_number || ''
    const userId = userObj._id || userObj.id || ''

    fetch(`http://localhost:45000/api/coupons/user?phone=${encodeURIComponent(phone)}&userId=${encodeURIComponent(userId)}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          setUserCoupons(resData.data)
        }
        setLoading(false)
      })
      .catch(err => {
        console.log('Error fetching user coupons:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <span style={{ fontSize: '11px', color: 'rgba(45, 63, 118, 0.5)' }}>Loading coupons for your account...</span>
  }

  if (userCoupons.length === 0) {
    return <span style={{ fontSize: '11px', color: 'rgba(45, 63, 118, 0.5)' }}>No exclusive coupons assigned to your account yet.</span>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
      <span style={{ fontSize: '11px', fontWeight: '800', color: '#2D3F76', letterSpacing: '0.3px' }}>
        🎁 Exclusive Coupons Assigned To You:
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {userCoupons.map((c) => {
          const discountText = c.type === 'Percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`
          return (
            <button
              key={c._id || c.code}
              onClick={async () => {
                setCouponCode(c.code)
                let userObj = {}
                try {
                  const raw = localStorage.getItem('avantika_user')
                  if (raw) userObj = JSON.parse(raw)
                } catch (e) {}

                try {
                  const res = await fetch('http://localhost:45000/api/coupons/validate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      code: c.code,
                      userPhone: userObj.phone || userObj.phone_number || '',
                      userId: userObj._id || userObj.id || '',
                      cartTotal: cartSubtotal
                    })
                  })
                  const data = await res.json()
                  if (data.success && data.data) {
                    setAppliedDiscount(data.data.discountAmount)
                    setCouponMsg(`${data.data.code} applied! ₹${data.data.discountAmount} discount added.`)
                  } else {
                    setAppliedDiscount(0)
                    setCouponMsg(data.message || 'Cannot apply coupon.')
                  }
                } catch (err) {
                  setAppliedDiscount(0)
                  setCouponMsg('Error applying coupon.')
                }
              }}
              style={{
                background: '#e0f2fe',
                border: '1px dashed #0284c7',
                color: '#0369a1',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              🏷️ <strong>{c.code}</strong> ({discountText})
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CartDrawer
