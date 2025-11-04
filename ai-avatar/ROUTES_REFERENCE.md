# SYNAPZ Platform Routes Reference

Complete guide for Sara AI Assistant to navigate and manage the SYNAPZ website.

## Base URLs

- **Development**: `http://localhost:3081`
- **Production**: *[To be configured]*

---

## Complete Route Listing (18 routes)

### 🔐 Authentication & Access (3 routes)

#### 1. Login Page
- **Route**: `/`
- **Full URL**: `http://localhost:3081/`
- **Name**: Login
- **Purpose**: Main login page for user authentication, initial entry point
- **Available Actions**: Login form, link to registration, link to password recovery
- **Voice Commands**: "login", "sign in", "home page", "start"
- **User Types**: All users (learners, parents, new visitors)
- **Category**: Authentication

#### 2. Registration Page
- **Route**: `/register`
- **Full URL**: `http://localhost:3081/register`
- **Name**: Register
- **Purpose**: Create new learner or parent account
- **Available Actions**: Registration form, user type selection, account creation
- **Voice Commands**: "register", "sign up", "create account", "new user"
- **User Types**: New users only
- **Category**: Authentication

#### 3. Forgot Password Page
- **Route**: `/forgot-password`
- **Full URL**: `http://localhost:3081/forgot-password`
- **Name**: Forgot Password
- **Purpose**: Reset forgotten password via email
- **Available Actions**: Email submission, password reset request
- **Voice Commands**: "forgot password", "reset password", "password help", "recover password"
- **User Types**: Registered users who forgot password
- **Category**: Authentication

---

### 📚 Learning & Education Routes (6 routes)

#### 4. Dashboard
- **Route**: `/dashboard`
- **Full URL**: `http://localhost:3081/dashboard`
- **Name**: Dashboard
- **Purpose**: Main overview with learning progress, upcoming lessons, and quick access to features
- **Available Actions**: View progress summary, access quick links, see upcoming lessons, check notifications
- **Voice Commands**: "dashboard", "home", "main page", "overview", "main menu"
- **User Types**: All authenticated users (learners and parents)
- **Navigation Suggestions**: First page after login, central hub for all activities
- **Category**: Learning

#### 5. Lessons Library
- **Route**: `/lessons`
- **Full URL**: `http://localhost:3081/lessons`
- **Name**: Lessons
- **Purpose**: Browse and access all lessons across subjects (math, English, digital skills)
- **Available Actions**: Browse lessons, filter by subject, start lessons, bookmark lessons
- **Voice Commands**: "lessons", "courses", "learning materials", "study", "learn"
- **User Types**: Learners (primary), Parents (view only)
- **Navigation Suggestions**: Go here when user wants to learn something new
- **Category**: Learning

#### 6. Quiz & Assessments
- **Route**: `/quiz`
- **Full URL**: `http://localhost:3081/quiz`
- **Name**: Quiz
- **Purpose**: Take quizzes and assessments to test knowledge
- **Available Actions**: Start quiz, answer questions, view quiz results, retry quizzes
- **Voice Commands**: "quiz", "test", "assessment", "practice questions", "exam"
- **User Types**: Learners (primary), Parents (view results)
- **Navigation Suggestions**: After completing lessons, for practice, or skill evaluation
- **Category**: Learning

#### 7. ADHD Learning
- **Route**: `/adhd-learning`
- **Full URL**: `http://localhost:3081/adhd-learning`
- **Name**: ADHD Learning
- **Purpose**: Specialized learning modules with ADHD-friendly content and reduced stimulation
- **Available Actions**: Access ADHD-optimized lessons, adjust stimulation levels, focused practice
- **Voice Commands**: "adhd", "focused learning", "special learning", "attention"
- **User Types**: Learners with ADHD or neurodiverse needs
- **Navigation Suggestions**: For learners who need reduced distraction learning environment
- **Category**: Learning

