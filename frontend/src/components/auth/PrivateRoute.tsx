import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PrivateRouteProps {
  children: ReactNode;
  requireManager?: boolean;
}

export function PrivateRoute({ children, requireManager = false }: PrivateRouteProps) {
  const { isAuthenticated, isManager, loading } = useAuth();

  console.log('🔒 PrivateRoute check:', { isAuthenticated, isManager, loading });

  if (loading) {
    console.log('⏳ PrivateRoute: Still loading, showing spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🚫 PrivateRoute: Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (requireManager && !isManager) {
    console.log('🚫 PrivateRoute: Not a manager, redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ PrivateRoute: Access granted');
  return <>{children}</>;
}
