export interface Card {
  id: string; // Mapped from cardNumber if id is missing
  cardNumber: string;
  cardType: string;
  status: string;
  organizationId: number;
  userId?: number;
  issueDate: string;
  expiryDate: string;
  cvv?: string; // Optional as per get-all example (it shows it, but maybe not always needed in list? keeping it)
}
