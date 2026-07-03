import Clarity from "@microsoft/clarity";

const PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

export const initClarity = () => {
  // Only initialize in production
  if (import.meta.env.PROD && PROJECT_ID) {
    Clarity.init(PROJECT_ID);
    console.log("✅ Microsoft Clarity Initialized");
  }
};