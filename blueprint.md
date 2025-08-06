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

## Current Task: Add Card Module

- **Objective**: Implement a new module for card management with features for adding, transferring, and assigning cards.
- **Steps**:
  1. **Phase 1: Core Structure and Card Addition**
     - Created the `Card` interface and `CardService`.
     - Implemented a form to add multiple cards at once, with each card's details displayed on a single line.
     - Added the new routes to the application.
  2. **Phase 2: Card Transfer**
     - Implemented a form to transfer multiple cards to different organizational levels.
     - Added logic to differentiate between admin and branch office users.
  3. **Phase 3: Card Assignment and Management**
     - Created a form for staff to assign cards to users.
     - Implemented features for revoking cards and managing their expiry dates.
     - Added a data table to view and manage card assignments.
