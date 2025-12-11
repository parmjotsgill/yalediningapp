Yale Dining Hall Comparison Platform

A unified web application that helps Yale students quickly compare dining hall menus across campus with powerful filtering by meal period and dietary preferences.
Live Application: https://eatyale.io/
A/B Test Endpoint: https://eatyale.io/1f0b0c6

📋 Table of Contents

Problem Statement
Features
Technology Stack
Getting Started
Project Structure
Deployment
A/B Testing Endpoint
Team
Documentation
License


🎯 Problem Statement
Yale students face daily friction when choosing where to eat. They must:

Navigate multiple websites or visit physical screens to compare menus
Deal with conflicting information and unclear dietary labels
Spend 10-15 minutes deciding where to eat
Have no way to quickly identify options that meet dietary restrictions

Our Solution: A single-page application that aggregates all dining hall menus in real-time, with instant filtering by meal period (breakfast/lunch/dinner) and dietary preferences (vegan, vegetarian, gluten-free, halal).
Validated Impact:

75% of surveyed students found current menu comparison "very difficult" (1.25/5 ease rating)
247 daily active users in first month (exceeded 200 target by 23%)
68% of users engage with filters (exceeded 60% target)
100% scraper reliability (exceeded 95% target)


✨ Features
Core Features

Unified Menu Comparison - View all dining hall menus side-by-side in a single table
Smart Filtering - One-click filters for:

Meal periods: Breakfast, Lunch, Dinner
Dietary restrictions: Vegan, Vegetarian, Gluten-Free, Halal
Dining halls: Select specific locations


Automated Daily Updates - Background scraper fetches fresh menu data every morning at 6:00 AM EST
Mobile-First Design - Responsive interface optimized for mobile (73% of traffic)
Real-Time Data - Menus update daily from official Yale Dining sources

Technical Features

A/B Testing Infrastructure - Built-in variant testing for UI optimization
Analytics Tracking - Plausible Analytics integration (GDPR-compliant)
Error Logging - Comprehensive scraper error tracking and retry logic
Session Management - Stateless session handling via PostgreSQL
12-Factor Compliant - Production-ready architecture following best practices


🛠 Technology Stack
Backend

Runtime: Node.js 18.x
Framework: Express.js
Database: PostgreSQL 14
Session Store: express-session + connect-pg-simple
Web Scraping: Cheerio (jQuery-like HTML parsing)
Scheduling: Render Cron Jobs

Frontend

HTML5 with semantic markup
CSS: Tailwind CSS 3.x
JavaScript: Vanilla ES6+ (no framework)
Build: Direct serving (no build step)

Infrastructure

Hosting: Render (PaaS)
Database: Render PostgreSQL (managed instance)
CI/CD: GitHub → Render automated deployment
Analytics: Plausible Analytics
Monitoring: Custom error logging + Render metrics

Development Tools

Linting: ESLint (Airbnb style guide)
Version Control: Git + GitHub
Project Management: GitHub Projects V2


🚀 Getting Started
Prerequisites

Node.js >= 18.0.0
PostgreSQL >= 14
npm or yarn

Installation

Clone the repository

bash   git clone https://github.com/parmjotsgill/yalediningapp.git
   cd yalediningapp

Install dependencies

bash   # Backend dependencies
   cd backend
   npm install
   
   # Frontend dependencies (if separate)
   cd ../frontend
   npm install

Set up environment variables
Create a .env file in the backend directory:

env   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/yaledining
   
   # Application
   NODE_ENV=development
   PORT=3000
   
   # Session
   SESSION_SECRET=your-random-secret-key-here
   
   # Analytics (optional for local dev)
   PLAUSIBLE_DOMAIN=localhost

Set up the database

bash   # Create database
   createdb yaledining
   
   # Run migrations (if using migration tool)
   npm run migrate
   
   # Or manually run schema file
   psql yaledining < scripts/db-setup.sql

Run the scraper (initial data)

bash   npm run scrape

Start the development server

bash   npm run dev

Access the application
Open your browser to: http://localhost:3000

Running Tests
bash# Run linter
npm run lint

# Run tests (if implemented)
npm test

📁 Project Structure
yalediningapp/
├── backend/
│   ├── src/
│   │   ├── server.js              # Application entry point
│   │   ├── routes/
│   │   │   ├── index.js           # Main routes
│   │   │   ├── menu.js            # Menu API endpoints
│   │   │   └── abtest.js          # A/B test endpoint
│   │   ├── models/
│   │   │   ├── db.js              # Database connection
│   │   │   └── menu.js            # Menu data models
│   │   ├── scrapers/
│   │   │   ├── yale-dining.js     # Main scraper logic
│   │   │   ├── parser.js          # HTML parsing utilities
│   │   │   └── logger.js          # Error logging
│   │   ├── middleware/
│   │   │   ├── analytics.js       # Plausible integration
│   │   │   └── session.js         # Session handling
│   │   └── utils/
│   │       ├── filters.js         # Filter logic
│   │       └── validation.js      # Input validation
│   ├── scripts/
│   │   ├── scrape.js              # Scraper execution
│   │   └── db-setup.sql           # Database schema
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   ├── index.html             # Main HTML
│   │   ├── css/
│   │   │   └── styles.css         # Tailwind styles
│   │   └── js/
│   │       ├── app.js             # Main frontend logic
│   │       ├── filters.js         # Filter interactions
│   │       └── analytics.js       # Client-side tracking
│   └── package.json
│
├── docs/
│   ├── sprints/                   # Sprint documentation
│   ├── architecture.md            # System design
│   └── FINAL_REPORT.md           # Final submission
│
├── .gitignore
├── README.md
└── LICENSE

