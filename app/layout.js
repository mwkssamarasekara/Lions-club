'use client';

import { useEffect } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    // Initialize AOS (Animate on Scroll)
    import('aos').then((AOS) => {
      AOS.init({ duration: 800, once: true, offset: 50 });
    });
  }, []);

  return (
    <html lang="si" data-theme="light">
      <head>
        <title>Lions Diamonds Homagama | Community Service Excellence</title>
        <meta name="description" content="Lions Diamonds Homagama - Serving the community of Homagama with compassion. Join us in making a difference through community service, donations, and volunteer programs." />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="stylesheet" href="https://unpkg.com/aos@2.3.4/dist/aos.css" />
        <link rel="icon" href="/assets/img/logo.png" type="image/png" />
      </head>
      <body>
        {!isDashboard && <Navbar />}
        {children}
        {!isDashboard && <Footer />}
      </body>
    </html>
  );
}
