(() => {
  const PUBLIC_KEY = window.VAPI_PUBLIC_KEY;
  const ASSISTANT_ID = window.VAPI_ASSISTANT_ID;

  if (!PUBLIC_KEY || !ASSISTANT_ID) {
    console.error("[Vapi] Missing keys. Check settings.js");
    return;
  }

  // 1) Official widget: set attributes via JS
  const widget = document.getElementById("vapi-widget");
  if (widget) {
    widget.setAttribute("public-key", PUBLIC_KEY);
    widget.setAttribute("assistant-id", ASSISTANT_ID);
  }

  // 2) Custom green button (html-script-tag)
  const buttonConfig = {
    // keep empty; CSS forces the position
  };

  const injectHtmlScriptTagSdk = () => new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-vapi-html-script-tag="1"]');
    if (existing) return resolve();

    const g = document.createElement("script");
    g.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    g.defer = true;
    g.async = true;
    g.dataset.vapiHtmlScriptTag = "1";
    g.onload = () => resolve();
    g.onerror = (e) => reject(e);
    document.head.appendChild(g);
  });

  injectHtmlScriptTagSdk()
    .then(() => {
      if (!window.vapiSDK || typeof window.vapiSDK.run !== "function") {
        throw new Error("vapiSDK not available (script loaded but API missing).");
      }

      window.vapiSDK.run({
        apiKey: PUBLIC_KEY,
        assistant: ASSISTANT_ID,
        config: buttonConfig,
      });

      console.log("[Vapi] Custom green button initialized");
    })
    .catch((e) => {
      console.error("[Vapi] Custom button init failed:", e);
    });
})();
