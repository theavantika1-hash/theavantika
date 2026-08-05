import React, { useState } from 'react';
import { FiCheckCircle, FiClock, FiDollarSign, FiSearch, FiBriefcase } from 'react-icons/fi';

function WalletPage({ orders = [], walletTransactions = [], onUpdatePaymentStatus, showNotification }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState('ALL');

  // Derive live transaction list from real orders array or fallback
  const rawList = orders.length > 0 ? orders : walletTransactions;

  // Calculate live balances
  const totalBalance = rawList.reduce((sum, ord) => {
    const isPaid = (ord.paymentStatus || 'Paid').toLowerCase() === 'paid';
    return isPaid ? sum + (ord.totalAmount || ord.amount || 0) : sum;
  }, 0);

  const pendingCodAmount = rawList.reduce((sum, ord) => {
    const isPaid = (ord.paymentStatus || '').toLowerCase() === 'paid';
    const isCod = (ord.paymentMethod || ord.method || '').toUpperCase().includes('COD');
    return (!isPaid && isCod) ? sum + (ord.totalAmount || ord.amount || 0) : sum;
  }, 0);

  // Filtered transactions
  const filtered = rawList.filter(ord => {
    const txId = ord.transactionId || ord.txId || `TXN-${ord.orderId || ''}`;
    const desc = ord.customerName ? `Order ${ord.orderId || ''} (${ord.customerName})` : (ord.desc || '');
    const method = (ord.paymentMethod || ord.method || '').toUpperCase();

    const matchesSearch = txId.toLowerCase().includes(searchQuery.toLowerCase()) || desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = filterMethod === 'ALL' || method.includes(filterMethod);

    return matchesSearch && matchesMethod;
  });

  const handleConfirmCodPayment = (orderObj) => {
    if (onUpdatePaymentStatus) {
      onUpdatePaymentStatus(orderObj, 'Paid');
    } else if (showNotification) {
      showNotification(`Marked COD payment for Order ${orderObj.orderId || ''} as Paid!`, 'success');
    }
  };

  return (
    <div className="grid-card" style={{ flex: 1, gap: '20px', overflowY: 'auto', background: 'transparent', border: 'none', boxShadow: 'none', padding: '24px 28px 24px 24px' }}>
      
      {/* Top Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1.5px' }}>FINANCIAL VAULT</span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>Wallet Balances & Settlement Logs</h2>
        </div>
        
        {/* Stat Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-card)', padding: '10px 18px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', padding: '8px', borderRadius: '10px', display: 'flex' }}>
              <FiDollarSign style={{ fontSize: '20px' }} />
            </div>
            <div>
              <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Total Settled Revenue</span>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)' }}>₹{totalBalance.toLocaleString('en-IN')}</h3>
            </div>
          </div>

          {pendingCodAmount > 0 && (
            <div style={{ background: 'var(--bg-card)', padding: '10px 18px', borderRadius: '16px', border: '1px solid #f59e0b', boxShadow: 'var(--card-shadow)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', padding: '8px', borderRadius: '10px', display: 'flex' }}>
                <FiClock style={{ fontSize: '20px' }} />
              </div>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#f59e0b', textTransform: 'uppercase', display: 'block' }}>Pending COD Collects</span>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#f59e0b' }}>₹{pendingCodAmount.toLocaleString('en-IN')}</h3>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '14px', width: '100%', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by Transaction ID or Customer Name..."
            style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '13.5px', outline: 'none' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'UPI', 'CARD', 'COD'].map(m => (
            <button
              key={m}
              onClick={() => setFilterMethod(m)}
              style={{
                padding: '9px 16px',
                borderRadius: '12px',
                border: filterMethod === m ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                background: filterMethod === m ? 'var(--accent-color)' : 'var(--bg-card)',
                color: filterMethod === m ? '#fff' : 'var(--text-primary)',
                fontWeight: '800',
                fontSize: '11.5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Settlement Table Card */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table className="stream-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Transaction ID</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Description / Order</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Method</th>
                <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Amount</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Payment Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Settlement Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                    <FiBriefcase style={{ fontSize: '32px', color: 'var(--text-muted)', marginBottom: '8px' }} />
                    <p style={{ margin: 0, fontWeight: '700', fontSize: '14px' }}>No settlement records found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((ord, idx) => {
                  const txId = ord.transactionId || ord.txId || `TXN-${ord.orderId || idx}`;
                  const desc = ord.customerName ? `Order ${ord.orderId || ''} (${ord.customerName})` : (ord.desc || `Order ${ord.orderId || ''}`);
                  const method = (ord.paymentMethod || ord.method || 'UPI').toUpperCase();
                  const amount = ord.totalAmount || ord.amount || 0;
                  const isPaid = (ord.paymentStatus || 'Paid').toLowerCase() === 'paid';
                  const isCod = method.includes('COD');

                  return (
                    <tr key={ord._id || idx} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s ease' }}>
                      
                      {/* Transaction ID */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '12px', color: 'var(--accent-color)', background: 'var(--bg-input)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          {txId}
                        </span>
                      </td>

                      {/* Description */}
                      <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {desc}
                      </td>

                      {/* Payment Method */}
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '900', letterSpacing: '0.5px',
                          background: isCod ? 'rgba(245, 158, 11, 0.12)' : method.includes('CARD') ? 'rgba(168, 85, 247, 0.12)' : 'rgba(59, 130, 246, 0.12)',
                          color: isCod ? '#f59e0b' : method.includes('CARD') ? '#a855f7' : '#3b82f6',
                          border: isCod ? '1px solid rgba(245, 158, 11, 0.3)' : method.includes('CARD') ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)'
                        }}>
                          {method}
                        </span>
                      </td>

                      {/* Amount */}
                      <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: '900', color: isPaid ? '#10b981' : '#f59e0b' }}>
                        +₹{amount.toLocaleString('en-IN')}
                      </td>

                      {/* Payment Status */}
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px',
                          background: isPaid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          color: isPaid ? '#10b981' : '#f59e0b',
                          border: isPaid ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                        }}>
                          {isPaid ? <><FiCheckCircle /> Paid</> : <><FiClock /> Pending</>}
                        </span>
                      </td>

                      {/* Action / Settlement Button */}
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        {!isPaid ? (
                          <button
                            onClick={() => handleConfirmCodPayment(ord)}
                            style={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: '#ffffff',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '10px',
                              fontSize: '11.5px',
                              fontWeight: '900',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <FiCheckCircle style={{ fontSize: '14px' }} /> Confirm Payment Received 💵
                          </button>
                        ) : (
                          <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            Settled & Received ✓
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default WalletPage;
