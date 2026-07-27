'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submitJoinRequest } from '@/lib/firestore-db';

export default function Join() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = {
      fullName,
      email,
      phone,
      address,
      message
    };

    const id = await submitJoinRequest(data);
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
        <h1 data-aos="fade-up"><i className="fa-solid fa-users"></i> Join Us</h1>
        <p data-aos="fade-up" data-aos-delay="100">Become a member of Lions Diamond Homagama and start your service journey today.</p>
        <div className="breadcrumb" data-aos="fade-up" data-aos-delay="200">
          <Link href="/">Home</Link>
          <i className="fa-solid fa-chevron-right"></i>
          <span>Join Us</span>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>Why Join Lions Club?</h2>
            <p>Being a Lion is about leading by example, building relationships, and improving the world through service.</p>
          </div>
          <div className="benefits-list">
            <div className="benefit-item" data-aos="fade-up" data-aos-delay="0">
              <div className="benefit-number">1</div>
              <div>
                <h4>Community Impact</h4>
                <p>Actively serve and directly resolve local issues in Homagama with local resources.</p>
              </div>
            </div>
            <div className="benefit-item" data-aos="fade-up" data-aos-delay="100">
              <div className="benefit-number">2</div>
              <div>
                <h4>Teamwork & Friendships</h4>
                <p>Connect with a passionate group of leaders and volunteers who share your vision.</p>
              </div>
            </div>
            <div className="benefit-item" data-aos="fade-up" data-aos-delay="200">
              <div className="benefit-number">3</div>
              <div>
                <h4>Leadership Skills</h4>
                <p>Gain valuable leadership experience through club roles and project management.</p>
              </div>
            </div>
            <div className="benefit-item" data-aos="fade-up" data-aos-delay="300">
              <div className="benefit-number">4</div>
              <div>
                <h4>Global Network</h4>
                <p>Access a worldwide network of 1.4 million members across 200+ countries.</p>
              </div>
            </div>
            <div className="benefit-item" data-aos="fade-up" data-aos-delay="400">
              <div className="benefit-number">5</div>
              <div>
                <h4>Personal Growth</h4>
                <p>Discover new strengths and grow as a compassionate, responsible citizen.</p>
              </div>
            </div>
            <div className="benefit-item" data-aos="fade-up" data-aos-delay="500">
              <div className="benefit-number">6</div>
              <div>
                <h4>Recognition</h4>
                <p>Receive awards, certificates, and appreciation for your dedicated service.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Form */}
      <section className="section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>Membership Application</h2>
            <p>Fill in the form below and our team will review your application promptly.</p>
          </div>

          <div className="form-card" data-aos="fade-up">
            {!success ? (
              <form id="joinForm" onSubmit={handleSubmit}>
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
                  <label><i className="fa-solid fa-location-dot"></i> Address</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Your address" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label><i className="fa-solid fa-message"></i> Why do you want to join?</label>
                  <textarea 
                    className="form-control" 
                    placeholder="Tell us about yourself and why you'd like to join Lions Diamond Homagama..." 
                    rows="4" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-purple" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="spinner" style={{ width: '20px', height: '20px', margin: 0, borderWidth: '2px' }}></div> Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i> Submit Application
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div id="successMsg" style={{ textItems: 'center', padding: 'var(--space-2xl)', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: 'var(--space-md)' }}>
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h3>Application Submitted!</h3>
                <p style={{ color: 'var(--gray-500)' }}>Thank you for your interest in joining Lions Diamond Homagama. Our team will review your application and contact you soon.</p>
                <Link href="/" className="btn btn-outline mt-2"><i className="fa-solid fa-home"></i> Back to Home</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
