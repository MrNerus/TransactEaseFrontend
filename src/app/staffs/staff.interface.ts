export interface Staff {
  id: string;
  fullName: string;
  email: string;
  organizationId: string;
  role: 'Admin' | 'Manager' | 'Operator' | 'Customer';
  isActive: boolean;
  createdAt: string;
}
