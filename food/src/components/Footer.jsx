import React from 'react'
import { IoMail, IoCall, IoLocation } from 'react-icons/io5'
import { FaFacebookF, FaInstagram } from 'react-icons/fa'

export const Footer = () => {
  return (
    <footer className="main-footer" style={{
      backgroundColor: '#4CA687',
      color: '#ffffff',
      borderRadius: '36px 36px 0 0',
      padding: '50px 40px 30px',
      marginTop: '60px',
      width: '100%',
      boxSizing: 'border-box',
      textAlign: 'left'
    }}>
      <div className="footer-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '10px 16px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(45, 63, 118, 0.08)'
            }}>
              <img src="/A logo.png" alt="Avantika Logo" style={{ height: '110px', width: 'auto' }} />
            </div>
            <h3 style={{ margin: 0, fontFamily: 'var(--primary-font)', fontWeight: '800', fontSize: '20px', letterSpacing: '0.5px', color: '#2D3F76' }}>
              Avantika Restaurant
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)' }}>
            Bringing you premium bites and authentic flavors, prepared with love and high standards of safety.
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            padding: '8px 14px',
            borderRadius: '12px',
            width: 'fit-content'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#ffffff" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff' }}>
              FSSAI Lic. No. 22223010001613
            </span>
          </div>
        </div>

        {/* Contact Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#2D3F76' }}>
            Contact Us
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IoMail size={16} style={{ flexShrink: 0 }} />
              <a href="mailto:theavantika1@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                theavantika1@gmail.com
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IoCall size={16} style={{ flexShrink: 0 }} />
              <span>Contact: +91 97990 97911</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <IoLocation size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Address:SH 25, near Telco circle, Bhagwanpura, Alwar, Rajasthan 301001</span>
            </div>
          </div>
        </div>

        {/* Legal & Policy Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#2D3F76' }}>
            Policies
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <a
              href="#refund-policy"
              onClick={(e) => {
                e.preventDefault()
                alert("Refund Policy: If your order is cancelled or experiences delivery failure, a full refund will be processed within 5-7 business days to your original payment mode.")
              }}
              style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = '#2D3F76'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
            >
              Refund Policy
            </a>
            <a
              href="#terms"
              style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = '#2D3F76'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
            >
              Terms & Conditions
            </a>
          </div>
        </div>

        {/* Social Media Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#2D3F76' }}>
            Follow Us
          </h4>
          <div style={{ display: 'flex', gap: '14px' }}>
            {/* Facebook Link */}
            <a
              href="https://www.facebook.com/share/18vVvJQQeJ/"
              target="_blank"
              rel="noreferrer"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'background-color 0.2s, transform 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1877F2'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <FaFacebookF size={18} />
            </a>

            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/avantika.kitchen?igsh=MzV0OTZxYnRoOGJ1"
              target="_blank"
              rel="noreferrer"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'background-color 0.2s, transform 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E4405F'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <FaInstagram size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '20px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.5)'
      }}>
        &copy; {new Date().getFullYear()} Avantika Restaurant. All Rights Reserved. | Crafted by RizeWorld
      </div>
    </footer>
  )
}

export default Footer
