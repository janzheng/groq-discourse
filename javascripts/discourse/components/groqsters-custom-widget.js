import { createWidget } from "discourse/widgets/widget";
import { h } from "virtual-dom";

export default createWidget("groqsters-custom-widget", {
  tagName: "div.groqsters-custom-widget",

  buildKey: () => "groqsters-custom-widget",

  defaultState() {
    return {
      isExpanded: false,
      animationClass: ""
    };
  },

  html(attrs, state) {
    const elements = [];

    // Widget header
    elements.push(
      h("div.widget-header", [
        h("h3.widget-title", attrs.title || "Groqsters Widget"),
        h("button.widget-toggle", {
          onclick: () => this.toggleExpanded()
        }, state.isExpanded ? "−" : "+")
      ])
    );

    // Widget content (conditionally rendered)
    if (state.isExpanded) {
      elements.push(
        h("div.widget-content", [
          h("p", attrs.content || "This is a custom Groqsters widget!"),
          attrs.showButton ? h("button.btn.btn-groqsters", {
            onclick: () => this.customAction()
          }, "Custom Action") : null
        ])
      );
    }

    return elements;
  },

  toggleExpanded() {
    const wasExpanded = this.state.isExpanded;
    this.state.isExpanded = !wasExpanded;
    this.state.animationClass = wasExpanded ? "groqsters-fade-out" : "groqsters-fade-in";
    this.scheduleRerender();

    // Log interaction for analytics
    if (window.settings && window.settings.enable_custom_js) {
      console.log("Groqsters widget toggled:", this.state.isExpanded);
    }
  },

  customAction() {
    // Custom action logic here
    if (this.attrs.onAction && typeof this.attrs.onAction === "function") {
      this.attrs.onAction();
    } else {
      // Default action
      alert("Custom Groqsters action triggered!");
    }

    // Track custom action
    console.log("Groqsters custom action executed");
  },

  click(e) {
    // Handle widget clicks
    if (e.target.classList.contains("widget-header")) {
      this.toggleExpanded();
    }
  }
});

// Groqsters Search Widget - Functional search component
export const groqstersSearchWidget = createWidget("groqsters-search-banner", {
  tagName: "div.groqsters-search-banner",
  
  buildKey: () => "groqsters-search-banner",
  
  defaultState() {
    return {
      searchTerm: "",
      isSearching: false,
      showResults: false
    };
  },

  html(attrs, state) {
    const elements = [];
    
    // Welcome banner container
    elements.push(
      h("div.welcome-banner.groqsters-functional-search", [
        h("div.custom-search-banner.welcome-banner__inner-wrapper", [
          h("div.custom-search-banner-wrap.welcome-banner__wrap", [
            // Title and subtitle
            h("div.welcome-banner__title", [
              "Welcome to Our Community",
              h("p.welcome-banner__subheader", 
                "Find help, share your knowledge, and experience fast inference")
            ]),
            
            // Functional search area
            h("div.groqsters-search-container", [
              h("div.search-input-wrapper", [
                h("input.groqsters-search-input", {
                  type: "search",
                  placeholder: "Search topics, posts, users...",
                  value: state.searchTerm,
                  oninput: (e) => this.updateSearchTerm(e.target.value),
                  onkeydown: (e) => this.handleKeydown(e),
                  "aria-label": "Search"
                }),
                h("button.groqsters-search-btn", {
                  onclick: () => this.performSearch(),
                  disabled: !state.searchTerm.trim(),
                  title: "Search"
                }, [
                  h("svg.fa.d-icon.d-icon-magnifying-glass", {
                    "aria-hidden": "true"
                  }, [
                    h("use", { href: "#magnifying-glass" })
                  ])
                ]),
                h("a.groqsters-advanced-search", {
                  href: "/search?expanded=true",
                  title: "Advanced search"
                }, [
                  h("svg.fa.d-icon.d-icon-sliders", {
                    "aria-hidden": "true"
                  }, [
                    h("use", { href: "#sliders" })
                  ])
                ])
              ])
            ])
          ])
        ])
      ])
    );
    
    return elements;
  },

  updateSearchTerm(term) {
    this.state.searchTerm = term;
    this.scheduleRerender();
  },

  handleKeydown(e) {
    if (e.key === "Enter" && this.state.searchTerm.trim()) {
      e.preventDefault();
      this.performSearch();
    }
  },

  performSearch() {
    const searchTerm = this.state.searchTerm.trim();
    if (!searchTerm) return;
    
    // Navigate to Discourse search page with the search term
    window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
  }
}); 