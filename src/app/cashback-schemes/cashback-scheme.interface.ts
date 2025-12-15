export interface CashbackScheme {
    id: string;
    name: string;
    type: 'flat' | 'percentage';
    value: number;
    minTransactionAmount: number;
    description?: string;
    isActive?: boolean;
}
