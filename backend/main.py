from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import random
import agent from Agent, function_tool ,GuardrailFunctionOutput

# Load environment variables
load_dotenv()

# Initialize Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="Career Mentor Agent API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://career-mentor-agent-frontend.vercel.app", "https://career-mentor-agent.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class ChatMessage(BaseModel):
    role: str
    content: str
    agent_personality: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage]
    current_agent: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    agent_personality: str
    suggested_agent: Optional[str] = None
    tools_used: List[str] = []

# Career data and tools
CAREER_PATHS = {
    "software_development": {
        "title": "Software Development",
        "skills": ["Programming", "Problem Solving", "Data Structures", "Algorithms", "Version Control"],
        "roles": ["Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer"],
        "description": "Build applications, websites, and software solutions"
    },
    "data_science": {
        "title": "Data Science",
        "skills": ["Statistics", "Python", "Machine Learning", "Data Visualization", "SQL"],
        "roles": ["Data Scientist", "Data Analyst", "Machine Learning Engineer", "Business Intelligence Analyst"],
        "description": "Analyze data to extract insights and build predictive models"
    },
    "cybersecurity": {
        "title": "Cybersecurity",
        "skills": ["Network Security", "Ethical Hacking", "Cryptography", "Incident Response", "Security Tools"],
        "roles": ["Security Analyst", "Penetration Tester", "Security Engineer", "Cybersecurity Consultant"],
        "description": "Protect systems and data from cyber threats"
    },
    "digital_marketing": {
        "title": "Digital Marketing",
        "skills": ["SEO", "Social Media Marketing", "Content Creation", "Analytics", "Email Marketing"],
        "roles": ["Digital Marketing Specialist", "SEO Specialist", "Social Media Manager", "Content Strategist"],
        "description": "Promote products and services through digital channels"
    },
    "ui_ux_design": {
        "title": "UI/UX Design",
        "skills": ["User Research", "Wireframing", "Prototyping", "Visual Design", "Usability Testing"],
        "roles": ["UX Designer", "UI Designer", "Product Designer", "Interaction Designer"],
        "description": "Design user-friendly and visually appealing digital experiences"
    }
}

# Agent personalities
AGENT_PERSONALITIES = {
    "career_explorer": {
        "name": "Career Explorer",
        "description": "I help you discover career paths that match your interests and strengths.",
        "system_prompt": """You are a Career Explorer agent. Your role is to:
1. Ask engaging questions about the user's interests, skills, and values
2. Suggest relevant career paths from the available options
3. Provide brief overviews of each suggested career
4. Hand off to the Skill Builder when a career path is chosen
5. Stay focused on career exploration - avoid casual conversation

Available career paths: Software Development, Data Science, Cybersecurity, Digital Marketing, UI/UX Design

Keep responses concise, engaging, and focused on career guidance."""
    },
    "skill_builder": {
        "name": "Skill Builder",
        "description": "I help you develop the skills needed for your chosen career path.",
        "system_prompt": """You are a Skill Builder agent. Your role is to:
1. Provide detailed skill requirements for the chosen career path
2. Suggest learning resources and courses
3. Create a personalized skill development plan
4. Hand off to the Job Advisor when skills are discussed
5. Stay focused on skill development - avoid casual conversation

Use the career data to provide accurate skill information and learning recommendations."""
    },
    "job_advisor": {
        "name": "Job Advisor",
        "description": "I provide information about real-world job roles and career opportunities.",
        "system_prompt": """You are a Job Advisor agent. Your role is to:
1. Provide detailed information about job roles in the chosen field
2. Share salary ranges and job market insights
3. Suggest companies and industries to target
4. Offer resume and interview tips
5. Stay focused on job information - avoid casual conversation

Use the career data to provide accurate job role information and market insights."""
    }
}
@function_tool
def get_career_info(career_path: str) -> Dict[str, Any]:
    """Tool to get career information"""
    return CAREER_PATHS.get(career_path, {})
@function_tool
def get_learning_resources(career_path: str) -> List[str]:
    """Tool to get learning resources for a career path"""
    resources = {
        "software_development": [
            "freeCodeCamp - Web Development",
            "The Odin Project - Full Stack",
            "LeetCode - Coding Practice",
            "GitHub - Open Source Projects"
        ],
        "data_science": [
            "Coursera - Data Science Specialization",
            "Kaggle - Data Science Competitions",
            "DataCamp - Python for Data Science",
            "Fast.ai - Practical Deep Learning"
        ],
        "cybersecurity": [
            "TryHackMe - Hands-on Security Training",
            "HackTheBox - Penetration Testing Labs",
            "Cybrary - Cybersecurity Courses",
            "SANS - Professional Security Training"
        ],
        "digital_marketing": [
            "Google Digital Garage - Marketing Fundamentals",
            "HubSpot Academy - Inbound Marketing",
            "Coursera - Digital Marketing Specialization",
            "LinkedIn Learning - Marketing Courses"
        ],
        "ui_ux_design": [
            "Figma - Design Tool Tutorials",
            "Interaction Design Foundation - UX Courses",
            "Coursera - UI/UX Design Specialization",
            "Behance - Design Inspiration"
        ]
    }
    return resources.get(career_path, [])

