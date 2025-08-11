# 💼 Career Mentor Agent

An intelligent AI-powered career guidance platform that helps students and professionals explore career paths, develop essential skills, and discover job opportunities. Built with Next.js, FastAPI, and Google Gemini AI, featuring a sophisticated multi-agent system with seamless personality handoffs.

## 🌟 What Your Agent Does 

### 🤖 Intelligent Multi-Agent System
Your Career Mentor Agent operates with three specialized AI personalities that work together to provide comprehensive career guidance:

1. **🎯 Career Explorer Agent**
   - Discovers career paths matching your interests and strengths
   - Asks targeted questions about your passions and values
   - Suggests relevant career options from 5 major fields
   - Provides overviews of each career path
   - Seamlessly hands off to Skill Builder when you choose a path

2. **📚 Skill Builder Agent**
   - Creates personalized skill development plans
   - Recommends specific learning resources and courses
   - Provides detailed skill requirements for chosen careers
   - Suggests practical projects and practice exercises
   - Transitions to Job Advisor when discussing employment

3. **💼 Job Advisor Agent**
   - Shares real-world job roles and market insights
   - Provides salary ranges and industry information
   - Suggests target companies and industries
   - Offers resume and interview preparation tips
   - Connects skills to actual job opportunities

### 🔄 Smart Agent Handoffs
- **Context-Aware Routing**: Automatically switches between agents based on conversation context
- **Seamless Transitions**: Maintains conversation flow while changing personalities
- **Intelligent Keywords**: Detects when users want to explore different aspects (careers → skills → jobs)
- **Conversation Memory**: Preserves context across agent switches

### 🛡️ Conversation Guardrails
- **Topic Focus**: Keeps conversations centered on career guidance
- **Professional Tone**: Maintains educational and professional atmosphere
- **Off-Topic Redirection**: Gently guides users back to career-related topics
- **Quality Control**: Ensures responses are helpful and relevant

## 🎨 User Experience Features

### 💬 Real-Time Chat Interface
- **Streaming Responses**: AI responses appear word-by-word for natural feel
- **Agent Indicators**: Visual cues showing which agent is responding
- **Message History**: Persistent conversation sessions
- **Multi-Session Support**: Switch between different agent conversations

### 🔐 Authentication & Access Control
- **Clerk Integration**: Secure user authentication
- **Free Tier**: 25 free interactions for new users
- **Premium Access**: Unlimited conversations for registered users
- **User Profiles**: Personalized experience tracking

### 📱 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Professional Gradients**: Beautiful color scheme with smooth transitions
- **Intuitive Navigation**: Easy switching between agent personalities
- **Accessibility**: Keyboard shortcuts and screen reader support

## 🚀 Technical Architecture

### Frontend (Next.js 15)
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with custom components
- **Lucide React**: Beautiful, consistent icons
- **Axios**: Reliable HTTP client for API communication
- **Clerk Auth**: Professional authentication system

### Backend (FastAPI)
- **Python 3.8+**: Modern Python with async support
- **Google Gemini AI**: Advanced AI model for natural conversations
- **Uvicorn**: High-performance ASGI server
- **Pydantic**: Data validation and serialization
- **CORS Support**: Cross-origin resource sharing for frontend integration

### AI Integration
- **Google Gemini API**: Primary AI model for intelligent responses
- **Multi-Personality System**: Different prompts for each agent type
- **Context Management**: Maintains conversation history and context
- **Tool Integration**: Access to career databases and learning resources

## 📊 Career Database

Your agent includes comprehensive information about 5 major career fields:

### 💻 Software Development
- **Skills**: Programming, Problem Solving, Data Structures, Algorithms, Version Control
- **Roles**: Software Engineer, Full Stack Developer, Frontend Developer, Backend Developer
- **Learning Resources**: freeCodeCamp, The Odin Project, LeetCode, GitHub

### 📈 Data Science
- **Skills**: Statistics, Python, Machine Learning, Data Visualization, SQL
- **Roles**: Data Scientist, Data Analyst, Machine Learning Engineer, Business Intelligence Analyst
- **Learning Resources**: Coursera, Kaggle, DataCamp, Fast.ai

### 🔒 Cybersecurity
- **Skills**: Network Security, Ethical Hacking, Cryptography, Incident Response, Security Tools
- **Roles**: Security Analyst, Penetration Tester, Security Engineer, Cybersecurity Consultant
- **Learning Resources**: TryHackMe, HackTheBox, Cybrary, SANS

