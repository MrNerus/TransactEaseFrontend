import { Role } from '../users/user.interface';

export const ROLES: Role[] = [
  {
    name: 'admin',
    permissions: {
      users: { canAdd: true, canEdit: true, canView: true, canDelete: true },
      roles: { canAdd: true, canEdit: true, canView: true, canDelete: true },
      organizations: { canAdd: true, canEdit: true, canView: true, canDelete: true },
    },
  },
  {
    name: 'editor',
    permissions: {
      users: { canAdd: true, canEdit: true, canView: true, canDelete: false },
      roles: { canAdd: false, canEdit: true, canView: true, canDelete: false },
      organizations: { canAdd: false, canEdit: true, canView: true, canDelete: false },
    },
  },
  {
    name: 'viewer',
    permissions: {
      users: { canAdd: false, canEdit: false, canView: true, canDelete: false },
      roles: { canAdd: false, canEdit: false, canView: true, canDelete: false },
      organizations: { canAdd: false, canEdit: false, canView: true, canDelete: false },
    },
  },
];