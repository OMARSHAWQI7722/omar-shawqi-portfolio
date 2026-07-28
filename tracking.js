(function () {
  const API = "https://portfolio-admin-dashboard-five.vercel.app";

  function getSessionId() {
    return sessionStorage.getItem("_sid");
  }
  function setSessionId(id) {
    sessionStorage.setItem("_sid", id);
  }

  function trackEvent(eventType, metadata) {
    fetch(API + "/api/portfolio-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        sessionId: getSessionId() || undefined,
        eventType: eventType,
        metadata: metadata || {},
      }),
    }).catch(function () {});
  }

  // 1. Track the page visit once
  fetch(API + "/api/visitors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      entryPage: location.pathname,
      referrer: document.referrer || "direct",
      screenResolution: screen.width + "x" + screen.height,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data && data.sessionId) setSessionId(data.sessionId);
    })
    .catch(function () {});

  // 2. Auto-detect and track link clicks by their destination
  document.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (!link || !link.href) return;
    const href = link.href;
    const text = (link.textContent || "").toLowerCase();

    if (href.includes("wa.me")) {
      trackEvent("whatsapp_click");
    } else if (href.includes("linkedin.com")) {
      trackEvent("linkedin_click");
    } else if (href.includes("github.com") && !href.includes("omarshawqi7722/omar-shawqi-portfolio")) {
      trackEvent("github_click");
    } else if (href.startsWith("mailto:")) {
      trackEvent("email_click");
    } else if (href.includes("drive.google.com") && text.includes("cv")) {
      trackEvent("cv_download", { label: link.textContent.trim() });
    }
  });

  // 3. Track contact form submission (runs alongside whatever the form
  // already does — does not block or change its normal behavior)
  document.addEventListener("submit", function (e) {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    const hasMessageField = form.querySelector(
      'textarea, input[name*="message" i], input[placeholder*="Message" i]'
    );
    if (!hasMessageField) return;

    const data = new FormData(form);
    function findField(patterns) {
      for (const [key, value] of data.entries()) {
        if (patterns.some((p) => key.toLowerCase().includes(p))) return value;
      }
      return "";
    }

    fetch(API + "/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        name: findField(["name"]) || "Unknown",
        email: findField(["email"]) || "unknown@unknown.com",
        subject: findField(["subject"]) || "",
        message: findField(["message"]) || "",
      }),
    }).catch(function () {});

    trackEvent("contact_form_submit");
  });
})();
