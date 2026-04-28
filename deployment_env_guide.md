# Deployment Environment Variables Guide

This document lists all the environment variables required for deploying the **Notification Project**.

## 1. Backend Configuration
Set these variables in your backend hosting environment (e.g., Render, Heroku, Railway).

| Variable | Description | Recommended Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | JDBC URL for the PostgreSQL database | `jdbc:postgresql://<host>:<port>/<database>` |
| `DB_USER` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `********` |
| `SMTP_HOST` | SMTP server for emails | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port (usually 587 for TLS) | `587` |
| `SMTP_USERNAME` | Your email address | `mrikaismail04@gmail.com` |
| `SMTP_PASSWORD` | Gmail App Password (16 chars) | `suvo thnf gvfw xdjq` |
| `SMTP_FROM` | The email address shown to users | `mrikaismail04@gmail.com` |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID from Google Console | `your-google-client-id.apps.googleusercontent.com` |

## 2. Frontend Configuration
Set these variables in your frontend hosting environment (e.g., Vercel, Netlify).

| Variable | Description | Recommended Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | The public URL of your backend API | `https://your-backend-url.com` |
| `VITE_GOOGLE_CLIENT_ID` | The same Google Client ID used above | `your-google-client-id.apps.googleusercontent.com` |

---

### Security Recommendations
1. **Never commit your actual `.env` file** to public repositories.
2. **Update CORS Settings**: Before final deployment, update the allowed origins in the backend to match your frontend URL instead of using `*`.
3. **App Passwords**: If you change your Google account password, you may need to generate a new Gmail App Password.
