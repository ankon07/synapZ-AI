"""
Navigation and utility tools for Sara AI Assistant
Provides structured route information and navigation helpers
"""

# SYNAPZ Platform Route Information
ROUTES = {
    "login": {
        "path": "/",
        "name": "Login",
        "description": "Main login page for user authentication",
        "category": "Authentication",
        "keywords": ["login", "sign in", "home page", "start"]
    },
    "register": {
        "path": "/register",
        "name": "Register",
        "description": "Create new learner or parent account",
        "category": "Authentication",
        "keywords": ["register", "sign up", "create account", "new user"]
    },
    "forgot-password": {
        "path": "/forgot-password",
        "name": "Forgot Password",
        "description": "Reset forgotten password via email",
        "category": "Authentication",
        "keywords": ["forgot password", "reset password", "password help", "recover password"]
    },
    "dashboard": {
        "path": "/dashboard",
        "name": "Dashboard",
        "description": "Main overview with learning progress, upcoming lessons, and quick access to features",
        "category": "Learning",
        "keywords": ["dashboard", "home", "main page", "overview", "main menu"]
    },
    "lessons": {
        "path": "/lessons",
        "name": "Lessons",
        "description": "Browse and access all lessons across subjects (math, English, digital skills)",
        "category": "Learning",
        "keywords": ["lessons", "courses", "learning materials", "study", "learn"]
    },
    "quiz": {
        "path": "/quiz",
        "name": "Quiz",
        "description": "Take quizzes and assessments to test your knowledge",
        "category": "Learning",
        "keywords": ["quiz", "test", "assessment", "practice questions", "exam"]
    },
    "adhd-learning": {
        "path": "/adhd-learning",
        "name": "ADHD Learning",
        "description": "Specialized learning modules with ADHD-friendly content and reduced stimulation",
        "category": "Learning",
        "keywords": ["adhd", "focused learning", "special learning", "attention"]
    },
    "voice-tutor": {
        "path": "/voice-tutor",
        "name": "Voice Tutor",
        "description": "Interactive voice-based lessons with Sara's guidance",
        "category": "Learning",
        "keywords": ["voice tutor", "voice lesson", "audio learning", "speak"]
    },
    "bdsl-translator": {
        "path": "/bdsl-translator",
        "name": "BdSL Translator",
        "description": "Convert text/speech to Bangla Sign Language with 3D avatar demonstrations",
        "category": "Learning",
        "keywords": ["sign language", "bdsl", "translator", "sign translator", "deaf"]
    },
    "progress": {
        "path": "/progress",
        "name": "My Progress",
        "description": "View detailed learning progress, completed lessons, and achievements",
        "category": "Progress",
        "keywords": ["progress", "achievements", "learning stats", "my progress", "results"]
    },
    "activity": {
        "path": "/activity",
        "name": "Activity",
        "description": "View recent activities, learning history, and session logs",
        "category": "Progress",
        "keywords": ["activity", "recent activity", "history", "what did i do", "log"]
    },
    "lernee-history": {
        "path": "/lernee-history",
        "name": "Learning History",
        "description": "Comprehensive learning history and past sessions",
        "category": "Progress",
        "keywords": ["learning history", "past lessons", "history log", "records"]
    },
    "schedule": {
        "path": "/schedule",
        "name": "Visual Schedule",
        "description": "Daily/weekly visual schedule planner for neurodiverse learners",
        "category": "Progress",
        "keywords": ["schedule", "planner", "daily schedule", "calendar", "plan"]
    },
    "skills": {
        "path": "/skills",
        "name": "Skills Assessment",
        "description": "Evaluate current skills and identify strengths and areas for improvement",
        "category": "Career",
        "keywords": ["skills", "assessment", "skill test", "evaluate skills", "abilities"]
    },
    "jobs": {
        "path": "/jobs",
        "name": "Job Matching",
        "description": "Browse job opportunities matched to your skills and interests",
        "category": "Career",
        "keywords": ["jobs", "find jobs", "job search", "employment", "work"]
    },
    "career": {
        "path": "/career",
        "name": "Career Path",
        "description": "Explore career options and create career development plans",
        "category": "Career",
        "keywords": ["career", "career path", "career planning", "future jobs"]
    },
    "settings": {
        "path": "/settings",
        "name": "Settings",
        "description": "User preferences, accessibility settings, and profile management",
        "category": "Configuration",
        "keywords": ["settings", "preferences", "options", "configure", "profile"]
    },
    "parent": {
        "path": "/parent",
        "name": "Parent Dashboard",
        "description": "Parent/guardian view of child's progress and supervision management",
        "category": "Parent",
        "keywords": ["parent", "parent dashboard", "parent view", "guardian page"]
    }
}

