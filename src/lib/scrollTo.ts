import Lenis from "lenis";

let _lenis: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  _lenis = l;
}

export function getLenis() {
  return _lenis;
}

/** Smoothly scroll to an element id, using Lenis if available. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (_lenis) {
    _lenis.scrollTo(el, { offset: -40, duration: 1.6 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
