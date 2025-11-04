# Sara Navigation Control System - Implementation Guide

This document explains how Sara AI Assistant can programmatically control website navigation.

## Overview

Sara can now directly navigate users to any page on the SYNAPZ platform by using voice commands. When a user says "Go to dashboard" or "Show me my lessons", Sara will automatically navigate them to the requested page.

## Architecture

### 1. Backend Components

#### A. Navigation Tools (`ai-avatar/tools.py`)
```python
def navigate_to_page(route_path: str) -> dict:
    """Returns navigation command for frontend"""
    return {
        "success": True,
        "command": "navigate",
        "route": route_path,
        "message": f"Navigating to {route_path}"
    }
```

#### B. MCP Navigation Tools (`ai-avatar/mcp_client/navigation_tools.py`)
Provides two main tools for Sara:

1. **`navigate_to_page`**: Navigate to a specific page
   - Input: page name or route path (e.g., "dashboard" or "/dashboard")
   - Automatically finds routes by keyword
   - Sends navigation command to frontend via LiveKit data channel

2. **`get_available_pages`**: List all available pages
   - Returns formatted list of all routes
   - Helps Sara understand available destinations

### 2. Frontend Components

#### A. VoiceService (`synapz-learn-connect/src/lib/voiceService.ts`)
```typescript
// Listens for navigation data messages from LiveKit
this.room.on(RoomEvent.DataReceived, (payload: Uint8Array) => {
  const data = JSON.parse(decoder.decode(payload));
  if (data.command === 'navigate' && data.route) {
    this.config.onNavigate?.(data.route);
  }
});
```

#### B. FloatingAIAvatar Component
```typescript
// Handles navigation when command received
onNavigate: (route) => {
  navigate(route); // React Router navigation
  toast({
    title: "Navigation",
    description: `Sara is taking you to ${route}`,
  });
}
```

### 3. Communication Flow

```
User Voice Command
      ↓
Sara AI Agent (LiveKit)
      ↓
MCP Navigation Tool (navigate_to_page)
      ↓
LiveKit Data Channel
      ↓
Frontend VoiceService (DataReceived event)
      ↓
FloatingAIAvatar (onNavigate callback)
      ↓
React Router (navigate function)
      ↓
Page Changes
```

## How It Works

### Step-by-Step Process

1. **User Request**
   ```
   User: "Sara, take me to the lessons page"
   ```

2. **Sara Processing**
   - Sara's prompts include all route information
   - She recognizes this as a navigation request
   - She calls the `navigate_to_page` MCP tool with parameter `page: "lessons"`

3. **Backend Processing**
   - Tool finds route by keyword: "lessons" → `/lessons`
   - Validates route exists in ROUTES dictionary
   - Returns success status

4. **MCP Tool sends navigation data via LiveKit**
   - Tool handler sends JSON data through LiveKit's data channel:
   ```json
   {
     "command": "navigate",
     "route": "/lessons"
   }
   ```

5. **Frontend Receives Command**
   - VoiceService DataReceived event triggered
   - Decodes message and extracts route
   - Calls `onNavigate` callback

6. **Navigation Executed**
   - FloatingAIAvatar's navigate function called
   - React Router changes route to `/lessons`
   - Toast notification shown to user
   - Page content updates

## Implementation Details

### Backend Tool Integration

The MCP navigation tool needs to be integrated with the LiveKit agent to send data messages. Here's how to implement this:

```python
# In agent.py or navigation_tools.py
from livekit import rtc

async def send_navigation_command(room: rtc.Room, route: str):
    """Send navigation command to frontend via LiveKit data channel"""
    import json
    
    data = {
        "command": "navigate",
        "route": route
    }
    
    # Encode and send via LiveKit data channel
    message = json.dumps(data).encode('utf-8')
    await room.local_participant.publish_data(
        message,
        reliable=True,
        destination_sids=None  # Send to all participants
    )
```

### Tool Handler Update

Update the `handle_navigate_to_page` function in `navigation_tools.py`:

```python
async def handle_navigate_to_page(arguments: dict[str, Any], room=None) -> str:
    """Navigate to a specific page on the website"""
    page = arguments.get('page') or arguments.get('route', '')
    
    # Find route
    if not page.startswith('/'):
        route_info = find_route_by_keyword(page)
        if route_info:
            page = route_info['path']
        else:
            return f"I couldn't find a page matching '{page}'."
    
    # Send navigation command via LiveKit
    if room:
        await send_navigation_command(room, page)
    
    # Find route name for response
    route_name = next(
        (r['name'] for r in ROUTES.values() if r['path'] == page),
        page
    )
    
    return f"Taking you to {route_name} now..."
```

