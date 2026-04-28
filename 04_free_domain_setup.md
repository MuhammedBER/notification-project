# 🌐 Step 4: Free Domain Name Setup

You currently have a Vercel URL (e.g., `your-app.vercel.app`). Now, we will get a completely free custom domain name and link it to your frontend.

Since getting a completely free `.com` is impossible, we will use **FreeDNS (afraid.org)** to get a professional-looking subdomain for free.

## 1. Register for a Free Domain
1. Go to [freedns.afraid.org](https://freedns.afraid.org/).
2. Click **Sign up** on the left menu and create an account.
3. After confirming your email and logging in, click on **Subdomains** on the left menu.
4. Click the **Add** button.

## 2. Choose Your Domain
1. **Type:** Change this dropdown from `A` to `CNAME`.
2. **Subdomain:** Type the name you want (e.g., `my-cloud-project`).
3. **Domain:** Choose an extension from the dropdown (e.g., `mooo.com`, `crabdance.com`, or `strangled.net`).
   *(So your final URL will be something like `my-cloud-project.mooo.com`).*
4. **Destination:** Type exactly `cname.vercel-dns.com`.
5. Enter the captcha code and click **Save!**.

## 3. Link the Domain to Vercel
1. Go back to your [Vercel Dashboard](https://vercel.com/) and open your frontend project.
2. Click on the **Settings** tab.
3. Click on **Domains** in the left sidebar.
4. In the input box, type the free domain you just created (e.g., `my-cloud-project.mooo.com`) and click **Add**.

## 4. Wait for Verification
1. Vercel will now attempt to verify the domain. 
2. Because you set up the `CNAME` record to point to `cname.vercel-dns.com` on FreeDNS, Vercel will automatically detect it.
3. It may take a few minutes for the DNS settings to propagate across the internet.
4. Once verified, Vercel will automatically generate a free SSL certificate for you.

---
🎉 **CONGRATULATIONS!** 🎉
You have successfully deployed a cloud database, a Dockerized backend, a React frontend, and connected it all to a custom domain name!
