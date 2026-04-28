# 🎨 Step 3: Frontend Deployment (Vercel)

We will use **Vercel** to host your React/Vite frontend. Vercel is incredibly fast, optimized for React, and free.

## 1. Create Vercel Account
1. Go to [Vercel.com](https://vercel.com/).
2. Sign up and choose **Continue with GitHub**.

## 2. Import Your Project
1. On your Vercel Dashboard, click **Add New...** and select **Project**.
2. Find your project repository in the GitHub list and click **Import**.

## 3. Configure the Frontend
1. **Project Name:** `notification-app` (or whatever you like).
2. **Framework Preset:** Vercel should automatically detect **Vite**. Leave it as Vite.
3. **Root Directory:** Click "Edit", select the `frontend` folder, and click continue.

## 4. Connect to Backend
1. Expand the **Environment Variables** section.
2. You need to tell your frontend where your Render backend lives (from Step 2).
3. **Name:** `VITE_API_URL`
4. **Value:** `https://notification-api.onrender.com` (Your Render URL. Do NOT put a trailing slash `/` at the end).
5. Click **Add**.

## 5. Deploy
1. Click the **Deploy** button.
2. Vercel will build your React code and deploy it in about 1 minute.
3. You will be greeted with a celebration screen and a live URL (e.g., `https://notification-app.vercel.app`).

---
✅ **Done!** Your entire project is now live on the internet! 
👉 **Final step:** Open `04_free_domain_setup.md` to get a custom domain name.
