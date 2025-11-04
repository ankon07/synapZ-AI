# SynapZ AI - Inclusive Learning Platform

An AI-powered accessible education platform for learners with disabilities, featuring adaptive learning, text-to-speech, speech-to-text, sign language avatars, and more.

## 🌟 Features

- **Adaptive Learning Engine** - Personalized learning paths based on user capabilities
- **Text-to-Speech (TTS)** - Natural voice narration in Bangla and English
- **Speech-to-Text (STT)** - Voice-based interaction and quiz responses
- **OCR Support** - Scan textbooks and convert to speech
- **Sign Language Avatar** - 3D avatar for Bangla Sign Language (BDSL)
- **Neurodiverse Support** - Custom UI for autism, ADHD, and dyslexia
- **Offline PWA** - Works without internet connection
- **Gamification** - Points, badges, and achievement system
- **Career Bridge** - Job matching and skill assessment

## 🏗️ Architecture

- **Frontend:** React + Vite + TypeScript + TailwindCSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Cache:** Redis
- **AI Services:** Google Gemini API
- **Deployment:** Docker + Docker Compose

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/snynapz-ai.git
   cd snynapz-ai
   ```

2. Setup environment:
   ```bash
   cp .env.example .env
   nano .env  # Edit with your configuration
   ```

3. Deploy:
   ```bash
   # Using automated script
   ./scripts/deploy.sh

   # Or manually
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/health

## 📖 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Complete deployment instructions
- [API Architecture](API_ARCHITECTURE.md) - API endpoints and specifications
- [Project Architecture](PROJECT_ARCHITECTURE.md) - System design and technology stack
- [Database Schema](DATABASE_SCHEMA.md) - Database structure
- [Implementation Roadmap](IMPLEMENTATION_ROADMAP.md) - Development phases

## 🛠️ Development

### Development Environment

```bash
# Start backend with hot-reload
docker-compose -f docker-compose.dev.yml up -d

# Start frontend with hot-reload
cd synapz-learn-connect
npm install
npm run dev
```

Access:
- Frontend: http://localhost:3081
- Backend: http://localhost:8000

### Useful Commands

```bash
# View logs
make logs              # All services
make backend-logs      # Backend only
make frontend-logs     # Frontend only

# Database operations
make db-shell          # PostgreSQL shell
make backup-db         # Backup database
make restore-db FILE=backup.sql  # Restore database

# Restart services
make restart           # Restart all

# Stop services
make down              # Stop all
```

## 🌐 Deployment Options

### Free Hosting Options

1. **Railway** - $5 free credit/month
2. **Render** - 750 hours/month free
3. **Fly.io** - 3 VMs free
4. **Vercel** - Free for frontend
5. **Supabase** - Free PostgreSQL

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📦 Project Structure

```
snynapz-ai/
├── synapz-learn-connect/    # Frontend (React + Vite)
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                  # Backend (Node.js + Express)
│   ├── src/
│   │   ├── server.js
│   │   └── routes/
│   ├── Dockerfile
│   └── package.json
├── scripts/                  # Deployment scripts
│   ├── deploy.sh
│   ├── backup.sh
│   └── restore.sh
├── docker-compose.yml        # Production config
├── docker-compose.dev.yml    # Development config
├── Makefile                  # Quick commands
└── DEPLOYMENT.md             # Deployment guide
```

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret
GEMINI_API_KEY=your-key
```

### Frontend (.env.production)
```env
VITE_API_URL=https://api.yourdomain.com
VITE_GEMINI_API_KEY=your-key
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd synapz-learn-connect
npm test
```

## 📊 Monitoring

```bash
# View real-time logs
docker-compose logs -f

# Check service health
curl http://localhost:8000/health

# Monitor resources
docker stats
```

## 🔒 Security

- JWT authentication
- Rate limiting
- CORS protection
- Helmet.js security headers
- Environment variable protection
- HTTPS enforcement (production)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Your Name** - Project Lead

## 🙏 Acknowledgments

- Google Gemini AI
- React and Vite communities
- Open source contributors

## 📧 Contact

- Email: your.email@example.com
- Website: https://yourdomain.com
- GitHub: https://github.com/yourusername

---

**Made with ❤️ for inclusive education**
