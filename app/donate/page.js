'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submitDonation } from '@/lib/firestore-db';

export default function Donate() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [slipData, setSlipData] = useState(null);
  const [slipName, setSlipName] = useState('');
  const [isPdf, setIsPdf] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const quickAmounts = [1000, 2500, 5000, 10000];

  const handleFileSelect = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSlipData(e.target.result);
      setSlipName(file.name);
      setIsPdf(file.type === 'application/pdf');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slipData) {
      alert('Please upload a bank transfer slip to submit.');
      return;
    }

    setSubmitting(true);

    const data = {
      fullName,
      email,
      phone,
      amount,
      purpose,
      paymentMethod: 'Bank Transfer',
      slipData
    };

    const id = await submitDonation(data);
    if (id) {
      setSuccess(true);
    } else {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <h1 data-aos="fade-up"><i className="fa-solid fa-hand-holding-heart"></i> Donate</h1>
        <p data-aos="fade-up" data-aos-delay="100">Your generosity transforms lives. Every rupee counts in our mission to serve Homagama.</p>
        <div className="breadcrumb" data-aos="fade-up" data-aos-delay="200">
          <Link href="/">Home</Link>
          <i className="fa-solid fa-chevron-right"></i>
          <span>Donate</span>
        </div>
      </section>

      {/* Impact Section */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>Your Impact</h2>
            <p>See how your donations make a difference in the lives of people across Homagama.</p>
          </div>
          <div className="impact-grid">
            <div className="impact-card" data-aos="fade-up" data-aos-delay="0">
              <i className="fa-solid fa-utensils"></i>
              <h4>Feed a Family</h4>
              <p>LKR 2,000 can feed a family of 4 for a week</p>
            </div>
            <div className="impact-card" data-aos="fade-up" data-aos-delay="100">
              <i className="fa-solid fa-graduation-cap"></i>
              <h4>Educate a Child</h4>
              <p>LKR 5,000 provides school supplies for one student</p>
            </div>
            <div className="impact-card" data-aos="fade-up" data-aos-delay="200">
              <i className="fa-solid fa-stethoscope"></i>
              <h4>Medical Checkup</h4>
              <p>LKR 3,000 funds a free health screening</p>
            </div>
            <div className="impact-card" data-aos="fade-up" data-aos-delay="300">
              <i className="fa-solid fa-eye"></i>
              <h4>Eye Care</h4>
              <p>LKR 10,000 provides eyeglasses for 5 people</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>Make a Donation</h2>
            <p>Fill in the form below to record your donation. We'll follow up with payment details.</p>
          </div>

          <div className="form-card" data-aos="fade-up">
            {!success ? (
              <form id="donateForm" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label><i className="fa-solid fa-user"></i> Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter your full name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label><i className="fa-solid fa-envelope"></i> Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label><i className="fa-solid fa-phone"></i> Phone</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    placeholder="+94 7X XXX XXXX" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label><i className="fa-solid fa-money-bill"></i> Amount (LKR)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="5000" 
                    min="100" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required 
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-lg)' }}>
                  {quickAmounts.map(amt => (
                    <button 
                      key={amt}
                      type="button" 
                      className={`btn btn-sm btn-outline quick-amount ${amount === String(amt) ? 'btn-blue' : ''}`}
                      onClick={() => setAmount(String(amt))}
                    >
                      LKR {amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="form-group">
                  <label><i className="fa-solid fa-bullseye"></i> Purpose</label>
                  <select 
                    className="form-control" 
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                  >
                    <option value="">Select purpose...</option>
                    <option value="General Fund">General Fund</option>
                    <option value="Education">Education</option>
                    <option value="Health Care">Health Care</option>
                    <option value="Food Distribution">Food Distribution</option>
                    <option value="Environmental">Environmental Projects</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                  </select>
                </div>

                <div className="form-group">
                  <label><i className="fa-solid fa-credit-card"></i> Payment Method</label>
                  <input type="text" className="form-control" value="Bank Transfer" readOnly style={{ background: 'var(--gray-100)', cursor: 'not-allowed' }} />
                </div>

                {/* Premium Bank Card Display */}
                <div className="bank-card-container">
                  <div className="premium-bank-card" style={{ animation: 'fadeInUp 0.8s ease forwards' }}>
                    <div className="brand-header">
                      <span className="bank-name"><i className="fa-solid fa-building-columns"></i> COMMERCIAL BANK</span>
                      <span className="premium-tag">premium</span>
                    </div>
                    <div className="card-mid">
                      <div className="gold-chip"></div>
                      <i className="fa-solid fa-wifi wifi-symbol"></i>
                    </div>
                    <div>
                      <div className="card-number">8012 3456 7890 1234</div>
                      <div className="card-labels">
                        <span>BRANCH</span>
                        <span>ACC TYPE</span>
                      </div>
                      <div className="card-dates">
                        <span>HOMAGAMA (077)</span>
                        <span>SAVINGS</span>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="card-holder">LIONS CLUB HOMAGAMA DIAMONDS</div>
                      <div className="mastercard-logo">
                        <div className="circle red"></div>
                        <div className="circle yellow"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Slip Upload Zone */}
                <div className="form-group">
                  <label><i className="fa-solid fa-receipt"></i> Upload Bank Slip (Image or PDF)</label>
                  <div 
                    className={`upload-zone ${dragOver ? 'drag-over' : ''}`} 
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    style={{ padding: 'var(--space-xl) var(--space-md)', marginTop: '6px' }}
                  >
                    <input 
                      type="file" 
                      accept="image/*,application/pdf" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleFileSelect(file);
                      }}
                      required={!slipData} 
                    />
                    <div className="upload-zone-icon" style={{ fontSize: '2rem' }}><i className="fa-solid fa-cloud-arrow-up"></i></div>
                    <p className="upload-zone-text" style={{ fontSize: '0.9rem' }}><strong>Click to upload</strong> or drag slip here</p>
                    <p className="upload-zone-hint">Images or PDF up to 5MB</p>
                  </div>
                  {/* Slip Preview */}
                  {slipData && (
                    <div className="upload-preview" style={{ display: 'block', maxHeight: '150px', overflow: 'hidden', marginTop: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                      {isPdf ? (
                        <div style={{ textItems: 'center', padding: 'var(--space-md)', background: 'var(--gray-50)', textAlign: 'center' }}>
                          <i className="fa-solid fa-file-pdf" style={{ fontSize: '2.5rem', color: 'var(--danger)' }}></i>
                          <p style={{ margin: 'var(--space-xs) 0 0', fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-700)' }}>{slipName}</p>
                        </div>
                      ) : (
                        <img src={slipData} alt="Slip Preview" style={{ width: '100%', height: '150px', objectFit: 'contain' }} />
                      )}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="spinner" style={{ width: '20px', height: '20px', margin: 0, borderWidth: '2px' }}></div> Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-heart"></i> Submit Donation
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div id="successMsg" style={{ textItems: 'center', padding: 'var(--space-2xl)', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: 'var(--space-md)' }}>
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h3>Thank You!</h3>
                <p style={{ color: 'var(--gray-500)' }}>Your donation has been recorded successfully. We will verify your slip and contact you shortly.</p>
                <Link href="/" className="btn btn-outline mt-2"><i className="fa-solid fa-home"></i> Back to Home</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
