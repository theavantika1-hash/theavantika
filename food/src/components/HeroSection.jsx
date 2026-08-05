import React from 'react'
import Navbar from './Navbar'

export const HeroSection = ({
  bgImages,
  bgImageIndex,
  mobileBgImages,
  mobileBgImageIndex,
  currentDish,
  handlePrev,
  handleNext,
  navbarProps
}) => {
  return (
    <div className="restaurant-card">
      {/* Background Image */}
      <picture>
        <source media="(max-width: 768px)" srcSet={mobileBgImages[mobileBgImageIndex]} />
        <img
          src={bgImages[bgImageIndex]}
          alt="Avantika Restaurant"
          className="card-bg-video bg-transition-fade"
        />
      </picture>

      {/* Header Navigation */}
      <Navbar {...navbarProps} />

      {/* Hero Section */}
      <div className="hero-content">

        

      </div>

      {/* Footer Slogans, Controls and Actions */}
      <footer className="hero-footer" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <div className="slogan-section">
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 3px rgba(0,0,0,0.5)', fontWeight: '700' }}>
            {currentDish.description}
          </p>
        </div>

      </footer>
    </div>
  )
}

export default HeroSection
