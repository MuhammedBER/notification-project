# 🌍 Global Deployment Guide

Welcome to your complete deployment handbook! This guide will walk you through hosting your entire project (Database, Backend, and Frontend) completely for free, and finishing it off with a custom domain name.

### 📋 The Deployment Pipeline

To successfully deploy your application, you must follow the steps in this specific order. The backend needs the database to exist first, and the frontend needs the backend to exist first.

Here is your roadmap:

#### Step 1: Deploy the Database
You will start by creating a free PostgreSQL database in the cloud.
👉 **Go to file:** `01_database_deployment_neon.md`

#### Step 2: Deploy the Backend
Once your database is ready, you will deploy your Spring Boot API (using Docker) and connect it to your new database.
👉 **Go to file:** `02_backend_deployment_render.md`

#### Step 3: Deploy the Frontend
With your API live, you will deploy your React/Vite frontend and connect it to your backend API.
👉 **Go to file:** `03_frontend_deployment_vercel.md`

#### Step 4: Custom Domain Name
Finally, you will claim a free custom domain name and link it to your live frontend to make your project look professional.
👉 **Go to file:** `04_free_domain_setup.md`

---
*Ready? Open `01_database_deployment_neon.md` to begin!*
