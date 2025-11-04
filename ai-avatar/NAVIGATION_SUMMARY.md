# Sara's Navigation Quick Reference

## 🎯 Quick Route Access

Base URL: **http://localhost:3081**

### Authentication (3)
- `/` - Login
- `/register` - Register
- `/forgot-password` - Forgot Password

### Learning (6)
- `/dashboard` - Dashboard (main hub)
- `/lessons` - Lessons Library
- `/quiz` - Quiz & Assessments
- `/adhd-learning` - ADHD Learning
- `/voice-tutor` - Voice Tutor
- `/bdsl-translator` - BdSL Translator

### Progress (4)
- `/progress` - My Progress
- `/activity` - Activity Tracking
- `/lernee-history` - Learning History
- `/schedule` - Visual Schedule

### Career (3)
- `/skills` - Skills Assessment
- `/jobs` - Job Matching
- `/career` - Career Path

### Other (2)
- `/settings` - Settings
- `/parent` - Parent Dashboard

---

## 🗣️ Common Voice Commands

| User Says | Sara Directs To |
|-----------|-----------------|
| "Start learning" | `/lessons` or `/dashboard` |
| "Take a test" | `/quiz` |
| "Check my progress" | `/progress` |
| "Find a job" | `/jobs` |
| "Plan my career" | `/career` |
| "Practice speaking" | `/voice-tutor` |
| "Learn sign language" | `/bdsl-translator` |
| "Adjust settings" | `/settings` |
| "View schedule" | `/schedule` |
| "Recent activity" | `/activity` |

---

## 📊 Route Categories Summary

**Total Routes**: 18

- **Authentication**: 3 routes (login, register, password recovery)
- **Learning**: 6 routes (dashboard, lessons, quiz, ADHD, voice, BdSL)
- **Progress**: 4 routes (progress, activity, history, schedule)
- **Career**: 3 routes (skills, jobs, career path)
- **Configuration**: 1 route (settings)
- **Parent**: 1 route (parent dashboard)

---

## 🔄 Common User Flows

### New User
`/` → `/register` → `/dashboard` → `/lessons`

### Daily Learning
`/dashboard` → `/lessons` → `/quiz` → `/progress`

### Career Seeker
`/skills` → `/jobs` → `/career`

### Parent Check
`/parent` → `/progress` → `/activity`

---

## 💬 Response Templates for Sara

### Providing URLs
```
"Let me help you navigate to the [Page Name] page. 
You can access it at http://localhost:3081[route]. 
[Brief description of what they can do there]."
```

### Suggesting Navigation
```
"To [user goal], you should visit the [Page Name] page. 
Would you like me to guide you there?"
```

### Explaining Current Page
```
"You're currently on the [Page Name] page. 
Here you can [list actions]. 
Would you like to [suggest next action]?"
```

---

## 🎨 Page Features by Category

### For Learning
- **Dashboard**: Overview, quick links, progress summary
- **Lessons**: Browse subjects, start lessons, bookmarks
- **Quiz**: Practice questions, view results, retry
- **Voice Tutor**: Speech practice, pronunciation feedback
- **BdSL Translator**: Sign language animations, practice

### For Progress Tracking
- **My Progress**: Charts, achievements, completion rates
- **Activity**: Recent sessions, timeline view
- **History**: Past sessions, comprehensive records
- **Schedule**: Daily/weekly planner, reminders

### For Career
- **Skills**: Skill evaluation, recommendations
- **Jobs**: Job search, matches, applications
- **Career**: Career exploration, development plans

---

## ✅ Implementation Checklist

- [x] All 18 routes documented
- [x] Voice commands mapped
- [x] Base URL set to http://localhost:3081
- [x] Navigation functions created in tools.py
- [x] Prompts updated with route information
- [x] Reference documentation created
- [x] Quick reference guide created

---

## 📝 Usage Notes

1. **Always provide full URLs**: Include base URL + route path
2. **Explain page purpose**: Brief description of what users can do
3. **Suggest next steps**: Based on user goals and current location
4. **Use natural language**: Avoid technical jargon
5. **Be encouraging**: Maintain positive, supportive tone

---

## 🔧 Technical Integration

Sara has access to navigation helper functions in `tools.py`:

- `get_route_by_name(route_name)` - Get route info by name
- `find_route_by_keyword(keyword)` - Find route by search term
- `get_routes_by_category(category)` - Get all routes in category
- `get_navigation_response(user_query)` - Generate navigation response
- `get_all_routes_summary()` - Get summary of all routes
- `suggest_next_page(current_page, user_goal)` - Suggest next logical page

---

## 📅 Last Updated

**Date**: October 23, 2025  
**Version**: 1.0  
**Status**: Ready for deployment

---

## 🚀 Quick Start for Sara

When a user asks for navigation help:

1. **Listen** for keywords (dashboard, lessons, progress, etc.)
2. **Match** to appropriate route using `find_route_by_keyword()`
3. **Provide** full URL with `http://localhost:3081` + route path
4. **Explain** what the page offers
5. **Confirm** understanding and offer to help further

Example:
```
User: "Show me my progress"
Sara: "Let me help you navigate to the My Progress page. 
You can access it at http://localhost:3081/progress. 
There you can view your detailed learning progress, 
completed lessons, and achievements. Would you like 
to know what else you can track?"
