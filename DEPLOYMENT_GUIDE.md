# Career Mentor Agent - Vercel Deployment Guide

This guide will help you deploy your Career Mentor Agent to Vercel. The project consists of two parts:
- **Frontend**: Next.js application
- **Backend**: FastAPI Python application

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Google Gemini API Key**: For the AI functionality

## Step 1: Prepare Your Repository

Make sure your repository structure looks like this:
```
career-mentor-agent/
├── frontend/          # Next.js app
├── backend/           # FastAPI app
└── README.md
```

### Windows CMD Setup

1. **Open Command Prompt** as Administrator (if needed for global npm installs)
2. **Navigate to your project directory**:
   ```cmd
   cd "H:\GIAIC PROJECTS\💼 Career Mentor Agent"
   ```
3. **Check if you have Node.js and npm installed**:
   ```cmd
   node --version
   npm --version
   ```
4. **Install Vercel CLI** (if not already installed):
   ```cmd
   npm install -g vercel
   ```

## Step 2: Deploy Backend First

### 2.1 Deploy Backend to Vercel

**Option A: Using Vercel Web Interface**
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty (Vercel will auto-detect)
   - **Output Directory**: Leave empty
   - **Install Command**: `pip install -r requirements.txt`

**Option B: Using Vercel CLI (CMD)**
1. Open Command Prompt and navigate to your project:
   ```cmd
   cd "H:\GIAIC PROJECTS\💼 Career Mentor Agent\backend"
   ```
2. Login to Vercel (if not already logged in):
   ```cmd
   vercel login
   ```
3. Deploy the backend:
   ```cmd
   vercel
   ```
4. Follow the prompts:
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `career-mentor-agent-backend`
   - Directory: `./` (current directory)
   - Override settings: `N`

### 2.2 Set Environment Variables

**Option A: Using Vercel Web Interface**
In your Vercel project settings, add these environment variables:
- `GEMINI_API_KEY`: Your Google Gemini API key

**Option B: Using Vercel CLI (CMD)**
```cmd
# Set environment variable
vercel env add GEMINI_API_KEY

# When prompted, enter your Google Gemini API key
```

### 2.3 Deploy

Click "Deploy" and wait for the build to complete. Note the deployment URL (e.g., `https://career-mentor-agent-backend.vercel.app`)

## Step 3: Deploy Frontend

### 3.1 Deploy Frontend to Vercel

**Option A: Using Vercel Web Interface**
1. Go back to Vercel dashboard
2. Click "New Project" again
3. Import the same GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

**Option B: Using Vercel CLI (CMD)**
1. Open Command Prompt and navigate to your frontend directory:
   ```cmd
   cd "H:\GIAIC PROJECTS\💼 Career Mentor Agent\frontend"
   ```
2. Deploy the frontend:
   ```cmd
   vercel
   ```
3. Follow the prompts:
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `career-mentor-agent-frontend`
   - Directory: `./` (current directory)
   - Override settings: `N`

### 3.2 Set Environment Variables

**Option A: Using Vercel Web Interface**
Add these environment variables:
- `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., `https://career-mentor-agent-backend.vercel.app`)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key

**Option B: Using Vercel CLI (CMD)**
```cmd
# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
 
vercel env add CLERK_SECRET_KEY

# When prompted, enter the corresponding values
```

### 3.3 Deploy

Click "Deploy" and wait for the build to complete.

## Step 4: Update CORS Settings

After deployment, you may need to update the CORS origins in your backend. The current configuration includes:
- `http://localhost:3000` (for local development)
- `https://career-mentor-agent-frontend.vercel.app`
- `https://career-mentor-agent.vercel.app`

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Test the chat functionality
3. Verify that the backend API is responding correctly

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your frontend URL is added to the CORS origins in `backend/main.py`

2. **API Key Issues**: Verify that `GEMINI_API_KEY` is set correctly in your backend environment variables

3. **Build Failures**: Check the build logs in Vercel for specific error messages

4. **Environment Variables**: Ensure all required environment variables are set in both frontend and backend projects

### Useful Commands

To check your deployment status:
```cmd
# Check backend logs
vercel logs --scope=your-team backend-project-name

# Check frontend logs
vercel logs --scope=your-team frontend-project-name
```

### Windows CMD Specific Commands

If you're using Windows Command Prompt, here are some helpful commands:

```cmd
# Navigate to your project directory
cd "H:\GIAIC PROJECTS\💼 Career Mentor Agent"

# Check if Node.js is installed
node --version

# Check if npm is installed
npm --version

# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Login to Vercel from CMD
vercel login

# Deploy from CMD (alternative to web interface)
vercel

# List your Vercel projects
vercel ls

# Pull environment variables
vercel env pull .env.local
```

## Environment Variables Summary

### Backend Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key

### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend deployment URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key

## Final Notes

- Your backend will be available at: `https://career-mentor-agent-backend.vercel.app`
- Your frontend will be available at: `https://career-mentor-agent-frontend.vercel.app`
- Both applications will automatically redeploy when you push changes to your GitHub repository

## Support

If you encounter any issues during deployment, check:
1. Vercel build logs for error messages
2. Environment variables are correctly set
3. API keys are valid and have proper permissions
4. CORS settings match your actual deployment URLs 