def get_route_by_name(route_name: str) -> dict:
    """
    Get route information by route name/key
    
    Args:
        route_name: Key of the route (e.g., 'dashboard', 'lessons')
    
    Returns:
        Dictionary with route information or None if not found
    """
    return ROUTES.get(route_name.lower())

def find_route_by_keyword(keyword: str) -> dict:
    """
    Find a route by searching keywords
    
    Args:
        keyword: Search term to find matching route
    
    Returns:
        Dictionary with route information or None if not found
    """
    keyword_lower = keyword.lower()
    
    for route_key, route_info in ROUTES.items():
        if keyword_lower in route_info["keywords"]:
            return route_info
        if keyword_lower in route_info["name"].lower():
            return route_info
        if keyword_lower in route_info["description"].lower():
            return route_info
    
    return None

def get_routes_by_category(category: str) -> list:
    """
    Get all routes in a specific category
    
    Args:
        category: Category name (e.g., 'Learning', 'Progress', 'Career')
    
    Returns:
        List of route dictionaries in that category
    """
    return [
        route_info for route_info in ROUTES.values()
        if route_info["category"].lower() == category.lower()
    ]

def get_navigation_response(user_query: str, base_url: str = "http://localhost:3081") -> str:
    """
    Generate a natural language navigation response based on user query
    
    Args:
        user_query: User's navigation request
        base_url: Base URL of the application
    
    Returns:
        String with navigation guidance
    """
    # Try to find the route
    route = find_route_by_keyword(user_query)
    
    if route:
        full_url = f"{base_url}{route['path']}"
        return (
            f"Let me help you navigate to the {route['name']} page. "
            f"You can access it at {full_url}. "
            f"{route['description']}"
        )
    else:
        return (
            "I'm not sure which page you're looking for. "
            "Could you try saying one of these: dashboard, lessons, quiz, progress, "
            "jobs, career, settings, or schedule?"
        )

def get_all_routes_summary() -> str:
    """
    Get a summary of all available routes
    
    Returns:
        String with formatted list of all routes
    """
    summary = "Here are all the pages you can visit on SYNAPZ:\n\n"
    
    categories = {}
    for route_info in ROUTES.values():
        category = route_info["category"]
        if category not in categories:
            categories[category] = []
        categories[category].append(route_info)
    
    for category, routes in categories.items():
        summary += f"{category}:\n"
        for route in routes:
            summary += f"  - {route['name']} ({route['path']}): {route['description']}\n"
        summary += "\n"
    
    return summary

def suggest_next_page(current_page: str, user_goal: str = None) -> dict:
    """
    Suggest the next logical page based on current location and user goal
    
    Args:
        current_page: Current route path (e.g., '/dashboard')
        user_goal: Optional user goal (e.g., 'learn', 'practice', 'jobs')
    
    Returns:
        Dictionary with suggested route information
    """
    # Goal-based suggestions
    goal_suggestions = {
        "learn": ["lessons", "voice-tutor", "adhd-learning"],
        "practice": ["quiz", "voice-tutor", "lessons"],
        "test": ["quiz", "skills"],
        "jobs": ["jobs", "career", "skills"],
        "career": ["career", "jobs", "skills"],
        "progress": ["progress", "activity", "lernee-history"],
        "schedule": ["schedule"],
        "parent": ["parent"]
    }
    
    if user_goal:
        goal_lower = user_goal.lower()
        for goal_key, route_keys in goal_suggestions.items():
            if goal_key in goal_lower:
                return get_route_by_name(route_keys[0])
    
    # Page-flow suggestions (logical next steps)
    page_flow = {
        "/": "dashboard",
        "/dashboard": "lessons",
        "/lessons": "quiz",
        "/quiz": "progress",
        "/skills": "jobs",
        "/jobs": "career",
    }
    
    suggested_route_key = page_flow.get(current_page, "dashboard")
    return get_route_by_name(suggested_route_key)

def navigate_to_page(route_path: str) -> dict:
    """
    Trigger navigation to a specific page by sending command to frontend
    This function returns a navigation command that should be sent to the frontend
    
    Args:
        route_path: The route path to navigate to (e.g., '/dashboard', '/lessons')
    
    Returns:
        Dictionary with navigation command and status
    """
    # Validate that the route exists
    route_exists = any(
        route_info['path'] == route_path 
        for route_info in ROUTES.values()
    )
    
    if not route_exists and route_path != '/':
        return {
            "success": False,
            "error": f"Invalid route: {route_path}",
            "command": None
        }
    
    return {
        "success": True,
        "command": "navigate",
        "route": route_path,
        "message": f"Navigating to {route_path}"
    }

# Export functions for use in agent
__all__ = [
    'ROUTES',
    'get_route_by_name',
    'find_route_by_keyword',
    'get_routes_by_category',
    'get_navigation_response',
    'get_all_routes_summary',
    'suggest_next_page',
    'navigate_to_page'
]