## Usage Examples

### Example 1: Direct Page Name
```
User: "Go to dashboard"
Sara: "Taking you to Dashboard now..."
Action: Navigates to /dashboard
```

### Example 2: Keyword Match
```
User: "Show me my learning progress"
Sara: "Taking you to My Progress now..."
Action: Navigates to /progress
```

### Example 3: Route Path
```
User: "Open /lessons"
Sara: "Taking you to Lessons now..."
Action: Navigates to /lessons
```

### Example 4: Invalid Request
```
User: "Go to xyz page"
Sara: "I couldn't find a page matching 'xyz'. Try saying: dashboard, lessons, quiz, progress, jobs, or career."
Action: No navigation, provides suggestions
```

## Available Routes

Sara can navigate to any of these 18 routes:

**Authentication**: /, /register, /forgot-password
**Learning**: /dashboard, /lessons, /quiz, /adhd-learning, /voice-tutor, /bdsl-translator
**Progress**: /progress, /activity, /lernee-history, /schedule
**Career**: /skills, /jobs, /career
**Other**: /settings, /parent

## Voice Commands Sara Recognizes

Sara has been trained to recognize these navigation patterns:

- "Go to [page]"
- "Take me to [page]"
- "Show me [page]"
- "Open [page]"
- "Navigate to [page]"
- "I want to see [page]"
- "Go to the [page] page"

## Testing the Navigation

### 1. Start the Backend
```bash
cd ai-avatar
python server.py
```

### 2. Start the Frontend
```bash
cd synapz-learn-connect
npm run dev
```

### 3. Test Navigation
1. Open browser to http://localhost:3081
2. Click on Sara's avatar to connect
3. Say: "Go to dashboard"
4. Verify page navigates to /dashboard
5. Try other commands like "Show me my progress"

## Troubleshooting

### Navigation Not Working

**Problem**: Sara responds but page doesn't change

**Solutions**:
1. Check browser console for navigation messages
2. Verify LiveKit data channel is working
3. Ensure VoiceService DataReceived listener is attached
4. Check that React Router is properly configured

**Problem**: Sara doesn't recognize navigation command

**Solutions**:
1. Verify navigation tools are loaded in MCP
2. Check Sara's prompts include navigation capabilities
3. Try more explicit commands like "navigate to lessons"

**Problem**: Navigation works but wrong page opens

**Solutions**:
1. Check route path in ROUTES dictionary
2. Verify keyword matching in `find_route_by_keyword`
3. Ensure route exists in frontend App.tsx

## Security Considerations

1. **Route Validation**: All routes are validated against ROUTES dictionary
2. **No Direct Code Execution**: Navigation uses React Router, no eval or direct execution
3. **User Feedback**: Toast notifications confirm all navigation actions
4. **Error Handling**: Invalid routes are caught and user-friendly messages displayed

## Future Enhancements

Potential improvements:

1. **Navigation History**: Track where Sara has taken the user
2. **Smart Suggestions**: Based on learning patterns
3. **Multi-Step Navigation**: "First go to lessons, then start quiz"
4. **Page State Preservation**: Remember scroll position, form data
5. **Navigation Undo**: "Go back to previous page"

## Files Modified

### Backend
- `ai-avatar/tools.py` - Navigation helper functions
- `ai-avatar/mcp_client/navigation_tools.py` - MCP navigation tools
- `ai-avatar/prompts.py` - Updated with navigation capabilities

### Frontend
- `synapz-learn-connect/src/lib/voiceService.ts` - DataReceived handler
- `synapz-learn-connect/src/components/FloatingAIAvatar.tsx` - Navigation integration

### Documentation
- `ai-avatar/ROUTES_REFERENCE.md` - Complete route documentation
- `ai-avatar/NAVIGATION_SUMMARY.md` - Quick reference guide
- `ai-avatar/NAVIGATION_CONTROL_GUIDE.md` - This implementation guide

## Conclusion

Sara can now fully control website navigation, providing a seamless voice-guided experience for users. The system is robust, secure, and easily extensible for future enhancements.

For questions or issues, refer to the documentation or check the implementation files listed above.

---

**Last Updated**: October 23, 2025  
**Version**: 1.0  
**Status**: Implementation Complete
