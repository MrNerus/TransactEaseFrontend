import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ColumnDef } from '../data-table/data-table';

export interface FormField {
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'textarea';
    required?: boolean;
    options?: { label: string; value: any }[]; // For select inputs
    readonly?: boolean;
}

export interface FormSchema {
    fields: FormField[];
}

export interface TableSchema {
    columns: ColumnDef[];
    searchableFields: string[];
}

@Injectable({ providedIn: 'root' })
export class SchemaService {

    // Mock data - in a real app, these would be fetched from an API
    private transactionTableSchema: TableSchema = {
        columns: [
            { key: 'id', label: 'Transaction ID' },
            { key: 'userId', label: 'User' },
            { key: 'receiverId', label: 'Receiver' },
            { key: 'amount', label: 'Amount' },
            { key: 'createdAt', label: 'Date', isDate: true },
        ],
        searchableFields: ['id', 'userId', 'receiverId']
    };

    private transactionFormSchema: FormSchema = {
        fields: [
            { key: 'id', label: 'Transaction ID', type: 'text', readonly: true },
            { key: 'userId', label: 'Sender', type: 'text', readonly: true },
            { key: 'receiverId', label: 'Receiver', type: 'text', readonly: true },
            { key: 'amount', label: 'Amount', type: 'number', readonly: true },
            { key: 'cashbackId', label: 'Cashback/Loyalty ID', type: 'text', readonly: true }, // Placeholder for cashback info
            { key: 'createdAt', label: 'Date', type: 'date', readonly: true },
        ]
    };

    private auditLogTableSchema: TableSchema = {
        columns: [
            { key: 'timestamp', label: 'Timestamp', isDate: true },
            { key: 'user', label: 'User' },
            { key: 'action', label: 'Action' },
            { key: 'details', label: 'Details' },
        ],
        searchableFields: ['user', 'action', 'details']
    };

    private cardTableSchema: TableSchema = {
        columns: [
            { key: 'cardNumber', label: 'Card Number' },
            { key: 'cardType', label: 'Card Type' },
            { key: 'status', label: 'Status' },
            { key: 'organizationId', label: 'Organization ID' },
            { key: 'userId', label: 'User ID' },
            { key: 'issueDate', label: 'Issue Date', isDate: true },
            { key: 'expiryDate', label: 'Expiry Date', isDate: true },
        ],
        searchableFields: ['cardNumber', 'organizationId', 'userId']
    };

    private cardFormSchema: FormSchema = {
        fields: [
            { key: 'cardNumber', label: 'Card Number', type: 'text', required: true },
            { key: 'cardType', label: 'Card Type', type: 'select', options: [{ label: 'Debit', value: 'debit' }, { label: 'Credit', value: 'credit' }], required: true },
            { key: 'issueDate', label: 'Issue Date', type: 'date', required: true },
            { key: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
        ]
    };

    private cardAssignSchema: FormSchema = {
        fields: [
            { key: 'cardId', label: 'Card ID', type: 'text', readonly: true },
            { key: 'userId', label: 'Assign To User (ID)', type: 'text', required: true },
        ]
    };

    private cardTransferSchema: FormSchema = {
        fields: [
            { key: 'cardIds', label: 'Card IDs (comma separated)', type: 'text', required: true },
            { key: 'organizationId', label: 'Transfer To Organization (ID)', type: 'text', required: true },
        ]
    };

    private cashbackSchemeTableSchema: TableSchema = {
        columns: [
            { key: 'name', label: 'Name' },
            { key: 'description', label: 'Description' },
            { key: 'isActive', label: 'Active', isBoolean: true },
        ],
        searchableFields: ['name', 'description']
    };

    private cashbackSchemeFormSchema: FormSchema = {
        fields: [
            { key: 'name', label: 'Name', type: 'text', required: true },
            { key: 'description', label: 'Description', type: 'textarea', required: true },
            { key: 'isActive', label: 'Active', type: 'boolean' },
        ]
    };

    private organizationTableSchema: TableSchema = {
        columns: [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'parentId', label: 'Parent ID' },
            { key: 'createdAt', label: 'Created At', isDate: true },
        ],
        searchableFields: ['id', 'name', 'parentId']
    };

