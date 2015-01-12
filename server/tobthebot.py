import http.server
import socketserver
import os

PORT = 80
Handler = http.server.SimpleHTTPRequestHandler
os.chdir("../front")
httpd = socketserver.TCPServer(("", PORT), Handler)

httpd.serve_forever()
