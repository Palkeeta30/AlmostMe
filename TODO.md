# TODO: Fix Signup Issue - Production Serving Setup

## Steps to Complete:
1. **Build React App**: Run `npm run build` to generate the production build in the `build/` directory.
2. **Copy Build Contents to Staticfiles**: Copy all contents from `build/` to `staticfiles/` so Django can serve the React SPA.
3. **Run Collectstatic**: Execute `python manage.py collectstatic --noinput` to ensure all static files are collected properly.
4. **Test Locally**: Start Django server with `python manage.py runserver` and verify signup at http://localhost:8000/signup using browser.
5. **Deploy to Railway**: Commit changes (if any) and push to GitHub; Railway will auto-deploy. Verify on production URL.

Progress:
- [x] Step 1: Build React
- [x] Step 2: Copy Build to Staticfiles
- [x] Step 3: Collectstatic
- [x] Step 4: Local Test
- [x] Step 5: Deploy (Run `git add . && git commit -m "Fix signup by serving React via Django staticfiles" && git push` for Railway auto-deploy)
