export interface Transaction {
  id: string;
  userId: string;
  organizationId: string;
  receiverId: string;
  amount: number;
  cashbackId: string;
  createdAt: Date;
}