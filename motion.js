/* =====================================================
   Omar Shawqi — Portfolio  |  motion.js
   Motion layer shared by every page: particle field,
   scroll progress, reveals, spotlight, tilt, filters.
   Everything degrades to a static page when the user
   prefers reduced motion.
   ===================================================== */
(function () {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const root = document.documentElement;

    /* ── Scroll progress bar under the nav ── */
    const nav = document.querySelector("nav");
    if (nav) {
        const bar = document.createElement("span");
        bar.className = "o-progress";
        nav.appendChild(bar);
        let ticking = false;
        const update = () => {
            const max = root.scrollHeight - window.innerHeight;
            bar.style.setProperty("--p", max > 0 ? (window.scrollY / max).toFixed(4) : 0);
            ticking = false;
        };
        window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
        update();
    }

    /* ── Particle constellation background ── */
    (function stars() {
        if (reduce) return;
        const bg = document.querySelector(".bg-animation");
        const canvas = document.createElement("canvas");
        canvas.id = "o-stars";
        canvas.setAttribute("aria-hidden", "true");
        (bg ? bg.after(canvas) : document.body.prepend(canvas));

        const ctx = canvas.getContext("2d");
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const mouse = { x: -9999, y: -9999 };
        let W = 0, H = 0, pts = [], running = true, linkDist = 130;

        function size() {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = W + "px";
            canvas.style.height = H + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const n = Math.round(Math.min(90, Math.max(28, (W * H) / 22000)));
            linkDist = W < 700 ? 95 : 130;
            pts = Array.from({ length: n }, () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.22,
                vy: (Math.random() - 0.5) * 0.22,
                r: Math.random() * 1.4 + 0.5
            }));
        }

        function frame() {
            if (!running) return;
            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < pts.length; i++) {
                const p = pts[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
                if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;

                // gentle pull toward the cursor
                const mx = mouse.x - p.x, my = mouse.y - p.y;
                const md = mx * mx + my * my;
                if (md < 32000) { p.x += mx * 0.004; p.y += my * 0.004; }

                for (let j = i + 1; j < pts.length; j++) {
                    const q = pts[j];
                    const dx = p.x - q.x, dy = p.y - q.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < linkDist) {
                        ctx.strokeStyle = `rgba(56,189,248,${(1 - d / linkDist) * 0.16})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                    }
                }
                ctx.fillStyle = md < 32000 ? "rgba(125,211,252,0.95)" : "rgba(56,189,248,0.55)";
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
            }
            requestAnimationFrame(frame);
        }

        size();
        let rs;
        window.addEventListener("resize", () => { clearTimeout(rs); rs = setTimeout(size, 150); });
        if (finePointer) {
            window.addEventListener("pointermove", e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
            document.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
        }
        document.addEventListener("visibilitychange", () => {
            running = !document.hidden;
            if (running) requestAnimationFrame(frame);
        });
        requestAnimationFrame(frame);
        requestAnimationFrame(() => canvas.classList.add("is-on"));
    })();

    /* ── Scroll reveals ── */
    const singles = document.querySelectorAll("[data-reveal]");
    const groups = document.querySelectorAll("[data-reveal-group]");

    if (!reduce && "IntersectionObserver" in window && (singles.length || groups.length)) {
        root.classList.add("motion-ready");

        groups.forEach(g => [...g.children].forEach((c, i) => c.style.setProperty("--d", (i * 0.08) + "s")));

        // Once an element has revealed, drop the reveal hooks so its own
        // hover transitions run without the entrance delay.
        const settle = (el, attr, delay) => setTimeout(() => {
            el.removeAttribute(attr);
            if (attr === "data-reveal-group") [...el.children].forEach(c => c.style.removeProperty("--d"));
            el.classList.remove("is-in");
        }, delay);

        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add("is-in");
                io.unobserve(el);
                if (el.hasAttribute("data-reveal-group")) settle(el, "data-reveal-group", 1000 + el.children.length * 80);
                else settle(el, "data-reveal", 1000);
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

        singles.forEach(el => io.observe(el));
        groups.forEach(el => io.observe(el));
    }

    /* ── Cursor spotlight on glass panels ── */
    if (finePointer) {
        document.addEventListener("pointermove", e => {
            const el = e.target.closest && e.target.closest(".o-spot, .pj-feature-media");
            if (!el) return;
            const r = el.getBoundingClientRect();
            const t = el.classList.contains("pj-feature-media") ? el.querySelector(".pj-window") : el;
            t.style.setProperty("--mx", (e.clientX - r.left) + "px");
            t.style.setProperty("--my", (e.clientY - r.top) + "px");
        }, { passive: true });
    }

    /* ── 3D tilt on featured project previews ── */
    if (finePointer && !reduce) {
        document.querySelectorAll("[data-tilt]").forEach(el => {
            const win = el.querySelector(".pj-window");
            if (!win) return;
            el.addEventListener("pointermove", e => {
                const r = el.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                win.style.setProperty("--ry", (px * 8).toFixed(2) + "deg");
                win.style.setProperty("--rx", (-py * 6).toFixed(2) + "deg");
            });
            el.addEventListener("pointerleave", () => {
                win.style.setProperty("--ry", "0deg");
                win.style.setProperty("--rx", "0deg");
            });
        });
    }

    /* ── Portrait parallax (About) ── */
    const portrait = document.querySelector("[data-parallax]");
    if (portrait && finePointer && !reduce) {
        const frame = portrait.querySelector(".ab-frame");
        const chips = portrait.querySelectorAll("[data-depth]");
        const zone = portrait.closest("section") || portrait;
        zone.addEventListener("pointermove", e => {
            const r = portrait.getBoundingClientRect();
            const px = (e.clientX - (r.left + r.width / 2)) / r.width;
            const py = (e.clientY - (r.top + r.height / 2)) / r.height;
            const cx = Math.max(-1, Math.min(1, px)), cy = Math.max(-1, Math.min(1, py));
            frame.style.setProperty("--ry", (cx * 9).toFixed(2) + "deg");
            frame.style.setProperty("--rx", (-cy * 9).toFixed(2) + "deg");
            chips.forEach(c => {
                const d = +c.dataset.depth;
                c.style.setProperty("--tx", (cx * d).toFixed(1) + "px");
                c.style.setProperty("--ty", (cy * d).toFixed(1) + "px");
            });
        });
        zone.addEventListener("pointerleave", () => {
            frame.style.setProperty("--ry", "0deg");
            frame.style.setProperty("--rx", "0deg");
            chips.forEach(c => { c.style.setProperty("--tx", "0px"); c.style.setProperty("--ty", "0px"); });
        });
    }

    /* ── Experience timeline fills as you scroll ── */
    const xp = document.querySelector(".xp-wrap");
    if (xp) {
        const fill = xp.querySelector(".xp-rail-fill");
        const onScroll = () => {
            const r = xp.getBoundingClientRect();
            const anchor = window.innerHeight * 0.6;
            const p = Math.max(0, Math.min(1, (anchor - r.top) / r.height));
            fill.style.setProperty("--fill", reduce ? 1 : p.toFixed(3));
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        onScroll();
    }

    /* ── Count-up stats ── */
    const counters = document.querySelectorAll("[data-count]");
    if (counters.length && !reduce && "IntersectionObserver" in window) {
        const co = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target, end = +el.dataset.count, t0 = performance.now(), dur = 1400;
                co.unobserve(el);
                const step = now => {
                    const k = Math.min(1, (now - t0) / dur);
                    el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
                    if (k < 1) requestAnimationFrame(step);
                };
                el.textContent = "0";
                requestAnimationFrame(step);
            });
        }, { threshold: 0.6 });
        counters.forEach(c => co.observe(c));
    }

    /* ── Filter tabs: sliding pill + selection state ── */
    document.querySelectorAll(".o-filters").forEach(group => {
        const pill = group.querySelector(".o-filters-pill");
        const tabs = [...group.querySelectorAll(".o-filter")];
        const place = () => {
            const active = group.querySelector(".o-filter.is-active");
            if (!active || !pill) return;
            pill.style.setProperty("--pl", active.offsetLeft + "px");
            pill.style.setProperty("--pt", active.offsetTop + "px");
            pill.style.setProperty("--pw", active.offsetWidth + "px");
            pill.style.setProperty("--ph", active.offsetHeight + "px");
        };
        tabs.forEach(t => t.addEventListener("click", () => {
            tabs.forEach(b => { b.classList.toggle("is-active", b === t); b.setAttribute("aria-selected", b === t); });
            place();
        }));
        window.addEventListener("resize", place);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
        place();
    });

    /* ── Project filtering ── */
    const projectTabs = document.querySelectorAll(".o-filter[data-filter]");
    if (projectTabs.length) {
        const items = document.querySelectorAll(".pj [data-cats]");
        const empty = document.getElementById("pj-empty");
        projectTabs.forEach(tab => tab.addEventListener("click", () => {
            const f = tab.dataset.filter;
            let shown = 0;
            items.forEach(el => {
                const match = f === "all" || el.dataset.cats.split(" ").includes(f);
                el.classList.toggle("is-filtered", !match);
                el.classList.remove("is-entering");
                if (match) {
                    shown++;
                    void el.offsetWidth;
                    if (!reduce) el.classList.add("is-entering");
                }
            });
            if (empty) empty.hidden = shown > 0;
        }));
    }
})();
