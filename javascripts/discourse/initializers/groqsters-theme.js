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

      // Emoji helpers
      const getSiteInfo = (() => {
        let cached = null;
        let pending = null;
        return () => {
          if (cached) return Promise.resolve(cached);
          if (pending) return pending;
          pending = fetch('/site.json')
            .then(r => (r && r.ok ? r.json() : null))
            .then(json => { cached = json; return cached; })
            .catch(() => null)
            .finally(() => { pending = null; });
          return pending;
        };
      })();

      const renderEmojiInto = (container, shortname) => {
        if (!container || !shortname) return;
        getSiteInfo().then(site => {
          const set = site && site.site_settings && site.site_settings.emoji_set ? site.site_settings.emoji_set : 'twitter';
          const src = 'https://emoji.discourse-cdn.com/' + set + '/' + encodeURIComponent(shortname) + '.png';
          const img = document.createElement('img');
          img.className = 'emoji';
          img.width = 20;
          img.height = 20;
          img.alt = shortname;
          img.title = shortname;
          img.src = src;
          container.classList.add('--style-emoji');
          container.textContent = '';
          container.appendChild(img);
        }).catch(() => { /* no-op */ });
      };




      // Deprecated Discourse widget (home-logo:after) removed. DOM is managed via onPageChange below.

      // Always try to update header banner on page changes
      api.onPageChange(() => {

        
        const isHomePage = window.location.pathname === "/" || 
                         window.location.pathname === "/latest" ||
                         window.location.pathname === "/categories" ||
                         window.location.pathname === "/top";
        
        if (!isHomePage) return;

        // Wait a bit for the page to render
        setTimeout(() => {
          // If our container already exists, update placeholders and skip reinserting
          const existingBannerContainer = document.querySelector('.groqsters-banners-container');
          if (existingBannerContainer) {
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
            
            const featureCardsRow = document.createElement('div');
            featureCardsRow.className = 'feature-cards-row';
            
            // Create up to three feature cards, honoring per-item enable toggles
            let enabledCount = 0;
            for (let i = 1; i <= 3; i++) {
              const enabledSettingName = `feature_banner_item_${i}_enabled`;
              const isEnabled = !!settings[enabledSettingName];
              if (!isEnabled) continue;

              const imageUrl = settings[`feature_banner_item_${i}_image`];
              const title = settings[`feature_banner_item_${i}_title`] ||
                (i === 1 ? "Fast & Powerful" : i === 2 ? "Community Driven" : "Always Learning");
              const url = settings[`feature_banner_item_${i}_url`] || "#";

              // Create either a link or div depending on URL
              const featureCard = url && url !== "#" ?
                document.createElement('a') :
                document.createElement('div');

              featureCard.className = 'feature-card';

              if (url && url !== "#") {
                featureCard.href = url;
                featureCard.target = url.startsWith('http') ? '_blank' : '_self';
              }

              // Create image container
              const imageContainer = document.createElement('div');
              imageContainer.className = 'feature-card-image';
              const bgSetting = settings[`feature_banner_item_${i}_bg`];
              if (bgSetting) {
                imageContainer.style.backgroundColor = bgSetting;
              }

              const imageElement = createBannerImage(imageUrl, i);
              imageContainer.appendChild(imageElement);

              // Create text container
              const textContainer = document.createElement('div');
              textContainer.className = 'feature-card-text';

              const titleElement = document.createElement('h3');
              titleElement.className = 'feature-card-title';
              titleElement.textContent = title;
              textContainer.appendChild(titleElement);

              featureCard.appendChild(imageContainer);
              featureCard.appendChild(textContainer);
              featureCardsRow.appendChild(featureCard);
              enabledCount++;
            }
            
            if (featureCardsRow.children.length > 0) {
              // Expose count for CSS if needed
              featureCardsRow.setAttribute('data-count', String(enabledCount));
              featureBanner.appendChild(featureCardsRow);
              bannerContainer.appendChild(featureBanner);
            }
          }

          // Custom posts rendering deferred below navigation grid
          if (settings.show_custom_posts) {
            // rendering is handled after navigation grid
          }

          // Add navigation grid if enabled
          if (settings.show_navigation_grid) {
            const navigationContainer = document.createElement('div');
            navigationContainer.className = 'groqsters-navigation-grid';
            
            const navigationGrid = document.createElement('div');
            navigationGrid.className = 'navigation-grid';
            
            // Create navigation items honoring per-item enable toggles and spans
            for (let i = 1; i <= 4; i++) {
              const enabled = !!settings[`nav_item_${i}_enabled`];
              if (!enabled) continue;
              const icon = settings[`nav_item_${i}_icon`];
              const title = settings[`nav_item_${i}_title`];
              const description = settings[`nav_item_${i}_description`];
              const url = settings[`nav_item_${i}_url`];
              const rawSpan = settings[`nav_item_${i}_span`];
              let span = parseInt(rawSpan == null ? 1 : rawSpan, 10);
              if (!Number.isFinite(span) || span < 1) span = 1;
              if (span > 4) span = 4;
              
              // Only add item if it has at least a title and URL
              if (title && url) {
                const navItem = document.createElement('a');
                navItem.className = 'nav-item';
                navItem.href = url;
                navItem.target = url.startsWith('http') ? '_blank' : '_self';
                navItem.style.gridColumn = `span ${span}`;
                
                const header = document.createElement('div');
                header.className = 'nav-item-header';
                
                const iconSpan = document.createElement('span');
                iconSpan.className = 'nav-item-icon';
                iconSpan.textContent = icon || "📍";
                
                const titleElement = document.createElement('h3');
                titleElement.className = 'nav-item-title';
                titleElement.textContent = title;
                
                header.appendChild(iconSpan);
                header.appendChild(titleElement);
                
                const descriptionElement = document.createElement('p');
                descriptionElement.className = 'nav-item-description';
                descriptionElement.textContent = description || "";
                
                navItem.appendChild(header);
                navItem.appendChild(descriptionElement);
                navigationGrid.appendChild(navItem);
              }
            }
            
            if (navigationGrid.children.length > 0) {
              navigationContainer.appendChild(navigationGrid);
              bannerContainer.appendChild(navigationContainer);
            }
          }

          // Render custom posts after navigation grid
          if (deferCustomPosts) {
            const customPostCache = window.__groqstersCustomPostCache || (window.__groqstersCustomPostCache = new Map());

            const buildAbsoluteUrl = function(pathOrUrl) {
              if (!pathOrUrl) return '';
              if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;
              try { return new URL(pathOrUrl, window.location.origin).toString(); } catch(e) { return pathOrUrl; }
            };

            const resolveAvatarFromTemplate = function(template, size) {
              if (!template) return '';
              const url = template.replace('{size}', String(size || 45));
              return url.startsWith('/') ? (window.location.origin + url) : url;
            };

            const postsSection = document.createElement('div');
            postsSection.className = 'groqsters-custom-posts';

            if (settings.custom_posts_title) {
              const header = document.createElement('h3');
              header.className = 'custom-posts-title';
              header.textContent = settings.custom_posts_title;
              postsSection.appendChild(header);
            }

            const list = document.createElement('div');
            list.className = 'custom-posts-list';

            const renderRow = function(i) {
              if (!settings['custom_post_' + i + '_enabled']) return;

              const configuredUrl = settings['custom_post_' + i + '_url'];
              const titleSetting = settings['custom_post_' + i + '_title'];
              const subtitle = settings['custom_post_' + i + '_subtitle'];
              const subtitleEmoji = settings['custom_post_' + i + '_subtitle_emoji'];
              const userSetting = settings['custom_post_' + i + '_user'];
              const avatarUrlSetting = settings['custom_post_' + i + '_avatar_url'];

              const row = document.createElement('a');
              row.className = 'custom-post-row';
              const href = configuredUrl && configuredUrl.trim() ? configuredUrl.trim() : '#';
              row.href = href;
              row.target = href.startsWith('http') ? '_blank' : '_self';

              let avatarContainer = null;
              if (settings.custom_posts_show_avatars) {
                avatarContainer = document.createElement('div');
                avatarContainer.className = 'custom-post-avatar';
                if (avatarUrlSetting && avatarUrlSetting.trim()) {
                  const img = document.createElement('img');
                  img.src = avatarUrlSetting.trim();
                  img.alt = userSetting ? (userSetting + ' avatar') : 'avatar';
                  avatarContainer.appendChild(img);
                } else if (userSetting && userSetting.trim()) {
                  const letter = document.createElement('span');
                  letter.className = 'avatar-letter';
                  letter.textContent = userSetting.trim().charAt(0).toUpperCase();
                  avatarContainer.appendChild(letter);
                }
                row.appendChild(avatarContainer);
              }

              const content = document.createElement('div');
              content.className = 'custom-post-content';
              const titleEl = document.createElement('div');
              titleEl.className = 'custom-post-title';
              titleEl.textContent = titleSetting || configuredUrl || '';
              content.appendChild(titleEl);

              if ((subtitle && String(subtitle).trim()) || (subtitleEmoji && String(subtitleEmoji).trim())) {
                const subtitleEl = document.createElement('div');
                subtitleEl.className = 'custom-post-subtitle';
                if (subtitleEmoji && String(subtitleEmoji).trim()) {
                  const emojiSpan = document.createElement('span');
                  emojiSpan.className = 'subtitle-emoji';
                  emojiSpan.textContent = String(subtitleEmoji);
                  subtitleEl.appendChild(emojiSpan);
                  const sn = String(subtitleEmoji).trim();
                  if (/^[a-z0-9_]+$/.test(sn)) {
                    renderEmojiInto(emojiSpan, sn);
                  }
                }
                if (subtitle && String(subtitle).trim()) {
                  const textSpan = document.createElement('span');
                  textSpan.className = 'subtitle-text';
                  textSpan.textContent = String(subtitle);
                  subtitleEl.appendChild(textSpan);
                }
                content.appendChild(subtitleEl);
              }

              row.appendChild(content);
              list.appendChild(row);

              // Enrich from topic .json endpoint if applicable
              if (configuredUrl && configuredUrl.includes('/t/')) {
                let jsonUrl = configuredUrl;
                if (!jsonUrl.endsWith('.json')) jsonUrl = jsonUrl.replace(/\/?$/, '') + '.json';
                jsonUrl = buildAbsoluteUrl(jsonUrl);

                const cached = customPostCache.get(jsonUrl);
                const applyData = function(data) {
                  if (!data) return;
                  try {
                    const titleFromJson = data.title || data.fancy_title || null;
                    const createdBy = data.details && data.details.created_by;
                    let avatarTemplate = createdBy && createdBy.avatar_template;
                    if (!avatarTemplate) {
                      const firstPost = data.post_stream && data.post_stream.posts && data.post_stream.posts[0];
                      if (firstPost && firstPost.avatar_template) avatarTemplate = firstPost.avatar_template;
                    }
                    if (!titleSetting && titleFromJson) { titleEl.textContent = titleFromJson; }
                    if (settings.custom_posts_show_avatars && avatarTemplate) {
                      const resolved = resolveAvatarFromTemplate(avatarTemplate, 45);
                      if (resolved) {
                        if (!avatarContainer) {
                          avatarContainer = document.createElement('div');
                          avatarContainer.className = 'custom-post-avatar';
                          row.insertBefore(avatarContainer, row.firstChild);
                        }
                        avatarContainer.innerHTML = '';
                        const img = document.createElement('img');
                        img.src = resolved;
                        img.alt = createdBy && createdBy.username ? (createdBy.username + ' avatar') : 'avatar';
                        avatarContainer.appendChild(img);
                      }
                    }
                  } catch(e) { /* no-op */ }
                };

                if (cached) {
                  applyData(cached);
                } else {
                  fetch(jsonUrl).then(function(resp) { return resp.ok ? resp.json() : null; }).then(function(json) {
                    if (json) { customPostCache.set(jsonUrl, json); applyData(json); }
                  }).catch(function() { /* no-op */ });
                }
              }
            };

            for (var j = 1; j <= 4; j++) { renderRow(j); }

            if (list.children.length > 0) {
              postsSection.appendChild(list);
              bannerContainer.appendChild(postsSection);
            }
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

      // Footer is now handled by Discourse connectors
      
      // Add page change handling for categories page
      api.onPageChange(() => {
        
        const isCategoriesPage = window.location.pathname === "/" ||
                                window.location.pathname === "/latest" ||
                                window.location.pathname === "/top" ||
                                window.location.pathname === "/categories" || 
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
            
            // Add sidebar if enabled
            if (settings.show_categories_sidebar) {
              document.body.classList.add('has-sidebar');
              this.createCategoriesSidebar();
            }
            
            // Hide Latest section on Categories tab
            // const latestSections = document.querySelectorAll('.latest-topic-list, .latest-topic-list-container, .latest-topic-list-item');
            // latestSections.forEach(section => {
            //   section.style.display = 'none';
            // });
            
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
            
          }, 100);
        } else {
          // Remove classes when not on categories page
          document.body.classList.remove('groqsters-categories-page', 'has-sidebar');
          
          // Remove sidebar if it exists
          const existingSidebar = document.querySelector('.groqsters-categories-sidebar');
          if (existingSidebar) {
            existingSidebar.remove();
          }
        }
      });

      // Footer is now handled by Discourse connectors

      // Attempt to autofocus the official Advanced Search Banner input when present
      api.onPageChange(() => {
        if (!settings.autofocus_search_banner) return;

        // Do not steal focus if the user is already typing somewhere meaningful
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
          return;
        }

        // Wait briefly for the banner to render, then poll for a short time
        setTimeout(() => {
          let attempts = 0;
          const maxAttempts = 20; // ~2s total

          const tryFocus = () => {
            attempts++;
            const input = document.querySelector(
              [
                '.search-banner input[type="search"]',
                '.search-banner input[type="text"]',
                '.custom-search-banner input[type="search"]',
                '.custom-search-banner input[type="text"]',
                '.search-input input[type="search"]',
                '.search-input input[type="text"]'
              ].join(', ')
            );

            if (input) {
              if (document.activeElement !== input) {
                try { input.focus({ preventScroll: true }); } catch(e) { /* no-op */ }
                if (typeof input.select === 'function') {
                  try { input.select(); } catch(e) { /* no-op */ }
                }
              }
              clearInterval(timerId);
              return;
            }

            if (attempts >= maxAttempts) {
              clearInterval(timerId);
            }
          };

          const timerId = setInterval(tryFocus, 100);
        }, 100);
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

      // Create categories page sidebar
      this.createCategoriesSidebar = () => {
        // Remove existing sidebar if it exists
        const existingSidebar = document.querySelector('.groqsters-categories-sidebar');
        if (existingSidebar) {
          existingSidebar.remove();
        }

        // Find the categories column specifically
        const categoriesColumn = document.querySelector('.column.categories');
        if (!categoriesColumn) return;

        // Find the category-list table within the categories column
        const categoryListTable = categoriesColumn.querySelector('.category-list');
        if (!categoryListTable) return;

        // Create sidebar container
        const sidebar = document.createElement('div');
        sidebar.className = 'groqsters-categories-sidebar';

        // Create introduction section
        if (settings.sidebar_intro_title || settings.sidebar_intro_text) {
          const introSection = document.createElement('div');
          introSection.className = 'sidebar-section';

          if (settings.sidebar_intro_title) {
            const title = document.createElement('h3');
            title.className = 'sidebar-title';
            title.textContent = settings.sidebar_intro_title;
            introSection.appendChild(title);
          }

          if (settings.sidebar_intro_text) {
            const introText = document.createElement('div');
            introText.className = 'sidebar-intro-text';
            
            // Replace link placeholders with actual links
            let text = settings.sidebar_intro_text;
            if (settings.sidebar_intro_link_1_text && settings.sidebar_intro_link_1_url) {
              const link1 = `<a href="${settings.sidebar_intro_link_1_url}">${settings.sidebar_intro_link_1_text}</a>`;
              text = text.replace('{introduce_link}', link1);
            }
            if (settings.sidebar_intro_link_2_text && settings.sidebar_intro_link_2_url) {
              const link2 = `<a href="${settings.sidebar_intro_link_2_url}">${settings.sidebar_intro_link_2_text}</a>`;
              text = text.replace('{ask_link}', link2);
            }
            if (settings.sidebar_intro_link_3_text && settings.sidebar_intro_link_3_url) {
              const link3 = `<a href="${settings.sidebar_intro_link_3_url}">${settings.sidebar_intro_link_3_text}</a>`;
              text = text.replace('{share_link}', link3);
            }
            // Support line breaks: convert both literal \n and actual newlines
            text = text
              .replaceAll('\\n\\n', '<br><br>')
              .replaceAll('\\n', '<br>')
              .replace(/\n\n/g, '<br><br>')
              .replace(/\n/g, '<br>');
            
            introText.innerHTML = text;
            introSection.appendChild(introText);
          }

          // Add quick links if configured
          if (settings.sidebar_quick_links) {
            const quickLinksContainer = document.createElement('div');
            quickLinksContainer.className = 'sidebar-quick-links';
            
            const links = settings.sidebar_quick_links.split(',');
            links.forEach(linkData => {
              const [text, url] = linkData.split('|');
              if (text && url) {
                const link = document.createElement('a');
                link.href = url.trim();
                link.textContent = text.trim();
                link.target = url.trim().startsWith('http') ? '_blank' : '_self';
                quickLinksContainer.appendChild(link);
              }
            });
            
            if (quickLinksContainer.children.length > 0) {
              introSection.appendChild(quickLinksContainer);
            }
          }

          sidebar.appendChild(introSection);
        }

        // Create detailed sections (now up to 5)
        for (let i = 1; i <= 5; i++) {
          const title = settings[`sidebar_section_${i}_title`];
          const description = settings[`sidebar_section_${i}_description`];
          const url = settings[`sidebar_section_${i}_url`];

          if (title && url) {
            const section = document.createElement('a');
            section.className = 'sidebar-section sidebar-detailed-section';
            section.href = url;
            section.target = url.startsWith('http') ? '_blank' : '_self';

            const titleElement = document.createElement('h4');
            titleElement.className = 'section-title';
            titleElement.textContent = title;
            section.appendChild(titleElement);

            if (description) {
              const descElement = document.createElement('p');
              descElement.className = 'section-description';
              descElement.textContent = description;
              section.appendChild(descElement);
            }

            sidebar.appendChild(section);
          }
        }

        // Insert sidebar directly after the category table within the categories column
        if (sidebar.children.length > 0) {
          categoriesColumn.insertBefore(sidebar, categoryListTable.nextSibling);
        }
      };




      // Search banner functionality is provided by the official discourse-search-banner component

    });
  }
}; 