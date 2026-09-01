import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement scrollIntoView/scrollTo; components call these on interaction.
if (typeof window !== "undefined") {
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.scrollTo = () => {};
}
