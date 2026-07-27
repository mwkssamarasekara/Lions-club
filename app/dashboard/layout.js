'use client';

import AuthGuard from '@/components/AuthGuard';
import DashboardSidebar from '@/components/DashboardSidebar';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/dashboard/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="dashboard-layout">
        <DashboardSidebar />
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
