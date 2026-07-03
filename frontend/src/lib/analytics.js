import ReactGA from "react-ga4";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initAnalytics = () => {
  // Run only in production and when GA ID exists
  if (import.meta.env.PROD && GA_ID) {
    ReactGA.initialize(GA_ID);

    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
    });

    console.log("✅ Google Analytics Initialized");
  }
};

// Track page changes
export const trackPageView = (path) => {
  if (import.meta.env.PROD && GA_ID) {
    ReactGA.send({
      hitType: "pageview",
      page: path,
    });
  }
};

// Track custom events
export const trackEvent = (action, category = "General", label = "") => {
  if (import.meta.env.PROD && GA_ID) {
    ReactGA.event({
      category,
      action,
      label,
    });
  }
};