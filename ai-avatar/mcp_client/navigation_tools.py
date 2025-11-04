"""
Navigation MCP tools for Sara AI Assistant
Allows Sara to programmatically control website navigation
"""

from typing import Any
import sys
import os
import json
import logging

# Add parent directory to path to import tools
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools import find_route_by_keyword, navigate_to_page, ROUTES

logger = logging.getLogger(__name__)

# Store room context globally so tools can access it
_room_context = None

def set_room_context(room):
    """Set the LiveKit room context for navigation tools"""
    global _room_context
    _room_context = room
    logger.info("Room context set for navigation tools")

async def send_navigation_command(route: str):
    """Send navigation command to frontend via LiveKit data channel"""
    global _room_context
    
    if not _room_context:
        logger.error("No room context available for navigation")
        return False
    
    try:
        data = {
            "command": "navigate",
            "route": route
        }
        
        # Encode and send via LiveKit data channel
        message = json.dumps(data).encode('utf-8')
        await _room_context.local_participant.publish_data(
            message,
            reliable=True
        )
        logger.info(f"Navigation command sent to frontend: {route}")
        return True
    except Exception as e:
        logger.error(f"Failed to send navigation command: {e}")
        return False

async def handle_navigate_to_page(arguments: dict[str, Any]) -> str:
    """
    Navigate to a specific page on the website
    
    Args:
        arguments: Dictionary with 'page' or 'route' key
        
    Returns:
        Navigation command result message
    """
    # Get the page/route from arguments
    page = arguments.get('page') or arguments.get('route', '')
    
    logger.info(f"Navigation requested to: {page}")
    
    # If it's a keyword, find the actual route
    if not page.startswith('/'):
        route_info = find_route_by_keyword(page)
        if route_info:
            page = route_info['path']
            logger.info(f"Resolved keyword to route: {page}")
        else:
            return f"I couldn't find a page matching '{page}'. Try saying: dashboard, lessons, quiz, progress, jobs, or career."
    
    # Validate the route
    result = navigate_to_page(page)
    
    if result['success']:
        # Send navigation command via LiveKit
        success = await send_navigation_command(page)
        
        if success:
            # Find route name for better response
            route_name = next(
                (r['name'] for r in ROUTES.values() if r['path'] == page),
                page
            )
            return f"Taking you to {route_name} now!"
        else:
            return "I tried to navigate but couldn't send the command. Please check the connection."
    else:
        return result.get('error', 'Navigation failed')

async def handle_get_current_routes() -> str:
    """
    Get a list of all available routes
    
    Returns:
        Formatted string with all routes
    """
    routes_list = []
    for route_info in ROUTES.values():
        routes_list.append(f"- {route_info['name']} ({route_info['path']}): {route_info['description']}")
    
    return "Available pages:\n" + "\n".join(routes_list)

# Tool definitions for MCP
NAVIGATION_TOOLS = [
    {
        "name": "navigate_to_page",
        "description": "Navigate the user to a specific page on the SYNAPZ platform. Use this when the user asks to go to a page, open a module, or access a feature.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "page": {
                    "type": "string",
                    "description": "The page to navigate to. Can be a route path (e.g., '/dashboard') or a page name/keyword (e.g., 'dashboard', 'lessons', 'quiz')"
                }
            },
            "required": ["page"],
            "additionalProperties": False
        },
        "handler": handle_navigate_to_page
    },
    {
        "name": "get_available_pages",
        "description": "Get a list of all available pages on the SYNAPZ platform with their descriptions",
        "inputSchema": {
            "type": "object",
            "properties": {},
            "additionalProperties": False
        },
        "handler": handle_get_current_routes
    }
]
