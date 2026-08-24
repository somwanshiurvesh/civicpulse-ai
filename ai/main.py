import json
import time
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = 5001

class AIPlaceholderHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Silence default stderr logging for clean console output
        pass

    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "success": True,
                "message": "AI Worker Service placeholder is running.",
                "data": {
                    "status": "UP",
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    "engine": "Python Stdlib http.server"
                }
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "success": True,
                "message": "Welcome to CivicPulse AI Service placeholder",
                "data": {
                    "status": "Idle",
                    "models": ["Image Analysis", "Category Classification", "Priority Scoring"]
                }
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))

def run():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, AIPlaceholderHandler)
    print(f"[CivicPulse AI] Python Service is running on port {PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down AI service...")
        httpd.server_close()

if __name__ == '__main__':
    run()