#### 8. Voice Tutor
- **Route**: `/voice-tutor`
- **Full URL**: `http://localhost:3081/voice-tutor`
- **Name**: Voice Tutor
- **Purpose**: Interactive voice-based lessons with Sara's guidance
- **Available Actions**: Start voice lesson, practice speaking, get pronunciation feedback
- **Voice Commands**: "voice tutor", "voice lesson", "audio learning", "speak"
- **User Types**: All learners (especially beneficial for visually impaired)
- **Navigation Suggestions**: For hands-free learning or pronunciation practice
- **Category**: Learning

#### 9. BdSL Translator
- **Route**: `/bdsl-translator`
- **Full URL**: `http://localhost:3081/bdsl-translator`
- **Name**: BdSL Translator
- **Purpose**: Convert text/speech to Bangla Sign Language with 3D avatar demonstrations
- **Available Actions**: Input text/speech, view sign language animations, practice signs
- **Voice Commands**: "sign language", "bdsl", "translator", "sign translator", "deaf"
- **User Types**: Deaf/hard-of-hearing learners, sign language students
- **Navigation Suggestions**: For accessibility or learning sign language
- **Category**: Learning

---

### 📊 Progress & Activity Tracking (4 routes)

#### 10. My Progress
- **Route**: `/progress`
- **Full URL**: `http://localhost:3081/progress`
- **Name**: My Progress
- **Purpose**: View detailed learning progress, completed lessons, and achievements
- **Available Actions**: View progress charts, check achievements, see completion rates
- **Voice Commands**: "progress", "achievements", "learning stats", "my progress", "results"
- **User Types**: Learners (primary), Parents (child's progress)
- **Navigation Suggestions**: After completing activities to check progress
- **Category**: Progress

#### 11. Activity Tracking
- **Route**: `/activity`
- **Full URL**: `http://localhost:3081/activity`
- **Name**: Activity
- **Purpose**: View recent activities, learning history, and session logs
- **Available Actions**: View recent sessions, check login history, see activity timeline
- **Voice Commands**: "activity", "recent activity", "history", "what did i do", "log"
- **User Types**: All authenticated users
- **Navigation Suggestions**: To review recent learning activities
- **Category**: Progress

#### 12. Learning History
- **Route**: `/lernee-history`
- **Full URL**: `http://localhost:3081/lernee-history`
- **Name**: Learning History
- **Purpose**: Comprehensive learning history and past sessions
- **Available Actions**: Browse past sessions, review completed content, export history
- **Voice Commands**: "learning history", "past lessons", "history log", "records"
- **User Types**: Learners (primary), Parents (child's history)
- **Navigation Suggestions**: To review comprehensive learning records
- **Category**: Progress

#### 13. Visual Schedule
- **Route**: `/schedule`
- **Full URL**: `http://localhost:3081/schedule`
- **Name**: Visual Schedule
- **Purpose**: Daily/weekly visual schedule planner for neurodiverse learners
- **Available Actions**: Create schedule, view daily/weekly plans, set reminders
- **Voice Commands**: "schedule", "planner", "daily schedule", "calendar", "plan"
- **User Types**: Neurodiverse learners, all users needing structure
- **Navigation Suggestions**: For planning daily activities and routines
- **Category**: Progress

---

### 💼 Career & Skills Development (3 routes)

#### 14. Skills Assessment
- **Route**: `/skills`
- **Full URL**: `http://localhost:3081/skills`
- **Name**: Skills Assessment
- **Purpose**: Evaluate current skills and identify strengths and areas for improvement
- **Available Actions**: Take skill tests, view skill levels, get recommendations
- **Voice Commands**: "skills", "assessment", "skill test", "evaluate skills", "abilities"
- **User Types**: Learners preparing for employment
- **Navigation Suggestions**: Before job search or career planning
- **Category**: Career

#### 15. Job Matching
- **Route**: `/jobs`
- **Full URL**: `http://localhost:3081/jobs`
- **Name**: Job Matching
- **Purpose**: Browse job opportunities matched to your skills and interests
- **Available Actions**: Search jobs, view matches, apply for positions, save listings
- **Voice Commands**: "jobs", "find jobs", "job search", "employment", "work"
- **User Types**: Learners seeking employment
- **Navigation Suggestions**: After skills assessment, for job hunting
- **Category**: Career

#### 16. Career Path Planning
- **Route**: `/career`
- **Full URL**: `http://localhost:3081/career`
- **Name**: Career Path
- **Purpose**: Explore career options and create career development plans
- **Available Actions**: Explore careers, create plans, set goals, view pathways
- **Voice Commands**: "career", "career path", "career planning", "future jobs"
- **User Types**: All learners planning future
- **Navigation Suggestions**: For long-term career exploration and planning
- **Category**: Career

---

### ⚙️ Settings & Configuration (1 route)

#### 17. Settings
- **Route**: `/settings`
- **Full URL**: `http://localhost:3081/settings`
- **Name**: Settings
- **Purpose**: User preferences, accessibility settings, and profile management
- **Available Actions**: Update profile, change accessibility options, manage preferences
- **Voice Commands**: "settings", "preferences", "options", "configure", "profile"
- **User Types**: All authenticated users
- **Navigation Suggestions**: For customizing experience and accessibility
- **Category**: Configuration

---

### 👪 Parent/Guardian Access (1 route)

#### 18. Parent Dashboard
- **Route**: `/parent`
- **Full URL**: `http://localhost:3081/parent`
- **Name**: Parent Dashboard
- **Purpose**: Parent/guardian view of child's progress and supervision management
- **Available Actions**: View child progress, manage supervision, set controls
- **Voice Commands**: "parent", "parent dashboard", "parent view", "guardian page"
- **User Types**: Parents/guardians only
- **Navigation Suggestions**: For parents to monitor child's learning
- **Category**: Parent

---

## Navigation Patterns

### Common User Flows

1. **New Learner Journey**
   - `/` (Login) → `/register` → `/dashboard` → `/lessons` → `/quiz` → `/progress`

2. **Daily Learning Session**
   - `/dashboard` → `/lessons` → `/voice-tutor` or `/quiz` → `/progress`

3. **Career Preparation**
   - `/skills` → `/jobs` → `/career` → `/lessons` (skill building)

4. **Accessibility Features**
   - `/voice-tutor` (for visually impaired)
   - `/bdsl-translator` (for Deaf users)
   - `/adhd-learning` (for neurodiverse users)

5. **Parent Monitoring**
   - `/parent` → `/progress` → `/activity` → `/lernee-history`

### Quick Access Commands

Sara should recognize these common requests:

- **"Start learning"** → Suggest `/lessons` or `/dashboard`
- **"Take a test"** → Suggest `/quiz`
- **"Check my progress"** → Direct to `/progress`
- **"Find a job"** → Direct to `/jobs`
- **"Plan my career"** → Direct to `/career`
- **"Adjust settings"** → Direct to `/settings`
- **"Practice speaking"** → Direct to `/voice-tutor`
- **"Learn sign language"** → Direct to `/bdsl-translator`

---

## Sara's Navigation Capabilities

### What Sara Can Do:

1. **Provide Direct URLs**: Give complete URLs for any page
2. **Explain Page Purpose**: Describe what users can do on each page
3. **Suggest Next Steps**: Recommend logical next pages based on context
4. **Answer Location Questions**: Tell users where specific features are
5. **Guide User Flow**: Help users navigate through multi-step processes

### Example Sara Responses:

**User**: "Take me to lessons"
**Sara**: "Let me help you navigate to the Lessons page. You can access it at http://localhost:3081/lessons. There you can browse and access all available lessons across subjects like math, English, and digital skills."

**User**: "Where can I find jobs?"
**Sara**: "You can find job opportunities on the Job Matching page at http://localhost:3081/jobs. This page shows job listings matched to your skills and interests."

**User**: "What can I do here?" (on dashboard)
**Sara**: "You're on the Dashboard! Here you can see your learning progress overview, upcoming lessons, and quick access to all features. Would you like to start a lesson, take a quiz, or check your progress?"

---

## Technical Integration Notes

- All routes use React Router DOM
- Protected routes check user authentication
- Role-based access for parent vs learner routes
- Default redirect to login (`/`) for unauthenticated users
- 404 page (`NotFound`) catches invalid routes

## Last Updated

Date: October 23, 2025
Version: 1.0
Base URL: http://localhost:3081
