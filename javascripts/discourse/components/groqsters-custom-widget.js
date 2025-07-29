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