def determine_agent_handoff(message: str, current_agent: str, conversation_history: List[ChatMessage]) -> Optional[str]:
    """Determine if we should hand off to a different agent"""
    message_lower = message.lower()
    
    # Career exploration keywords
    career_keywords = ["career", "job", "work", "profession", "field", "path", "interested in", "what can i do"]
    
    # Skill building keywords
    skill_keywords = ["skill", "learn", "study", "course", "training", "education", "how to", "requirements"]
    
    # Job information keywords
    job_keywords = ["salary", "company", "role", "position", "hire", "apply", "interview", "resume"]
    
    # Handoff logic
    if current_agent == "career_explorer":
        if any(keyword in message_lower for keyword in skill_keywords):
            return "skill_builder"
        elif any(keyword in message_lower for keyword in job_keywords):
            return "job_advisor"
    
    elif current_agent == "skill_builder":
        if any(keyword in message_lower for keyword in job_keywords):
            return "job_advisor"
        elif any(keyword in message_lower for keyword in career_keywords):
            return "career_explorer"
    
    elif current_agent == "job_advisor":
        if any(keyword in message_lower for keyword in skill_keywords):
            return "skill_builder"
        elif any(keyword in message_lower for keyword in career_keywords):
            return "career_explorer"
    
    return None

def apply_guardrails(message: str) -> str:
    """Apply guardrails to keep conversation focused on career guidance"""
    # Simple guardrail: redirect off-topic conversations
    off_topic_keywords = ["weather", "politics", "sports", "entertainment", "personal life"]
    message_lower = message.lower()
    
    if any(keyword in message_lower for keyword in off_topic_keywords):
        return "I'd be happy to help you with career guidance! Could you tell me more about your professional interests or what career path you're considering?"
    
    return message

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Apply guardrails
        processed_message = apply_guardrails(request.message)
        
        # Determine current agent
        current_agent = request.current_agent or "career_explorer"
        
        # Check for agent handoff
        suggested_agent = determine_agent_handoff(processed_message, current_agent, request.conversation_history)
        if suggested_agent:
            current_agent = suggested_agent
        
        # Get agent personality
        agent_info = AGENT_PERSONALITIES[current_agent]
        
        # Prepare conversation context
        conversation_context = f"Current Agent: {agent_info['name']}\n\n"
        conversation_context += f"System: {agent_info['system_prompt']}\n\n"
        
        # Add conversation history
        for msg in request.conversation_history[-5:]:  # Last 5 messages for context
            conversation_context += f"{msg.role}: {msg.content}\n"
        
        conversation_context += f"User: {processed_message}\n"
        conversation_context += f"{agent_info['name']}:"
        
        # Use Gemini for response generation
        model = genai.GenerativeModel('gemini-2.0-flash-001')
        
        # Prepare the prompt with system message and user input
        prompt = f"{agent_info['system_prompt']}\n\nUser: {processed_message}\n\nResponse:"
        
        response = model.generate_content(prompt)
        agent_response = response.text.strip()
        
        # Use tools based on agent type
        tools_used = []
        if current_agent == "career_explorer":
            # Use career path tool
            tools_used.append("career_paths_database")
        elif current_agent == "skill_builder":
            # Use skills and learning resources tools
            tools_used.extend(["skills_database", "learning_resources"])
        elif current_agent == "job_advisor":
            # Use job roles tool
            tools_used.append("job_roles_database")
        
        return ChatResponse(
            message=agent_response,
            agent_personality=current_agent,
            suggested_agent=suggested_agent,
            tools_used=tools_used
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@app.get("/api/careers")
async def get_careers():
    """Get all available career paths"""
    return {"careers": CAREER_PATHS}

@app.get("/api/career/{career_path}")
async def get_career_details(career_path: str):
    """Get detailed information about a specific career path"""
    career_info = get_career_info(career_path)
    if not career_info:
        raise HTTPException(status_code=404, detail="Career path not found")
    
    learning_resources = get_learning_resources(career_path)
    career_info["learning_resources"] = learning_resources
    
    return career_info

@app.get("/api/agents")
async def get_agents():
    """Get all available agent personalities"""
    return {"agents": AGENT_PERSONALITIES}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 