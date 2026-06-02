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
        if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
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
            background:radial-gradient(circle,rgba(14,165,233,0.10) 0%,transparent 68%);
            filter:blur(40px);left:"-10%";top:"40%";
            animation:orbFloat2 25s ease-in-out infinite alternate;
            pointer-events:none;will-change:transform;`;
        bg.appendChild(el);
        return;
    }

    // Desktop: full orb set
    const orbs = [
        { w:500, h:500, color:"rgba(14,165,233,0.13)",  blur:80,  left:"-10%", top:"45%",  anim:"orbFloat2", dur:"22s" },
        { w:380, h:380, color:"rgba(99,102,241,0.09)",  blur:70,  left:"28%",  top:"62%",  anim:"orbFloat3", dur:"28s" },
        { w:320, h:320, color:"rgba(56,189,248,0.07)",  blur:80,  left:"55%",  top:"15%",  anim:"orbFloat1", dur:"20s" },
        { w:250, h:250, color:"rgba(20,184,166,0.06)",  blur:60,  left:"78%",  top:"68%",  anim:"orbFloat2", dur:"26s" }
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
