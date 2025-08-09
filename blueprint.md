# TransactEase Blueprint

## Overview

TransactEase is a modern, interactive financial management application built with Angular. It provides a comprehensive suite of tools for managing transactions, accounts, users, and cashback schemes. The application is designed with a clean, intuitive user interface and a focus on performance and accessibility.

## Style and Design

- **Framework**: Angular 20+
- **Styling**: Native CSS with a modern, responsive design
- **Components**: Standalone components with `ChangeDetectionStrategy.OnPush`
- **State Management**: Signals for reactive state management
- **Control Flow**: Native `@` syntax for all template logic

## Features

- **Authentication**: Secure login with JWT-based authentication.
- **Dashboard**: A central hub for accessing all application features.
- **Organizations**: Manage organizations with CRUD functionality.
- **Users**: Manage users with CRUD functionality.
- **Staff**: Manage staff members with CRUD functionality.
- **Transactions**: View and manage financial transactions.
- **Documents**: Upload and view documents.
- **Accounts**: Manage financial accounts.
- **Profile**: View and edit user profiles.
- **Cashback Schemes**: Create, edit, and delete cashback schemes.
- **Reports**: Generate and view financial reports.
- **Audit Logs**: Track user activity and system events.
- **Card Management**: Add, transfer, and assign cards.
- **RBAC**: Flexible and configurable role-based access control.

## Current Task: RBAC Inconsistency Fix

- **Objective**: Fix inconsistencies with RBAC to have configurable add, edit, view, delete for roles and same overrideable for users.
- **Steps**:
  1. **Phase 1: Refactor RBAC Core**
     - Defined new `Permission` and `Role` interfaces.
     - Updated the `User` interface to use the new `Role` interface and added an optional `permissions` property for user-specific overrides.
     - Replaced the old `ROLE_PERMISSIONS` with a new `ROLES` array that uses the new interfaces.
     - Updated the `PermissionService` to check for permissions based on a feature and an action, and to correctly handle user-specific overrides and role-based permissions.
  2. **Phase 2: Update Application to New RBAC**
     - Updated the `authGuard` to use the new `feature` and `action` properties in the route data to check for permissions.
     - Updated all routes that require permission checks to have the `feature` and `action` properties in their `data` object.
     - Fixed all compilation errors to ensure the application builds successfully.
  3. **Phase 3: UI and Data Table Updates**
     - Updated the `user-form` to correctly handle the `Role` object.
     - Updated the `data-table` component to correctly render the role name.
