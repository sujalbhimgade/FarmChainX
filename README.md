# 🌱 FarmChainX - AI Driven Agriculture Traceability Network 

A role-based, AI-enabled agriculture platform connecting farmers, distributors, retailers, consumers, and admins to streamline crop management, supply visibility, and trusted farm-to-fork data.

---

## 🚀 Tech Stack

### Frontend
- React + Vite  
- CSS theming  
- Client-side routing  
- State management  
- Form validation  
- API client  

### Backend
- Java (Spring Boot)  
- REST APIs  
- Authentication/Authorization  
- Validation  
- Swagger/OpenAPI  

### AI Microservice
- Python (Flask) REST endpoints for crop image analysis

- OpenAPI/Swagger UI for AI routes

- Normalized JSON outputs for inference

  
### Database
- MySQL with schema migrations/ORM mapping  

---

## 📖 Overview

FarmChainX provides **multi-tenant dashboards** for key stakeholders with secure access to crop, inventory, and transaction data, aiming to improve traceability and decision-making across the agricultural value chain.  

The project is designed as a deliverable for the **Infosys Springboard Java full-stack internship** with a pragmatic scope and clean separation between frontend and backend services.

---

## 🎨 Frontend

- **Framework**: React + Vite for fast dev builds and optimized production bundles  
- **Routing**: Client-side routing for role-based sections and protected routes  
- **State**: Centralized app state for auth session and dashboard data  
- **UI & Theming**: Consistent CSS theme variables, responsive layout, and shared components  
- **Forms**: Validations for login, profile, crop entries, and transactions  
- **API Client**: REST integration with token-aware interceptors and error handling  
- **Testing**: Unit tests for components and basic integration flows  

---

## ⚙️ Backend

- **Runtime**: Java with Spring Boot layering (controller, service, repository)  
- **APIs**: REST endpoints for auth, users, roles, crops, inventory, and transactions with request/response validation  
- **Security**: JWT/session-based auth, role-based access control (admin, farmer, distributor, retailer, consumer)  
- **Data**: MySQL schemas for users, roles, crop records, inventory lots, and transaction ledgers  
- **Docs**: Swagger/OpenAPI for endpoint discovery and testing  
- **Testing**: Service and repository tests for core domain flows  

---

## 📊 Dashboards

- **Admin**: User provisioning, role assignments, audit views, and system metrics  
- **Farmer**: Crop planning, field updates, input usage, and harvest records  
- **Distributor**: Intake, batch creation, routing, and inventory status  
- **Retailer**: Stock visibility, purchase orders, and traceability lookup  
- **Consumer**: Product trace view with origin, handling, and quality checkpoints  

---
## 🤖 AI Context

### Chatbot
A role-aware assistant that answers farming and traceability queries in natural language, grounds responses in authorized real-time data, deep-links to relevant screens, and enforces RBAC and tenant isolation.

### Crop health detection
An image-based service that classifies ripeness and quality from uploads, returning stage, confidence, grade, and handling advice inside dashboards to accelerate harvest, intake, and QC decisions.

---
## ⚡ Environment

- **Frontend**: `.env` for API base URL, auth keys, and feature flags  
- **Backend**: `application.properties` for DB URL/credentials, JWT secret, and CORS  
- **Database**: MySQL instance with migration scripts for reproducible setups  

---

## 🛠️ Getting Started

### Prerequisites
- Node.js  
- Java 17+  
- Maven/Gradle
- Python 3.10+ 
- MySQL  

### Setup

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
mvn spring-boot:run

# AI Microservice (Flask)
cd Backend/farmchainx-flask
python -m venv .venv
```

###  🧪 Testing
- Frontend: Component tests and basic integration flows with mocked services

- Backend: Service/repository tests with Spring Boot test utilities and in-memory or containerized DB

- AI: Endpoint smoke tests (pytest/curl) validating schema and health

### 🔐 Security & Auth
- JWT-based authentication and role checks on protected endpoints

- CORS configured per environment for frontend, backend, and AI microservice

### 📦 Build & Deploy
- Frontend: Vite build outputs static assets suitable for CDN or container delivery

- Backend: Spring Boot packaged as an executable JAR or container image

- AI: Flask packaged as a containerized service that can scale independently

---
### 📜 License
- See the repository’s license file for terms.
