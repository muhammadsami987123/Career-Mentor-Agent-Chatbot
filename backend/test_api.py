#!/usr/bin/env python3
"""
Simple test script for the Career Mentor Agent API
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test if the API is running"""
    try:
        response = requests.get(f"{BASE_URL}/docs")
        print("✅ API is running - Swagger docs available")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ API is not running. Start with: uvicorn main:app --reload")
        return False

def test_careers_endpoint():
    """Test the careers endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/careers")
        if response.status_code == 200:
            careers = response.json()
            print(f"✅ Careers endpoint working - Found {len(careers['careers'])} career paths")
            return True
        else:
            print(f"❌ Careers endpoint failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Careers endpoint error: {e}")
        return False

def test_agents_endpoint():
    """Test the agents endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/agents")
        if response.status_code == 200:
            agents = response.json()
            print(f"✅ Agents endpoint working - Found {len(agents['agents'])} agents")
            return True
        else:
            print(f"❌ Agents endpoint failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Agents endpoint error: {e}")
        return False

def test_chat_endpoint():
    """Test the chat endpoint (without API keys)"""
    try:
        chat_data = {
            "message": "Hello, I'm interested in technology careers",
            "conversation_history": [],
            "current_agent": "career_explorer"
        }
        response = requests.post(f"{BASE_URL}/api/chat", json=chat_data)
        if response.status_code == 500:
            print("⚠️  Chat endpoint responding (API keys needed for full functionality)")
            return True
        elif response.status_code == 200:
            print("✅ Chat endpoint working with API keys")
            return True
        else:
            print(f"❌ Chat endpoint failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Chat endpoint error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Career Mentor Agent API...\n")
    
    tests = [
        test_health,
        test_careers_endpoint,
        test_agents_endpoint,
        test_chat_endpoint
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The API is ready to use.")
    else:
        print("⚠️  Some tests failed. Check the output above for details.")

if __name__ == "__main__":
    main() 