#!/usr/bin/env python3
"""
Resume Builder - Unified Startup Script
A clean, simple way to start the application for both local and network access.
"""

import os
import sys
import subprocess
import time
import threading
import signal
import socket
from pathlib import Path

def get_local_ip():
    """Get the local IP address of this machine."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"

def check_dependencies():
    """Check if all required dependencies are installed."""
    print("🔍 Checking dependencies...")
    
    # Check Python dependencies
    try:
        import flask
        import google.generativeai
        import flask_cors
        print("✅ Python dependencies are installed")
    except ImportError as e:
        print(f"❌ Missing Python dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False
    
    # Check if Node.js is installed
    try:
        subprocess.run(["node", "--version"], check=True, capture_output=True)
        print("✅ Node.js is installed")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Node.js is not installed")
        print("Please install Node.js from https://nodejs.org/")
        return False
    
    # Check if npm is installed
    try:
        subprocess.run(["npm", "--version"], check=True, capture_output=True)
        print("✅ npm is installed")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ npm is not installed")
        return False
    
    return True

def check_env_file():
    """Check if .env file exists and has the required API key."""
    env_file = Path(".env")
    if not env_file.exists():
        print("❌ .env file not found")
        print("Creating .env file from template...")
        create_env_file()
        return False
    
    with open(env_file, 'r') as f:
        content = f.read()
        if "your_gemini_api_key_here" in content:
            print("⚠️  Please add your Gemini API key to .env file")
            print("Run: python setup_api_key.py")
            return False
    
    print("✅ .env file is configured")
    return True

def create_env_file():
    """Create .env file from template."""
    env_content = """# Resume Builder Environment Configuration

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Backend Server Configuration
PORT=5001
HOST=0.0.0.0
DEBUG=True

# Frontend Configuration
REACT_APP_BACKEND_URL=http://localhost:5001
REACT_APP_API_TIMEOUT=60000
"""
    
    # Only create if file doesn't exist
    if not os.path.exists(".env"):
        with open(".env", "w") as f:
            f.write(env_content)
        print("✅ .env file created")
    else:
        print("⚠️  .env file already exists - not overwriting")

class ResumeBuilderApp:
    def __init__(self):
        self.backend_process = None
        self.frontend_process = None
        self.running = True
        self.local_ip = get_local_ip()
        
    def start_backend(self):
        """Start the Flask backend server."""
        print("🚀 Starting Flask backend...")
        try:
            self.backend_process = subprocess.Popen([
                sys.executable, "app.py"
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            
            # Wait a moment for backend to start
            time.sleep(3)
            
            if self.backend_process.poll() is None:
                print("✅ Backend server started successfully")
            else:
                print("❌ Backend server failed to start")
                return False
                
        except Exception as e:
            print(f"❌ Error starting backend: {e}")
            return False
        
        return True
    
    def start_frontend(self):
        """Start the React frontend server."""
        print("🚀 Starting React frontend...")
        try:
            # Change to resume-builder directory
            os.chdir("resume-builder")
            
            # Install dependencies if node_modules doesn't exist
            if not Path("node_modules").exists():
                print("📦 Installing React dependencies...")
                subprocess.run(["npm", "install"], check=True)
            
            # Start the development server
            env = os.environ.copy()
            env['HOST'] = '0.0.0.0'  # Allow network access
            
            self.frontend_process = subprocess.Popen([
                "npm", "start"
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=env)
            
            # Wait a moment for frontend to start
            time.sleep(5)
            
            if self.frontend_process.poll() is None:
                print("✅ Frontend server started successfully")
            else:
                print("❌ Frontend server failed to start")
                return False
                
        except Exception as e:
            print(f"❌ Error starting frontend: {e}")
            return False
        
        return True
    
    def monitor_processes(self):
        """Monitor both processes and restart if needed."""
        while self.running:
            time.sleep(5)
            
            # Check backend
            if self.backend_process and self.backend_process.poll() is not None:
                print("⚠️  Backend process stopped, restarting...")
                self.start_backend()
            
            # Check frontend
            if self.frontend_process and self.frontend_process.poll() is not None:
                print("⚠️  Frontend process stopped, restarting...")
                self.start_frontend()
    
    def stop_servers(self):
        """Stop both servers gracefully."""
        print("\n🛑 Stopping servers...")
        self.running = False
        
        if self.backend_process:
            self.backend_process.terminate()
            self.backend_process.wait()
            print("✅ Backend server stopped")
        
        if self.frontend_process:
            self.frontend_process.terminate()
            self.frontend_process.wait()
            print("✅ Frontend server stopped")
    
    def run(self):
        """Main method to run the application."""
        print("🎨 Resume Builder")
        print("=" * 50)
        
        # Check dependencies
        if not check_dependencies():
            print("\n❌ Dependency check failed. Please fix the issues above.")
            return False
        
        # Check environment file
        if not check_env_file():
            print("\n❌ Environment check failed. Please fix the issues above.")
            return False
        
        print("\n✅ All checks passed!")
        print("\n🚀 Starting servers...")
        print("Backend will run on: http://0.0.0.0:5001")
        print("Frontend will run on: http://0.0.0.0:3000")
        print("\n🌐 Access URLs:")
        print(f"📍 Local: http://localhost:3000")
        print(f"📍 Network: http://{self.local_ip}:3000")
        print("\nPress Ctrl+C to stop all servers")
        print("-" * 50)
        
        # Start backend
        if not self.start_backend():
            print("❌ Failed to start backend")
            return False
        
        # Start frontend
        if not self.start_frontend():
            print("❌ Failed to start frontend")
            self.stop_servers()
            return False
        
        # Set up signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, lambda sig, frame: self.stop_servers())
        signal.signal(signal.SIGTERM, lambda sig, frame: self.stop_servers())
        
        # Start monitoring in a separate thread
        monitor_thread = threading.Thread(target=self.monitor_processes, daemon=True)
        monitor_thread.start()
        
        print("\n🎉 Resume Builder is now running!")
        print(f"📱 Local: http://localhost:3000")
        print(f"🌐 Network: http://{self.local_ip}:3000")
        print("\nPress Ctrl+C to stop all servers")
        
        try:
            # Keep the main thread alive
            while self.running:
                time.sleep(1)
        except KeyboardInterrupt:
            self.stop_servers()
        
        return True

def main():
    app = ResumeBuilderApp()
    success = app.run()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
