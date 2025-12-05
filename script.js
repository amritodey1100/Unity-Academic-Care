/* ============================================
   Unity Academic Care - JavaScript
   Smooth scroll, animations, and interactivity
============================================= */

document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // SCROLL PROGRESS BAR
  // ============================================
  const scrollProgress = document.getElementById("scrollProgress");

  function updateScrollProgress() {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = scrollPercent + "%";
  }

  window.addEventListener("scroll", updateScrollProgress);

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  const header = document.getElementById("header");

  function handleHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleHeaderScroll);
  handleHeaderScroll(); // Check on load

  // ============================================
  // MOBILE MENU TOGGLE (Enhanced)
  // ============================================
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");
  let isMenuOpen = false;

  function openMenu() {
    isMenuOpen = true;
    mobileToggle.classList.add("active");
    navMenu.classList.add("active");
    document.body.style.overflow = "hidden";
    mobileToggle.setAttribute("aria-expanded", "true");
    // Focus first menu item for accessibility
    setTimeout(() => {
      const firstLink = navMenu.querySelector(".nav-link");
      if (firstLink) firstLink.focus();
    }, 100);
  }

  function closeMenu() {
    isMenuOpen = false;
    mobileToggle.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.style.overflow = "";
    mobileToggle.setAttribute("aria-expanded", "false");
  }

  // Toggle menu on button click
  mobileToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking a link
  navMenu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close menu when clicking outside (on the backdrop)
  navMenu.addEventListener("click", function (e) {
    // Only close if clicking directly on the nav-menu (backdrop), not on links
    if (e.target === navMenu) {
      closeMenu();
    }
  });

  // Close menu on window resize (if switching to desktop)
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && isMenuOpen) {
      closeMenu();
    }
  });

  // ============================================
  // SMOOTH SCROLL NAVIGATION
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ============================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ============================================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function highlightActiveNav() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightActiveNav);
  highlightActiveNav(); // Check on load

  // ============================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================
  const animatedElements = document.querySelectorAll(
    ".animate-fade-up, .animate-fade-right, .animate-fade-left"
  );

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add delay if specified
        const delay =
          getComputedStyle(entry.target).getPropertyValue("--delay") || "0s";
        entry.target.style.transitionDelay = delay;
        entry.target.classList.add("animated");
        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((element) => {
    animationObserver.observe(element);
  });

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  const backToTop = document.getElementById("backToTop");

  function toggleBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  window.addEventListener("scroll", toggleBackToTop);

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // ============================================
  // CONTACT FORM HANDLING
  // ============================================
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());

      // Simple validation
      let isValid = true;
      const requiredFields = ["name", "email", "phone", "subject", "message"];

      requiredFields.forEach((field) => {
        const input = this.querySelector(`[name="${field}"]`);
        if (!input.value.trim()) {
          input.parentElement.classList.add("error");
          isValid = false;
        } else {
          input.parentElement.classList.remove("error");
        }
      });

      // Email validation
      const emailInput = this.querySelector('[name="email"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput.value && !emailRegex.test(emailInput.value)) {
        emailInput.parentElement.classList.add("error");
        isValid = false;
      }

      // Phone validation (Bangladesh format)
      const phoneInput = this.querySelector('[name="phone"]');
      const phoneRegex = /^01[3-9]\d{8}$/;
      const cleanPhone = phoneInput.value.replace(/[-\s]/g, "");
      if (phoneInput.value && !phoneRegex.test(cleanPhone)) {
        phoneInput.parentElement.classList.add("error");
        isValid = false;
      }

      if (isValid) {
        // Show success message
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="las la-check"></i> Message Sent!';
        submitBtn.disabled = true;
        submitBtn.style.background = "var(--accent)";

        // Reset form
        setTimeout(() => {
          this.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = "";
        }, 3000);

        // In production, you would send this data to a server
        console.log("Form submitted:", data);
      }
    });

    // Remove error class on input
    contactForm.querySelectorAll("input, textarea, select").forEach((input) => {
      input.addEventListener("input", function () {
        this.parentElement.classList.remove("error");
      });
    });
  }

  // ============================================
  // PARALLAX EFFECT FOR HERO
  // ============================================
  const heroBg = document.querySelector(".hero-bg::before");

  function parallaxEffect() {
    const scrolled = window.scrollY;
    const heroSection = document.querySelector(".hero");

    if (heroSection && scrolled < heroSection.offsetHeight) {
      const translateY = scrolled * 0.4;
      heroSection.style.setProperty("--parallax-offset", translateY + "px");
    }
  }

  window.addEventListener("scroll", parallaxEffect);

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
      start += increment;
      if (start < target) {
        element.textContent =
          Math.floor(start) + (element.dataset.suffix || "");
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + (element.dataset.suffix || "");
      }
    }

    updateCounter();
  }

  // Animate stats when they become visible
  const statNumbers = document.querySelectorAll(".stat-number");

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const text = entry.target.textContent;
          const numMatch = text.match(/(\d+)/);

          if (numMatch) {
            const number = parseInt(numMatch[1]);
            const suffix = text.replace(/\d+/g, "");
            entry.target.dataset.suffix = suffix;
            entry.target.textContent = "0" + suffix;
            animateCounter(entry.target, number);
          }

          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((stat) => {
    statObserver.observe(stat);
  });

  // ============================================
  // CARD HOVER TILT EFFECT (subtle)
  // ============================================
  const cards = document.querySelectorAll(
    ".course-card, .teacher-card, .testimonial-card"
  );

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // ============================================
  // KEYBOARD ACCESSIBILITY
  // ============================================
  document.addEventListener("keydown", (e) => {
    // Escape key closes mobile menu
    if (e.key === "Escape" && isMenuOpen) {
      closeMenu();
      mobileToggle.focus(); // Return focus to toggle button
    }

    // Tab trap inside mobile menu
    if (e.key === "Tab" && isMenuOpen) {
      const focusableElements = navMenu.querySelectorAll(".nav-link");
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });

  // ============================================
  // REDUCE MOTION FOR ACCESSIBILITY
  // ============================================
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty("--transition-normal", "0s");
    document.documentElement.style.setProperty("--transition-slow", "0s");

    animatedElements.forEach((el) => {
      el.classList.add("animated");
    });
  }

  // ============================================
  // LAZY LOADING IMAGES FALLBACK
  // ============================================
  if ("loading" in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach((img) => {
      img.src = img.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
    document.body.appendChild(script);
  }

  console.log("Unity Academic Care - Website initialized successfully! 📚");
});
