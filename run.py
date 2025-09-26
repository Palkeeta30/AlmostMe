#!/usr/bin/env python
import os
import sys
import subprocess
import webbrowser
from time import sleep

def setup_and_run():
    print("Setting up AlmostMe application...")
    
    # Make migrations
    subprocess.run([sys.executable, "manage.py", "makemigrations"])
    
    # Apply migrations
    subprocess.run([sys.executable, "manage.py", "migrate"])
    
    # Start the Django server in a separate process
    django_process = subprocess.Popen([sys.executable, "manage.py", "runserver"])
    
    # Wait for Django to start
    print("Starting Django backend server...")
    sleep(3)
    
    # Start the React frontend in a separate process
    print("Starting React frontend...")
    frontend_process = subprocess.Popen(["npm", "start"], cwd=os.path.dirname(os.path.abspath(__file__)))
    
    # Wait a bit more for frontend to start
    sleep(5)
    
    # Open the browser to the frontend
    print("Opening application in browser...")
    webbrowser.open("http://localhost:3000")
    
    print("\nAlmostMe is now running!")
    print("Backend: http://localhost:8000")
    print("Frontend: http://localhost:3000")
    print("Press Ctrl+C in the terminal to stop both servers.")
    
    try:
        # Wait for either process to finish
        django_process.wait()
        frontend_process.terminate()
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        django_process.terminate()
        frontend_process.terminate()
        django_process.wait()
        frontend_process.wait()
        print("Servers stopped. Goodbye!")

if __name__ == "__main__":
    setup_and_run()
