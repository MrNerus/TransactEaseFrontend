export interface Transaction {
  id: string; // Mapped from transactionId
  userId?: string; // Not in backend response? Backend has 'cardId', maybe user derived? Or cardId enough?
  organizationId?: string; // Not in backend
  receiverId?: string; // Not in backend
  amount: number;
  date: string; // Backend: date
  status: string; // Backend: status
  type: string; // Backend: type
  cardId: string;
  merchantName: string;
}