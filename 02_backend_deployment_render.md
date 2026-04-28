# ⚙️ Step 2: Backend Deployment (Render)

We will use **Render.com** to host your Spring Boot backend because it has a great free tier and natively supports your `Dockerfile`.

## 1. Push Code to GitHub
Ensure your latest code (including the `Dockerfile` inside the `backend` folder) is pushed to your GitHub repository.

## 2. Create Render Account
1. Go to [Render.com](https://render.com/).
2. Click **Get Started** and register using **GitHub**.

## 3. Create Web Service
1. On your Render Dashboard, click **New +** and select **Web Service**.
2. Choose **Build and deploy from a Git repository**.
3. Connect your GitHub account and select your project's repository.

## 4. Configure the Service
1. **Name:** `notification-api`.
2. **Root Directory:** Type `backend` (this tells Render to look inside the backend folder for the Dockerfile).
3. **Environment:** Select **Docker**.
4. **Instance Type:** Select **Free**.

## 5. Add Environment Variables
Scroll down to the **Environment Variables** section and click **Add Environment Variable**. You need to add the credentials from your Neon database (Step 1).

*Important: When setting the `DATABASE_URL`, change `postgresql://` at the start of your Neon string to `jdbc:postgresql://` for Java!*

1. **Key:** `DATABASE_URL`
   **Value:** `jdbc:postgresql://ep-nameless-shape-123...` (Your Neon connection string)
2. **Key:** `DB_USER`
   **Value:** Your Neon username (usually `neondb_owner`)
3. **Key:** `DB_PASSWORD`
   **Value:** Your Neon database password

## 6. Deploy
1. Click **Create Web Service**.
2. Render will use your Dockerfile to build and start your Java application.
3. Wait until the status says **Live** (this might take 5-10 minutes the first time).
4. Look at the top left to find your live URL (e.g., `https://notification-api.onrender.com`). **Copy this URL!**

---
✅ **Done!** Your backend API is live and connected to your database.
👉 **Next step:** Open `03_frontend_deployment_vercel.md`
