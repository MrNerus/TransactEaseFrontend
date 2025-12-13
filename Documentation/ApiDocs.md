# Tables
transactionTableSchema
```js
{
    columns: [
        { key: 'id', label: 'Transaction ID' },
        { key: 'userId', label: 'User' },
        { key: 'receiverId', label: 'Receiver' },
        { key: 'amount', label: 'Amount' },
        { key: 'createdAt', label: 'Date', isDate: true },
    ],
    searchableFields: ['id', 'userId', 'receiverId']
}
```

auditLogTableSchema
```js
{
    columns: [
        { key: 'timestamp', label: 'Timestamp', isDate: true },
        { key: 'user', label: 'User' },
        { key: 'action', label: 'Action' },
        { key: 'details', label: 'Details' },
    ],
    searchableFields: ['user', 'action', 'details']
}
```

cardTableSchema
```js
{
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
}
```

cashbackSchemeTableSchema
```js
{
    columns: [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'isActive', label: 'Active', isBoolean: true },
    ],
    searchableFields: ['name', 'description']
}
```

organizationTableSchema
```js
{
    columns: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'parentId', label: 'Parent ID' },
        { key: 'createdAt', label: 'Created At', isDate: true },
    ],
    searchableFields: ['id', 'name', 'parentId']
}
```

staffTableSchema
```js
{
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
}
```

userTableSchema
```js
{
    columns: [
        { key: 'id', label: 'ID' },
        { key: 'fullName', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'organizationId', label: 'Organization ID' },
        { key: 'isActive', label: 'Active', isBoolean: true },
        { key: 'createdAt', label: 'Created At', isDate: true },
    ],
    searchableFields: ['fullName', 'email', 'organizationId']
}
```

# Forms
transactionFormSchema
```js
{
    fields: [
        { key: 'userId', label: 'Sender', type: 'lookup', required: true, lookupResource: 'users', displayField: 'name' },
        { key: 'receiverId', label: 'Receiver', type: 'lookup', required: true, lookupResource: 'users', displayField: 'name' },
        { key: 'organizationId', label: 'Organization', type: 'lookup', required: true, lookupResource: 'organizations', displayField: 'name' },
        { key: 'amount', label: 'Amount', type: 'number', required: true },
        { key: 'cashbackId', label: 'Cashback Scheme', type: 'lookup', lookupResource: 'cashback-schemes', displayField: 'name' },
    ]
}
```

cardFormSchema
```js
{
    fields: [
        { key: 'cardNumber', label: 'Card Number', type: 'text', required: true },
        { key: 'cardType', label: 'Card Type', type: 'select', options: [{ label: 'Debit', value: 'debit' }, { label: 'Credit', value: 'credit' }], required: true },
        { key: 'issueDate', label: 'Issue Date', type: 'date', required: true },
        { key: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
        { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Active', value: 'active' }, { label: 'Blocked', value: 'blocked' }], required: true },
        { key: 'userId', label: 'Assigned User', type: 'lookup', required: true, lookupResource: 'users', displayField: 'name' },
        { key: 'cvv', label: 'CVV', type: 'text', required: true }
    ]
}
```

cardAssignSchema
```js
{
    fields: [
        { key: 'userId', label: 'Assign To User', type: 'lookup', required: true, lookupResource: 'users', displayField: 'name' },
        { key: 'issueDate', label: 'Issue Date', type: 'date', required: true },
        { key: 'expiryDate', label: 'Expiry Date', type: 'date', required: true }
    ]
}
```

cardTransferSchema
```js
{
    fields: [
        { key: 'targetOrganizationId', label: 'Transfer To', type: 'lookup', required: true, lookupResource: 'organizations', displayField: 'name' }
    ]
}
```
    
cashbackSchemeFormSchema
```js
{
    fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'isActive', label: 'Active', type: 'boolean' },
    ]
}
```


organizationFormSchema
```js
{
    fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'parentId', label: 'Parent Organization', type: 'lookup', lookupResource: 'organizations', displayField: 'name' },
    ]
}
```

reportFilterSchema
```js
{
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
}
```

staffFormSchema
```js
{
    fields: [
        { key: 'fullName', label: 'Full Name', type: 'text', required: true },
        { key: 'email', label: 'Email', type: 'text', required: true },
        { key: 'organizationId', label: 'Organization', type: 'lookup', required: true, lookupResource: 'organizations', displayField: 'name' },
        {
            key: 'role', label: 'Role', type: 'select', options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Manager', value: 'manager' },
                { label: 'Staff', value: 'staff' }
            ], required: true
        },
        { key: 'isActive', label: 'Active', type: 'boolean' }
    ]
}
```

userFormSchema
```js
{
    fields: [
        { key: 'fullName', label: 'Full Name', type: 'text', required: true },
        { key: 'email', label: 'Email', type: 'text', required: true },
        { key: 'organizationId', label: 'Organization', type: 'lookup', required: true, lookupResource: 'organizations', displayField: 'name' },
        { key: 'isActive', label: 'Active', type: 'boolean' }
    ]
}
```
    