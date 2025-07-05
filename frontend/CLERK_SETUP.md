# Clerk Authentication Setup

## Prerequisites

1. Create a Clerk account at [https://clerk.com/](https://clerk.com/)
2. Create a new application in your Clerk dashboard

## Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```env
# Clerk Authentication
# Get these from https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Getting Your Clerk Keys

1. Go to your Clerk Dashboard
2. Select your application
3. Go to "API Keys" in the sidebar
4. Copy the "Publishable Key" and "Secret Key"
5. Replace `your_publishable_key_here` and `your_secret_key_here` with your actual keys

## Features

- **Free Trial**: Users get 3 free interactions before being prompted to sign up
- **Smart Popup**: Login popup appears after 2 seconds for new users
- **Session Management**: Users can have multiple chat sessions with different agents
- **User Profile**: Dropdown menu with user info and sign out option
- **Responsive Design**: Works on all devices

## How It Works

1. **New Users**: Can interact with agents 3 times before being prompted to sign up
2. **Returning Users**: If not signed in, will be prompted after 3 interactions
3. **Signed In Users**: Have unlimited access to all features
4. **Popup Dismissal**: Users can dismiss the popup and continue with remaining free interactions

## Security

- All authentication is handled securely by Clerk
- User sessions are managed automatically
- No sensitive data is stored locally
- API calls are protected by middleware 