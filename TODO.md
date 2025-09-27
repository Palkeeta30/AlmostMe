<<<<<<< HEAD
# Deployment Plan for Railway

## Information Gathered
- Project is a Django backend with React frontend.
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
=======
# Deployment Fix TODO

## Steps to Complete:

1. **Create .python-version**: Set Python version to 3.12.3 for Django compatibility.
   - Tool: create_file
   - Status: Pending

2. **Clean requirements.txt**: Rewrite with plain UTF-8 content, no BOM/encoding issues, list all existing deps including gunicorn (skip Postgres deps like psycopg2-binary, dj-database-url as per user).
   - Tool: create_file (overwrite)
   - Status: Pending

3. **Update package.json**: Add "postinstall": "npm run build" to scripts for auto-building React on deploy.
   - Tool: edit_file
   - Status: Pending

4. **Update settings.py**: 
   - Set SECRET_KEY from os.environ.get('SECRET_KEY', default).
   - Add '.railway.app' to ALLOWED_HOSTS.
   - Append os.path.join(BASE_DIR, 'build') to STATICFILES_DIRS.
   - Add SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https').
   - Update CSRF_TRUSTED_ORIGINS and CORS_ALLOWED_ORIGINS to include 'https://optimistic-ambition.up.railway.app'.
   - No DB changes (keep SQLite as per user).
   - Tool: edit_file
   - Status: Pending

5. **Update almostme/urls.py**: Add import re_path and TemplateView; add catch-all route for SPA (serve 'index.html' from build/ for non-API paths).
   - Tool: edit_file
   - Status: Pending

6. **Create railway.toml**: Define build commands (npm ci, npm run build, python manage.py collectstatic --noinput --clear) and start command (gunicorn).
   - Tool: create_file
   - Status: Pending

7. **User Actions (Post-Updates)**:
   - Generate and set SECRET_KEY in Railway vars.
   - Commit/push changes to trigger redeploy.
   - Monitor logs; run migrations if needed (railway run python manage.py migrate).
   - Test: Access https://optimistic-ambition.up.railway.app, verify React loads and APIs work.
   - Status: Pending (instruct user)

8. **Verification**:
   - Local: npm install (triggers build), python manage.py collectstatic, runserver, check SPA.
   - If issues: Check Railway logs for gunicorn/static errors.
   - Status: Pending

Note: SQLite on Railway may cause data loss on restarts due to ephemeral FS—consider Postgres later for persistence.
>>>>>>> 82e6390 (Update README title without prefix)
