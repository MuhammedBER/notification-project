# 🗄️ Step 1: Database Deployment (Neon.tech)

We will use **Neon.tech** because it offers a fantastic, permanent free tier for PostgreSQL databases without requiring a credit card.

## 1. Create an Account
1. Go to [Neon.tech](https://neon.tech/).
2. Click **Sign Up** and choose **Continue with GitHub** (the fastest option).

## 2. Create Your Database
1. Once logged in, you will be prompted to create your first project.
2. **Project Name:** `notification-db` (or whatever you prefer).
3. **Postgres Version:** Select 17.
4. **Region:** Choose a region close to where you live (e.g., Europe or US East).
5. Click **Create Project**.

## 3. Get Your Connection String
1. On your project dashboard, look at the **Connection Details** box.
2. Ensure you are on the **Postgres** tab.
3. You will see a **Connection String** that looks like this:
   `postgresql://neondb_owner:YOUR_PASSWORD@ep-nameless-shape-123.eu-central-1.aws.neon.tech/neondb?sslmode=require`
4. **Copy this string and save it somewhere safe.** You will need it in the next step.

---
✅ **Done!** Your cloud database is live. 
👉 **Next step:** Open `02_backend_deployment_render.md`
