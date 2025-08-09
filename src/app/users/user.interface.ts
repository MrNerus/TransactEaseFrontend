export interface Permission {
  canAdd: boolean;
  canEdit: boolean;
  canView: boolean;
  canDelete: boolean;
}

export interface Role {
  name: string;
  permissions: {
    [key: string]: Partial<Permission>;
  };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  organizationId: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  permissions?: {
    [key: string]: Partial<Permission>;
  };
}