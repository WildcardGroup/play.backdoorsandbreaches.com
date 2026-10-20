// Wildcard Group (18 October 2026): the moving wave bundle of the wildcardgroup.be hero, in the two
// horizontal bands of the game (behind the scenario cards and behind the Established Detections).
// Same algorithm as the hero's #signal-canvas script (and as tools/genereer_banden.py, which makes the
// static bands): a woven bundle of core strands, loose fringe lines and twinkling particles, no focal point.
// Adapted to a band of 125 px (90 px on phones): slower and fainter than the hero, no glow, at most
// 30 frames a second, and only while a band is on screen.
// Fallback: the static SVG bands in wildcard-game.css stay in place when the visitor asks for reduced
// motion, when canvas is not available, or when <body> does not carry the class "wg-bands".
(() => {
    const body = document.body;
    if (!body.classList.contains('wg-bands')) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const probe = document.createElement('canvas');
    if (!probe.getContext || !probe.getContext('2d')) return;

    const phone = window.matchMedia('(max-width: 767px)');
    const VH = 1080;              // the hero's reference height: offsets below are in hero pixels
    const CENTER_SCALE = 0.2;     // damp the slow swing of the whole bundle so it stays inside the band
    const SPREAD = 0.5;           // fringe lines and loose particles closer to the core
    const SPEED = 0.6;            // the hero runs at 1.0
    const TEAL_DEEP = [3, 89, 116];
    const TEAL_LIGHT = [10, 126, 158];

    // navy band behind the scenario cards, teal band behind the Established Detections (lighter, white)
    const THEMES = {
        navy: { fill: '#0B2641', edge: '#005670', strength: 0.75, accents: true,
                core: n => [150 + n * 90, 190 + n * 55, 205 + n * 45], fringe: [150, 190, 205],
                pLow: [94, 147, 168], pHigh: [228, 236, 241], particles: 0.24 },
        teal: { fill: '#005670', edge: '#0B2641', strength: 0.45, accents: false,
                core: n => [215 + n * 40, 232 + n * 23, 238 + n * 17], fringe: [220, 236, 242],
                pLow: [190, 222, 233], pHigh: [255, 255, 255], particles: 0.12 }
    };

    const rgba = (c, a) => `rgba(${c.map(Math.round).join(',')},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
    const ramp = nx => Math.min(1, Math.max(0, (nx - 0.15) / 0.6));
    const envelope = nx => 0.6 + 0.4 * ramp(nx);

    function makeTwist(twistAmp) {
        const f = 5.5 + Math.random() * 9, s = 0.16 + Math.random() * 0.22, p = Math.random() * 7;
        const f2 = 11 + Math.random() * 10, s2 = 0.1 + Math.random() * 0.12, p2 = Math.random() * 7;
        return (nx, t) => Math.sin(nx * f + t * s + p) * twistAmp + Math.sin(nx * f2 - t * s2 + p2) * twistAmp * 0.4;
    }
    const ampBase = VH * 0.1 * CENTER_SCALE;
    const centerline = (nx, t) => Math.sin(nx * 1.7 + t * 0.11) * ampBase + Math.sin(nx * 3.6 - t * 0.15 + 1.3) * ampBase * 0.4;
    function makeStrandWave(ampScale, twistAmp) {
        const twist = makeTwist(twistAmp);
        return (nx, t) => centerline(nx, t) * ampScale + twist(nx, t);
    }

    class Band {
        constructor(host, theme, phase) {
            this.host = host;
            this.theme = theme;
            this.phase = phase;
            this.visible = false;
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'wg-band-canvas';
            this.canvas.setAttribute('aria-hidden', 'true');
            // layout set here, not in the stylesheet: with a stale cached stylesheet the canvas would
            // otherwise fall into the page flow at its bitmap size (wide, blurry, cards pushed away)
            this.canvas.style.cssText = 'display:block;position:absolute;left:0;top:50%;width:100%;' +
                'transform:translateY(-50%);pointer-events:none;z-index:0;margin:0;padding:0;border:0';
            host.insertBefore(this.canvas, host.firstChild);
            this.ctx = this.canvas.getContext('2d');
            this.size();
        }

        size() {
            this.w = Math.max(1, this.host.clientWidth);
            this.h = phone.matches ? 90 : 125;
            this.dpr = Math.min(2, window.devicePixelRatio || 1);
            this.canvas.width = Math.round(this.w * this.dpr);
            this.canvas.height = Math.round(this.h * this.dpr);
            this.canvas.style.height = this.h + 'px';
            this.sy = 0.45 * this.h / 125;
            // the bundle is laid out over at least 1400 px and centred, so a phone shows the middle of it
            // instead of squeezing every wave into 375 px
            this.VW = Math.max(this.w, 1400);
            this.x0 = (this.w - this.VW) / 2;
            this.steps = Math.max(60, Math.round(this.w / 12));
            this.build();
        }

        gradient(peak, rgb, minFrac) {
            const g = this.ctx.createLinearGradient(this.x0, 0, this.x0 + this.VW, 0);
            for (const nx of [0, 0.22, 0.4, 0.6, 0.8, 1]) {
                g.addColorStop(nx, rgba(rgb, this.theme.strength * peak * (minFrac + (1 - minFrac) * ramp(nx))));
            }
            return g;
        }

        build() {
            const th = this.theme;
            this.cores = Array.from({ length: 11 }, (_, i) => {
                const lane = i - 5;
                const near = 1 - Math.min(1, Math.abs(lane) / 5);
                const accent = th.accents && Math.random() < 0.35;
                return {
                    off: lane * 11,
                    wave: makeStrandWave(1, 14 + Math.random() * 12),
                    width: accent ? 1.1 + near * 1.3 : 0.7 + near * 1.1,
                    grad: this.gradient(accent ? 0.65 + near * 0.35 : 0.18 + near * 0.62, accent ? TEAL_LIGHT : th.core(near), accent ? 0.4 : 0.35)
                };
            });
            this.fringes = Array.from({ length: 16 }, (_, i) => {
                const lane = i - 7.5;
                const side = lane < 0 ? -1 : 1;
                const dist = 70 + Math.abs(lane) * (VH * 0.024) + Math.random() * 22;
                const alpha = Math.max(0.03, 0.13 - (dist / VH) * 0.4);
                const accent = th.accents && Math.random() < 0.3;
                return {
                    off: side * dist * SPREAD,
                    wave: makeStrandWave(0.7 + Math.random() * 0.5, 10 + Math.random() * 16),
                    width: accent ? Math.max(0.9, (0.9 - (dist / VH) * 1.1) * 1.6) : Math.max(0.5, 0.9 - (dist / VH) * 1.1),
                    grad: this.gradient(accent ? alpha * 3.2 : alpha, accent ? TEAL_DEEP : th.fringe, accent ? 0.4 : 0.3)
                };
            });
            this.pwave = makeStrandWave(0.85, 16);
            // particles only where the band is visible
            this.nxL = -this.x0 / this.VW;
            this.nxR = (this.w - this.x0) / this.VW;
            this.particles = Array.from({ length: Math.round(this.w * th.particles) }, () => {
                const nearCore = Math.random() < 0.55;
                const type = Math.random();
                const rot = Math.random() * Math.PI * 2;
                const off = nearCore ? (Math.random() - 0.5) * 110 : (Math.random() - 0.5) * VH * 0.5 * SPREAD;
                return {
                    nx: this.nxL + Math.random() * (this.nxR - this.nxL),
                    off,
                    near: Math.max(0, 1 - Math.abs(off) / (VH * 0.32 * SPREAD)),
                    shape: type < 0.72 ? 0 : (type < 0.88 ? 1 : 2),
                    size: 1.1 + Math.random() * 3.4,
                    accent: th.accents && Math.random() < 0.15,
                    ph: Math.random() * Math.PI * 2,
                    sp: 0.3 + Math.random() * 1.2,
                    drift: (Math.random() - 0.5) * 0.00007 * SPEED,
                    cos: Math.cos(rot), sin: Math.sin(rot)
                };
            });
        }

        strand(ln, t) {
            const ctx = this.ctx, mid = this.h / 2;
            ctx.strokeStyle = ln.grad;
            ctx.lineWidth = ln.width;
            ctx.beginPath();
            for (let s = 0; s <= this.steps; s++) {
                const x = this.w * s / this.steps;
                const nx = (x - this.x0) / this.VW;
                const y = mid + (ln.off + ln.wave(nx, t)) * this.sy;
                if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        draw(t) {
            const ctx = this.ctx, th = this.theme, w = this.w, h = this.h, mid = h / 2;
            t = t + this.phase;
            ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = th.fill;
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = th.edge;
            ctx.fillRect(0, 0, w, 2);
            ctx.fillRect(0, h - 2, w, 2);

            for (const ln of this.fringes) this.strand(ln, t);

            const span = this.nxR - this.nxL;
            for (const p of this.particles) {
                p.nx += p.drift;
                if (p.nx < this.nxL) p.nx += span; else if (p.nx > this.nxR) p.nx -= span;
                const x = this.x0 + p.nx * this.VW;
                const y = mid + (p.off + this.pwave(p.nx, t)) * this.sy;
                if (y < -4 || y > h + 4) continue;
                const twinkle = 0.55 + 0.45 * Math.max(0, Math.sin(t * p.sp + p.ph));
                const a = th.strength * (0.16 + 0.5 * p.near) * twinkle * envelope(p.nx);
                const c = p.accent ? TEAL_LIGHT : th.pLow.map((v, k) => v + (th.pHigh[k] - v) * p.near);
                ctx.strokeStyle = ctx.fillStyle = rgba(c, p.accent ? a * 1.8 : a);
                if (p.shape === 0) {
                    ctx.beginPath(); ctx.arc(x, y, p.size * 0.45, 0, Math.PI * 2); ctx.fill();
                } else if (p.shape === 1) {
                    const hs = p.size / 2, cs = p.cos, sn = p.sin;
                    ctx.lineWidth = 0.7;
                    ctx.beginPath();
                    ctx.moveTo(x + (-hs * cs + hs * sn), y + (-hs * sn - hs * cs));
                    ctx.lineTo(x + (hs * cs + hs * sn), y + (hs * sn - hs * cs));
                    ctx.lineTo(x + (hs * cs - hs * sn), y + (hs * sn + hs * cs));
                    ctx.lineTo(x + (-hs * cs - hs * sn), y + (-hs * sn + hs * cs));
                    ctx.closePath(); ctx.stroke();
                } else {
                    const cs = p.cos, sn = p.sin, s = p.size;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(x - 0.5 * s * cs + 0.6 * s * sn, y - 0.5 * s * sn - 0.6 * s * cs);
                    ctx.lineTo(x + 0.3 * s * cs, y + 0.3 * s * sn);
                    ctx.lineTo(x - 0.5 * s * cs - 0.6 * s * sn, y - 0.5 * s * sn + 0.6 * s * cs);
                    ctx.stroke();
                }
            }

            ctx.globalCompositeOperation = 'lighter';
            for (const ln of this.cores) this.strand(ln, t);
            ctx.globalCompositeOperation = 'source-over';
        }
    }

    // the scenario band can live inside .cards (its contents are never replaced); #output is refilled
    // by the game on every deal, so its band canvas sits in a wrapper next to it
    const bands = [];
    const cards = document.querySelector('.cards');
    if (cards) {
        cards.style.position = 'relative';
        cards.style.background = 'none';
        bands.push(new Band(cards, THEMES.navy, 0));
    }
    const output = document.getElementById('output');
    if (output) {
        const wrap = document.createElement('div');
        wrap.className = 'wg-procband';
        wrap.style.position = 'relative';
        output.parentNode.insertBefore(wrap, output);
        wrap.appendChild(output);
        // the Detections above the canvas; their static band image gives way to the moving one
        output.style.position = 'relative';
        output.style.zIndex = '1';
        output.style.background = 'none';
        bands.push(new Band(wrap, THEMES.teal, 40));
    }
    if (!bands.length) return;

    const FRAME = 1000 / (phone.matches ? 24 : 30);
    let last = -Infinity, rafId = null;
    function tick(now) {
        rafId = null;
        if (!bands.some(b => b.visible)) return;
        if (now - last >= FRAME) {
            last = now;
            const t = now / 1000 * SPEED;
            for (const b of bands) if (b.visible) b.draw(t);
        }
        rafId = requestAnimationFrame(tick);
    }
    function wake() { if (rafId === null) rafId = requestAnimationFrame(tick); }

    for (const b of bands) b.draw(performance.now() / 1000 * SPEED);
    body.classList.add('wg-bands-live');

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
            for (const e of entries) {
                const b = bands.find(x => x.canvas === e.target);
                if (b) b.visible = e.isIntersecting;
            }
            wake();
        }, { threshold: 0 });
        for (const b of bands) io.observe(b.canvas);
    } else {
        for (const b of bands) b.visible = true;
        wake();
    }

    // rebuild only when the width (or the phone breakpoint) changes, not on every mobile address-bar resize
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            for (const b of bands) {
                const h = phone.matches ? 90 : 125;
                if (b.host.clientWidth !== b.w || h !== b.h) { b.size(); b.draw(performance.now() / 1000 * SPEED); }
            }
        }, 150);
    });
})();
