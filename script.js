// ===== PARTICLES BACKGROUND =====
document.addEventListener("DOMContentLoaded", () => {
  // Initialize particles.js
  // Check if particlesJS is already defined, if not, define it as an empty function
  if (typeof particlesJS === "undefined") {
    window.particlesJS = () => {}
  }
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#8e44ad",
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
        polygon: {
          nb_sides: 5,
        },
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#8e44ad",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true,
  })

  // ===== HEADER SCROLL EFFECT =====
  const header = document.querySelector("header")
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // ===== MOBILE MENU TOGGLE =====
  const menuToggle = document.querySelector(".menu-toggle")
  const nav = document.querySelector("nav")

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active")
    if (nav.classList.contains("active")) {
      menuToggle.innerHTML = '<i class="fas fa-times"></i>'
    } else {
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>'
    }
  })

  // Close menu when clicking on a nav link
  const navLinks = document.querySelectorAll("nav ul li a")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active")
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>'
    })
  })

  // ===== HERO SECTION ANIMATIONS =====
  const heroElements = document.querySelectorAll(".animate-on-load")
  setTimeout(() => {
    heroElements.forEach((element) => {
      element.classList.add("active")
    })
  }, 500)

  // ===== SCROLL ANIMATIONS =====
  const animatedElements = document.querySelectorAll("[data-animation]")

  function checkScroll() {
    animatedElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (elementTop < windowHeight * 0.8) {
        element.classList.add("animate-in")
      }
    })
  }

  // Initial check
  checkScroll()

  // Check on scroll
  window.addEventListener("scroll", checkScroll)

  // ===== WAVE ANIMATION =====
  const waves = document.querySelectorAll(".wave")

  function animateWaves() {
    waves.forEach((wave) => {
      const height = Math.random() * 60 + 20
      wave.style.height = `${height}px`
    })
  }

  // Initial animation
  animateWaves()

  // Animate every 1.5 seconds
  setInterval(animateWaves, 1500)

  // ===== PROGRESS CIRCLE ANIMATION =====
  const progressCircle = document.querySelector(".progress-bar")
  const progressText = document.querySelector(".progress-text")

  function animateProgress() {
    const value = 75 // Percentage value
    const circumference = 2 * Math.PI * 45 // 2πr
    const offset = circumference - (value / 100) * circumference

    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`
    progressCircle.style.strokeDashoffset = offset
  }

  // Animate progress when in viewport
  const fitnessSection = document.querySelector(".fitness")
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(animateProgress, 500)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  observer.observe(fitnessSection)

  // ===== DIET TOGGLE BUTTONS =====
  const toggleBtns = document.querySelectorAll(".toggle-btn")

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      toggleBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // ===== BACK TO TOP BUTTON =====
  const backToTopBtn = document.getElementById("back-to-top")

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // ===== FOOD ITEMS ANIMATION =====
  const foodItems = document.querySelectorAll(".food-item")

  function animateFoodItems() {
    foodItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.transform = "scale(1.1)"
        setTimeout(() => {
          item.style.transform = "scale(1)"
        }, 300)
      }, index * 200)
    })
  }

  // Animate food items when diet section is in viewport
  const dietSection = document.querySelector(".diet")
  const foodObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInterval(animateFoodItems, 3000)
          foodObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  foodObserver.observe(dietSection)

  // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // ===== EMOJI ANIMATION =====
  const emojis = document.querySelectorAll(".emoji")
  let currentEmojiIndex = 0

  function animateEmojis() {
    emojis.forEach((emoji, index) => {
      if (index === currentEmojiIndex) {
        emoji.style.transform = "scale(1.2)"
        emoji.style.opacity = "1"
      } else {
        emoji.style.transform = "scale(1)"
        emoji.style.opacity = "0.5"
      }
    })

    currentEmojiIndex = (currentEmojiIndex + 1) % emojis.length
  }

  // Animate emojis every 2 seconds
  setInterval(animateEmojis, 2000)

  // Initial animation
  animateEmojis()
})
