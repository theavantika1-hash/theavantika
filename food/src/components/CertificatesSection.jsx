import React from 'react'

export const CertificatesSection = () => {
  const certificates = [
    {
      id: 1,
      title: 'FSSAI License',
      number: 'Lic. No. 11223999000123',
      authority: 'Food Safety and Standards Authority of India',
      description: 'Fully compliant with national hygiene, sanitation, and food safety standards.',
      image: '/fssai-badge.png'
    },
    {
      id: 2,
      title: 'ISO 22000:2018',
      number: 'FSMS Certificate #99102',
      authority: 'Global Quality Assurance',
      description: 'Certified Food Safety Management System ensuring premium hazard control and kitchen cleanliness.',
      image: '/iso-badge.png'
    },
    {
      id: 3,
      title: '100% Vegetarian Certified',
      number: 'Reg. No. V-88910',
      authority: 'Pure Veg Standards',
      description: 'Strictly monitored pure vegetarian kitchen operations, zero cross-contamination guaranteed.',
      image: '/veg-badge.png'
    }
  ]

  return (
    <section className="certificates-section" style={{ marginTop: '50px', width: '100%', textAlign: 'left' }}>
      <div className="section-header">
        <div className="title-area">
          <span className="section-subtitle">Trust & Quality</span>
          <h2 className="section-title">Accreditations & Certificates</h2>
        </div>
      </div>

      <div className="certificates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '20px', marginBottom: '30px' }}>
        {certificates.map(cert => (
          <div 
            key={cert.id} 
            className="certificate-card" 
            style={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid rgba(45, 63, 118, 0.08)', 
              borderRadius: '24px', 
              padding: '24px', 
              boxShadow: '0 10px 30px rgba(45, 63, 118, 0.04)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ background: '#ffffff', border: '1px solid rgba(45, 63, 118, 0.08)', borderRadius: '14px', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: '4px', overflow: 'hidden' }}>
                <img src={cert.image} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '100px', backgroundColor: 'rgba(45, 63, 118, 0.06)', color: '#2D3F76' }}>
                Verified
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#2D3F76' }} className="food-card-title">{cert.title}</h3>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#4CA687' }}>{cert.number}</span>
              <span style={{ fontSize: '11px', color: 'rgba(45, 63, 118, 0.5)', fontWeight: '600' }}>{cert.authority}</span>
            </div>

            <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: 'rgba(45, 63, 118, 0.7)' }}>
              {cert.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CertificatesSection