    private organizationFormSchema: FormSchema = {
        fields: [
            { key: 'name', label: 'Name', type: 'text', required: true },
            { key: 'parentId', label: 'Parent Organization ID', type: 'text' },
        ]
    };

    private reportFilterSchema: FormSchema = {
        fields: [
            {
                key: 'reportType',
                label: 'Report Type',
                type: 'select',
                options: [
                    { label: 'Transaction Report', value: 'report_1' },
                    { label: 'Cashback Report', value: 'report_2' },
                    { label: 'User Activity Report', value: 'report_3' }
                ],
                required: true
            },
            { key: 'startDate', label: 'Start Date', type: 'date' },
            { key: 'endDate', label: 'End Date', type: 'date' }
        ]
    };

    private staffTableSchema: TableSchema = {
        columns: [
            { key: 'id', label: 'ID' },
            { key: 'fullName', label: 'Full Name' },
            { key: 'email', label: 'Email' },
            { key: 'organizationId', label: 'Organization ID' },
            { key: 'role', label: 'Role' },
            { key: 'isActive', label: 'Active', isBoolean: true },
            { key: 'createdAt', label: 'Created At', isDate: true },
        ],
        searchableFields: ['fullName', 'email', 'organizationId', 'role']
    };

    private staffFormSchema: FormSchema = {
        fields: [
            { key: 'fullName', label: 'Full Name', type: 'text', required: true },
            { key: 'email', label: 'Email', type: 'text', required: true },
            { key: 'organizationId', label: 'Organization ID', type: 'text', required: true },
            {
                key: 'role', label: 'Role', type: 'select', options: [
                    { label: 'Admin', value: 'admin' },
                    { label: 'Manager', value: 'manager' },
                    { label: 'Staff', value: 'staff' }
                ], required: true
            },
            { key: 'isActive', label: 'Active', type: 'boolean' }
        ]
    };

    private userTableSchema: TableSchema = {
        columns: [
            { key: 'id', label: 'ID' },
            { key: 'fullName', label: 'Full Name' },
            { key: 'email', label: 'Email' },
            { key: 'organizationId', label: 'Organization ID' },
            { key: 'isActive', label: 'Active', isBoolean: true },
            { key: 'createdAt', label: 'Created At', isDate: true },
        ],
        searchableFields: ['fullName', 'email', 'organizationId']
    };

    private userFormSchema: FormSchema = {
        fields: [
            { key: 'fullName', label: 'Full Name', type: 'text', required: true },
            { key: 'email', label: 'Email', type: 'text', required: true },
            { key: 'organizationId', label: 'Organization ID', type: 'text', required: true },
            { key: 'isActive', label: 'Active', type: 'boolean' }
        ]
    };

    getTableSchema(resource: string): Observable<TableSchema> {
        // Simulate API call
        if (resource === 'transactions') {
            return of(this.transactionTableSchema);
        }
        if (resource === 'audit-logs') {
            return of(this.auditLogTableSchema);
        }
        if (resource === 'cards') {
            return of(this.cardTableSchema);
        }
        if (resource === 'cashback-schemes') {
            return of(this.cashbackSchemeTableSchema);
        }
        if (resource === 'organizations') {
            return of(this.organizationTableSchema);
        }
        if (resource === 'staffs') {
            return of(this.staffTableSchema);
        }
        if (resource === 'users') {
            return of(this.userTableSchema);
        }
        // Default or error handling could go here
        return of({ columns: [], searchableFields: [] });
    }

    getFormSchema(resource: string): Observable<FormSchema> {
        if (resource === 'transactions') {
            return of(this.transactionFormSchema);
        }
        if (resource === 'cards') {
            return of(this.cardFormSchema);
        }
        if (resource === 'cards-assign') {
            return of(this.cardAssignSchema);
        }
        if (resource === 'cards-transfer') {
            return of(this.cardTransferSchema);
        }
        if (resource === 'cashback-schemes') {
            return of(this.cashbackSchemeFormSchema);
        }
        if (resource === 'organizations') {
            return of(this.organizationFormSchema);
        }
        if (resource === 'reports') {
            return of(this.reportFilterSchema);
        }
        if (resource === 'staffs') {
            return of(this.staffFormSchema);
        }
        if (resource === 'users') {
            return of(this.userFormSchema);
        }
        return of({ fields: [] });
    }
}
