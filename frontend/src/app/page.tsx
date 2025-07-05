'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, BookOpen, Briefcase, Target, Menu, X, Trash2 } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { chatAPI } from '../lib/api';
import LoginPopup from '../components/LoginPopup';
import AuthBanner from '../components/AuthBanner';
import UserProfile from '../components/UserProfile';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  agent_personality?: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatSession {
  id: string;
  agent: string;
  messages: ChatMessage[];
  isActive: boolean;
}

interface AgentInfo {
  name: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

const AGENT_INFO: Record<string, AgentInfo> = {
  career_explorer: {
    name: 'Career Explorer',
    description: 'Discovers career paths that match your interests',
    color: 'blue',
    icon: <Target className="w-5 h-5" />
  },
  skill_builder: {
    name: 'Skill Builder',
    description: 'Helps you develop the skills needed for your chosen career',
    color: 'green',
    icon: <BookOpen className="w-5 h-5" />
  },
  job_advisor: {
    name: 'Job Advisor',
    description: 'Provides information about real-world job roles and opportunities',
    color: 'purple',
    icon: <Briefcase className="w-5 h-5" />
  }
};

const FREE_INTERACTIONS_LIMIT = 25;

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  // const { user } = useUser();
  
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showAuthBanner, setShowAuthBanner] = useState(false);
  const [hasShownInitialPopup, setHasShownInitialPopup] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize with default session
  useEffect(() => {
    if (chatSessions.length === 0) {
      const defaultSession = createNewSession('career_explorer');
      setChatSessions([defaultSession]);
      setCurrentSessionId(defaultSession.id);
    }
  }, [chatSessions.length]);

  // Show initial popup for non-authenticated users
  useEffect(() => {
    if (isLoaded && !isSignedIn && !hasShownInitialPopup) {
      const timer = setTimeout(() => {
        setShowLoginPopup(true);
        setHasShownInitialPopup(true);
      }, 2000); // Show after 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, hasShownInitialPopup]);

  // Show auth banner when users exhaust free interactions
  useEffect(() => {
    if (isLoaded && !isSignedIn && interactionCount >= FREE_INTERACTIONS_LIMIT) {
      setShowAuthBanner(true);
      setShowLoginPopup(false); // Hide popup if banner is shown
    }
  }, [interactionCount, isLoaded, isSignedIn]);

  const createNewSession = (agent: string): ChatSession => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id: sessionId,
      agent,
      messages: [{
        role: 'assistant',
        content: `Hello! I'm your ${AGENT_INFO[agent]?.name}. I'm here to help you with your career journey. What would you like to know?`,
        agent_personality: agent,
        timestamp: new Date()
      }],
      isActive: true
    };
  };

  const getCurrentSession = () => {
    return chatSessions.find(session => session.id === currentSessionId);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatSessions]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentSessionId]);

  const startNewChat = (agent: string) => {
    // Deactivate current session
    setChatSessions(prev => prev.map(session => ({
      ...session,
      isActive: false
    })));

    // Check if session already exists for this agent
    const existingSession = chatSessions.find(session => session.agent === agent);
    
    if (existingSession) {
      // Reactivate existing session
      setChatSessions(prev => prev.map(session => ({
        ...session,
        isActive: session.id === existingSession.id
      })));
      setCurrentSessionId(existingSession.id);
    } else {
      // Create new session
      const newSession = createNewSession(agent);
      setChatSessions(prev => [...prev, newSession]);
      setCurrentSessionId(newSession.id);
    }
  };

  const deleteSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== sessionId));
    if (currentSessionId === sessionId) {
      const remainingSessions = chatSessions.filter(session => session.id !== sessionId);
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].id);
      }
    }
  };

  const simulateStreamingResponse = async (content: string, sessionId: string) => {
    const words = content.split(' ');
    let streamedContent = '';
    
    for (let i = 0; i < words.length; i++) {
      streamedContent += words[i] + ' ';
      
      setChatSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? {
              ...session,
              messages: session.messages.map((msg, idx) => 
                idx === session.messages.length - 1 
                  ? { ...msg, content: streamedContent.trim(), isStreaming: true }
                  : msg
              )
            }
          : session
      ));
      
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    }
    
    // Mark as complete
    setChatSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? {
            ...session,
            messages: session.messages.map((msg, idx) => 
              idx === session.messages.length - 1 
                ? { ...msg, isStreaming: false }
                : msg
            )
          }
        : session
    ));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Check if user needs to login
    if (!isSignedIn && interactionCount >= FREE_INTERACTIONS_LIMIT) {
      setShowAuthBanner(true);
      return;
    }

    const currentSession = getCurrentSession();
    if (!currentSession) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    // Add user message
    setChatSessions(prev => prev.map(session => 
      session.id === currentSessionId 
        ? {
            ...session,
            messages: [...session.messages, userMessage]
          }
        : session
    ));

    setInputMessage('');
    setIsLoading(true);

    // Increment interaction count for non-authenticated users
    if (!isSignedIn) {
      setInteractionCount(prev => prev + 1);
    }

    try {
      const response = await chatAPI.sendMessage(inputMessage, currentSession.messages, currentSession.agent);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        agent_personality: response.agent_personality || currentSession.agent,
        timestamp: new Date(),
        isStreaming: true
      };

      // Add assistant message
      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? {
              ...session,
              messages: [...session.messages, assistantMessage]
            }
          : session
      ));

      // Simulate streaming
      await simulateStreamingResponse(response.message, currentSessionId);
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        agent_personality: currentSession.agent,
        timestamp: new Date()
      };
      
      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? {
              ...session,
              messages: [...session.messages, errorMessage]
            }
          : session
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAgentColor = (agent: string) => {
    return AGENT_INFO[agent]?.color || 'gray';
  };

  const formatMessage = (content: string) => {
    // Convert markdown-like formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\.\s+(.+)$/gm, '<li>$2</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  };

  const renderMessageContent = (content: string, isStreaming?: boolean) => {
    const formattedContent = formatMessage(content);
    return (
      <div className="prose prose-sm max-w-none">
        <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
        {isStreaming && <span className="ml-1 animate-pulse">...</span>}
      </div>
    );
  };

  const remainingInteractions = FREE_INTERACTIONS_LIMIT - interactionCount;
  const hasExhaustedFreeInteractions = remainingInteractions <= 0;

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Auth Banner - appears at top when users exhaust free interactions */}
      <AuthBanner
        isVisible={showAuthBanner}
        onDismiss={hasExhaustedFreeInteractions ? undefined : () => setShowAuthBanner(false)}
        interactionCount={interactionCount}
      />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0`} style={{ top: showAuthBanner ? '80px' : '0' }}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-800">Career Mentor</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Agent Selection */}
          <div className="flex-1 p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
              Choose Your Agent
            </h3>
            {Object.entries(AGENT_INFO).map(([key, info]) => (
              <button
                key={key}
                onClick={() => startNewChat(key)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  getCurrentSession()?.agent === key
                    ? `bg-${info.color}-50 border-2 border-${info.color}-200`
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  getCurrentSession()?.agent === key
                    ? `bg-${info.color}-500 text-white`
                    : `bg-gray-100 text-gray-600`
                }`}>
                  {info.icon}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-800">{info.name}</h4>
                  <p className="text-sm text-gray-500">{info.description}</p>
                </div>
                {getCurrentSession()?.agent === key && (
                  <div className={`w-2 h-2 bg-${info.color}-500 rounded-full`} />
                )}
              </button>
            ))}
          </div>

          {/* Chat Sessions */}
          {chatSessions.length > 1 && (
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Chat Sessions
              </h3>
              <div className="space-y-2">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      session.id === currentSessionId
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentSessionId(session.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full bg-${getAgentColor(session.agent)}-500`} />
                      <span className="text-sm text-gray-700 truncate">
                        {AGENT_INFO[session.agent]?.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col lg:ml-0" style={{ marginTop: showAuthBanner ? '80px' : '0' }}>
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            {getCurrentSession() && (
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg bg-${getAgentColor(getCurrentSession()!.agent)}-100`}>
                  {AGENT_INFO[getCurrentSession()!.agent]?.icon}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">{AGENT_INFO[getCurrentSession()!.agent]?.name}</h2>
                  <p className="text-sm text-gray-500">Career Mentor Agent</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Right side - User Profile and Interaction Counter */}
          <div className="flex items-center space-x-4">
            {/* Interaction Counter for non-authenticated users */}
            {!isSignedIn && (
              <div className="text-sm text-gray-600">
                {remainingInteractions > 0 ? (
                  <span className="text-blue-600 font-medium">
                    {remainingInteractions} free interaction{remainingInteractions > 1 ? 's' : ''} left
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    Sign up to continue
                  </span>
                )}
              </div>
            )}
            
            {/* User Profile - now in the top bar */}
            <UserProfile />
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto bg-white"
        >
          <div className="max-w-4xl mx-auto px-4 py-8">
            {getCurrentSession()?.messages.map((message, index) => (
              <div
                key={index}
                className={`mb-6 ${
                  message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                }`}
              >
                <div className={`max-w-2xl ${
                  message.role === 'user' ? 'ml-auto' : 'mr-auto'
                }`}>
                  <div className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : `bg-${getAgentColor(message.agent_personality || getCurrentSession()!.agent)}-100 text-${getAgentColor(message.agent_personality || getCurrentSession()!.agent)}-600`
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`flex-1 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      <div className={`inline-block px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {renderMessageContent(message.content, message.isStreaming)}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="max-w-2xl">
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-${getAgentColor(getCurrentSession()!.agent)}-100 text-${getAgentColor(getCurrentSession()!.agent)}-600`}>
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="inline-block px-4 py-3 rounded-2xl bg-gray-100">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    !isSignedIn && hasExhaustedFreeInteractions 
                      ? "Sign up to continue chatting..." 
                      : "Message Career Mentor Agent..."
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 placeholder-gray-500 text-gray-900 text-sm"
                  rows={1}
                  disabled={isLoading || (!isSignedIn && hasExhaustedFreeInteractions)}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim() || (!isSignedIn && hasExhaustedFreeInteractions)}
                className="flex-shrink-0 bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              Career Mentor Agent can make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Login Popup - only shown for initial users, not when exhausted */}
      <LoginPopup
        isVisible={showLoginPopup && !hasExhaustedFreeInteractions}
        onDismiss={() => setShowLoginPopup(false)}
        interactionCount={interactionCount}
      />
    </div>
  );
}
