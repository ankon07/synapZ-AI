from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from livekit import api
import os
from dotenv import load_dotenv
import logging
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound, VideoUnavailable
import re

load_dotenv()

app = FastAPI()

# Configure CORS
# Get allowed origins from environment variable or use defaults
ALLOWED_ORIGINS = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://localhost:3081"
).split(",")

# Add production frontend URL if available
FRONTEND_URL = os.environ.get("FRONTEND_URL")
if FRONTEND_URL:
    ALLOWED_ORIGINS.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local development
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3081",
        "http://localhost:8080",
        "http://localhost:8081",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3081",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",
        # Production - Add your Vercel URL here
        # Example: "https://your-app.vercel.app"
    ] + ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger(__name__)

@app.get("/")
def read_root():
    return {"message": "SYNAPZ AI Voice Agent Server", "status": "running"}

@app.post("/api/token")
async def get_token(user_id: str = "user"):
    """
    Generate a LiveKit access token for the user to join the voice agent room
    """
    try:
        livekit_url = os.environ.get("LIVEKIT_URL")
        api_key = os.environ.get("LIVEKIT_API_KEY")
        api_secret = os.environ.get("LIVEKIT_API_SECRET")
        
        if not all([livekit_url, api_key, api_secret]):
            raise HTTPException(status_code=500, detail="LiveKit credentials not configured")
        
        # Create a unique room name or use a shared room
        room_name = "synapz-voice-agent"
        
        # Generate token with permissions
        token = api.AccessToken(api_key, api_secret)
        token.with_identity(user_id)
        token.with_name(f"User {user_id}")
        token.with_grants(api.VideoGrants(
            room_join=True,
            room=room_name,
            can_publish=True,
            can_subscribe=True,
        ))
        
        jwt_token = token.to_jwt()
        
        return {
            "token": jwt_token,
            "url": livekit_url,
            "room": room_name
        }
    
    except Exception as e:
        logger.error(f"Error generating token: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}

class YouTubeTranscriptRequest(BaseModel):
    video_url: str

def extract_video_id(url: str) -> str:
    """Extract video ID from various YouTube URL formats"""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)',
        r'youtube\.com\/embed\/([^&\n?#]+)',
        r'youtube\.com\/v\/([^&\n?#]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    raise ValueError("Invalid YouTube URL")

@app.post("/api/youtube/transcript")
async def get_youtube_transcript(request: YouTubeTranscriptRequest):
    """
    Fetch transcript/captions from a YouTube video using youtube-transcript-api
    """
    try:
        # Extract video ID from URL
        try:
            video_id = extract_video_id(request.video_url)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        # Get transcript using youtube-transcript-api
        try:
            # Try to get English transcript first
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            
            # Try to find English transcript
            try:
                transcript = transcript_list.find_transcript(['en'])
            except NoTranscriptFound:
                # If no English transcript, get the first available one
                available_transcripts = list(transcript_list)
                if not available_transcripts:
                    raise HTTPException(
                        status_code=404,
                        detail="No transcripts available for this video"
                    )
                transcript = available_transcripts[0]
            
            # Fetch the actual transcript data
            transcript_data = transcript.fetch()
            
            # Combine all text segments into one string
            full_text = ' '.join([entry['text'] for entry in transcript_data])
            
            # Clean up the text (remove extra whitespace, newlines)
            full_text = ' '.join(full_text.split())
            
            return {
                "success": True,
                "video_id": video_id,
                "transcript": full_text,
                "language": transcript.language,
                "language_code": transcript.language_code
            }
            
        except TranscriptsDisabled:
            raise HTTPException(
                status_code=403,
                detail="Transcripts are disabled for this video"
            )
        except VideoUnavailable:
            raise HTTPException(
                status_code=404,
                detail="Video not found or unavailable"
            )
        except NoTranscriptFound:
            raise HTTPException(
                status_code=404,
                detail="No transcripts found for this video"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching YouTube transcript: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
