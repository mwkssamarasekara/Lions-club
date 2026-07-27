'use client';

import { useState } from 'react';
import Link from 'next/link';
import { showToast } from '@/lib/firestore-db';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      showToast('Message sent successfully! We will contact you soon.', 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSubmitting(false);
    }, 1000);
  };

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <h1 data-aos="fade-up"><i className="fa-solid fa-envelope"></i> Contact Us</h1>
        <p data-aos="fade-up" data-aos-delay="100">Have questions? Want to collaborate? Drop us a line and we'll get back to you.</p>
        <div className="breadcrumb" data-aos="fade-up" data-aos-delay="200">
          <Link href="/">Home</Link>
          <i className="fa-solid fa-chevron-right"></i>
          <span>Contact</span>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section">
        <div className="container">
          <div className="grid-2">
            {/* Contact Details Card */}
            <div data-aos="fade-right">
              <h2 style={{ marginBottom: 'var(--space-lg)' }}>Get In <span className="text-gradient">Touch</span></h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-xl)' }}>
                We're always here to listen, help, and collaborate. Reach out to us through any of the channels below or fill out the contact form.
              </p>
              
              <ul className="contact-info-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', padding: 'var(--space-md) 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div className="icon-circle" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--blue-600)' }}>
                    <i className="fa-solid fa-phone" style={{ fontSize: '1.2rem' }}></i>
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Phone</strong>
                    <a href="tel:+94771234567" style={{ fontWeight: '600', color: 'var(--gray-700)' }}>+94 77 123 4567</a>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', padding: 'var(--space-md) 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div className="icon-circle" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--purple-600)' }}>
                    <i className="fa-solid fa-envelope" style={{ fontSize: '1.2rem' }}></i>
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Email</strong>
                    <a href="mailto:info@lionsdiamond.lk" style={{ fontWeight: '600', color: 'var(--gray-700)' }}>info@lionsdiamond.lk</a>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', padding: 'var(--space-md) 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div className="icon-circle" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--yellow-600)' }}>
                    <i className="fa-solid fa-location-dot" style={{ fontSize: '1.2rem' }}></i>
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase' }}>Location</strong>
                    <span style={{ fontWeight: '600', color: 'var(--gray-700)' }}>Homagama, Sri Lanka</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Contact Form Card */}
            <div className="form-card" data-aos="fade-left">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label><i className="fa-solid fa-user"></i> Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  <label><i className="fa-solid fa-heading"></i> Subject</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Subject of your message" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label><i className="fa-solid fa-message"></i> Message</label>
                  <textarea 
                    className="form-control" 
                    placeholder="Type your message here..." 
                    rows="4" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="spinner" style={{ width: '20px', height: '20px', margin: 0, borderWidth: '2px' }}></div> Sending...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
