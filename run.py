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
    
    # Start the server in a separate process
    server_process = subprocess.Popen([sys.executable, "manage.py", "runserver"])
    
    # Wait a moment for the server to start
    print("Starting server...")
    sleep(2)
    
    # Open the browser
    print("Opening application in browser...")
    webbrowser.open("http://127.0.0.1:8000/")
    
    print("\nAlmostMe is now running!")
    print("Press Ctrl+C to stop the server when you're done.")
    
    try:
        # Keep the script running until interrupted
        server_process.wait()
    except KeyboardInterrupt:
        # Handle the Ctrl+C to gracefully shut down
        print("\nShutting down server...")
        server_process.terminate()
        server_process.wait()
        print("Server stopped. Goodbye!")

if __name__ == "__main__":
    setup_and_run()
