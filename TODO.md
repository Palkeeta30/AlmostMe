# Deployment Plan for Railway

## Information Gathered
- Project is a Django backend with React frontend.
- railway.toml configured with build commands (pip install, migrate, npm ci, npm run build, collectstatic) and start command (gunicorn).
- settings.py set for production (DEBUG=False, Railway domains in CORS/CSRF, secure sessions).
- Using SQLite database.
- Static files with WhiteNoise.
- Environment variables: SECRET_KEY, EMAIL_HOST_PASSWORD.

## Plan
- [x] Update settings.py for production
- [x] Add migration to railway.toml
- [x] Resolve merge conflicts
- Ensure environment variables set in Railway
- Test deployment

## Followup Steps
- Set env vars in Railway: SECRET_KEY, EMAIL_HOST_PASSWORD
- Push to GitHub, redeploy on Railway
- Monitor logs, test live app
