# Quick Start Guide - AI Voice Agent

## ⚡ Quick Setup (3 Terminals Required)

### Terminal 1: FastAPI Server ✅ (Already Running)
```bash
cd ai-avatar
source venv/bin/activate
python server.py
```
**Status:** ✅ Running on http://0.0.0.0:8000

---

### Terminal 2: LiveKit AI Agent ⚠️ (NEEDS TO START)
```bash
cd ai-avatar
source venv/bin/activate
python agent.py dev
```

**Expected Output:**
```
INFO: Connecting to LiveKit...
INFO: Agent started successfully
INFO: Listening for voice connections...
```

**This is the Sara AI agent that actually talks to users!**

---

### Terminal 3: Frontend
```bash
cd synapz-learn-connect
npm run dev
```

**Expected Output:**
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

---

## 🔍 Troubleshooting Your Current Error

### Error: "Failed to connect to voice agent"

**Cause:** LiveKit agent (agent.py) is not running

**Solution:** 
1. Open a new terminal
2. Navigate to ai-avatar directory
3. Activate virtual environment
4. Run: `python agent.py dev`

### What Each Service Does:

| Service | Purpose | Status |
|---------|---------|--------|
| **server.py** | Generates access tokens | ✅ Running |
| **agent.py** | AI voice agent (Sara) | ❌ Not running |
| **npm run dev** | Web interface | ? Unknown |

---

## 📋 Complete Startup Checklist

- [x] 1. Backend server running (server.py) ✅
- [ ] 2. AI agent running (agent.py) ⚠️ **START THIS NOW**
- [ ] 3. Frontend running (npm run dev)
- [ ] 4. Click AI avatar in browser
- [ ] 5. Grant microphone permissions
- [ ] 6. Start talking to Sara!

---

## 🎯 Next Steps

**In a new terminal, run:**
```bash
cd ~/Downloads/snynapZ-ai/ai-avatar
source venv/bin/activate
python agent.py dev
```

**Wait for this output:**
- "Agent started successfully"
- "Connected to LiveKit room"

**Then try connecting again from the browser!**

---

## ✅ Success Indicators

### Backend Server (Terminal 1):
```
INFO: Uvicorn running on http://0.0.0.0:8000
```

### AI Agent (Terminal 2):
```
INFO: Agent started successfully
INFO: Connected to LiveKit room: synapz-voice-agent
```

### Browser Console (F12):
```
Connected to LiveKit room: synapz-voice-agent
Voice agent connected
Agent audio track subscribed
```

---

## 🐛 Common Issues

### "ModuleNotFoundError" when running agent.py
```bash
pip install -r requirements.txt
```

### "Connection refused" error
- Check LiveKit credentials in .env
- Verify internet connection

### "Microphone access denied"
- Allow microphone in browser settings
- Check browser permissions

---

## 📞 Support

If issues persist:
1. Check all 3 terminals are running
2. Verify .env file exists with credentials
3. Check browser console (F12) for errors
4. Review Terminal 2 (agent.py) logs
