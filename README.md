# AssetFlow – Enterprise Asset & Resource Management System

> A Modern Full-Stack Enterprise Asset & Resource Management System developed for the Odoo Hackathon 2026.

---

## Overview

AssetFlow is a modern Full-Stack Enterprise Asset & Resource Management System designed to help organizations efficiently manage physical assets and shared resources through a centralized ERP platform.

The application replaces manual spreadsheets and paper-based tracking with an intelligent digital workflow, providing complete visibility into asset allocation, maintenance, bookings, audits, analytics, and reporting.

Built with modern web technologies, AssetFlow provides secure authentication, role-based access control, reusable architecture, responsive UI, and real-time operational insights.

---

## Vision

To simplify and digitize enterprise asset management by providing a centralized, scalable, and intelligent ERP platform for organizations of all sizes.

---

## Mission

The platform enables organizations to:

- Manage departments and employees
- Register and track assets
- Allocate assets securely
- Prevent duplicate allocations
- Manage shared resource bookings
- Automate maintenance workflows
- Conduct structured asset audits
- Generate operational reports
- Improve decision-making through analytics

---

## Problem Statement

Organizations often face challenges such as:

- Manual asset tracking
- Spreadsheet-based workflows
- Double allocation of assets
- Maintenance management issues
- Resource booking conflicts
- Lack of audit visibility
- Limited operational insights

AssetFlow addresses these challenges through a centralized ERP system with secure workflows and intelligent validation.

---

## Features

### Authentication

- Secure Login
- Secure Signup
- JWT Authentication
- Password Encryption
- Role-Based Authentication
- Session Management
- Protected Routes

### Organization Management

- Department Management
- Employee Directory
- Asset Categories
- Parent Departments
- Department Head Assignment
- Employee Status Management

### Asset Management

- Asset Registration
- Auto Asset Tag Generation
- QR Code Support
- Asset Images
- Asset Documents
- Asset History
- Asset Lifecycle Tracking
- Search & Filters

Supported Asset Statuses

- Available
- Allocated
- Reserved
- Under Maintenance
- Lost
- Retired
- Disposed

### Asset Allocation

- Allocate Assets
- Return Assets
- Transfer Requests
- Approval Workflow
- Allocation History
- Expected Return Tracking
- Duplicate Allocation Prevention

### Resource Booking

- Meeting Rooms
- Company Vehicles
- Equipment
- Projectors
- Calendar View
- Booking Validation
- Overlap Detection
- Reschedule Booking
- Booking Cancellation

### Maintenance Management

- Raise Maintenance Requests
- Approval Workflow
- Technician Assignment
- Progress Tracking
- Resolution Tracking
- Maintenance History

Workflow

```
Pending
    ↓
Approved
    ↓
Technician Assigned
    ↓
In Progress
    ↓
Resolved
```

### Asset Audits

- Audit Cycles
- Auditor Assignment
- Asset Verification
- Missing Asset Detection
- Damaged Asset Reporting
- Discrepancy Reports
- Audit History

### Dashboard

- Available Assets
- Allocated Assets
- Assets Under Maintenance
- Active Bookings
- Pending Transfers
- Upcoming Returns
- Overdue Returns
- Recent Activities
- Charts
- Analytics
- Notifications

### Reports

- Asset Utilization
- Department Summary
- Allocation Reports
- Maintenance Reports
- Booking Reports
- Audit Reports

Export Formats

- PDF
- Excel
- CSV

### Notifications

- Asset Allocation
- Transfer Approval
- Maintenance Updates
- Booking Confirmation
- Booking Reminder
- Audit Alerts
- Overdue Return Alerts

### Activity Logs

- Login History
- Asset Activities
- Booking Activities
- Maintenance Activities
- Audit Activities
- Role Changes
- System Logs

---

## User Roles

### Admin

- Manage Departments
- Manage Employees
- Assign Roles
- Configure Organization
- Manage Asset Categories
- Manage Audit Cycles
- View Analytics

### Asset Manager

- Register Assets
- Allocate Assets
- Approve Transfers
- Approve Maintenance Requests
- Approve Returns
- Manage Asset Lifecycle

### Department Head

- View Department Assets
- Approve Requests
- Book Resources
- Monitor Department Allocations

### Employee

- View Assigned Assets
- Raise Maintenance Requests
- Book Resources
- Request Asset Transfers
- Request Asset Returns

---

## System Workflow

```
Organization Setup
        │
        ▼
Employee Management
        │
        ▼
Asset Registration
        │
        ▼
Asset Allocation
        │
        ▼
Transfer / Return
        │
        ▼
Maintenance
        │
        ▼
Audit
        │
        ▼
Reports & Dashboard
```

---

## Technology Stack

### Frontend

- React.js
- Vite
- JavaScript (ES6+)
- Tailwind CSS
- shadcn/ui
- React Router DOM
- Axios

### Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcrypt
- Multer

### Database

- MongoDB
- Mongoose

---

## Architecture

```
React + Vite

        │

REST API

        │

Node.js + Express

        │

MongoDB
```

---

## Validations

- Client-side Validation
- Server-side Validation
- JWT Authentication
- Password Encryption
- Role-Based Authorization
- Duplicate Allocation Prevention
- Booking Overlap Validation
- Protected APIs
- Error Handling
- Input Validation

---

## Main Modules

- Authentication
- Dashboard
- Organization
- Departments
- Employees
- Asset Categories
- Assets
- Asset Allocation
- Transfer Requests
- Resource Booking
- Maintenance
- Asset Audits
- Reports
- Notifications
- Activity Logs
- Settings

---

## Objectives

- Improve Asset Visibility
- Prevent Duplicate Allocation
- Reduce Manual Processes
- Improve Accountability
- Simplify Maintenance
- Automate Audits
- Generate Actionable Insights

---

## Future Enhancements

- QR Code Scanner
- RFID Integration
- Mobile Application
- AI-Based Asset Prediction
- Predictive Maintenance
- IoT Integration
- Email Notifications
- SMS Notifications
- Multi-Company Support

---

## Developed For

**Odoo Hackathon 2026**

Enterprise Asset & Resource Management System

---

## Built With

- React.js
- Vite
- Node.js
- Express.js
- MongoDB
- Tailwind CSS

---

## License

This project has been developed for educational, learning, and hackathon purposes only.