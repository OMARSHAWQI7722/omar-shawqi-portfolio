/* =====================================================
   Omar Shawqi — Portfolio  |  script.js
   ===================================================== */

/* ── HAMBURGER MENU ── */
(function () {
    const hamburger = document.getElementById("hamburger");
    const navMenu   = document.getElementById("nav-menu") || document.querySelector(".nav-links");
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener("click", function (e) {
        e.stopPropagation();
        hamburger.classList.toggle("open");
        navMenu.classList.toggle("open");
        document.body.style.overflow = navMenu.classList.contains("open") ? "hidden" : "";
    });

    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("open");
            navMenu.classList.remove("open");
            document.body.style.overflow = "";
        });
    });

    document.addEventListener("click", function (e) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove("open");
            navMenu.classList.remove("open");
            document.body.style.overflow = "";
        }
    });
})();

/* ── HERO TYPING + ROTATING SUBTITLES ── */
(function () {
    const typedEl = document.getElementById("typing-text");
    const subEl   = document.getElementById("hero-sub");
    if (!typedEl) return;

    /* Phrases to cycle through */
    const phrases = [
        "Omar Shawqi",
        "Web Developer",
        "Digital Marketer",
        "Social Media Expert",
        "Meta Ads Specialist",
        "E-Commerce Founder",
        "CS Student"
    ];

    /* Subtitles matching each phrase */
    const subtitles = [
        "Computer Science Student @ Albukhary International University 🇲🇾",
        "Building <span class='highlight'>modern</span>, responsive websites & digital experiences",
        "Driving growth through <span class='highlight'>data-driven</span> marketing strategies",
        "Managing brands & growing audiences across <span class='highlight'>social platforms</span>",
        "Running high-converting <span class='highlight'>Meta Ads</span> campaigns that deliver results",
        "Founder of <span class='highlight'>Elite Vibes</span> & <span class='highlight'>OZO Store</span> — digital & watch brands",
        "Turning <span class='highlight'>code + creativity</span> into real-world digital solutions"
    ];

    let phraseIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;
    let isPaused    = false;

    function typeLoop() {
        const current = phrases[phraseIndex];

        if (!isDeleting) {
            typedEl.textContent = current.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                isPaused = true;
                setTimeout(() => { isPaused = false; isDeleting = true; typeLoop(); }, 2000);
                return;
            }
        } else {
            typedEl.textContent = current.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                if (subEl) {
                    subEl.style.opacity = 0;
                    setTimeout(() => {
                        subEl.innerHTML = subtitles[phraseIndex];
                        subEl.style.opacity = 1;
                    }, 300);
                }
            }
        }

        const speed = isDeleting ? 60 : 120;
        setTimeout(typeLoop, speed);
    }

    /* Init subtitle */
    if (subEl) subEl.innerHTML = subtitles[0];

    setTimeout(typeLoop, 600);
})();

/* ── CONTACT FORM → EmailJS ── */
function sendEmail() {
    const name    = document.getElementById("name")?.value.trim();
    const email   = document.getElementById("email")?.value.trim();
    const subject = document.getElementById("subject")?.value.trim();
    const message = document.getElementById("message")?.value.trim();
    const status  = document.getElementById("formStatus");
    const btn     = document.getElementById("sendBtn");
    const btnText = document.getElementById("btnText");

    if (!name || !email || !subject || !message) {
        showStatus("error", "⚠️ Please fill in all fields before sending.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showStatus("error", "⚠️ Please enter a valid email address.");
        return;
    }

    /* Show loading */
    btn.disabled = true;
    btnText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    /* EmailJS send */
    emailjs.send("service_omar", "template_omar", {
        from_name:    name,
        from_email:   email,
        subject:      subject,
        message:      message,
        to_email:     "7omarshawqi7@gmail.com"
    }).then(function () {
        showStatus("success", "✅ Message sent successfully! I'll get back to you soon.");
        document.getElementById("name").value    = "";
        document.getElementById("email").value   = "";
        document.getElementById("subject").value = "";
        document.getElementById("message").value = "";
        btn.disabled = false;
        btnText.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }).catch(function (err) {
        /* Fallback: open mail client */
        const mailtoLink = `mailto:7omarshawqi7@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message)}`;
        window.open(mailtoLink, "_blank");
        showStatus("success", "✅ Your mail client has been opened. Please send the email from there.");
        btn.disabled = false;
        btnText.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    });
}

function showStatus(type, msg) {
    const status = document.getElementById("formStatus");
    if (!status) return;
    status.className = "form-status " + type;
    status.innerHTML = msg;
    status.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setTimeout(() => { status.className = "form-status"; status.innerHTML = ""; }, 6000);
}

/* ── PAGE TRANSITION ── */
document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href && !href.startsWith("#") && !href.startsWith("http") && !href.startsWith("mailto") && !href.startsWith("tel")) {
            e.preventDefault();
            document.body.classList.add("fade-out");
            // Reduced from 500ms → 220ms for snappy mobile navigation
            setTimeout(() => { window.location.href = href; }, 220);
        }
    });
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
    });
});

