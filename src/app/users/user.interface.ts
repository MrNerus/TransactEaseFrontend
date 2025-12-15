export enum Permission {
  blocked = 0,
  viewOnly = 1,
  allowInteraction = 2
}

export interface Role {
  name: string;
  permissions: {
    [key: string]: Permission;
  };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  organizationId: number;
  isActive: boolean;
  role?: string;
  createdAt: string;
  permissions?: {
    [key: string]: Permission;
  };
}