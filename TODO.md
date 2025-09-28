# Deployment Plan for Railway

## Information Gathered
- Project is a Django backend with React frontend.
<<<<<<< HEAD
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
=======
- railway.toml already configured with build commands (pip install, npm ci, npm run build, collectstatic) and start command (gunicorn).
- settings.py has DEBUG=True, needs production settings.
- Using SQLite database, which is fine for Railway.
- Static files configured with WhiteNoise.
- CORS and CSRF set for localhost, need to add Railway domain.
- Environment variables needed: SECRET_KEY, EMAIL_HOST_PASSWORD.

## Plan
- [x] Update settings.py for production:
  - [x] Set DEBUG=False
  - ALLOWED_HOSTS already includes Railway domains
  - Railway domain already in CSRF_TRUSTED_ORIGINS and CORS_ALLOWED_ORIGINS
- [x] Add migration command to railway.toml build commands
- Ensure environment variables are set in Railway dashboard
- Test deployment

## Dependent Files to Edit
- almostme/settings.py
- railway.toml

## Followup Steps
- Set environment variables in Railway: SECRET_KEY, EMAIL_HOST_PASSWORD
- Deploy and monitor for errors
- If crashes, check logs for issues like missing env vars or database errors
>>>>>>> c0f43f394f42fd07343418e6ae38b9fe5b0aea3f
