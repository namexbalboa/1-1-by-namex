import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionGateProps {
  children: ReactNode;
  require?: 'manager' | 'employee' | 'authenticated';
  fallback?: ReactNode;
  renderIf?: boolean;
}

export function PermissionGate({
  children,
  require = 'authenticated',
  fallback = null,
  renderIf = true,
}: PermissionGateProps) {
  const { isManager, isEmployee } = usePermissions();

  // If renderIf is false, don't render anything
  if (!renderIf) {
    return <>{fallback}</>;
  }

  // Check permission based on requirement
  let hasPermission = false;

  switch (require) {
    case 'manager':
      hasPermission = isManager;
      break;
    case 'employee':
      hasPermission = isEmployee;
      break;
    case 'authenticated':
      hasPermission = true; // Already authenticated if using this component
      break;
    default:
      hasPermission = false;
  }

  // Render children if has permission, otherwise render fallback
  return <>{hasPermission ? children : fallback}</>;
}
