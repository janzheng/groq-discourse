import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "groqsters-theme",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      // Helper function to create banner image element
      const createBannerImage = (imageUrl, fallbackIcon, itemIndex) => {
        if (imageUrl && imageUrl.trim()) {
          // Create image element
          const img = document.createElement('img');
          const iconSpan = document.createElement('span');
          iconSpan.className = 'banner-icon';
          iconSpan.textContent = fallbackIcon;
          
          const container = document.createElement('div');
          container.className = 'banner-image loading';
          container.appendChild(img);
          container.appendChild(iconSpan);
          
          // Handle image loading
          img.onload = () => {
            container.classList.remove('loading', 'no-image');
            container.classList.add('has-image');
          };
          
          img.onerror = () => {
            container.classList.remove('loading', 'has-image');
            container.classList.add('no-image');
          };
          
          img.src = imageUrl;
          img.alt = `Feature ${itemIndex}`;
          
          return container;
        } else {
          // No image URL provided, use fallback icon
          const container = document.createElement('div');
          container.className = 'banner-image no-image';
          
          const iconSpan = document.createElement('span');
          iconSpan.className = 'banner-icon';
          iconSpan.textContent = fallbackIcon;
          container.appendChild(iconSpan);
          
          return container;
        }
      };

      // Add custom header text if configured
      api.decorateWidget("header:before", (dec) => {
        const customHeaderText = settings.custom_header_text;
        if (customHeaderText && customHeaderText.length > 0) {
          return dec.h("div.custom-header-text", customHeaderText);
        }
      });

      // Add banners to homepage - using discovery-list-container:before for better placement
      api.decorateWidget("discovery-list-container:before", (dec) => {
        const isHomePage = window.location.pathname === "/" || 
                         window.location.pathname === "/latest" ||
                         window.location.pathname === "/categories";
        
        if (!isHomePage) return;

        const elements = [];

        // Add welcome banner if enabled
        if (settings.show_welcome_banner && settings.welcome_banner_text) {
          elements.push(
            dec.h("div.welcome-banner", [
              dec.h("h2", "Welcome to Groqsters!"),
              dec.h("p", settings.welcome_banner_text)
            ])
          );
        }

        // Add feature banner if enabled
        if (settings.show_feature_banner) {
          elements.push(
            dec.h("div.groqsters-feature-banner", [
              dec.h("div.banner-grid", [
                // First banner item
                dec.h("div.banner-item", [
                  dec.h("div.banner-image-placeholder", { "data-item": "1" }),
                  dec.h("h3", settings.feature_banner_item_1_title || "Fast & Powerful")
                ]),
                // Second banner item
                dec.h("div.banner-item", [
                  dec.h("div.banner-image-placeholder", { "data-item": "2" }),
                  dec.h("h3", settings.feature_banner_item_2_title || "Community Driven")
                ]),
                // Third banner item
                dec.h("div.banner-item", [
                  dec.h("div.banner-image-placeholder", { "data-item": "3" }),
                  dec.h("h3", settings.feature_banner_item_3_title || "Always Learning")
                ])
              ])
            ])
          );
        }

        return elements.length > 0 ? elements : null;
      });

      // Fallback: Also try to inject using DOM manipulation if widget decoration doesn't work
      api.onPageChange(() => {
        const isHomePage = window.location.pathname === "/" || 
                         window.location.pathname === "/latest" ||
                         window.location.pathname === "/categories";
        
        if (!isHomePage) return;

        // Wait a bit for the page to render
        setTimeout(() => {
          // Check if banners already exist to avoid duplicates
          if (document.querySelector('.groqsters-feature-banner')) {
            // Replace placeholders with actual image elements
            setTimeout(() => this.replaceBannerPlaceholders(), 100);
            return;
          }

          const container = document.querySelector('.discovery-list-container, .list-container, #main-outlet');
          if (!container) return;

          // Create banner container
          const bannerContainer = document.createElement('div');
          bannerContainer.className = 'groqsters-banners-container';

          // Add welcome banner if enabled
          if (settings.show_welcome_banner && settings.welcome_banner_text) {
            const welcomeBanner = document.createElement('div');
            welcomeBanner.className = 'welcome-banner';
            welcomeBanner.innerHTML = `
              <h2>Welcome to Groqsters!</h2>
              <p>${settings.welcome_banner_text}</p>
            `;
            bannerContainer.appendChild(welcomeBanner);
          }

          // Add feature banner if enabled
          if (settings.show_feature_banner) {
            const featureBanner = document.createElement('div');
            featureBanner.className = 'groqsters-feature-banner';
            
            const bannerGrid = document.createElement('div');
            bannerGrid.className = 'banner-grid';
            
            // Create banner items with proper image handling
            const items = [
              {
                image: settings.feature_banner_item_1_image,
                title: settings.feature_banner_item_1_title || "Fast & Powerful",
                fallback: settings.feature_banner_fallback_icon_1 || "⚡"
              },
              {
                image: settings.feature_banner_item_2_image,
                title: settings.feature_banner_item_2_title || "Community Driven", 
                fallback: settings.feature_banner_fallback_icon_2 || "🤝"
              },
              {
                image: settings.feature_banner_item_3_image,
                title: settings.feature_banner_item_3_title || "Always Learning",
                fallback: settings.feature_banner_fallback_icon_3 || "🚀"
              }
            ];
            
            items.forEach((item, index) => {
              const bannerItem = document.createElement('div');
              bannerItem.className = 'banner-item';
              
              const imageContainer = createBannerImage(item.image, item.fallback, index + 1);
              
              const title = document.createElement('h3');
              title.textContent = item.title;
              
              bannerItem.appendChild(imageContainer);
              bannerItem.appendChild(title);
              bannerGrid.appendChild(bannerItem);
            });
            
            featureBanner.appendChild(bannerGrid);
            bannerContainer.appendChild(featureBanner);
          }

          // Insert the banner container at the beginning of the main content
          if (bannerContainer.children.length > 0) {
            container.insertBefore(bannerContainer, container.firstChild);

            // Add animations if enabled
            if (settings.enable_animations) {
              setTimeout(() => {
                const bannerItems = bannerContainer.querySelectorAll(".banner-item");
                bannerItems.forEach((item, index) => {
                  setTimeout(() => {
                    item.classList.add("groqsters-fade-in");
                  }, index * 150);
                });
              }, 100);
            }
          }
        }, 500);
      });

      // Function to replace placeholders with actual image elements (for widget decoration method)
      this.replaceBannerPlaceholders = () => {
        const placeholders = document.querySelectorAll('.banner-image-placeholder');
        placeholders.forEach(placeholder => {
          const itemIndex = placeholder.getAttribute('data-item');
          let imageUrl, fallbackIcon;
          
          switch(itemIndex) {
            case '1':
              imageUrl = settings.feature_banner_item_1_image;
              fallbackIcon = settings.feature_banner_fallback_icon_1 || "⚡";
              break;
            case '2':
              imageUrl = settings.feature_banner_item_2_image;
              fallbackIcon = settings.feature_banner_fallback_icon_2 || "🤝";
              break;
            case '3':
              imageUrl = settings.feature_banner_item_3_image;
              fallbackIcon = settings.feature_banner_fallback_icon_3 || "🚀";
              break;
          }
          
          const imageContainer = createBannerImage(imageUrl, fallbackIcon, itemIndex);
          placeholder.parentNode.replaceChild(imageContainer, placeholder);
        });
      };

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
        featureBanner: settings.show_feature_banner,
        primaryColor: settings.primary_brand_color,
        bannerImages: {
          item1: settings.feature_banner_item_1_image,
          item2: settings.feature_banner_item_2_image,
          item3: settings.feature_banner_item_3_image
        }
      });
    });
  }
}; 