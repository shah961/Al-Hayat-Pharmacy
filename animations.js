/**
 * AL HAYAT PHARMACY - GSAP ANIMATIONS & MICRO-INTERACTIONS
 * Smooth, subtle, and performance-optimized scroll-driven reveal effects.
 */

document.addEventListener('DOMContentLoaded', () => {
  initGsapAnimations();
});

function initGsapAnimations() {
  // Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Section Entrance Animation
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.from(heroContent.children, {
      opacity: 0,
      y: 25,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    });
  }

  // Scroll Reveal for Cards
  const cards = document.querySelectorAll('.card');
  if (cards.length > 0 && typeof ScrollTrigger !== 'undefined') {
    cards.forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power1.out'
      });
    });
  }

  // Subtle Header Transition on Scroll
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }
}