/* ── BACKGROUND ORBS ── */
window.addEventListener("load", function () {
    injectBgOrbs();
});

function injectBgOrbs() {
    const bg = document.querySelector(".bg-animation");
    if (!bg) return;

    // Detect mobile/low-power devices
    const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches
                  || window.innerWidth <= 768;

    // On mobile: only 1 subtle orb to save GPU
    if (isMobile) {
        const el = document.createElement("div");
        el.style.cssText = `position:absolute;width:300px;height:300px;
            background:radial-gradient(circle,rgba(91,140,255,0.10) 0%,transparent 68%);
            filter:blur(40px);left:"-10%";top:"40%";
            animation:orbFloat2 25s ease-in-out infinite alternate;
            pointer-events:none;will-change:transform;`;
        bg.appendChild(el);
        return;
    }

    // Desktop: full orb set
    const orbs = [
        { w:500, h:500, color:"rgba(91,140,255,0.13)",  blur:80,  left:"-10%", top:"45%",  anim:"orbFloat2", dur:"22s" },
        { w:380, h:380, color:"rgba(139,92,246,0.09)",  blur:70,  left:"28%",  top:"62%",  anim:"orbFloat3", dur:"28s" },
        { w:320, h:320, color:"rgba(91,140,255,0.07)",  blur:80,  left:"55%",  top:"15%",  anim:"orbFloat1", dur:"20s" },
        { w:250, h:250, color:"rgba(45,212,191,0.06)",  blur:60,  left:"78%",  top:"68%",  anim:"orbFloat2", dur:"26s" }
    ];

    orbs.forEach(o => {
        const el = document.createElement("div");
        el.style.cssText = `position:absolute;width:${o.w}px;height:${o.h}px;
            background:radial-gradient(circle,${o.color} 0%,transparent 68%);
            filter:blur(${o.blur}px);left:${o.left};top:${o.top};
            animation:${o.anim} ${o.dur} ease-in-out infinite alternate;
            pointer-events:none;will-change:transform;`;
        bg.appendChild(el);
    });
}


/* =====================================================
   CERTIFICATES — data, cards, filter, viewer
   Edit the array below to add / update certificates.
   image  → scan shown in the viewer (optional)
   verify → issuer's verification page (optional)
   A certificate needs at least one of the two.
   ===================================================== */
