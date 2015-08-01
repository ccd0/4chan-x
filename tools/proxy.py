#!/usr/bin/env python3
import http.server, http.client, socketserver, threading, sys, re

proxyConfig = b'''function FindProxyForURL(url, host) {
  if (/^http:\/\/boards\.4chan\.org\//.test(url)) {
    return 'PROXY localhost:8000';
  }
  return 'DIRECT';
}
'''
resources = {'/proxy.pac': ('application/x-javascript-config', proxyConfig)}

class ExtensionReplacer(http.server.BaseHTTPRequestHandler):
  def do_HEAD(self):
    self.do_GET()

  def do_GET(self):
    if self.headers.get('Host', '').split(':')[0] == 'localhost':
      self.local()
    else:
      self.proxy()

  def local(self):
    if self.path in resources:
      mimeType, data = resources[self.path]
      self.send_response(200)
      self.send_header('Content-Type', mimeType)
      self.send_header('Content-Length', len(data))
      self.end_headers()
      if self.command != 'HEAD':
        self.wfile.write(data)
    else:
      self.send_error(404)

  def proxy(self):
    del self.headers['Accept-Encoding']
    try:
      conn = http.client.HTTPConnection('boards.4chan.org')
      conn.request('GET', self.path, headers=self.headers)
      response = conn.getresponse()
      body = response.read()
    finally:
      conn.close()
    body = body.replace(b'<head>', b'<head><script src="https://ccd0.github.io/4chan-x/builds/4chan-X.user.js"></script>', 1)
    self.send_response(response.status, response.reason)
    for header, value in response.getheaders():
      if header.lower() not in ('date', 'connection', 'transfer-encoding', 'content-length'):
        self.send_header(header, value)
    self.send_header('Content-Length', len(body))
    self.end_headers()
    if self.command != 'HEAD':
      self.wfile.write(body)

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
  pass

port = int(sys.argv[1]) if 1 < len(sys.argv) else 8000
server = ThreadedHTTPServer(('localhost', port), ExtensionReplacer)
thread = threading.Thread(target=server.serve_forever)
thread.start()
