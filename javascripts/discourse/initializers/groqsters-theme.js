import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "groqsters-theme",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      // Note: Discourse uses site texts for welcome banner, but we'll override with theme settings
      
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
          };
          
          img.onerror = () => {
            container.classList.remove('loading');
            container.classList.add('no-image');
          };
          
          img.src = imageUrl;
          img.alt = `Feature ${itemIndex}`;
          
          return container;
        } else {
          // Create placeholder
          const container = document.createElement('div');
          container.className = 'banner-image no-image';
          return container;
        }
      };

      // Console log for debugging
      console.log("Groqsters theme initialized with settings:", {
        welcomeBanner: settings.show_welcome_banner,
        alertBanner: settings.show_alert_banner,
        featureBanner: settings.show_feature_banner
      });

      // Function to update banner (target Discourse's existing banner OR our header banner)
      const updateHeaderBanner = () => {
        // Try multiple selectors for Discourse's welcome banner
        let targetBanner = document.querySelector('.welcome-banner.--above-topic-content') ||
                          document.querySelector('.welcome-banner') ||
                          document.querySelector('[class*="welcome-banner"]') ||
                          document.getElementById('groqsters-header-banner');
        
        console.log('Groqsters: Looking for banner, found:', !!targetBanner);
        console.log('Groqsters: Banner type:', targetBanner?.classList.toString() || 'none');
        console.log('Groqsters: Current banner content:', targetBanner?.textContent?.substring(0, 100) || 'none');
        console.log('Groqsters: Settings:', {
          show_welcome_banner: settings.show_welcome_banner,
          welcome_banner_header_logged_in: settings.welcome_banner_header_logged_in,
          welcome_banner_header_guest: settings.welcome_banner_header_guest,
          welcome_banner_subtitle: settings.welcome_banner_subtitle,
          show_banner_search: settings.show_banner_search
        });
        
        if (targetBanner && settings.show_welcome_banner) {
          const currentUser = api.getCurrentUser();
          console.log('Groqsters: Current user:', currentUser?.username);
          
          // Apply our custom styling to the existing banner
          targetBanner.style.background = 'linear-gradient(135deg, #c2410c, #ea580c, #f97316)';
          targetBanner.style.color = 'white';
          targetBanner.style.padding = '2rem';
          targetBanner.style.textAlign = 'center';
          targetBanner.style.borderRadius = '8px';
          targetBanner.style.margin = '1rem 0';
          
          // Create or update banner content
          let headerText;
          if (currentUser) {
            headerText = (settings.welcome_banner_header_logged_in || "Welcome back, {username}!")
              .replace("{username}", currentUser.username);
          } else {
            headerText = settings.welcome_banner_header_guest || "Welcome to Our Community";
          }
          
          const subtitleText = settings.welcome_banner_subtitle || "Find help, share your knowledge, and experience fast inference";
          
          // Replace banner content with our custom structure
          let bannerHTML = `
            <h1 style="margin: 0 0 0.75rem 0; font-size: 2rem; font-weight: 700; line-height: 1.2;">${headerText}</h1>
            <h2 style="margin: 0 0 1.5rem 0; font-size: 1.1rem; font-weight: 400; opacity: 0.9; line-height: 1.4;">${subtitleText}</h2>
          `;
          
          // Add search bar if enabled - use Discourse's built-in search
          if (settings.show_banner_search !== false) {
            bannerHTML += `
              <div style="margin-top: 1.5rem; max-width: 500px; margin-left: auto; margin-right: auto;">
                <div id="groqsters-search-container" style="position: relative;">
                  <!-- Discourse search will be inserted here -->
                </div>
              </div>
            `;
          }
          
          targetBanner.innerHTML = bannerHTML;
          console.log('Groqsters: Updated banner content');
        } else if (targetBanner && !settings.show_welcome_banner) {
          // Hide banner if setting is disabled
          targetBanner.style.display = 'none';
          console.log('Groqsters: Hidden banner per settings');
        }
        
        // Hide our header banner if we're using Discourse's banner
        const headerBanner = document.getElementById('groqsters-header-banner');
        if (headerBanner && targetBanner !== headerBanner) {
          headerBanner.style.display = 'none';
        }
      };

      // Add banners after hero area but before navigation tabs
      api.decorateWidget("home-logo:after", (dec) => {
        const isHomePage = window.location.pathname === "/" || 
                         window.location.pathname === "/latest" ||
                         window.location.pathname === "/categories";
        
        if (!isHomePage) return;

        const elements = [];

        // Update header banner with a longer delay and retry mechanism
        setTimeout(updateHeaderBanner, 100);
        setTimeout(updateHeaderBanner, 500);
        setTimeout(updateHeaderBanner, 1000);

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
          elements.push(
            dec.h("div.groqsters-feature-banner", [
              dec.h("div.banner-grid", [
                dec.h("div.banner-item", [
                  dec.h("div.banner-image-placeholder", { 
                    "data-item": "1",
                    "data-url": settings.feature_banner_item_1_image || ""
                  }),
                  dec.h("h3", settings.feature_banner_item_1_title || "Fast & Powerful")
                ]),
                dec.h("div.banner-item", [
                  dec.h("div.banner-image-placeholder", { 
                    "data-item": "2",
                    "data-url": settings.feature_banner_item_2_image || ""
                  }),
                  dec.h("h3", settings.feature_banner_item_2_title || "Community Driven")
                ]),
                dec.h("div.banner-item", [
                  dec.h("div.banner-image-placeholder", { 
                    "data-item": "3",
                    "data-url": settings.feature_banner_item_3_image || ""
                  }),
                  dec.h("h3", settings.feature_banner_item_3_title || "Always Learning")
                ])
              ])
            ])
          );
        }

        return elements.length > 0 ? elements : null;
      });

      // Always try to update header banner on page changes
      api.onPageChange(() => {
        console.log('Groqsters: Page changed to:', window.location.pathname);
        
        // Update header banner regardless of page (in case banner is shown on multiple pages)
        setTimeout(updateHeaderBanner, 100);
        setTimeout(updateHeaderBanner, 500);
        setTimeout(updateHeaderBanner, 1000);
        
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

          // Add alert banner if enabled
          if (settings.show_alert_banner && settings.alert_banner_message) {
            const alertBanner = document.createElement('div');
            alertBanner.className = 'groqsters-alert-banner';
            
            if (settings.alert_banner_color) {
              alertBanner.style.setProperty('--groqsters-alert-color', settings.alert_banner_color);
            }
            
            let alertHTML = `<div class="alert-message">${settings.alert_banner_message}</div>`;
            
            if (settings.alert_banner_cta_url && settings.alert_banner_cta_url.trim()) {
              const target = settings.alert_banner_cta_url.startsWith('http') ? '_blank' : '_self';
              const ctaText = settings.alert_banner_cta_text || "Learn More";
              alertHTML += `<a class="alert-cta" href="${settings.alert_banner_cta_url}" target="${target}">${ctaText}</a>`;
            }
            
            alertBanner.innerHTML = alertHTML;
            bannerContainer.appendChild(alertBanner);
          }

          // Add feature banner if enabled
          if (settings.show_feature_banner) {
            const featureBanner = document.createElement('div');
            featureBanner.className = 'groqsters-feature-banner';
            
            const bannerGrid = document.createElement('div');
            bannerGrid.className = 'banner-grid';
            
            // Create three banner items
            for (let i = 1; i <= 3; i++) {
              const bannerItem = document.createElement('div');
              bannerItem.className = 'banner-item';
              
              const imageUrl = settings[`feature_banner_item_${i}_image`];
              const title = settings[`feature_banner_item_${i}_title`] || 
                          (i === 1 ? "Fast & Powerful" : i === 2 ? "Community Driven" : "Always Learning");
              
              const imageContainer = createBannerImage(imageUrl, i);
              bannerItem.appendChild(imageContainer);
              
              const titleElement = document.createElement('h3');
              titleElement.textContent = title;
              bannerItem.appendChild(titleElement);
              
              bannerGrid.appendChild(bannerItem);
            }
            
            featureBanner.appendChild(bannerGrid);
            bannerContainer.appendChild(featureBanner);
          }

          // Insert the banner container
          if (bannerContainer.children.length > 0) {
            if (navigationContainer) {
              navigationContainer.parentNode.insertBefore(bannerContainer, navigationContainer);
            } else {
              insertTarget.appendChild(bannerContainer);
            }
          }

          // Replace placeholders after a short delay
          setTimeout(() => this.replaceBannerPlaceholders(), 100);
        }, 100);
      });

      // Simple category page enhancement without complex DOM manipulation
      api.onPageChange(() => {
        const isCategoriesPage = window.location.pathname === "/categories" || 
                                window.location.pathname.includes("/categories");
        
        if (isCategoriesPage) {
          setTimeout(() => {
            // Add our custom class to multiple possible containers
            const categoriesContainers = document.querySelectorAll(
              '.categories-and-latest, .categories-only, .categories-page, #main-outlet'
            );
            
            categoriesContainers.forEach(container => {
              if (container) {
                container.classList.add('groqsters-categories-layout');
              }
            });
            
            // Force the body to have our category class
            document.body.classList.add('groqsters-categories-page');
            
            // Hide Latest section on Categories tab
            const latestSections = document.querySelectorAll('.latest-topic-list, .latest-topic-list-container, .latest-topic-list-item');
            latestSections.forEach(section => {
              section.style.display = 'none';
            });
            
            // Apply Cloudflare-style grid layout
            const categoryList = document.querySelector('.category-list');
            if (categoryList) {
              categoryList.style.display = 'grid';
              categoryList.style.gridTemplateColumns = 'repeat(auto-fit, minmax(320px, 1fr))';
              categoryList.style.gap = '1.5rem';
              
              // Ensure the table structure supports grid
              const table = categoryList.querySelector('table');
              if (table) {
                table.style.display = 'contents';
              }
              
              const tbody = categoryList.querySelector('tbody');
              if (tbody) {
                tbody.style.display = 'contents';
              }
              
              // Style category items like Cloudflare
              const categoryItems = categoryList.querySelectorAll('.category-list-item, tr.category-list-item');
              categoryItems.forEach(item => {
                item.style.display = 'block';
                item.style.visibility = 'visible';
                item.style.background = 'var(--secondary)';
                item.style.border = '1px solid var(--primary-low)';
                item.style.borderRadius = '16px';
                item.style.padding = '2rem';
                item.style.marginBottom = '0';
                item.style.minHeight = '160px';
                item.style.position = 'relative';
                
                // Add left border accent
                item.style.setProperty('--before-content', '""');
                item.style.setProperty('--before-position', 'absolute');
                item.style.setProperty('--before-left', '0');
                item.style.setProperty('--before-top', '0');
                item.style.setProperty('--before-width', '4px');
                item.style.setProperty('--before-height', '100%');
                item.style.setProperty('--before-background', 'var(--groqsters-primary)');
                
                // Hide ALL metadata cells
                const hideCells = item.querySelectorAll('td.topics, td.posts, td.latest, td.num, td.stats');
                hideCells.forEach(cell => {
                  cell.style.display = 'none';
                });
                
                // Style the category cell
                const categoryCell = item.querySelector('td.category');
                if (categoryCell) {
                  categoryCell.style.display = 'block';
                  categoryCell.style.padding = '0';
                  categoryCell.style.border = 'none';
                  
                  // Style category name
                  const categoryName = categoryCell.querySelector('h3, .category-name, .category-title-link');
                  if (categoryName) {
                    categoryName.style.fontSize = '1.5rem';
                    categoryName.style.fontWeight = '700';
                    categoryName.style.margin = '0 0 1rem 0';
                    categoryName.style.lineHeight = '1.3';
                  }
                  
                  // Style description
                  const description = categoryCell.querySelector('.category-description');
                  if (description) {
                    description.style.fontSize = '1rem';
                    description.style.lineHeight = '1.6';
                    description.style.marginBottom = '0';
                    description.style.fontWeight = '400';
                  }
                  
                  // Hide category icons/logos
                  const icons = categoryCell.querySelectorAll('.category-logo, .category-icon');
                  icons.forEach(icon => {
                    icon.style.display = 'none';
                  });
                }
              });
            }
            
            // Hide table headers
            const tableHeaders = document.querySelectorAll('.category-list thead, .category-list-header');
            tableHeaders.forEach(header => {
              header.style.display = 'none';
            });
            
            console.log('Groqsters Cloudflare-style categories layout applied');
            
          }, 100);
        } else {
          // Remove classes when not on categories page
          document.body.classList.remove('groqsters-categories-page');
        }
      });

      // Replace banner placeholders with actual images
      this.replaceBannerPlaceholders = () => {
        const placeholders = document.querySelectorAll('.banner-image-placeholder');
        placeholders.forEach(placeholder => {
          const item = placeholder.getAttribute('data-item');
          const url = placeholder.getAttribute('data-url');
          
          if (url && url.trim()) {
            const imageContainer = createBannerImage(url, item);
            placeholder.parentNode.replaceChild(imageContainer, placeholder);
          } else {
            placeholder.className = 'banner-image no-image';
          }
        });
      };

      console.log("Groqsters theme API setup completed with banner config:", {
        bannerTitles: {
          item1: settings.feature_banner_item_1_title,
          item2: settings.feature_banner_item_2_title,
          item3: settings.feature_banner_item_3_title
        },
        bannerUrls: {
          item1: settings.feature_banner_item_1_url,
          item2: settings.feature_banner_item_2_url,
          item3: settings.feature_banner_item_3_url
        }
      });

      // Add mutation observer to catch banner when it's added to DOM
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              if (node.id === 'groqsters-header-banner' || node.querySelector('#groqsters-header-banner')) {
                console.log('Groqsters: Banner detected via mutation observer');
                setTimeout(updateHeaderBanner, 10);
              }
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
}; 