### 📱 Digital Marketing
- **Skills**: SEO, Social Media Marketing, Content Creation, Analytics, Email Marketing
- **Roles**: Digital Marketing Specialist, SEO Specialist, Social Media Manager, Content Strategist
- **Learning Resources**: Google Digital Garage, HubSpot Academy, Coursera, LinkedIn Learning

### 🎨 UI/UX Design
- **Skills**: User Research, Wireframing, Prototyping, Visual Design, Usability Testing
- **Roles**: UX Designer, UI Designer, Product Designer, Interaction Designer
- **Learning Resources**: Figma, Interaction Design Foundation, Coursera, Behance

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Google Gemini API key
- Clerk account for authentication

### 1. Clone the Repository
```bash
git clone <repository-url>
cd career-mentor-agent
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
```

### 3. Environment Configuration
Create a `.env` file in the `backend` directory:
```env
GEMINI_API_KEY=your_gemini_api_key
HOST=0.0.0.0
PORT=8000
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

### 5. Clerk Authentication Setup
1. Create a Clerk account at https://clerk.com
2. Set up your application in Clerk dashboard
3. Add environment variables to frontend:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the Backend**
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. **Start the Frontend**
```bash
cd frontend
npm run dev
```

3. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Production Deployment

#### Vercel Deployment (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. Deploy both frontend and backend

#### Manual Deployment
```bash
# Build frontend
cd frontend
npm run build

# Deploy backend
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🎯 Usage Examples

### Getting Started
1. Open the application in your browser
2. Start with the Career Explorer agent
3. Share your interests and goals
4. Let the agent guide you through the career exploration process

### Example Conversations

**Career Exploration:**
- "I'm interested in technology and problem-solving"
- "What careers involve working with data?"
- "I love being creative and designing things"

**Skill Development:**
- "What skills do I need for software development?"
- "How can I improve my programming skills?"
- "What courses should I take for data science?"

**Job Information:**
- "Tell me about job opportunities in cybersecurity"
- "What's the salary range for UX designers?"
- "Which companies hire data scientists?"

### Agent Switching
The system automatically detects when you want to explore different aspects:
- Ask about skills → Switches to Skill Builder
- Ask about jobs → Switches to Job Advisor
- Ask about careers → Switches to Career Explorer

## 🔧 API Endpoints

### Core Chat Endpoint
```
POST /api/chat
```
- Send messages and receive AI responses
- Automatic agent handoffs based on context
- Tool usage tracking and conversation memory

### Career Information
```
GET /api/careers
GET /api/career/{career_path}
```
- Get available career paths and detailed information
- Skills, roles, and descriptions for each field

### Agent Information
```
GET /api/agents
```
- Get available agent personalities and descriptions

## 🛠️ Development & Customization

### Project Structure
```
career-mentor-agent/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── page.tsx     # Main chat interface
│   │   │   ├── layout.tsx   # Root layout
│   │   │   └── globals.css  # Global styles
│   │   ├── components/      # React components
│   │   │   ├── AuthBanner.tsx
│   │   │   ├── LoginPopup.tsx
│   │   │   └── UserProfile.tsx
│   │   └── lib/             # Utility functions
│   ├── package.json
│   └── next.config.js
├── backend/                  # FastAPI backend application
│   ├── main.py              # Main API application
│   ├── requirements.txt     # Python dependencies
│   └── vercel.json         # Vercel configuration
└── README.md
```

### Adding New Features

#### New Agent Personality
1. Add to `AGENT_PERSONALITIES` in `main.py`
2. Define system prompt and description
3. Update handoff logic in `determine_agent_handoff()`
4. Add UI components in frontend

#### New Career Path
1. Add to `CAREER_PATHS` in `main.py`
2. Include skills, roles, and description
3. Add learning resources to `get_learning_resources()`
4. Update agent prompts to include new career

#### New Tools
1. Implement tool functions in `main.py`
2. Add tool usage tracking
3. Integrate with agent responses
4. Update API documentation

### Environment Variables

#### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key
HOST=0.0.0.0
PORT=8000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 Performance & Scalability

### Optimization Features
- **Streaming Responses**: Real-time AI response streaming
- **Session Management**: Efficient conversation state handling
- **Caching**: API response caching for better performance
- **Error Handling**: Graceful error recovery and user feedback

### Scalability Considerations
- **Stateless Backend**: Easy horizontal scaling
- **CDN Ready**: Static assets optimized for CDN delivery
- **Database Ready**: Prepared for future database integration
- **Microservices Ready**: Modular architecture for service decomposition

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the deployment guide in `DEPLOYMENT_GUIDE.md`

---

**Built with ❤️ using Next.js, FastAPI, and Google Gemini AI** 
