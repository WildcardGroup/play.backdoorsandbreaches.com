"""Maakt de twee banden van de spelpagina (SVG) in de lijnenbundel-stijl van Wildcard Group.

Port van wave_bundle() uit het ontwerp van de Wildcard Group-portfolio: hetzelfde algoritme als de
hero van wildcardgroup.be (#signal-canvas). Een golvende bundel kernlijnen met losse randlijnen en deeltjes,
zonder convergentie en zonder brandpunt.

Aanpassingen voor een band van 125 px hoog over de volle schermbreedte:
- aparte horizontale en verticale schaal (de bundel loopt plat en breed, met zachte golven);
- teal accentlijnen en -deeltjes zoals in de hero van de website (TEAL_LIGHT / TEAL_DEEP);
- geen gloed-brandpunt, en een vlakkere opbouw van links naar rechts, zodat er over de hele band lijnen staan;
- eenheden in px, viewBox W x 125.

Gebruik (vanuit de root van de repository):  python3 tools/generate_bands.py assets
Schrijft wg-band-scenario.svg (navy band, achter de scenariokaarten) en wg-band-detections.svg
(teal band, achter de Established Detections).
"""
import math
import sys


class _Rnd:
    """Zelfde LCG als wave.py en de website, zodat een seed hetzelfde beeld geeft."""
    def __init__(self, seed): self.s = seed
    def __call__(self):
        self.s = (self.s * 1664525 + 1013904223) % 4294967296
        return self.s / 4294967296


def _hex(c): return '#%02X%02X%02X' % tuple(max(0, min(255, round(v))) for v in c)


# kleurverloop van links naar rechts, zoals wave.py
STOPS_NAVY = [(0.00, (94, 147, 168)), (0.45, (150, 196, 212)), (0.75, (236, 244, 247)), (1.00, (190, 222, 233))]
# lichte variant voor de teal band: bijna wit
STOPS_WHITE = [(0.00, (205, 229, 237)), (0.50, (236, 246, 249)), (1.00, (255, 255, 255))]
TEAL_LIGHT = (10, 126, 158)   # accentlijnen in de hero van de website
TEAL_DEEP = (3, 89, 116)


def _mix(stops, nx):
    x = max(0.0, min(1.0, nx))
    for i in range(1, len(stops)):
        if x <= stops[i][0]:
            a, b = stops[i - 1], stops[i]
            u = (x - a[0]) / ((b[0] - a[0]) or 1)
            return [a[1][k] + (b[1][k] - a[1][k]) * u for k in range(3)]
    return list(stops[-1][1])


def _ramp(nx, lo=0.10, span=0.72):
    return min(1.0, max(0.0, (nx - lo) / span))


