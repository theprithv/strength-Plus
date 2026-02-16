# ⚡ Strength+ | Premium Fitness Tracker

Strength+ is a state-of-the-art web application designed for athletes who demand precision, speed, and a premium aesthetic in their training. Built with a "dark-mode first" philosophy, it combines a SaaS-inspired interface with a robust backend to provide seamless workout logging and routine management.

![Project Preview](https://github.com/theprithv/Strength-Plus/blob/master/preview.png?raw=true) *(Note: Add your own preview image here later)*

## ✨ Key Features

### 🏋️ Advanced Workout Session
- **Real-time Tracking**: Live duration timer and dynamic stats (Sets, Reps, Volume).
- **Inline Editing**: Correct sets and weights directly in the row—no intrusive pop-ups.
- **Smart Swapping**: Replace any exercise in your stack mid-workout without losing your session data.
- **Session Restoration**: Automatically pick up where you left off if you refresh the page.

### 📋 Routine Management
- **Custom Splits**: Design personalized workout splits (PPL, Upper/Lower, Bro-splits).
- **Reordering**: Drag-and-drop exercises to optimize your training flow.
- **Library Integration**: Search and add from a comprehensive database of muscle-specific exercises.

### 💎 Premium Design
- **Glassmorphism UI**: High-end frosted glass effects and vibrant accent colors.
- **OLED Optimized**: Deep dark themes with #050505 backgrounds to save battery and look stunning.
- **Fluid Animations**: Custom cubic-bezier transitions for toasts, menus, and item entries.
- **Responsive Layout**: Validated against mobile, tablet, and desktop viewports.

### 🤖 AI Integration
- **Gemini-Powered Insights**: Daily analysis of your training volume and muscle balance.
- **Smart Recommendations**: Actionable advice based on your workout history.

## 🛠 Tech Stack

### Frontend
- **React.js**: Functional components with hooks-based state management.
- **Vanilla CSS**: Custom "Redlined" design system (Tailwind-free).
- **Axios**: Secure API communication.

### Backend
- **Node.js & Express**: High-performance RESTful API.
- **Prisma ORM**: Type-safe database management.
- **PostgreSQL**: Robust relational data storage.
- **JWT Auth**: Secure user authentication and session management.
- **Zod**: Strict schema validation for all API inputs.
- **Winston & Morgan**: Production-grade structured logging.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- npm or yarn

### Installation
1. **Clone the Repo**
   ```bash
   git clone https://github.com/theprithv/Strength-Plus.git
   cd Strength-Plus
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   # Create a .env file based on .env.example
   # Required: DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID, GEMINI_API_KEY
   npx prisma migrate dev
   npm start
   ```

### Configuration (.env)
Ensure your `.env` file includes:
- `DATABASE_URL`: Connection string for PostgreSQL.
- `JWT_SECRET`: Secret key for signing tokens.
- `PORT`: Server port (default: 5000).
- `NODE_ENV`: `development` or `production`.
- `GOOGLE_CLIENT_ID`: For Google OAuth.
- `GEMINI_API_KEY`: For AI insights.
- `EMAIL_USER` / `EMAIL_PASS`: For sending OTPs.

3. **Setup Client**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Built by [theprithv](https://github.com/theprithv)
