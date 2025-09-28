# Signup API Request Failure Fix

## Current Work
Fixing the "API request failed: Failed to fetch" error during signup on the deployed site. The issue is due to the frontend using a hardcoded localhost URL in production, while the backend is correctly configured. Plan approved by user.

## Key Technical Concepts
- Django backend with session-based auth (no JWT).
- React frontend served via Django staticfiles in production.
- API calls must use relative paths (same-origin) for deployment on Railway.
- CORS and CSRF configured for Railway domains.
- Secure cookies for HTTPS in production.

## Relevant Files and Code
- src/utils/api.js: Defines API_BASE_URL; currently sets to localhost in prod.
- almostme/settings.py: Session and CSRF cookie security settings.
- auth_api/views.py: api_signup view (already correct).
- auth_api/urls.py and almostme/urls.py: URL routing (already correct).

## Problem Solving
- Identified root cause: Wrong base URL in api.js for production.
- Verified backend endpoint works locally.
- No database or dependency issues.

## Pending Tasks and Next Steps
- [ ] Update src/utils/api.js to use relative API_BASE_URL = "" in all environments. This ensures fetches like fetch("/auth-api/signup/") hit the same domain (e.g., https://your-app.up.railway.app/auth-api/signup/).
  - Exact change: Replace the conditional with const API_BASE_URL = "";
- [ ] Update almostme/settings.py: Set CSRF_COOKIE_SECURE = True and SESSION_COOKIE_SECURE = True for production HTTPS security.
  - Note: Keep False for local dev if needed, but since DEBUG=False in prod, use conditional if necessary.
- [ ] Execute `python manage.py collectstatic --noinput` to update static files for the React build.
- [ ] Commit and push changes to GitHub: `git add . && git commit -m "Fix signup API URL for production" && git push`.
- [ ] Deploy on Railway (auto-triggers on push).
- [ ] Test: Visit deployed site, attempt signup, verify success toast, redirect to home, and logged-in state (e.g., via /auth-api/current_user/).
- If test fails, check Railway logs via dashboard or `railway logs`.

User confirmed plan: "ok". Proceeding step-by-step.
