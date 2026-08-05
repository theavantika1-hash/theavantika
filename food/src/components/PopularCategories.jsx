import React, { useState, useEffect, useRef } from 'react'
import { POPULAR_CATEGORIES } from '../data/foodData'

export const PopularCategories = ({
  setShowAllProductsPage,
  setSelectedCatalogueCategory
}) => {
  const [sliderIndex, setSliderIndex] = useState(POPULAR_CATEGORIES.length)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mobileCardWidth, setMobileCardWidth] = useState(240)
  const popularSliderRef = useRef(null)

  const tripledCategories = [...POPULAR_CATEGORIES, ...POPULAR_CATEGORIES, ...POPULAR_CATEGORIES]

  const nextSlide = () => {
    if (window.innerWidth <= 1200) return
    if (isTransitioning) return
    setIsTransitioning(true)
    setTransitionEnabled(true)
    setSliderIndex((prev) => prev + 1)
  }

  const prevSlide = () => {
    if (window.innerWidth <= 1200) return
    if (isTransitioning) return
    setIsTransitioning(true)
    setTransitionEnabled(true)
    setSliderIndex((prev) => prev - 1)
  }

  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    if (sliderIndex >= POPULAR_CATEGORIES.length * 2) {
      setTransitionEnabled(false)
      setSliderIndex((prev) => prev - POPULAR_CATEGORIES.length)
    } else if (sliderIndex < POPULAR_CATEGORIES.length) {
      setTransitionEnabled(false)
      setSliderIndex((prev) => prev + POPULAR_CATEGORIES.length)
    }
  }

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200)

  // Calculate card step width dynamically on mobile vs desktop
  useEffect(() => {
    const updateSize = () => {
      const mobileStatus = window.innerWidth <= 1200
      setIsMobile(mobileStatus)
      if (mobileStatus) {
        if (popularSliderRef.current) {
          const containerWidth = popularSliderRef.current.clientWidth
          // on mobile gap is 16px, so step is (containerWidth + 16) / 2
          setMobileCardWidth((containerWidth + 16) / 2)
        }
      } else {
        setMobileCardWidth(240)
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    const timer = setTimeout(updateSize, 150)
    return () => {
      window.removeEventListener('resize', updateSize)
      clearTimeout(timer)
    }
  }, [])

  // Auto slide (disabled on mobile)
  useEffect(() => {
    if (isMobile) return
    const timer = setInterval(() => {
      nextSlide()
    }, 3000)
    return () => clearInterval(timer)
  }, [sliderIndex, isTransitioning, isMobile])

  const displayCategories = isMobile ? POPULAR_CATEGORIES : tripledCategories

  return (
    <section className="food-categories-section">
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1200px) {
          .slider-nav-buttons button:not(.nav-all-products-btn-mobile) {
            display: none !important;
          }
          .nav-all-products-btn-mobile {
            display: flex !important;
          }
          .all-products-trigger-card {
            display: none !important;
          }
           .foods-slider-container {
             overflow-x: auto !important;
             scroll-behavior: smooth !important;
             margin-left: 16px !important;
             margin-right: 16px !important;
             width: calc(100% - 32px) !important;
           }
           .foods-slider-container::-webkit-scrollbar {
             display: none !important;
           }
          .popular-category-carousel-slider {
            transform: none !important;
            transition: none !important;
            gap: 16px !important;
            width: 100% !important;
            display: flex !important;
          }
          .popular-category-slider-card {
            flex: 0 0 50% !important;
            width: 50% !important;
            max-width: 50% !important;
            padding: 8px !important;
          }
          .popular-category-slider-card .food-card-img-wrap {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1 / 1 !important;
          }
          .popular-category-slider-card .food-card-img-wrap img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }
        }
      `}} />
      <div className="section-header">
        <div className="title-area">
          <span className="section-subtitle">Choose & Enjoy</span>
          <h2 className="section-title">Popular Categories</h2>
        </div>
        <div className="slider-nav-buttons" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={prevSlide} className="slider-nav-btn" aria-label="Previous foods">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Zomato mobile-only All Products trigger button placed in navigation */}
          <button 
            onClick={() => {
              setSelectedCatalogueCategory('All');
              setShowAllProductsPage(true);
            }}
            className="slider-nav-btn nav-all-products-btn-mobile"
            title="Explore Full Menu"
            style={{ display: 'none' }} /* controlled via CSS media query */
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>

          <button onClick={nextSlide} className="slider-nav-btn" aria-label="Next foods">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div className="popular-slider-outer-wrapper" style={{ display: 'flex', gap: '24px', alignItems: 'stretch', width: '100%', position: 'relative' }}>
        {/* Special Fixed "All Products" Card (Only rendered on desktop) */}
        {!isMobile && (
          <div 
            className="food-card-item all-products-trigger-card" 
            onClick={() => {
              setSelectedCatalogueCategory('All');
              setShowAllProductsPage(true);
            }} 
            style={{ flexShrink: 0, zIndex: 10, background: '#ffffff', boxShadow: '10px 0 25px rgba(45, 63, 118, 0.08)' }} 
            title="Explore Full Menu"
          >
            <div className="food-card-img-wrap all-products-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
            <div className="food-card-info">
              <span className="food-card-tag">Explore Menu</span>
              <h3 className="food-card-title">ALL PRODUCTS</h3>
            </div>
          </div>
        )}

        {/* Sliding Area */}
        <div 
          ref={popularSliderRef} 
          className="foods-slider-container" 
          style={{ 
            flexGrow: 1, 
            overflow: 'hidden',
            ...(isMobile ? {
              overflowX: 'auto',
              scrollbarWidth: 'none',
              scrollBehavior: 'smooth',
              marginLeft: '16px',
              marginRight: '16px',
              width: 'calc(100% - 32px)'
            } : {})
          }}
        >
          {POPULAR_CATEGORIES.length === 0 ? (
            <p className="search-empty-message">No matching categories found.</p>
          ) : (
            <div 
              className="foods-slider popular-category-carousel-slider" 
              onTransitionEnd={handleTransitionEnd}
              style={{ 
                transform: `translateX(-${isMobile ? 0 : sliderIndex * mobileCardWidth}px)`,
                transition: transitionEnabled ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
                ...(isMobile ? {
                  transform: 'none',
                  transition: 'none',
                  gap: '16px',
                  width: '100%',
                  display: 'flex'
                } : {})
              }}
            >
              {/* Infinite Popular Categories Cards */}
              {displayCategories.map((category, idx) => (
                <div
                  key={idx}
                  className="food-card-item popular-category-slider-card"
                  style={{ 
                    cursor: 'pointer',
                    ...(isMobile ? {
                      flex: '0 0 50%',
                      width: '50%',
                      maxWidth: '50%',
                      padding: '8px'
                    } : {})
                  }}
                  onClick={() => {
                    setSelectedCatalogueCategory(category.name);
                    setShowAllProductsPage(true);
                  }}
                >
                  <div 
                    className="food-card-img-wrap"
                    style={isMobile ? {
                      width: '100%',
                      height: 'auto',
                      aspectRatio: '1 / 1'
                    } : {}}
                  >
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      style={isMobile ? {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      } : {}}
                    />
                  </div>
                  <div className="food-card-info">
                    <span className="food-card-tag">Category</span>
                    <h3 className="food-card-title" style={{ marginTop: '6px' }}>{category.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default PopularCategories

