import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { EmployeeLayout } from './EmployeeLayout';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isManager } = useAuth();

  // Use EmployeeLayout for non-manager users
  if (!isManager) {
    return <EmployeeLayout>{children}</EmployeeLayout>;
  }

  // Use regular layout with sidebar for managers
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
