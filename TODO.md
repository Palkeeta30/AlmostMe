# Task: Fix Signup Issue and Deployment Blank Page

## Current Work
- Resolved local "Failed to fetch" by serving React via Django staticfiles (build, copy to staticfiles/build, collectstatic).
- Partial browser testing: Page loads, fields interactive.
- Deployment issue: Blank page on Railway due to missing build/index.html in staticfiles (collectstatic skips non-static dirs).
- Plan: Update railway.toml to copy build/* to staticfiles during build, commit/push for auto-deploy.

## Key Technical Concepts
- Django static serving for SPA: urls.py fallback to build/index.html.
- Railway CI/CD: TOML defines build commands (npm build + collectstatic); add cp for HTML.
- Git deployment: Commit/push triggers rebuild.

## Relevant Files and Code
- railway.toml: Add "cp -r build/* staticfiles/" after npm run build.
- TODO.md: Track steps.

## Problem Solving
- Local works; prod fails on missing SPA entry point.
- Solution: Explicit copy in build script.

## Pending Tasks and Next Steps
- [x] Edit railway.toml to include copy command.
- [x] Update TODO.md with progress.
- [ ] Run git add/commit/push to deploy.
- [ ] Verify production signup at https://almostme-production.up.railway.app/signup (load page, submit form, check user creation/login).
- [ ] Test error cases (duplicates).
- [ ] If success, complete task.
