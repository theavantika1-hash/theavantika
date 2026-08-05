import React from 'react'

function ReviewsPage({ reviews = [], setReviews, showNotification }) {
  const handleAddReview = () => {
    const name = prompt("Enter Patron Name:") || "Anonymous Guest";
    const rating = parseInt(prompt("Enter Rating (1-5):") || "5");
    const text = prompt("Enter Review Message:") || "Excellent food and outstanding royal ambiance!";
    if (name && text) {
      const newReview = {
        name,
        rating: rating > 5 ? 5 : rating < 1 ? 1 : rating,
        text,
        date: "Just Now",
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 99999)}?auto=format&fit=crop&w=100&q=80`,
        foodImg: `https://images.unsplash.com/photo-${1540000000000 + Math.floor(Math.random() * 99999)}?auto=format&fit=crop&w=180&q=80`
      };
      setReviews(prev => [newReview, ...prev]);
      if (showNotification) showNotification("Review added successfully!");
    }
  }

  return (
    <div className="grid-card" style={{ flex: 1, gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Patron Feedback & Reviews ({reviews.length})</h2>
        <button
          className="btn btn-primary btn-yellow"
          style={{ padding: '8px 16px', fontSize: '12px' }}
          onClick={handleAddReview}
        >
          + Write Review
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No reviews submitted yet. Click "+ Write Review" to post a review.
          </div>
        ) : (
          reviews.map((r, i) => (
            <div key={i} className="checklist-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span className="run-name">{r.name}</span>
                <span style={{ color: '#facc15' }}>{'★'.repeat(r.rating || 5)}</span>
              </div>
              <p style={{ fontSize: '13px' }}>"{r.text}"</p>
              <span className="text-muted" style={{ fontSize: '11px' }}>{r.date}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReviewsPage
