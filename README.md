# AssetFlow – Enterprise Asset & Resource Management System

> A modern enterprise-grade Asset & Resource Management platform built for the Odoo Hackathon 2026.

---

## Overview

AssetFlow is a centralized ERP solution designed to help organizations efficiently manage their physical assets and shared resources. It replaces manual spreadsheets and paper-based tracking with a streamlined digital workflow, providing complete visibility into asset allocation, maintenance, bookings, audits, and reporting.

The system enables organizations to manage the complete lifecycle of assets—from registration to retirement—while improving accountability, operational efficiency, and decision-making.

---

## Problem Statement

Organizations often struggle with:

- Manual asset tracking
- Double allocation of assets
- Inefficient maintenance management
- Shared resource booking conflicts
- Lack of audit visibility
- Poor reporting and operational insights

AssetFlow solves these challenges by providing a centralized and intelligent asset management platform.

---

## Key Features

### Organization Management

- Department Management
- Employee Directory
- Asset Categories
- Role-Based Access Control

---

### Asset Management

- Register Assets
- QR Code Support
- Asset Tag Generation
- Asset Lifecycle Tracking
- Asset Status Management
- Asset History
- Asset Documents
- Asset Images

Asset Statuses:

- Available
- Allocated
- Reserved
- Under Maintenance
- Lost
- Retired
- Disposed

---

### Asset Allocation

- Allocate Assets
- Return Assets
- Transfer Requests
- Approval Workflow
- Allocation History
- Expected Return Tracking
- Conflict Detection

---

### Resource Booking

Manage shared resources such as:

- Meeting Rooms
- Vehicles
- Equipment
- Projectors

Features:

- Calendar View
- Booking Validation
- Overlap Detection
- Reschedule
- Cancellation

---

### Maintenance Management

- Raise Maintenance Requests
- Approval Workflow
- Technician Assignment
- Progress Tracking
- Attachments
- Maintenance History

Workflow:

Pending → Approved → Assigned → In Progress → Resolved

---

### Asset Audits

- Audit Cycles
- Auditor Assignment
- Asset Verification
- Missing Asset Detection
- Damaged Asset Reporting
- Discrepancy Reports

---

### Dashboard & Analytics

Interactive dashboard including:

- Available Assets
- Allocated Assets
- Assets Under Maintenance
- Pending Transfers
- Upcoming Returns
- Maintenance Trends
- Asset Utilization
- Department Statistics

---

### Reports

Generate reports for:

- Asset Utilization
- Department Summary
- Maintenance History
- Resource Bookings
- Audit Reports

Export Support:

- PDF
- Excel
- CSV

---

### Notifications

Real-time notifications for:

- Asset Allocation
- Transfer Approval
- Maintenance Updates
- Booking Confirmation
- Audit Alerts
- Overdue Returns

---

### User Roles

#### Admin

- Manage entire system
- Create departments
- Manage employees
- Configure settings
- View reports

#### Asset Manager

- Register assets
- Allocate assets
- Approve maintenance
- Handle transfers

#### Department Head

- View department assets
- Approve requests
- Monitor allocations

#### Employee

- View assigned assets
- Raise maintenance requests
- Book resources
- Request transfers

---

## System Workflow

```
Department Setup
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

- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router

### Backend

- Supabase
- PostgreSQL
- Authentication
- Row Level Security

### Database

- PostgreSQL

---

## Main Modules

- Dashboard
- Organization
- Departments
- Employees
- Asset Categories
- Assets
- Allocations
- Transfers
- Bookings
- Maintenance
- Audits
- Reports
- Notifications
- Activity Logs
- Settings

---

## Objectives

- Improve asset visibility
- Prevent duplicate allocation
- Simplify maintenance workflow
- Enable audit tracking
- Increase operational efficiency
- Reduce manual effort
- Provide actionable insights

---

## Future Enhancements

- QR Code Scanner
- Mobile Application
- AI-based Asset Prediction
- Predictive Maintenance
- RFID Integration
- IoT-enabled Asset Tracking
- Email & SMS Notifications
- Barcode Printing
- Multi-Company Support

---

## Developed For

**Odoo Hackathon 2026**

Enterprise Asset & Resource Management System

---

## License

This project is developed solely for educational and hackathon purposes.git 