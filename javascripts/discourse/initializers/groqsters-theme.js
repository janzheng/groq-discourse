import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "groqsters-theme",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      // Add custom header text if configured
      api.decorateWidget("header:before", (dec) => {
        const customHeaderText = settings.custom_header_text;
        if (customHeaderText && customHeaderText.length > 0) {
          return dec.h("div.custom-header-text", customHeaderText);
        }
      });

      // Add welcome banner to homepage
      api.decorateWidget("home-logo:after", (dec) => {
        if (settings.show_welcome_banner && settings.welcome_banner_text) {
          const isHomePage = window.location.pathname === "/" || 
                           window.location.pathname === "/latest" ||
                           window.location.pathname === "/categories";
          
          if (isHomePage) {
            return dec.h("div.welcome-banner", [
              dec.h("h2", "Welcome to Groqsters!"),
              dec.h("p", settings.welcome_banner_text)
            ]);
          }
        }
      });

      // Add custom footer
      api.decorateWidget("after-footer", (dec) => {
        const customFooterText = settings.custom_footer_text;
        if (customFooterText && customFooterText.length > 0) {
          return dec.h("div.custom-footer", [
            dec.h("div.footer-text", customFooterText)
          ]);
        }
      });

      // Add animations to posts if enabled
      if (settings.enable_animations) {
        api.decorateWidget("post:after", (dec) => {
          // Add fade-in animation class to posts
          const postElement = document.querySelector(`#post_${dec.attrs.id}`);
          if (postElement && !postElement.classList.contains("groqsters-fade-in")) {
            postElement.classList.add("groqsters-fade-in");
          }
        });
      }

      // Custom topic list enhancements
      api.decorateWidget("topic-list-item:after", (dec) => {
        if (settings.enable_custom_js) {
          // Add hover effects and interactions
          const topicElement = document.querySelector(`[data-topic-id="${dec.attrs.topic.id}"]`);
          if (topicElement) {
            topicElement.addEventListener("mouseenter", () => {
              topicElement.classList.add("groqsters-hover");
            });
            
            topicElement.addEventListener("mouseleave", () => {
              topicElement.classList.remove("groqsters-hover");
            });
          }
        }
      });

      // Add custom CSS variables based on settings
      api.onPageChange(() => {
        if (settings.primary_brand_color) {
          document.documentElement.style.setProperty("--groqsters-primary", settings.primary_brand_color);
        }
      });

      // Custom notification enhancements
      api.onAppEvent("notification:changed", () => {
        if (settings.enable_animations) {
          const notifications = document.querySelectorAll(".notification:not(.groqsters-animated)");
          notifications.forEach((notification) => {
            notification.classList.add("groqsters-fade-in", "groqsters-animated");
          });
        }
      });

      // Log theme initialization for debugging
      console.log("Groqsters theme initialized with settings:", {
        customJs: settings.enable_custom_js,
        animations: settings.enable_animations,
        welcomeBanner: settings.show_welcome_banner,
        primaryColor: settings.primary_brand_color
      });
    });
  }
}; 