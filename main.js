/**
 * AL HAYAT PHARMACY - CORE APPLICATION SCRIPT
 * Handles Mobile Menu (Click-only, zero swipe), FAQ Accordions, Form Validation, and WebGL Fallback
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFaqAccordion();
  initContactForm();
  initThreeJsVisual();
});

/**
 * Mobile Drawer Menu System
 * CRITICAL: Zero swipe-to-open gesture implemented. Openable strictly via click.
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const menuBackdrop = document.getElementById('menuBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!menuToggle || !mobileDrawer || !menuBackdrop) return;

  function openMenu() {
    mobileDrawer.classList.add('is-open');
    menuBackdrop.classList.add('is-open');
    document.body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    mobileDrawer.classList.remove('is-open');
    menuBackdrop.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
  }

  // Explicit Event Listeners
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    openMenu();
  });

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  menuBackdrop.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ESC Key Support for Accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

/**
 * Accordion Functionality for FAQs
 */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.parentElement;
      const isOpen = faqItem.classList.contains('active');

      // Close other open items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked item
      if (!isOpen) {
        faqItem.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Frontend Validation for Contact Form
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Elements
    const fullName = document.getElementById('fullName');
    const phoneNum = document.getElementById('phoneNum');
    const message = document.getElementById('message');

    // Reset error states
    document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));

    // Validate Name
    if (!fullName.value.trim()) {
      fullName.parentElement.classList.add('has-error');
      isValid = false;
    }

    // Validate Phone
    if (!phoneNum.value.trim() || phoneNum.value.trim().length < 8) {
      phoneNum.parentElement.classList.add('has-error');
      isValid = false;
    }

    // Validate Message
    if (!message.value.trim()) {
      message.parentElement.classList.add('has-error');
      isValid = false;
    }

    if (isValid) {
      // Static Form Simulation Response
      if (formStatus) {
        formStatus.className = 'form-status success';
        formStatus.innerHTML = 'Thank you for reaching out! Your message has been prepared locally. For immediate assistance, please call us directly at <strong>0322 8021752</strong>.';
        formStatus.style.display = 'block';
      }
      contactForm.reset();
    }
  });
}

/**
 * Three.js Hero Scene (Performance Safe with WebGL Fallback)
 */
function initThreeJsVisual() {
  const container = document.getElementById('webgl-container');
  const fallback = document.querySelector('.fallback-hero-card');

  if (!container || typeof THREE === 'undefined') {
    if (fallback) fallback.style.display = 'block';
    return;
  }

  // Graceful motion check
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (fallback) fallback.style.display = 'block';
    return;
  }

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Light Abstract Medical Shape (Icosahedron Geometry)
    const geometry = new THREE.IcosahedronGeometry(1.8, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00a884,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Inner glowing core
    const innerGeom = new THREE.SphereGeometry(1.1, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x0e2a47, wireframe: true });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    scene.add(innerMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Animation Loop
    let animationFrameId;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      mesh.rotation.x += 0.003;
      mesh.rotation.y += 0.004;
      innerMesh.rotation.y -= 0.002;
      renderer.render(scene, camera);
    }
    animate();

    // Responsive Resize Handler
    window.addEventListener('resize', () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

  } catch (err) {
    console.warn("WebGL initialization skipped, using fallback UI.");
    if (fallback) fallback.style.display = 'block';
  }
}
  
