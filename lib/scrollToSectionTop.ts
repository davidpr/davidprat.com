export function scrollToSectionTop(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const scrollMarginTop = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const top = window.scrollY + el.getBoundingClientRect().top - scrollMarginTop;
  window.scrollTo({ top, behavior: "instant" });
}
