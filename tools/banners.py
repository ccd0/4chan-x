#!/usr/bin/env python3
import urllib.request, urllib.error, json
banners = []
for ext in ['jpg', 'png', 'gif']:
  for i in range(300):
    banner = str(i) + '.' + ext
    req = urllib.request.Request('http://s.4cdn.org/image/title/' + banner, method='HEAD')
    try:
      try:
        status = urllib.request.urlopen(req).status
      except urllib.error.URLError:
        status = urllib.request.urlopen(req).status
    except urllib.error.HTTPError as e:
      status = e.status
    print(banner, status)
    if status == 200:
      banners.append(banner)
with open('src/config/banners.json', 'w') as f:
  f.write(json.dumps(banners))
