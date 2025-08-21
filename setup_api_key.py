#!/usr/bin/env python3
"""
Script to help set up the Gemini API key.
"""

import os

def setup_api_key():
    """Set up the Gemini API key in .env file."""
    print("🔑 Gemini API Key Setup")
    print("=" * 30)
    
    # Check if .env exists
    if not os.path.exists(".env"):
        print("❌ .env file not found. Creating one...")
        with open(".env", "w") as f:
            f.write("GEMINI_API_KEY=your_gemini_api_key_here\n")
    
    # Read current .env
    with open(".env", "r") as f:
        content = f.read()
    
    # Check if API key is already set
    if "your_gemini_api_key_here" in content:
        print("⚠️  You need to add your actual Gemini API key!")
        print("\n📝 Steps to get your API key:")
        print("1. Go to https://makersuite.google.com/app/apikey")
        print("2. Sign in with your Google account")
        print("3. Click 'Create API Key'")
        print("4. Copy the generated API key")
        print("\n🔧 To update your .env file:")
        print("1. Open .env file in a text editor")
        print("2. Replace 'your_gemini_api_key_here' with your actual API key")
        print("3. Save the file")
        print("\nExample:")
        print("GEMINI_API_KEY=AIzaSyC...your_actual_key_here...")
        
        # Ask if user wants to input it now
        response = input("\n🤔 Do you want to enter your API key now? (y/n): ").lower().strip()
        if response == 'y':
            api_key = input("🔑 Enter your Gemini API key: ").strip()
            if api_key and api_key != "your_gemini_api_key_here":
                # Update the .env file
                new_content = content.replace("your_gemini_api_key_here", api_key)
                with open(".env", "w") as f:
                    f.write(new_content)
                print("✅ API key updated successfully!")
                return True
            else:
                print("❌ Invalid API key. Please try again.")
                return False
        else:
            print("ℹ️  Please update your .env file manually and run this script again.")
            return False
    else:
        print("✅ API key is already configured!")
        return True

if __name__ == "__main__":
    setup_api_key()
