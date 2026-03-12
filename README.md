# HRMS Dashboard System

A full-stack **Human Resource Management System (HRMS)** designed to manage employees, attendance policies, leave workflows, and recruitment pipelines through a centralized dashboard.

The system focuses on **secure authentication, modular backend architecture, policy-driven HR operations, and real-time system updates**.

This project demonstrates practical implementation of **enterprise-style HR systems** used in organizations for managing internal workforce operations.

---

## Credentials - 
#### admin - 
  ##### mail - admin@company.com 
  ##### password - Admin@123

#### manager - 
  ##### mail - manager@company.com 
  ##### password - Manager@123

## 📌 Problem Statement

Organizations require centralized systems to manage employees, attendance records, leave requests, and recruitment workflows.

Traditional manual HR processes lead to:

- inefficient employee record management
- lack of visibility in attendance tracking
- unstructured leave approval processes
- poor recruitment pipeline tracking
- difficulty monitoring organizational HR operations

This project aims to design a **structured HR management platform** that digitizes these processes through a scalable backend architecture and responsive dashboard interface.

---

## 🎯 Objectives

- Build a centralized HR management platform
- Implement **role-based access control**
- Design a **policy-driven attendance system**
- Create a structured **leave approval workflow**
- Implement a **recruitment pipeline management system**
- Enable **real-time dashboard updates**
- Apply **secure authentication and API architecture**

---

## 🧠 Core Design Philosophy

- Backend-first architecture
- Modular service-based design
- Secure authentication and authorization
- Policy-driven HR operations
- Real-time event communication
- Scalable REST API structure

---

## 🏗️ System Architecture

### High-Level Flow

User
│
│ (Authenticated Login)
▼
Frontend Dashboard (React.js)
│
▼
API Layer (Node.js + Express)
│
├── Authentication Middleware
├── Role Authorization
│
▼
Service Layer
│
├── User Management Service
├── Attendance Policy Engine
├── Leave Management Service
├── Recruitment Pipeline Service
│
▼
Database Layer



### Key Architectural Principles

- Separation of concerns
- Modular API services
- Role-based middleware authorization
- Scalable backend design
- Real-time event communication using Socket.IO

---

## 🗂️ System Modules

### User & Manager Management

Administrative tools for managing employees and organizational roles.

Features include:

- employee creation and management
- manager role assignment
- profile updates
- permission-based access control

---

### Attendance Management System

The attendance system follows a **policy-driven architecture**.

Supported policies include:

- Grace Time Policy
- Overtime Policy
- Working Hour Tracking

This allows organizations to configure attendance rules according to their operational requirements.

---

### Leave Management System

The leave module implements a **structured approval workflow**.

Features include:

- leave request submission
- manager approval or rejection
- leave history tracking
- configurable leave policies

---

### Recruitment Pipeline System

The recruitment module enables organizations to track candidates throughout the hiring process.

Features include:

- job requisition creation
- candidate pipeline tracking
- interview stage management
- recruitment status monitoring

---

### Real-Time Updates

The platform integrates **Socket.IO** to support real-time system updates.

Real-time updates include:

- recruitment status changes
- leave approval notifications
- dashboard activity updates
- workflow status updates

---

## ⚙️ Tech Stack

### Frontend

- React.js
- Material UI
- Axios

### Backend

- Node.js
- Express.js
- REST API architecture
- Socket.IO

### Database

- MySQL / relational database

### Security

- JWT authentication
- Email OTP verification
- IP-based access control

### Development Tools

- Git version control
- CI/CD pipeline
- Jest testing
- CodeRabbit AI code review

---

## 🚀 Current Features

### Implemented

- secure JWT authentication
- email OTP login verification
- role-based access control
- user and manager management
- attendance policy engine
- leave approval workflow
- recruitment pipeline tracking
- real-time system updates
- modular backend architecture

### Planned

- analytics dashboard
- system notification service
- audit logs for HR operations
- multi-organization support
- mobile responsiveness improvements

---

## 📡 API Overview

### Authentication APIs



---

## 🔍 Why This Project Stands Out

- Implements a **real-world HR management workflow**
- Uses **policy-driven attendance architecture**
- Supports **role-based system design**
- Integrates **real-time event communication**
- Applies **secure authentication practices**
- Follows **modular backend architecture**

This project demonstrates practical understanding of **backend system design and scalable API development**.

---

## 📚 Academic Relevance (Major Project)

This project demonstrates:

- backend architecture design
- REST API development
- authentication and authorization systems
- database modeling
- real-time system communication
- enterprise workflow design

The implementation reflects **real-world HR system architecture used in modern organizations**.

---

## 🧪 Future Enhancements

- asynchronous job workers
- advanced analytics dashboard
- audit logging system
- AI-assisted recruitment analysis
- multi-language support
- enterprise-level monitoring

---

## 👤 Author

#### Abhishek Jevene

Backend Developer

Focus Areas:

- Backend architecture
- API development
- System design

LinkedIn  
https://www.linkedin.com/in/abhishek-jevene-2a3b18267/

Email  
jeveneabhi665@gmail.com

---

## 📜 License

This project is developed for **academic and learning purposes**.
