export interface Card {
  id: string;
  cardNumber: string;
  cardType: 'debit' | 'credit';
  status: 'active' | 'inactive' | 'expired';
  organizationId?: string;
  userId?: string;
  issueDate: Date;
  expiryDate: Date;
}
