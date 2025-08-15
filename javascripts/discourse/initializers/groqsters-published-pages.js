import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "groqsters-published-pages",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      const isPublishedPage = () => document.body.classList.contains("published-page");

      const parseLinksSetting = (linksSetting) => {
        const links = [];
        if (!linksSetting) return links;
        linksSetting.split(",").forEach((entry) => {
          const parts = entry.split("|");
          if (parts.length >= 2) {
            const text = parts[0].trim();
            const href = parts[1].trim();
            if (text && href) links.push({ text, href });
          }
        });
        return links;
      };

      const buildMenu = () => {
        const existing = document.querySelector(".groqsters-published-menu");
        if (existing) return existing;

        const container = document.createElement("nav");
        container.className = "groqsters-published-menu";

        const inner = document.createElement("div");
        inner.className = "groqsters-published-menu-inner";
        container.appendChild(inner);

        const links = parseLinksSetting(settings.published_menu_links);
        links.forEach(({ text, href }) => {
          const a = document.createElement("a");
          a.href = href;
          a.textContent = text;
          a.target = href.startsWith("http") ? "_blank" : "_self";
          inner.appendChild(a);
        });

        return container;
      };

      const injectMenu = () => {
        const menu = buildMenu();
        if (!menu) return;

        // Insert after the default published header if present, else at top of main container
        const header = document.querySelector(".published-page-header");
        if (header) {
          if (!header.nextSibling || header.nextSibling !== menu) {
            header.parentNode.insertBefore(menu, header.nextSibling);
          }
        } else {
          const mainWrap = document.querySelector(".wrap, .container, body");
          if (mainWrap && !document.querySelector(".groqsters-published-menu")) {
            mainWrap.insertBefore(menu, mainWrap.firstChild);
          }
        }
      };

      const injectCounterDemo = () => {
        if (!settings.published_enable_counter_demo) return;
        if (document.querySelector(".groqsters-counter")) return;

        const target = document.querySelector(".published-page-header-wrapper, .wrap, .container, body");
        if (!target) return;

        const wrapper = document.createElement("div");
        wrapper.style.margin = "0.5rem 1rem";

        const counter = document.createElement("div");
        counter.className = "groqsters-counter";

        const label = document.createElement("span");
        label.textContent = "Counter:";

        const value = document.createElement("strong");
        value.textContent = "0";
        value.setAttribute("aria-live", "polite");

        const inc = document.createElement("button");
        inc.type = "button";
        inc.textContent = "+";
        inc.addEventListener("click", () => {
          const current = parseInt(value.textContent || "0", 10) || 0;
          value.textContent = String(current + 1);
        });

        counter.appendChild(label);
        counter.appendChild(value);
        counter.appendChild(inc);
        wrapper.appendChild(counter);

        target.appendChild(wrapper);
      };

      const injectGallery = () => {
        const imagesSetting = (settings.published_gallery_images || "").trim();
        if (!imagesSetting) return;
        if (document.querySelector(".groqsters-gallery")) return;

        const urls = imagesSetting
          .split(",")
          .map((u) => u.trim())
          .filter((u) => u);
        if (!urls.length) return;

        const gallery = document.createElement("div");
        gallery.className = "groqsters-gallery";

        urls.forEach((src, idx) => {
          const img = document.createElement("img");
          img.src = src;
          img.alt = `Gallery image ${idx + 1}`;
          gallery.appendChild(img);
        });

        // Try to place after header or at top of content
        const afterHeader = document.querySelector(".published-page-header");
        if (afterHeader && afterHeader.parentNode) {
          afterHeader.parentNode.insertBefore(gallery, afterHeader.nextSibling);
          return;
        }

        const content = document.querySelector(".wrap, .container, body");
        if (content) content.insertBefore(gallery, content.firstChild);
      };

      const applyHiding = () => {
        if (settings.published_hide_default_header) {
          const header = document.querySelector(".published-page-header");
          if (header) header.style.display = "none";
        }
      };

      const wireSpaNavigation = () => {
        if (!settings.published_spa_enabled) return;
        const selector = settings.published_spa_link_selector || ".groqsters-published-menu a";

        const container = document;
        container.addEventListener("click", (event) => {
          const path = event.composedPath ? event.composedPath() : [];
          let anchor = null;
          for (const el of path) {
            if (el && el.tagName === "A") { anchor = el; break; }
          }
          if (!anchor) {
            const target = event.target;
            anchor = target && target.closest ? target.closest(selector) : null;
          }
          if (!anchor || !anchor.matches(selector)) return;

          const href = anchor.getAttribute("href");
          if (!href) return;

          // Only handle same-origin relative links
          const isExternal = href.startsWith("http");
          if (isExternal) return;

          event.preventDefault();
          window.history.pushState({}, "", href);
          const navEvent = new CustomEvent("groqsters:spa:navigate", { detail: { href } });
          window.dispatchEvent(navEvent);
        }, true);
      };

      const runEnhancements = () => {
        if (!settings.published_enable_customizations) return;
        if (!isPublishedPage()) return;
        if (document.body.dataset.groqstersPublishedInitialized === "true") return;

        document.body.dataset.groqstersPublishedInitialized = "true";
        document.body.dataset.publishedPagePathname = window.location.pathname;

        applyHiding();
        injectMenu();
        injectCounterDemo();
        injectGallery();
        wireSpaNavigation();
      };

      // Initial run and on route changes
      api.onPageChange(() => {
        // Allow re-init when navigating between published pages
        if (isPublishedPage()) {
          // Reset flag on each page change to enable re-injection
          delete document.body.dataset.groqstersPublishedInitialized;
          setTimeout(runEnhancements, 0);
        }
      });

      // In case onPageChange didn't trigger yet
      setTimeout(runEnhancements, 50);
    });
  }
};


