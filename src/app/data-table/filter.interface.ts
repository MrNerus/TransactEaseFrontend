export type FilterOperator = 'eq' | 'neq' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in';

export interface FilterCondition {
    field: string;
    operator: FilterOperator;
    value: any;
}

export interface FilterPayload {
    logic: 'and' | 'or';
    conditions: FilterCondition[];
}
