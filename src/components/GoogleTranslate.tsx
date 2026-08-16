import React, { useEffect } from "react";

export default function GoogleTranslate(): JSX.Element {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scriptId = "google-translate-script";
    const applyLanguageSelection = () => {
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (!combo) return;

      const current = combo.value;
      const nextValue = document.cookie.includes("googtrans=/en/hi") ? "hi" : "en";
      if (current !== nextValue) {
        combo.value = nextValue;
        combo.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    const mountWidget = () => {
      try {
        const g = (window as any).google;
        if (!g || !g.translate) {
          window.setTimeout(mountWidget, 250);
          return;
        }

        const target = document.getElementById("google_translate_element");
        if (!target) return;

        const hasWidget = target.querySelector(".goog-te-combo") || target.querySelector(".goog-te-gadget");
        if (!hasWidget) {
          new g.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,hi",
              layout: g.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element",
          );
        }

        window.setTimeout(applyLanguageSelection, 150);
      } catch (err) {
        // Ignore: Google widget is optional and may fail for a restricted browser or CSP.
      }
    };

    if (document.getElementById(scriptId)) {
      mountWidget();
      return;
    }

    (window as any).googleTranslateElementInit = mountWidget;

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(script);

    return () => {
      try {
        delete (window as any).googleTranslateElementInit;
      } catch (e) {
        // ignore
      }
    };
  }, []);

  return (
    <>
      <style>{`
        body > .skiptranslate,
        .skiptranslate,
        iframe.goog-te-banner-frame,
        .goog-te-banner-frame,
        .goog-te-menu-frame,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-te-gadget,
        .goog-te-gadget-simple {
          display: none !important;
        }
        html {
          top: 0 !important;
        }
        body {
          top: 0 !important;
        }
        #google_translate_element {
          position: absolute !important;
          left: -9999px !important;
          width: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
          visibility: hidden !important;
        }
      `}</style>
      <div id="google_translate_element" className="translate-widget" aria-hidden="true" />
    </>
  );
}
