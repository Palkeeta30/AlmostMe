# AlmostMe - a wellness web app

A comprehensive React (Vite) frontend integrated with a Django backend, designed to help users improve their physical health, mental wellbeing, and emotional balance.

---

## 🌟 Features

- 🎮 Games Collection
  - CardFlipChallenge, MindMazeMatch, BubbleBurstBliss, ZenGardenPuzzle, ReactionRush, ColorCatchDash, WordQuest
- 🍎 Diet & Meal Planner (DietPage)
- 😊 Emotion Detection (EmotionPage)
- 💪 Fitness Tracking (FitnessPage)
- 🔐 Authentication (Login, Signup, Profile)
- 📞 Contact & Feedback (ContactPage)

---

## 🚀 Getting Started

This repository appears to be a monorepo containing both the React frontend and Django backend apps.

### Prerequisites

- Node.js >= 18 (recommended)
- npm >= 9 (or pnpm/yarn if preferred)
- Python >= 3.10 and pip (for the Django backend)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd almost-memain
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create a frontend environment file `.env` in the project root:
   ```bash
   # .env (frontend)
   VITE_API_URL=http://localhost:8000/api
   ```

4. Start the development servers:
   - Backend (example; adjust to your setup):
     ```bash
     # From the Django project root (where manage.py resides)
     python -m venv .venv && .venv/Scripts/activate  # Windows (PowerShell: .venv\Scripts\Activate.ps1)
     pip install -r requirements.txt
     python manage.py migrate
     python manage.py runserver 0.0.0.0:8000
     ```
   - Frontend (Vite):
     ```bash
     npm run dev
     ```

Frontend will typically be available at http://localhost:5173 and the API at http://localhost:8000/api.

### Building for Production

```bash
npm run build
# Optional local preview
npm run preview
```

---

## 🏗️ Project Structure (key files)

```text
.
├── index.html                    # Vite HTML entry
├── package.json
├── requirements.txt              # Backend requirements
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── index.jsx
│   ├── auth/
│   │   └── AuthContext.jsx
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProgressCircle.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── ThemeProvider.jsx
│   │   └── games/
│   │       ├── BubbleBurstBliss.css
│   │       ├── BubbleBurstBliss.jsx
│   │       ├── CardFlipChallenge.css
│   │       ├── CardFlipChallenge.jsx
│   │       ├── ColorCatchDash.css
│   │       ├── ColorCatchDash.jsx
│   │       ├── MindMazeMatch.css
│   │       ├── MindMazeMatch.jsx
│   │       ├── ReactionRush.css
│   │       ├── ReactionRush.jsx
│   │       ├── WordQuest.css
│   │       ├── WordQuest.jsx
│   │       ├── ZenGardenPuzzle.css
│   │       └── ZenGardenPuzzle.jsx
│   ├── pages/
│   │   ├── Auth.css
│   │   ├── ContactPage.jsx
│   │   ├── DietPage.jsx
│   │   ├── EmotionPage.jsx
│   │   ├── FitnessPage.css
│   │   ├── FitnessPage.jsx
│   │   ├── GamesPage.css
│   │   ├── GamesPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── Login.jsx
│   │   ├── ProfilePage.css
│   │   ├── ProfilePage.jsx
│   │   └── Signup.jsx
│   └── utils/
│       └── api.js
├── templates/
│   ├── base.html
│   └── fitness/index.html
├── auth_api/
│   ├── urls.py
│   └── views.py
├── emotion/
│   ├── api_views.py
│   ├── models.py
│   └── urls.py
├── fitness/
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
├── diet/
│   └── models.py
└── games/
    └── models.py
```

---

## 🎨 Design System

### Color Palette

- Primary: `#8e44ad` (Purple)
- Secondary: `#3498db` (Blue)
- Accent: `#1abc9c` (Teal)
- Neon Colors:
  - Green: `#39ff14`
  - Orange: `#ff6b35`
  - Blue: `#00d4ff`
  - Purple: `#bf00ff`
- Dark Theme: `#121218` (Background), `#1a1a2e` (Secondary)

### Typography

- Font Family: Poppins (Google Fonts)
- Weights: 300, 400, 500, 600, 700

### Animations

- Smooth transitions with CSS custom properties
- Intersection Observer for scroll animations
- Floating elements and particle effects
- Staggered animation delays for enhanced UX

---

## 🔌 API Integration (examples)

These examples assume your API base is configured via `VITE_API_URL`.

### Contact Form

```json
POST /api/contact/
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

### Emotion Analysis

```json
POST /api/emotion/analyze/
FormData {
  "mood": "string" (optional),
  "image": File (optional)
}
```

### Meal Planning

```json
POST /api/diet/meal-plan/
{
  "breakfast": [ ... ],
  "lunch": [ ... ],
  "dinner": [ ... ],
  "snack": [ ... ]
}
```

### Fitness Tracking

```json
POST /api/fitness/log-workout/
{
  "name": "string",
  "duration": 30,
  "calories": 250,
  "exercises": [ ... ]
}
```

### Game Scores

```json
POST /api/games/score/
{
  "game": "string",
  "score": 123,
  "level": 2,
  "duration": 60
}
```

---

## 📱 Responsive Design

- Desktop: 1024px and above
- Tablet: 768px - 1023px
- Mobile: 480px - 767px
- Small Mobile: Below 480px

---

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast mode support
- Reduced motion preferences
- Focus management
- Screen reader compatibility

---

## 🧪 Testing

Frontend tests are not configured yet. If you add Vitest/Jest:

- Vitest example:
  ```bash
  npm run test
  npm run test -- --coverage
  ```
- Jest example:
  ```bash
  npm test
  npm test -- --coverage
  ```

Document the selected test runner in this section when added.

---

## 🚀 Deployment

### Vercel (Vite)

- Build Command: `npm run build`
- Output Directory: `dist`
- Environment: set `VITE_API_URL` to your production API base URL

### Netlify

```bash
npm run build
```
- Publish Directory: `dist`
- Environment: set `VITE_API_URL`

### Traditional Hosting

```bash
npm run build
# Upload the contents of the dist/ folder to your static host
```

Ensure your backend is deployed and `VITE_API_URL` points to it over HTTPS.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License. Add a LICENSE file to the repository root if it is missing.

---

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- React Router for navigation

---

**AlmostMe** — Not just an app, it's Almost You. 💜

AlmostMe is a full-stack wellness web app combining fitness tracking, diet planning, emotion detection, and interactive brain games. Built with React, Django, and REST APIs, it offers AI-assisted features, progress visualization, and a responsive, engaging UX for holistic self-care.
