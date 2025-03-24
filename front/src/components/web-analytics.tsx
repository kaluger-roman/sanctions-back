// @ts-nocheck
import { useEffect } from "react";

export const WebAnalytics = () => {
  // Add Yandex verification meta tag
  useEffect(() => {
    const metaTag = document.createElement("meta");
    metaTag.name = "yandex-verification";
    metaTag.content = "9afc31a43e94d559";

    // Check if the meta tag already exists
    const existingTag = document.querySelector(
      'meta[name="yandex-verification"]',
    );
    if (!existingTag) {
      document.head.appendChild(metaTag);
    }

    // Clean up function to remove the tag when component unmounts
    return () => {
      const tag = document.querySelector('meta[name="yandex-verification"]');
      if (tag) {
        document.head.removeChild(tag);
      }
    };
  }, []);

  useEffect(() => {
    (function (m, e, t, r, i, k, a) {
      m[i] =
        m[i] ||
        function () {
          (m[i].a = m[i].a || []).push(arguments);
        };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) {
          return;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      (k = e.createElement(t)), (a = e.getElementsByTagName(t)[0]);
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(100022866, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
    });
  }, []);

  return (
    <noscript>
      <div>
        <img
          src="https://mc.yandex.ru/watch/100022866"
          style={{ position: "absolute", left: "-9999px" }}
          alt=""
        />
      </div>
    </noscript>
  );
};
