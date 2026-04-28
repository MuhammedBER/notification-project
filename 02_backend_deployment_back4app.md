# ⚙️ Step 2: Backend Deployment (Back4App)

Since Render is strictly asking you for a credit card to deploy Docker containers, we will use **Back4App Containers**. It is a fantastic alternative that natively supports Docker and **DOES NOT require a credit card** for its free tier.

## 1. Push Code to GitHub
Ensure your latest code (including the `Dockerfile` inside the `backend` folder) is pushed to your GitHub repository.

## 2. Create Back4App Account
1. Go to [Back4App Containers](https://www.back4app.com/containers).
2. Click **Sign Up** and register using **GitHub**.

## 3. Create a New App
1. On your Dashboard, click on **Build new app**.
2. Select **CaaS (Containers as a Service)**.
3. Connect your GitHub account and select your `Cloud-project` repository.

## 4. Configure the Service
1. **App Name:** `notification-api` (or whatever you prefer).
2. **Root Directory:** Type `backend` (this tells Back4App to look inside the backend folder for your Dockerfile).
3. **Branch:** `main` (or whichever branch you pushed to).

## 5. Add Environment Variables
Scroll down to the **Environment Variables** section. You need to add the exact credentials from your Neon database (Step 1).

*Important: When setting the `DATABASE_URL`, change `postgresql://` at the start of your Neon string to `jdbc:postgresql://` for Java!*

1. **Key:** `DATABASE_URL`
   **Value:** `jdbc:postgresql://ep-nameless-shape-123...` (Your Neon connection string)
2. **Key:** `DB_USER`
   **Value:** `postgres` (or your Neon username)
3. **Key:** `DB_PASSWORD`
   **Value:** Your Neon database password

## 6. Deploy
1. Click **Create App**.
2. Back4App will automatically read your Dockerfile, build the Spring Boot application, and start it.
3. Wait until the deployment finishes.
4. Once it is live, look for the green link at the top (e.g., `https://notificationapi-xxxxx.b4a.run`). **Copy this URL!**

---
✅ **Done!** Your backend API is live and connected to your database, with no credit card required!
👉 **Next step:** Open `03_frontend_deployment_vercel.md` (Use the Back4App URL you just copied for the `VITE_API_URL`).
