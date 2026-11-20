"""Lokale testserver voor het prototype, zonder browsercache.

Zelfde als `python3 -m http.server`, maar elk antwoord krijgt "Cache-Control: no-store". Zo haalt de browser
na elke wijziging altijd de nieuwe CSS en JavaScript op en mengt hij nooit oude en nieuwe bestanden.

Gebruik (from the repository root):
    python3 tools/serve.py            -> http://127.0.0.1:8791/
    python3 tools/serve.py 8800       -> andere poort
Stoppen met Ctrl+C. Luistert alleen op 127.0.0.1 (niet zichtbaar voor andere toestellen in het netwerk).
"""
import functools
import http.server
import os
import sys

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, max-age=0')
        super().end_headers()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8791
    handler = functools.partial(NoCacheHandler, directory=os.path.normpath(SITE))
    with http.server.ThreadingHTTPServer(('127.0.0.1', port), handler) as httpd:
        print(f'Prototype op http://127.0.0.1:{port}/  (Ctrl+C om te stoppen)')
        httpd.serve_forever()