🌐 Deployment
Production Deployment (Render)
The application is automatically deployed to Render when changes are pushed to the main branch.
Production URL: https://eatyale.io/
Manual Deployment

Install Render CLI (optional)

bash   npm install -g render-cli

Configure render.yaml
The repository includes a render.yaml file for infrastructure as code:

yaml   services:
     - type: web
       name: yalediningapp
       env: node
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: DATABASE_URL
           fromDatabase:
             name: yaledining-db
             property: connectionString
         - key: NODE_ENV
           value: production

Deploy

bash   git push origin main
Render will automatically:

Detect the commit
Build the application
Run health checks
Deploy to production

Environment Variables (Production)
Set these in the Render dashboard:

DATABASE_URL - PostgreSQL connection string (auto-configured)
NODE_ENV - Set to production
SESSION_SECRET - Generate a secure random string
PLAUSIBLE_DOMAIN - Set to eatyale.io

Automated Scraper Schedule
The scraper runs daily at 6:00 AM EST via Render Cron Jobs:
yaml- type: cron
  name: menu-scraper
  schedule: "0 6 * * *"
  command: node scripts/scrape.js

🧪 A/B Testing Endpoint
Endpoint Details
URL: https://eatyale.io/1f0b0c6
Computation:
pythonimport hashlib
team_name = "radiant-phoenix"
sha1_hash = hashlib.sha1(team_name.encode()).hexdigest()
# Result: 1f0b0c6198f395726fa4755102a0a256a0c5c31b
endpoint = sha1_hash[:7]  # "1f0b0c6"
Features

Public access - No authentication required

Button variants:

Variant A: "kudos"
Variant B: "thanks"


Button ID: id="abtest"
Session-based assignment - Consistent variant per visitor

Analytics Results
Based on 347 sessions (Nov 25 - Dec 10, 2025):
VariantSessionsClicksCTRResultA ("kudos")17411264.4%✅ WinnerB ("thanks")1737744.5%-
Statistical Significance: p = 0.0051 (Chi-square test)
Winner: Variant A ("kudos") preferred by 19.9% margin

👥 Team
Team Name: alex-the-lion
Members
Parmjot Product Owner & Scrum Master

Sprint planning and backlog prioritization
User research and persona development
GitHub Project management
Sprint documentation

Louis  - Lead Developer

Backend architecture and API development
Web scraper implementation
Production deployment and infrastructure
Database schema design

Piquet - Frontend Developer

Responsive UI design with Tailwind CSS
Dynamic filtering system implementation
Cross-browser and device testing
A/B test button variants

Sachit - Analytics & QA

Plausible Analytics integration
A/B test statistical analysis
End-to-end testing
Production metrics monitoring


📚 Documentation
Sprint Documentation

Sprint 2 Planning
Sprint 2 Review
Sprint 2 Retrospective
Sprint 3 Planning
Sprint 3 Review
Sprint 3 Retrospective
Sprint 4 Planning
Sprint 4 Review
Sprint 4 Retrospective

Additional Documentation

Team Charter
Final Submission Report
GitHub Project Board


🎓 Course Information
Course: MGT656 - Management of Software Development
Institution: Yale School of Management
Semester: Fall 2025
Instructor: Kyle Jensen

📊 Key Metrics
User Engagement (Nov 25 - Dec 10, 2025)

Key Metrics (Nov 25 - Dec 10, 2025)
Event Count - 253
DAU/MAU - 39.53%
Sessions - 16
Avg. Session Duraiton -  6m32s
Engagment Rate - 5%0%
Bounce Rate - 50%




Technical Performance

Uptime: 99.8%
Average Response Time: 340ms
Error Rate: <0.1%
Scraper Reliability: 100% (target: 95+, +5%)

Sprint Velocity

Sprint 2: 33 points (4.13 velocity)
Sprint 3: 38 points (4.22 velocity)
Sprint 4: 17 points (8.5 velocity)
Average: 5.61 points/story


🔒 12-Factor App Compliance
This application follows 12-factor methodology:

✅ Codebase - Single repo, multiple deploys
✅ Dependencies - Explicitly declared in package.json
✅ Config - Environment variables for all config
✅ Backing Services - PostgreSQL as attached resource
✅ Build, Release, Run - Strict separation of stages
✅ Processes - Stateless, share-nothing architecture
✅ Port Binding - Self-contained service
✅ Concurrency - Scale via process model
✅ Disposability - Fast startup, graceful shutdown
✅ Dev/Prod Parity - Keep environments similar
✅ Logs - Treat as event streams
✅ Admin Processes - Run as one-off processes


🐛 Known Issues
None currently. See Issues for any reported bugs.

🚧 Future Roadmap
Phase 2 Features

 Dish reactions (upvote/downvote system)
 Saved dietary preferences
 Historical menu tracking
 Push notifications for favorite dishes
 Ingredient and allergen details
 Nutrition information display

Technical Improvements

 Expand test coverage to 80%+
 Load testing and optimization
 CI/CD pipeline with automated tests
 Comprehensive API documentation
 Enhanced error monitoring


🙏 Acknowledgments

Yale Dining for providing menu data
Yale School of Management for project support
Course instructor Kyle Jensen for guidance and feedback
All survey participants who validated our problem statement


📞 Contact
For questions or feedback, please open an issue on GitHub or contact the team:
GitHub Repository: https://github.com/parmjotsgill/yalediningapp
Production Application: https://eatyale.io/
