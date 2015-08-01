#!/usr/bin/env python3
import http.server, http.client, sys, re

proxyConfig = b'''function FindProxyForURL(url, host) {
  if (/^http:\/\/s\.4cdn\.org\/(js\/extension\.min\.\d+\.js)?$/.test(url)) {
    return 'PROXY localhost:8000';
  }
  return 'DIRECT';
}
'''

class ExtensionReplacer(http.server.BaseHTTPRequestHandler):
  def do_HEAD(self):
    self.do_GET()

  def do_GET(self):
    if self.path == '/proxy.pac':
      self.send_response(200, 'OK')
      self.send_header('Content-Length', len(proxyConfig))
      self.end_headers()
      if self.command != 'HEAD':
        self.wfile.write(proxyConfig)
    elif re.match(r'http://s\.4cdn\.org/js/extension.min.\d+.js$', self.path):
      self.send_response(302, 'Found')
      self.send_header('Location', 'https://ccd0.github.io/4chan-x/builds/4chan-X.user.js')
      self.end_headers()
    else:
      conn = http.client.HTTPConnection('s.4cdn.org')
      conn.request('GET', self.path, headers=self.headers)
      response = conn.getresponse()
      body = response.read()
      self.send_response(response.status, response.reason)
      for header, value in response.getheaders():
        if header.lower() not in ('date', 'connection', 'content-encoding', 'transfer-encoding', 'content-length'):
          self.send_header(header, value)
      self.send_header('Content-Length', len(body))
      self.end_headers()
      if self.command != 'HEAD':
        self.wfile.write(body)
      conn.close()

port = int(sys.argv[1]) if 1 < len(sys.argv) else 8000
httpd = http.server.HTTPServer(('localhost', port), ExtensionReplacer)
httpd.serve_forever()