def wave_band(gid, W=2560, H=125, t=6.0, seed=20261013, strength=1.0, stops=STOPS_NAVY, sy=0.45,
              lane_gap=11, particles=520, minfrac=0.38, teal_accent=True, samples=301, center_scale=0.2, spread=0.5):
    """Lijnenbundel over de volle breedte W, middenlijn op H/2. sy = px per virtuele eenheid in de hoogte.
    center_scale dempt de trage golf van de hele bundel en spread de afstand van randlijnen en losse deeltjes,
    zodat de bundel in een band van 125 px blijft; de korte golven (twist) blijven op volle sterkte."""
    rnd = _Rnd(seed)
    VW, VH = 1500.0, 1080.0
    cy = H / 2
    amp = VH * 0.10
    TAU = 2 * math.pi

    def center(nx): return (math.sin(nx * 1.7 + t * 0.11) * amp + math.sin(nx * 3.6 - t * 0.15 + 1.3) * amp * 0.4) * center_scale

    def twist(ta):
        f, sp, p = 5.5 + rnd() * 9, 0.16 + rnd() * 0.22, rnd() * 7
        f2, sp2, p2 = 11 + rnd() * 10, 0.10 + rnd() * 0.12, rnd() * 7
        return lambda nx: math.sin(nx * f + t * sp + p) * ta + math.sin(nx * f2 - t * sp2 + p2) * ta * 0.4

    def wave(ampscale, ta):
        tw = twist(ta)
        return lambda nx: center(nx) * ampscale + tw(nx)

    defs, body = [], []

    def grad(name, peak, mf, lift, rgb=None):
        st = []
        for i in range(11):
            nx = i / 10
            c = list(rgb) if rgb else [v + lift for v in _mix(stops, nx)]
            a = strength * peak * (mf + (1 - mf) * _ramp(nx))
            st.append(f'<stop offset="{nx:.1f}" stop-color="{_hex(c)}" stop-opacity="{min(1, a):.3f}"/>')
        defs.append(f'<linearGradient id="{name}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="{W}" y2="0">{"".join(st)}</linearGradient>')

    def poly(fn, off):
        pts = []
        for k in range(samples):
            nx = k / (samples - 1)
            pts.append((nx * W, cy + (off + fn(nx)) * sy))
        return 'M' + ' L'.join(f'{a:.1f},{b:.1f}' for a, b in pts)

    CORE, FRINGE = 11, 16
    cores = []
    for i in range(CORE):
        lane = i - (CORE - 1) / 2
        near = 1 - min(1, abs(lane) / ((CORE - 1) / 2))
        accent = teal_accent and rnd() < 0.35
        cores.append((lane * lane_gap, wave(1, 14 + rnd() * 12), 0.7 + near * 1.1, 0.20 + near * 0.62,
                      round(near * 22), i, accent))
    fringes = []
    for i in range(FRINGE):
        lane = i - (FRINGE - 1) / 2
        side = -1 if lane < 0 else 1
        dist = (70 + abs(lane) * (VH * 0.024) + rnd() * 22) * spread
        alpha = max(0.035, 0.15 - (dist / spread / VH) * 0.4)
        accent = teal_accent and rnd() < 0.30
        fringes.append((side * dist, wave(0.7 + rnd() * 0.5, 10 + rnd() * 16), max(0.5, 0.95 - (dist / spread / VH) * 1.1), alpha, i, accent))
    pwave = wave(0.85, 16)
    parts = []
    for _ in range(particles):
        nearcore = rnd() < 0.55
        ty = rnd()
        parts.append(dict(nx=rnd(), off=(rnd() - 0.5) * 110 if nearcore else (rnd() - 0.5) * (VH * 0.5) * spread,
                          shape='circle' if ty < 0.55 else ('square' if ty < 0.8 else 'chevron'),
                          size=1.1 + rnd() * 3.4, ph=rnd() * TAU, sp=0.3 + rnd() * 1.2, rot=rnd() * TAU,
                          accent=teal_accent and rnd() < 0.15))

    for off, fn, w, a, i, accent in fringes:
        grad(f'{gid}f{i}', a * (3.2 if accent else 1), 0.4 if accent else minfrac, 0, TEAL_DEEP if accent else None)
        body.append(f'<path d="{poly(fn, off)}" stroke="url(#{gid}f{i})" stroke-width="{(w * 1.6 if accent else w):.2f}"/>')
    for p in parts:
        nx = p['nx']
        x = nx * W
        y = cy + (p['off'] + pwave(nx)) * sy
        if y < -4 or y > H + 4:
            continue
        near = max(0.0, 1 - abs(p['off']) / (VH * 0.32 * spread))
        tw = 0.55 + 0.45 * max(0.0, math.sin(t * p['sp'] + p['ph']))
        a = strength * (0.16 + 0.5 * near) * tw * (0.35 + 0.65 * _ramp(nx))
        col = _hex(TEAL_LIGHT) if p['accent'] else _hex([v + near * 40 for v in _mix(stops, nx)])
        sz = p['size'] * 0.9
        if p['shape'] == 'circle':
            body.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{sz * 0.5:.2f}" fill="{col}" fill-opacity="{a:.2f}" stroke="none"/>')
        elif p['shape'] == 'square':
            body.append(f'<rect x="{-sz / 2:.2f}" y="{-sz / 2:.2f}" width="{sz:.2f}" height="{sz:.2f}" stroke="{col}" '
                        f'stroke-opacity="{a:.2f}" stroke-width="0.7" transform="translate({x:.1f},{y:.1f}) rotate({math.degrees(p["rot"]):.0f})"/>')
        else:
            body.append(f'<path d="M{-sz * 0.5:.2f},{-sz * 0.6:.2f} L{sz * 0.3:.2f},0 L{-sz * 0.5:.2f},{sz * 0.6:.2f}" stroke="{col}" '
                        f'stroke-opacity="{a:.2f}" stroke-width="0.8" transform="translate({x:.1f},{y:.1f}) rotate({math.degrees(p["rot"]):.0f})"/>')
    for off, fn, w, a, lift, i, accent in cores:
        grad(f'{gid}c{i}', 0.65 + a * 0.35 if accent else a, 0.4 if accent else minfrac, lift, TEAL_LIGHT if accent else None)
        d = poly(fn, off)
        width = 1.1 + (w - 0.7) * 1.2 if accent else w
        body.append(f'<path d="{d}" stroke="url(#{gid}c{i})" stroke-width="{width * 4:.2f}" stroke-opacity="0.10"/>')
        body.append(f'<path d="{d}" stroke="url(#{gid}c{i})" stroke-width="{width:.2f}"/>')
    return '<defs>' + ''.join(defs) + '</defs><g fill="none" stroke-linecap="round" stroke-linejoin="round">' + ''.join(body) + '</g>'


def dot_grid(gid, W, H, step=12, r=0.7, col='#5E93A8', op=0.20):
    """Het fijne puntenraster van de portfolio-cover (dots() in build.py), in px."""
    return (f'<defs><pattern id="{gid}" width="{step}" height="{step}" patternUnits="userSpaceOnUse">'
            f'<circle cx="{step / 2}" cy="{step / 2}" r="{r}" fill="{col}" fill-opacity="{op}"/></pattern></defs>'
            f'<rect width="{W}" height="{H}" fill="url(#{gid})"/>')


def svg(W, H, comment, content):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">\n'
            f'<!-- {comment} -->\n{content}\n</svg>\n')


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'site/assets'
    W, H = 2560, 125
    # navy band achter de scenariokaarten: de bundel van de portfolio-cover (seed en t van de cover)
    scen = svg(W, H, 'Wildcard Group wave bundle (scenario row), after the Service Portfolio cover and the wildcardgroup.be hero. Wildcard Group, 18 October 2026.',
               dot_grid('sd', W, H) + wave_band('s', W, H, t=6.0, seed=20261013))
    open(f'{out}/wg-band-scenario.svg', 'w').write(scen)
    # teal band achter de Established Detections: lichtere bundel, wit op lage dekking
    det = svg(W, H, 'Wildcard Group wave bundle, light (Established Detections). Wildcard Group, 18 October 2026.',
              wave_band('d', W, H, t=9.0, seed=11, strength=0.55, stops=STOPS_WHITE, particles=260,
                        teal_accent=False, minfrac=0.5))
    open(f'{out}/wg-band-detections.svg', 'w').write(det)
    print('ok:', f'{out}/wg-band-scenario.svg', f'{out}/wg-band-detections.svg')