(function certifications() {
    const grid = document.getElementById("cert-grid");
    if (!grid) return;

    const certsData = [
        /* ── Technology ── */
        { category: "technology", skill: "AI fundamentals", name: "Introduction to AI", org: "Google · Coursera", year: "2026",
          desc: "Google's foundational course on artificial intelligence and how it is used in everyday work.",
          image: "certificates/google-intro-to-ai.jpg", verify: "https://coursera.org/verify/T8UUZX3IT0LW" },
        { category: "technology", skill: "AI productivity", name: "Maximize Productivity With AI Tools", org: "Google · Coursera", year: "2026",
          desc: "Using AI tools to work faster and more effectively.",
          image: "certificates/google-ai-productivity.jpg", verify: "https://coursera.org/verify/77D750PG24YM" },
        { category: "technology", skill: "AI automation", name: "Claude Cowork, Skills and Plugins for Workflow Automation", org: "Dr. Ryan Ahmed · Coursera", year: "2026",
          desc: "Automating workflows with Claude Cowork, Skills, and plugins.",
          image: "certificates/claude-cowork-automation.jpg", verify: "https://coursera.org/verify/WDPDMFI589UO" },
        { category: "technology", skill: "Web development", name: "HTML, CSS, and JavaScript for Web Developers", org: "Johns Hopkins University · Coursera", year: "2025",
          desc: "Front-end fundamentals for building web pages with HTML, CSS, and JavaScript.",
          verify: "https://coursera.org/verify/HDDPVY1H7BAQ" },
        { category: "technology", skill: "AI fundamentals", name: "Elements of AI", org: "University of Helsinki & MinnaLearn", year: "2023",
          desc: "A 2 ECTS-credit online course introducing the core ideas and methods behind artificial intelligence.",
          image: "certificates/elements-of-ai.webp", verify: "https://certificates.mooc.fi/validate/yid06540yfl" },
        { category: "technology", skill: "AI strategy", name: "AI For Everyone", org: "DeepLearning.AI · Coursera", year: "2023",
          desc: "Andrew Ng's non-technical course on what AI can do and how organisations put it to work (Arabic edition).",
          image: "certificates/ai-for-everyone.jpg", verify: "https://coursera.org/verify/AB5LYS8RSVNR" },
        { category: "technology", skill: "Digital literacy", name: "International Computer Driving License (ICDL v6)", org: "New Horizons Learning Centers", year: "2023",
          desc: "70-hour international computer skills program, completed with an Excellent grade (97%).",
          image: "certificates/icdl.jpg" },
        { category: "technology", skill: "Front-end", name: "Beginner Programming Camp", org: "Third Eye Academic", year: "2023–2024",
          desc: "Hands-on programming training covering HTML, CSS, and JavaScript foundations.",
          image: "certificates/programming-camp.jpg" },

        /* ── Data ── */
        { category: "data", skill: "Data analytics", name: "Foundations: Data, Data, Everywhere", org: "Google · Coursera", year: "2026",
          desc: "The first course of Google's Data Analytics program, covering the fundamentals of data analysis.",
          image: "certificates/google-data-foundations.jpg", verify: "https://coursera.org/verify/TTPBP2X5R7HU" },
        { category: "data", skill: "Spreadsheets", name: "Work Smarter with Microsoft Excel", org: "Microsoft · Coursera", year: "2023",
          desc: "Using Excel to organise, calculate, and analyse data more efficiently.",
          image: "certificates/excel-microsoft.jpg", verify: "https://coursera.org/verify/JHPTBDTLMZKX" },
        { category: "data", skill: "Data analysis", name: "Data Analysis", org: "UNICEF · Agora", year: "2026",
          desc: "UNICEF learning module on data analysis, issued by the Global Cluster Coordination Unit.",
          image: "certificates/unicef-data-analysis.jpg" },

        /* ── Design & marketing ── */
        { category: "design", skill: "Visual design", name: "Canva Design Essentials Pt. 1: Core Tools & Layouts", org: "Skillshare · Coursera", year: "2025",
          desc: "Core Canva tools and layout principles for producing clean visual content.",
          image: "certificates/canva-design.jpg", verify: "https://coursera.org/verify/AHFVTMW0G4BW" },
        { category: "design", skill: "Digital marketing", name: "Digital Marketing Basics", org: "Google Skills · IAB Europe", year: "2023",
          desc: "Google's introduction to the fundamentals of online marketing.",
          verify: "https://learndigital.withgoogle.com/link/1g13k7gbvgg" },

        /* ── Business & growth ── */
        { category: "business", skill: "Career strategy", name: "Success", org: "Wharton, University of Pennsylvania · Coursera", year: "2023",
          desc: "Professor Richard Shell's course on defining and pursuing personal and professional success.",
          image: "certificates/wharton-success.jpg", verify: "https://coursera.org/verify/YX8FCU4PBZ45" },
        { category: "business", skill: "Self-learning", name: "Learning How to Learn", org: "Deep Teaching Solutions · Coursera", year: "2023",
          desc: "Barbara Oakley and Terry Sejnowski's techniques for mastering difficult subjects.",
          image: "certificates/learning-how-to-learn.jpg", verify: "https://coursera.org/verify/FXDSGECZYBWK" },

        /* ── Languages ── */
        { category: "language", skill: "English", name: "IELTS Academic", org: "British Council · IDP · Cambridge English", year: "2026",
          desc: "International English language test, Academic module.",
          label: "IELTS Academic · 2026", verify: "https://ielts.org/verify" },

        /* ── Community ── */
        { category: "community", skill: "Leadership", name: "Certificate of Appreciation", org: "Yemeni Students Union · AIU", year: "2025",
          desc: "Recognition for contributions to the Yemeni Students Union at Albukhary International University during the 2024–2025 term.",
          image: "certificates/aiu-yemeni-students-union.jpg" },
        { category: "community", skill: "Humanitarian", name: "UNICEF Training Programs", org: "UNICEF · Community & Child Protection", year: "2023",
          desc: "Training on community engagement, child protection systems, and emergency humanitarian awareness.",
          image: "certificates/unicef-child-protection.jpg" },
        { category: "community", skill: "Crisis support", name: "Psychological First Aid", org: "Johns Hopkins University · Coursera", year: "2023",
          desc: "Supporting people affected by emergencies and disasters with psychological first aid.",
          image: "certificates/psychological-first-aid.jpg", verify: "https://coursera.org/verify/D2XTR68LC7TW" }
    ];

    const LABELS = { technology: "Technology", data: "Data", design: "Design & marketing", business: "Business", language: "Languages", community: "Community" };
    const ICONS  = { technology: "fa-microchip", data: "fa-chart-column", design: "fa-pen-nib", business: "fa-briefcase", language: "fa-language", community: "fa-hand-holding-heart" };

    const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" };
    const esc = s => String(s).replace(/[&<>"]/g, ch => ENTITIES[ch]);
    const seal = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M8.5 13.8L7 22l5-3 5 3-1.5-8.2"/></svg>`;

    /* Drawn certificate face for credentials that only live on the issuer's site */
    const face = c => `
        <div class="cert-face cert-face--lg">
            <span class="cert-face-seal">${seal}</span>
            <span class="cert-face-of">${esc(c.label || "Certificate of completion")}</span>
            <strong class="cert-face-name">${esc(c.name)}</strong>
            <span class="cert-face-org">${esc(c.org)} · ${esc(c.year)}</span>
        </div>`;

    let visible = certsData.slice();

    function render(list) {
        visible = list;
        grid.innerHTML = list.map((c, i) => `
            <article class="cert-card o-spot" style="--i:${i}">
                <div class="cert-card-top">
                    <span class="cert-card-icon" aria-hidden="true"><i class="fas ${ICONS[c.category]}"></i></span>
                    <span class="cert-card-cat">${LABELS[c.category]}</span>
                    <span class="cert-card-year">${esc(c.year)}</span>
                </div>
                <h3>${esc(c.name)}</h3>
                <p class="cert-card-org">${esc(c.org)}</p>
                <p class="cert-card-desc">${esc(c.desc)}</p>
                <div class="cert-card-foot">
                    <span class="cert-card-skill">${esc(c.skill)}</span>
                    <button type="button" class="cert-card-btn" data-index="${i}">
                        View Certificate <i class="fas fa-arrow-right" aria-hidden="true"></i>
                    </button>
                </div>
            </article>
        `).join("");

        grid.classList.remove("is-in");
        requestAnimationFrame(() => requestAnimationFrame(() => grid.classList.add("is-in")));
    }

    render(certsData);

    grid.addEventListener("click", e => {
        const btn = e.target.closest(".cert-card-btn");
        if (btn) open(+btn.dataset.index, btn);
    });

    document.querySelectorAll(".o-filter[data-cert-filter]").forEach(btn => {
        btn.addEventListener("click", () => {
            const f = btn.dataset.certFilter;
            render(f === "all" ? certsData : certsData.filter(c => c.category === f));
        });
    });

    /* ── Viewer ── */
    const modal = document.getElementById("cert-modal");
    if (!modal) return;
    const stage = document.getElementById("cert-modal-stage");
    const title = document.getElementById("cert-modal-title");
    const org   = document.getElementById("cert-modal-org");
    const count = document.getElementById("cert-modal-count");
    const link  = document.getElementById("cert-modal-link");
    const prev  = document.getElementById("cert-prev");
    const next  = document.getElementById("cert-next");
    let current = 0;
    let opener = null;

    function fill(i) {
        current = (i + visible.length) % visible.length;
        const c = visible[current];
        title.textContent = c.name;
        org.textContent = `${c.org} · ${c.year}`;
        count.textContent = `${current + 1} / ${visible.length}`;

        if (c.image) {
            stage.innerHTML = `<img src="${c.image}" alt="Certificate: ${esc(c.name)}" class="cv-modal-img">`;
            stage.querySelector("img").addEventListener("click", () => stage.classList.toggle("is-zoomed"));
        } else {
            stage.innerHTML = face(c);
        }

        link.href = c.verify || c.image;
        link.innerHTML = c.verify
            ? `<i class="fas fa-shield-halved"></i> Verify credential`
            : `<i class="fas fa-up-right-from-square"></i> Open full size`;

        stage.classList.remove("is-zoomed", "is-swap");
        void stage.offsetWidth;
        stage.classList.add("is-swap");
        prev.hidden = next.hidden = visible.length < 2;
    }

    function open(i, from) {
        opener = from || null;
        fill(i);
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        requestAnimationFrame(() => modal.classList.add("is-open"));
        modal.querySelector(".cv-modal-close").focus({ preventScroll: true });
    }

    function close() {
        if (modal.hidden) return;
        modal.classList.remove("is-open");
        document.body.style.overflow = "";
        setTimeout(() => { modal.hidden = true; stage.innerHTML = ""; }, 320);
        if (opener) opener.focus({ preventScroll: true });
    }

    modal.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", close));
    prev.addEventListener("click", () => fill(current - 1));
    next.addEventListener("click", () => fill(current + 1));

    document.addEventListener("keydown", e => {
        if (modal.hidden) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") fill(current - 1);
        if (e.key === "ArrowRight") fill(current + 1);
        if (e.key === "Tab") {
            const f = [...modal.querySelectorAll("button:not([hidden]), a[href]")];
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });

    /* Swipe between certificates on touch screens */
    let x0 = null;
    stage.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 50 && !stage.classList.contains("is-zoomed")) fill(current + (dx < 0 ? 1 : -1));
        x0 = null;
    });
})();
