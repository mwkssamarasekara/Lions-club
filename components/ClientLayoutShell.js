'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FestivalThemeEffects from '@/components/FestivalThemeEffects';

export default function ClientLayoutShell({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    import('aos').then((AOS) => {
      AOS.init({ duration: 800, once: true, offset: 50 });
    });
  }, []);

  return (
    <>
      <FestivalThemeEffects />
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
    </>
  );
}
