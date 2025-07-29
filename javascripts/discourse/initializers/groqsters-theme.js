import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "groqsters-theme",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      // Helper function to create banner image element
      const createBannerImage = (imageUrl, itemIndex) => {
        if (imageUrl && imageUrl.trim()) {
          // Create image element
          const img = document.createElement('img');
          
          const container = document.createElement('div');
          container.className = 'banner-image loading';
          container.appendChild(img);
          
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
          // No image URL provided, show empty placeholder
          const container = document.createElement('div');
          container.className = 'banner-image no-image';
          
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

      // Add banners after hero area but before navigation tabs
      api.decorateWidget("home-logo:after", (dec) => {
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

        // Add alert banner if enabled
        if (settings.show_alert_banner && settings.alert_banner_message) {
          const alertStyle = settings.alert_banner_color 
            ? `--groqsters-alert-color: ${settings.alert_banner_color};` 
            : '';
            
          const alertBannerChildren = [
            dec.h("div.alert-message", settings.alert_banner_message)
          ];
          
          // Add CTA button if URL is provided
          if (settings.alert_banner_cta_url && settings.alert_banner_cta_url.trim()) {
            alertBannerChildren.push(
              dec.h("a.alert-cta", {
                href: settings.alert_banner_cta_url,
                target: settings.alert_banner_cta_url.startsWith('http') ? '_blank' : '_self'
              }, settings.alert_banner_cta_text || "Learn More")
            );
          }

          elements.push(
            dec.h("div.groqsters-alert-banner", {
              style: alertStyle
            }, alertBannerChildren)
          );
        }

        // Add feature banner if enabled
        if (settings.show_feature_banner) {
          // Create banner items data with URLs
          const bannerItems = [
            {
              title: settings.feature_banner_item_1_title || "Fast & Powerful",
              url: settings.feature_banner_item_1_url,
              dataItem: "1"
            },
            {
              title: settings.feature_banner_item_2_title || "Community Driven", 
              url: settings.feature_banner_item_2_url,
              dataItem: "2"
            },
            {
              title: settings.feature_banner_item_3_title || "Always Learning",
              url: settings.feature_banner_item_3_url,
              dataItem: "3"
            }
          ];

          const bannerItemElements = bannerItems.map(item => {
            const itemClass = item.url ? "banner-item clickable" : "banner-item";
            const itemAttrs = {
              class: itemClass,
              "data-url": item.url || "",
              onclick: item.url ? `window.${item.url.startsWith('http') ? 'open' : 'location'}('${item.url}'${item.url.startsWith('http') ? ', "_blank"' : ''})` : ""
            };

            return dec.h(`div.${itemClass}`, itemAttrs, [
              dec.h("div.banner-image-placeholder", { "data-item": item.dataItem }),
              dec.h("h3", item.title)
            ]);
          });

          elements.push(
            dec.h("div.groqsters-feature-banner", [
              dec.h("div.banner-grid", bannerItemElements)
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
          if (document.querySelector('.groqsters-feature-banner') || document.querySelector('.groqsters-alert-banner')) {
            // Replace placeholders with actual image elements
            setTimeout(() => this.replaceBannerPlaceholders(), 100);
            return;
          }

          // Try to find the hero area and insert after it
          const heroArea = document.querySelector('.above-main-container-outlet, .home-logo-wrapper-outlet, #main-outlet');
          const navigationContainer = document.querySelector('.navigation-container, .list-controls');
          
          let insertTarget = heroArea;
          if (navigationContainer && heroArea) {
            insertTarget = navigationContainer.parentNode;
          } else if (navigationContainer) {
            insertTarget = navigationContainer;
          }

          if (!insertTarget) return;

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

          // Add alert banner if enabled
          if (settings.show_alert_banner && settings.alert_banner_message) {
            const alertBanner = document.createElement('div');
            alertBanner.className = 'groqsters-alert-banner';
            
            // Set custom color if provided
            if (settings.alert_banner_color) {
              alertBanner.style.setProperty('--groqsters-alert-color', settings.alert_banner_color);
              alertBanner.style.background = settings.alert_banner_color;
            }
            
            // Create message element
            const messageElement = document.createElement('div');
            messageElement.className = 'alert-message';
            messageElement.textContent = settings.alert_banner_message;
            alertBanner.appendChild(messageElement);
            
            // Add CTA button if URL is provided
            if (settings.alert_banner_cta_url && settings.alert_banner_cta_url.trim()) {
              const ctaElement = document.createElement('a');
              ctaElement.className = 'alert-cta';
              ctaElement.href = settings.alert_banner_cta_url;
              ctaElement.textContent = settings.alert_banner_cta_text || "Learn More";
              
              // Open external links in new tab
              if (settings.alert_banner_cta_url.startsWith('http')) {
                ctaElement.target = '_blank';
              }
              
              alertBanner.appendChild(ctaElement);
            }
            
            bannerContainer.appendChild(alertBanner);
          }

          // Add feature banner if enabled
          if (settings.show_feature_banner) {
            const featureBanner = document.createElement('div');
            featureBanner.className = 'groqsters-feature-banner';
            
            const bannerGrid = document.createElement('div');
            bannerGrid.className = 'banner-grid';
            
            // Create banner items with proper image handling and click functionality
            const items = [
              {
                image: settings.feature_banner_item_1_image,
                title: settings.feature_banner_item_1_title || "Fast & Powerful",
                url: settings.feature_banner_item_1_url
              },
              {
                image: settings.feature_banner_item_2_image,
                title: settings.feature_banner_item_2_title || "Community Driven",
                url: settings.feature_banner_item_2_url
              },
              {
                image: settings.feature_banner_item_3_image,
                title: settings.feature_banner_item_3_title || "Always Learning",
                url: settings.feature_banner_item_3_url
              }
            ];
            
            items.forEach((item, index) => {
              const bannerItem = document.createElement('div');
              bannerItem.className = item.url ? 'banner-item clickable' : 'banner-item';
              
              // Add click functionality if URL is provided
              if (item.url) {
                bannerItem.style.cursor = 'pointer';
                bannerItem.addEventListener('click', () => {
                  if (item.url.startsWith('http')) {
                    window.open(item.url, '_blank');
                  } else {
                    window.location.href = item.url;
                  }
                });
              }
              
              const imageContainer = createBannerImage(item.image, index + 1);
              
              const title = document.createElement('h3');
              title.textContent = item.title;
              
              bannerItem.appendChild(imageContainer);
              bannerItem.appendChild(title);
              bannerGrid.appendChild(bannerItem);
            });
            
            featureBanner.appendChild(bannerGrid);
            bannerContainer.appendChild(featureBanner);
          }

          // Insert the banner container before the navigation
          if (bannerContainer.children.length > 0) {
            if (navigationContainer) {
              navigationContainer.parentNode.insertBefore(bannerContainer, navigationContainer);
            } else {
              insertTarget.appendChild(bannerContainer);
            }
          }
        }, 500);
      });

      // Function to replace placeholders with actual image elements (for widget decoration method)
      this.replaceBannerPlaceholders = () => {
        const placeholders = document.querySelectorAll('.banner-image-placeholder');
        placeholders.forEach(placeholder => {
          const itemIndex = placeholder.getAttribute('data-item');
          let imageUrl;
          
          switch(itemIndex) {
            case '1':
              imageUrl = settings.feature_banner_item_1_image;
              break;
            case '2':
              imageUrl = settings.feature_banner_item_2_image;
              break;
            case '3':
              imageUrl = settings.feature_banner_item_3_image;
              break;
          }
          
          const imageContainer = createBannerImage(imageUrl, itemIndex);
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

      // Log theme initialization for debugging
      console.log("Groqsters theme initialized with settings:", {
        customJs: settings.enable_custom_js,
        welcomeBanner: settings.show_welcome_banner,
        alertBanner: settings.show_alert_banner,
        featureBanner: settings.show_feature_banner,
        primaryColor: settings.primary_brand_color,
        alertBannerColor: settings.alert_banner_color,
        bannerImages: {
          item1: settings.feature_banner_item_1_image,
          item2: settings.feature_banner_item_2_image,
          item3: settings.feature_banner_item_3_image
        },
        bannerUrls: {
          item1: settings.feature_banner_item_1_url,
          item2: settings.feature_banner_item_2_url,
          item3: settings.feature_banner_item_3_url
        }
      });
    });
  }
}; 