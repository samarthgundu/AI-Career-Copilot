# AI Career Copilot - Hackathon Edition

A complete full-stack web application for AI-powered career advancement with 4 interconnected modules.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+ (or use Python 3.14 with fallback mode)
- Node.js 18+
- npm 9+

### Installation & Running

**Backend Setup:**
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

**Run Backend:**
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 📋 Project Structure

```
Hackathon/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── models.py                  # Pydantic data models
│   ├── database.py               # Supabase database layer (with fallback)
│   ├── services.py               # Cloudinary & LlamaParse services
│   ├── ai_service.py             # Gemini AI integration (with fallback)
│   ├── routes/
│   │   ├── resume_routes.py      # Resume upload endpoint
│   │   ├── job_routes.py         # Job target endpoint
│   │   ├── analysis_routes.py    # Resume analysis & ATS check
│   │   ├── interview_routes.py   # Interview chat endpoints
│   │   └── skill_routes.py       # Skill gap & study plan endpoints
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Database schema
│   ├── .env                      # API keys & configuration
│   ├── .env.example              # Environment template
│   ├── requirements.txt          # Python dependencies
│   ├── run_backend.ps1           # PowerShell startup script
│   └── run_backend.bat           # Batch startup script
│
└── frontend/
    ├── src/
    │   ├── main.jsx              # React entry point
    │   ├── App.jsx               # Main app component
    │   ├── index.css             # Global styles
    │   ├── context/
    │   │   └── AppContext.jsx    # Global state management
    │   ├── services/
    │   │   └── api.js            # API client
    │   ├── components/
    │   │   ├── Sidebar.jsx       # Navigation sidebar
    │   │   ├── SharedHeader.jsx  # Resume & job target panel
    │   │   ├── Notification.jsx  # Toast notifications
    │   │   ├── ScoreGauge.jsx    # Animated score display
    │   │   └── SkillChip.jsx     # Skill tag component
    │   └── modules/
    │       ├── ResumeAnalyzer.jsx        # Module 1
    │       ├── InterviewAssistant.jsx    # Module 2
    │       ├── SkillGapAnalyzer.jsx      # Module 3
    │       └── StudyPlanner.jsx          # Module 4
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── .env                      # Frontend config
    ├── .env.example
    └── .gitignore
```

## 🎯 Features

### Module 1: AI Resume Builder & Analyzer
- Upload resume (PDF/DOCX)
- Real-time ATS compatibility scoring
- Skill matching analysis
- AI-generated bullet point suggestions
- Download optimized PDF resume

### Module 2: AI Interview Assistant
- Interactive chatbot-style interviewer
- Real-time AI evaluation with scoring
- Turn-by-turn feedback panel
- Dynamic average score tracking
- Follow-up question generation

### Module 3: Skill Gap Analyzer
- Current vs. required skills visualization
- Priority-ranked gap analysis
- Impact assessment for each skill
- Learning time estimates

### Module 4: Personalized Study Planner
- Week-by-week learning roadmap
- Expandable accordion UI per week
- Topic breakdown per week
- Concrete action items
- Resource recommendations

## 🔑 Environment Variables

Create a `.env` file in both `/backend` and `/frontend`:

**Backend (.env):**
```
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SECRET_KEY=your_supabase_secret_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
LLAMAPARSE_API_KEY=your_llamaparse_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000
```

## 🛠 Tech Stack

### Backend
- **Framework:** FastAPI (Python)
- **Server:** Uvicorn
- **Database:** Supabase (PostgreSQL)
- **File Storage:** Cloudinary
- **Resume Parsing:** LlamaParse API
- **AI:** Google Gemini 1.5 Flash (with fallback mode)
- **ORM:** Direct SQL via Supabase client

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **State Management:** React Context API

## 🔌 API Endpoints

### Resume Management
- `POST /resume/upload` - Upload and parse resume
- `POST /resume/rewrite` - Generate optimized resume

### Job Target
- `POST /job-target` - Save target job information

### Analysis
- `POST /analyze` - Resume vs job analysis
- `POST /ats-check` - ATS compatibility check

### Interview
- `POST /interview/start` - Start new interview session
- `POST /interview/chat` - Continue interview conversation

### Skills & Learning
- `POST /skill-gap` - Analyze skill gaps
- `POST /study-plan` - Generate personalized study plan

## 🎨 UI Features

- **Dark Modern Theme:** Slate & accent blue color scheme
- **Smooth Animations:** Framer Motion transitions
- **Responsive Design:** Mobile-friendly layout
- **Real-time Feedback:** Toast notifications
- **Demo Mode:** "Load Demo" button with pre-filled data
- **Animated Gauges:** Circular progress indicators
- **Interactive Accordions:** Expandable week plans
- **Chatbot Interface:** Message threads with typing indicators

## ⚡ Fallback Modes

The application includes intelligent fallback modes for demo/testing:

1. **Demo Mode (No Gemini):** If Google Gemini API is unavailable, the app uses pre-generated demo responses
2. **Demo Mode (No Supabase):** If database is unreachable, data operations still work with in-memory storage
3. **Resume Parsing Fallback:** LlamaParse failures fall back to basic PDF/DOCX extraction

## 🎮 Demo Usage

1. Click **"Load Demo"** button in header
2. Demo resume and job target will be auto-populated
3. Click **"Analyze Now"** in Resume Analyzer module
4. Try **"Start Interview"** in Interview Assistant
5. Generate **Skill Gap** and **Study Plan** for complete recommendations

## 🚀 Performance Features

- Lazy-loaded components
- Optimized API calls with async/await
- Smooth animations with GPU acceleration
- Efficient state management
- Automatic notification dismissal after 5 seconds

## 📝 Database Schema

Tables created via migration:
- `users` - User accounts
- `resumes` - Uploaded resumes
- `job_targets` - Target job descriptions
- `analyses` - Resume vs job analyses
- `interview_sessions` - Interview chat histories
- `skill_gaps` - Skill analysis results
- `study_plans` - Generated learning roadmaps

## 🔐 Security Notes

- API keys should never be committed (use .env)
- Frontend proxies API requests to prevent CORS issues
- Supabase provides built-in authentication
- All external APIs use secure HTTPS connections

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## ⚙️ Development Notes

### Adding New Features

1. **New API Endpoint:** Add route in `/backend/routes/`
2. **New UI Module:** Create component in `/frontend/src/modules/`
3. **New Shared State:** Update `/frontend/src/context/AppContext.jsx`
4. **Database Changes:** Add SQL migration file

### Running in Production

```bash
# Backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# Frontend
npm run build
npm run preview
```

## 🎯 Hackathon Checklist

- ✅ Complete full-stack application
- ✅ 4 interconnected AI modules
- ✅ Responsive UI with animations
- ✅ Demo data loading
- ✅ Error handling & fallbacks
- ✅ Smooth user experience
- ✅ Real-time feedback
- ✅ Professional dark theme
- ✅ Ready for live demo

## 🤝 Support

For issues or questions:
1. Check the `.env` file configuration
2. Verify backend is running on port 8000
3. Check browser console for frontend errors
4. Review terminal output for backend logs

---

**Built for hackathon demo** | Production-ready code | Zero-downtime setup
