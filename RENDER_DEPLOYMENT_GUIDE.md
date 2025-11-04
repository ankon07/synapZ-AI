# 🚀 SYNAPZ AI Backend Deployment Guide for Render.com

This guide will help you deploy the SYNAPZ AI backend services (FastAPI server and LiveKit AI Agent) to Render.com.

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ A Render.com account (sign up at https://render.com if you don't have one)
- ✅ GitHub repository with your code pushed
- ✅ All API credentials ready:
  - LiveKit URL, API Key, and Secret
  - OpenAI API Key
  - Tavus API Key, Persona ID, and Replica ID
  - N8N MCP Server URL
  - YouTube API Key
  - Google Client ID and Secret

## 🏗️ Architecture Overview

Your backend consists of **TWO services**:

### 1. **FastAPI Token Server** (Web Service)
- Generates LiveKit access tokens for clients
- Provides YouTube transcript API
- Public URL: `https://synapz-api-server.onrender.com`
- **Cost**: ✅ **FREE TIER** (currently configured)

### 2. **LiveKit AI Agent (Sara)** (Background Worker)
- The actual AI voice assistant
- Connects to LiveKit cloud and processes voice
- Runs continuously in the background
- **Cost**: ~$7/month (Starter plan required)
- **Status**: ⚠️ **DISABLED** (commented out in render.yaml)

---

## 🆓 Current Configuration: FREE TIER

The render.yaml is currently configured to deploy **ONLY the FastAPI server on the free tier**. This means:

### ✅ What WILL Work:
- YouTube transcript API endpoints
- LiveKit token generation (generates tokens but no agent to connect to)
- Health check endpoint
- All non-voice features of your application

### ❌ What WON'T Work:
- **Voice conversations with Sara** - No agent running to process voice
- **Floating AI Avatar voice feature** - Will fail to connect
- Any LiveKit-based real-time voice interactions

### 📊 Free Tier Limitations:
- **Spins down after 15 minutes** of inactivity (30-60 second cold start)
- **750 free instance hours/month** (~31 days of 24/7 runtime)
- **100 GB bandwidth/month** included
- ✅ Custom domains supported
- ✅ Free HTTPS/SSL

### 💰 Cost Comparison:
- **Current (Free Tier)**: $0/month - FastAPI only, no voice features
- **With Voice AI**: $7/month - Add background worker for full functionality
- **Always-On (Both)**: $14/month - Both services on paid plans, no cold starts

**To enable voice features later:** Uncomment the AI agent section in render.yaml and redeploy.

---

## 🎯 Deployment Steps

### Method 1: Using Blueprint (Recommended - Automated)

This method uses the `render.yaml` file to automatically configure both services.

#### Step 1: Connect Repository to Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub account if not already connected
4. Select repository: **ankon07/synapZ-AI**
5. Click **"Connect"**

#### Step 2: Review Configuration

Render will detect the `render.yaml` file and show you:
- **synapz-api-server** (Web Service)
- **synapz-ai-agent** (Background Worker)

#### Step 3: Configure Environment Variables

For **BOTH services**, you need to set these environment variables:

**Required for both:**
```
LIVEKIT_URL=<your-livekit-url>
LIVEKIT_API_KEY=<your-livekit-api-key>
LIVEKIT_API_SECRET=<your-livekit-api-secret>
OPENAI_API_KEY=<your-openai-api-key>
TAVUS_API_KEY=<your-tavus-api-key>
PERSONA_ID=<your-tavus-persona-id>
REPLICA_ID=<your-tavus-replica-id>
N8N_MCP_SERVER_URL=<your-n8n-mcp-server-url>
YOUTUBE_API_KEY=<your-youtube-api-key>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

**Note:** Use the actual values from your `ai-avatar/.env` file. Do NOT commit these values to GitHub - only set them in Render's environment variables.

**⚠️ IMPORTANT**: The `FRONTEND_URL` is already set in render.yaml to `https://synap-z-ai.vercel.app`

#### Step 4: Deploy

1. Click **"Apply"** to create both services
2. Render will start building and deploying
3. **FastAPI Server** will deploy first (5-10 minutes)
4. **AI Agent** will deploy next (5-10 minutes)

#### Step 5: Wait for Deployment

Monitor the deployment logs for each service:
- ✅ **synapz-api-server**: Look for "Application startup complete"
- ✅ **synapz-ai-agent**: Look for "Agent started"

---

### Method 2: Manual Setup (Alternative)

If you prefer to set up services one by one:

#### Deploy FastAPI Server

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `synapz-api-server`
   - **Runtime**: Docker
   - **Dockerfile Path**: `./ai-avatar/Dockerfile`
   - **Region**: Oregon (or nearest to you)
   - **Plan**: Free or Starter
5. Add all environment variables listed above
6. Click **"Create Web Service"**

#### Deploy AI Agent

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Background Worker"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `synapz-ai-agent`
   - **Runtime**: Python 3.11
   - **Root Directory**: `ai-avatar`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python agent.py start`
   - **Region**: Oregon (same as API server)
   - **Plan**: Starter ($7/month)
5. Add all environment variables listed above
6. Click **"Create Background Worker"**

---

## 📝 Post-Deployment Configuration

### 1. Get Your API Server URL

After deployment, your FastAPI server will be available at:
```
https://synapz-api-server.onrender.com
```

### 2. Update Frontend Configuration

Update your frontend's `VoiceService` to use the production URL:

In `synapz-learn-connect/src/lib/voiceService.ts`, update:

```typescript
// Change from:
this.serverUrl = config.serverUrl || '';

// To:
this.serverUrl = config.serverUrl || 'https://synapz-api-server.onrender.com';
```

Or set an environment variable in Vercel:
```
VITE_API_URL=https://synapz-api-server.onrender.com
```

### 3. Test the Deployment

1. Visit your frontend: https://synap-z-ai.vercel.app
2. Click the floating AI avatar
3. Click "Connect to Sara"
4. Test voice interaction

---

## 🔍 Monitoring and Logs

### View Logs

**For FastAPI Server:**
1. Go to https://dashboard.render.com
2. Click on **synapz-api-server**
3. Click **"Logs"** tab
4. Monitor for errors or connection issues

**For AI Agent:**
1. Go to https://dashboard.render.com
2. Click on **synapz-ai-agent**
3. Click **"Logs"** tab
4. Look for "Agent started" message

### Health Checks

Test your API server:
```bash
curl https://synapz-api-server.onrender.com/health
```

Expected response:
```json
{"status": "healthy"}
```

---

## 🐛 Troubleshooting

### Issue: "Failed to connect to voice agent"

**Solution:**
1. Check that **both services** are running (not sleeping)
2. Verify all environment variables are set correctly
3. Check logs for errors
4. Ensure LiveKit credentials are valid

### Issue: "Web Service keeps spinning down"

**Solution:**
- Free tier spins down after 15 minutes of inactivity
- Upgrade to Starter plan ($7/month) for always-on service
- Or accept the cold start delay (30-60 seconds)

### Issue: "AI Agent not responding"

**Solution:**
1. Check **synapz-ai-agent** logs for errors
2. Verify OpenAI API key is valid and has credits
3. Ensure Tavus credentials are correct
4. Check LiveKit connection in logs

### Issue: "CORS errors in browser"

**Solution:**
- Verify `FRONTEND_URL` is set correctly in render.yaml
- Check browser console for actual error
- Ensure frontend is using correct API URL

### Issue: "Build failed"

**Solution:**
1. Check build logs for specific error
2. Verify `requirements.txt` is complete
3. Ensure Dockerfile syntax is correct
4. Try manual deployment to isolate issue

---

## 💰 Cost Management

### Current Setup Cost:
- **FastAPI Server** (Free tier): $0/month
- **AI Agent** (Starter): $7/month
- **Total**: $7/month

### Optimization Tips:
1. **Free tier limitations**: API server spins down after 15 min inactivity
2. **Always-on API**: Upgrade to Starter ($7/month) if you need 24/7 availability
3. **Monitor usage**: Check Render dashboard for resource usage
4. **Scale as needed**: Can upgrade plans as traffic increases

---

## 🔐 Security Notes

**⚠️ IMPORTANT:**
- Never commit API keys to GitHub
- All credentials are stored as environment variables in Render
- Render encrypts environment variables at rest
- Use separate API keys for development and production
- Rotate keys regularly

---

## 📈 Scaling

As your application grows:

1. **Upgrade API Server**: 
   - Starter → Standard → Pro
   - Adds more CPU/RAM

2. **Multiple Workers**:
   - Add more AI agent instances
   - Load balance across regions

3. **Database**:
   - Add PostgreSQL for user data
   - Use Render's managed database

---

## ✅ Success Checklist

- [ ] Both services deployed successfully
- [ ] All environment variables configured
- [ ] Health check endpoint responding
- [ ] Frontend can connect to API server
- [ ] AI agent appears in LiveKit dashboard
- [ ] Voice interaction working
- [ ] Video avatar loading (if enabled)
- [ ] Logs show no errors

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Render Logs**: Most issues show up in service logs
2. **LiveKit Dashboard**: Monitor connections at https://cloud.livekit.io
3. **Browser Console**: Check for frontend errors
4. **Render Status**: Check https://status.render.com for outages

---

## 🎉 You're Done!

Your SYNAPZ AI backend is now deployed and ready to serve voice interactions!

**Next Steps:**
1. Test thoroughly with real users
2. Monitor performance and costs
3. Set up alerts for errors
4. Plan for scaling as needed

**Deployed Services:**
- 🌐 API Server: https://synapz-api-server.onrender.com
- 🤖 AI Agent: Running in background
- 💻 Frontend: https://synap-z-ai.vercel.app

Happy deploying! 🚀
