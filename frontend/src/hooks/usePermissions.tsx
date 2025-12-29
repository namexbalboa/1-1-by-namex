import { useAuth } from './useAuth';

export function usePermissions() {
  const { collaborator, isManager } = useAuth();

  const isEmployee = !isManager;

  return {
    // Role checks
    isManager,
    isEmployee,

    // Collaborator permissions
    canViewAllCollaborators: isManager,
    canCreateCollaborator: isManager,
    canEditCollaborator: (collaboratorId: string) =>
      isManager || collaboratorId === collaborator?._id,
    canDeleteCollaborator: isManager,
    canViewCollaboratorDetails: (collaboratorId: string) =>
      isManager || collaboratorId === collaborator?._id,

    // Settings permissions
    canViewSettings: isManager,
    canManageSettings: isManager,
    canManageJobRoles: isManager,
    canManageDepartments: isManager,
    canManageManagers: isManager,

    // Analytics permissions
    canViewTeamAnalytics: isManager,
    canViewOwnAnalytics: true,
    canViewAnalyticsFor: (collaboratorId: string) =>
      isManager || collaboratorId === collaborator?._id,

    // Meeting permissions
    canCreateMeetingFor: (collaboratorId: string) => isManager,
    canViewMeetingFor: (collaboratorId: string) =>
      isManager || collaboratorId === collaborator?._id,
    canEditMeetingFor: (collaboratorId: string) =>
      isManager || collaboratorId === collaborator?._id,

    // Navigation permissions
    canAccessSidebar: isManager,
    canAccessCollaboratorsPage: isManager,
    canAccessSettingsPage: isManager,

    // Get current user ID
    currentUserId: collaborator?._id,
  };
}
