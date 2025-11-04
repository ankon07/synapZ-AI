# SYNAPZ AI Voice Agent Setup Guide

This guide will help you set up and run the AI Voice Agent (Sara) backend for the SYNAPZ learning platform.

## Overview

Sara is a bilingual (Bangla & English) AI tutor that provides voice-based learning, powered by:
- **LiveKit** for real-time voice communication
- **OpenAI GPT-4** for intelligent responses
- **Tavus** for avatar visualization
- **FastAPI** for the backend server

## Prerequisites

- Python 3.9+
- Node.js 18+ (for the frontend)
- LiveKit account (credentials in `.env`)
- OpenAI API key
- Tavus API key (optional, for avatar)

## Installation

### 1. Install Python Dependencies

```bash
cd ai-avatar
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

The `.env` file is already configured with:
- LiveKit credentials
- OpenAI API key
- Tavus API key
- N8N MCP Server URL

**Note:** Keep these credentials secure and never commit them to public repositories.

## Running the Services

You need to run **THREE separate services**:

### Terminal 1: FastAPI Backend Server

This generates access tokens for clients to connect to LiveKit:

```bash
cd ai-avatar
source venv/bin/activate  # Activate virtual environment
python server.py
```

Server will run on: `http://localhost:8000`

**Endpoints:**
- `GET /` - Health check
- `POST /api/token?user_id=<id>` - Generate LiveKit access token
- `GET /health` - Server health status

### Terminal 2: LiveKit Voice Agent

This runs the actual AI agent that processes voice:

```bash
cd ai-avatar
source venv/bin/activate
python agent.py dev
```

The agent will:
- Connect to LiveKit room
- Listen for user voice input
- Process with OpenAI GPT-4
- Respond with natural speech
- Optionally show Tavus avatar

### Terminal 3: Frontend React App

This runs your web interface:

```bash
cd synapz-learn-connect
npm install  # If not already done
npm run dev
```

Frontend will run on: `http://localhost:5173`

## Using the Voice Agent

1. **Start all three services** (backend server, agent, frontend)
2. **Open the frontend** in your browser
3. **Look for the floating AI avatar** at the bottom-right corner
4. **Click the avatar** to expand the panel
5. **Click "Connect to Sara"** button
6. **Grant microphone permissions** when prompted
7. **Start speaking** - Sara will respond!

## Visual Indicators

### Avatar States:
- **Gray AI badge** - Not connected
- **Green dot (top-left)** - Connected to voice agent
- **Red badge (top-right)** - Microphone active / listening
- **Blue badge (top-right)** - Sara is speaking
- **Spinning loader** - Connecting...

### Panel Status Messages:
- **"Click to connect"** - Not connected yet
- **"Connecting..."** - Establishing connection
- **"Connected - Ready to help"** - Ready for voice input
- **"Listening to you..."** - Recording your voice
- **"Sara is speaking..."** - Agent is responding

## Voice Commands

Try saying:
- "Next lesson"
- "Repeat that"
- "Go to dashboard"
- "Show my progress"
- "Tell me about..."
- "Help me with..."

Sara understands both English and Bangla!

## Troubleshooting

### "Failed to connect to voice agent"

**Solution:**
1. Check that FastAPI server is running (`python server.py`)
2. Check that LiveKit agent is running (`python agent.py dev`)
3. Verify `.env` credentials are correct
4. Check console for detailed error messages

### No audio from agent

**Solution:**
1. Check browser console for errors
2. Ensure microphone permissions are granted
3. Verify LiveKit agent terminal shows "Agent started"
4. Check speaker/audio output settings

### Agent not responding

**Solution:**
1. Check LiveKit agent logs for errors
2. Verify OpenAI API key is valid
3. Ensure N8N MCP server is accessible
4. Try disconnecting and reconnecting

### CORS errors

**Solution:**
- FastAPI server is configured for `localhost:5173` and `localhost:3000`
- If using different port, update CORS settings in `server.py`

## Architecture

```
Frontend (React)
    ↓
FloatingAIAvatar Component
    ↓
VoiceService (livekit-client)
    ↓
FastAPI Server (token generation)
    ↓
LiveKit Cloud
    ↓
AI Agent (agent.py)
    ↓
OpenAI GPT-4 + Tavus Avatar
```

## Development

### Modifying Agent Behavior

Edit `prompts.py` to change:
- Sara's persona and instructions
- Session flow and structure
- Language and tone
- Specialized behaviors

### Adding New Tools

Edit `tools.py` to add custom functionality that Sara can execute.

### Customizing Frontend

The FloatingAIAvatar component is in:
`synapz-learn-connect/src/components/FloatingAIAvatar.tsx`

## Production Deployment

### Backend:
```bash
uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4
```

### Agent:
```bash
python agent.py start
```

### Frontend:
```bash
npm run build
# Serve dist folder with your web server
```

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `LIVEKIT_URL` | LiveKit server WebSocket URL |
| `LIVEKIT_API_KEY` | LiveKit API key |
| `LIVEKIT_API_SECRET` | LiveKit API secret |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 |
| `TAVUS_API_KEY` | Tavus API key (optional) |
| `PERSONA_ID` | Tavus persona ID (optional) |
| `REPLICA_ID` | Tavus replica ID (optional) |
| `N8N_MCP_SERVER_URL` | N8N MCP server endpoint |

## Support

For issues or questions:
1. Check agent logs in terminal
2. Check browser console for frontend errors
3. Review LiveKit dashboard for connection issues
4. Verify all environment variables are set correctly

## Features

✅ Real-time voice communication  
✅ Bilingual support (English & Bangla)  
✅ Natural conversation flow  
✅ Visual avatar (optional)  
✅ Microphone controls  
✅ Connection status indicators  
✅ Error handling and recovery  
✅ Draggable floating interface  
✅ Works across all pages  

Happy learning with Sara! 🎓🤖
