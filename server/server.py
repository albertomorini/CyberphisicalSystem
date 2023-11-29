from http.server import BaseHTTPRequestHandler, HTTPServer
PORT = 1199

## class will handle the requests
class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self): ##GET REQUESTS
        self.send_response(200)
        # TODO: set JSON
        self.send_header('Content-type','text/html')
        self.send_header('Access-Control-Allow-Origin','*')
        self.end_headers()
        # TODO: retrive data from backend 
        message = "Attack detected!"
        self.wfile.write(bytes(message, "utf8"))


def run():
    print('Server started...')
    server_address = ('127.0.0.1', PORT)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    print('Server in ready...')
    httpd.serve_forever()
    
run()