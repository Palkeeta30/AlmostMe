// ===== DOCUMENT READY =====
document.addEventListener("DOMContentLoaded", () => {
  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.querySelector(".navbar")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // ===== SCROLL ANIMATIONS =====
  const animatedElements = document.querySelectorAll(".animated-element")

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

  // ===== SMOOTH SCROLLING =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const headerHeight = document.querySelector(".navbar").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // ===== TOGGLE BUTTONS =====
  const toggleBtns = document.querySelectorAll(".toggle-btn")

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      toggleBtns.forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // ===== WAVE ANIMATION =====
  const waves = document.querySelectorAll(".wave")

  function animateWaves() {
    waves.forEach((wave) => {
      const height = Math.random() * 60 + 20
      wave.style.height = `${height}px`
    })
  }

  // Animate waves if they exist
  if (waves.length > 0) {
    // Initial animation
    animateWaves()

    // Animate every 1.5 seconds
    setInterval(animateWaves, 1500)
  }

  // ===== EMOJI ANIMATION =====
  const emojis = document.querySelectorAll(".emoji")
  let currentEmojiIndex = 0

  function animateEmojis() {
    emojis.forEach((emoji, index) => {
      if (index === currentEmojiIndex) {
        emoji.classList.add("active")
      } else {
        emoji.classList.remove("active")
      }
    })

    currentEmojiIndex = (currentEmojiIndex + 1) % emojis.length
  }

  // Animate emojis if they exist
  if (emojis.length > 0) {
    // Initial animation
    animateEmojis()

    // Animate every 2 seconds
    setInterval(animateEmojis, 2000)
  }

  // ===== BMI CALCULATOR =====
  const bmiForm = document.getElementById("bmi-form")

  if (bmiForm) {
    bmiForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const height = Number.parseFloat(document.getElementById("height").value)
      const weight = Number.parseFloat(document.getElementById("weight").value)

      if (height > 0 && weight > 0) {
        // Convert height from cm to m
        const heightInMeters = height / 100

        // Calculate BMI
        const bmi = weight / (heightInMeters * heightInMeters)

        // Determine BMI category
        let category = ""
        let color = ""

        if (bmi < 18.5) {
          category = "Underweight"
          color = "#3498db"
        } else if (bmi >= 18.5 && bmi < 25) {
          category = "Normal weight"
          color = "#2ecc71"
        } else if (bmi >= 25 && bmi < 30) {
          category = "Overweight"
          color = "#f39c12"
        } else {
          category = "Obese"
          color = "#e74c3c"
        }

        // Update result
        const resultElement = document.getElementById("bmi-result")
        resultElement.innerHTML = `
                    <div class="alert" style="background-color: ${color}20; border: 1px solid ${color}50; color: ${color};">
                        <h4>Your BMI: ${bmi.toFixed(1)}</h4>
                        <p>Category: ${category}</p>
                    </div>
                `

        // Show result
        resultElement.style.display = "block"
      }
    })
  }

  // ===== EMOTION ANALYSIS =====
  const emotionForm = document.getElementById("emotion-form")

  if (emotionForm) {
    emotionForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const text = document.getElementById("emotion-text").value.trim()

      if (text) {
        // Simple dummy emotion analysis
        let emotion = ""
        let emoji = ""

        // Very basic keyword detection
        if (text.match(/happy|joy|excited|great|good|love/i)) {
          emotion = "Happy"
          emoji = "😊"
        } else if (text.match(/sad|unhappy|depressed|bad|terrible|miss/i)) {
          emotion = "Sad"
          emoji = "😢"
        } else if (text.match(/angry|mad|furious|hate|annoyed/i)) {
          emotion = "Angry"
          emoji = "😡"
        } else if (text.match(/tired|sleepy|exhausted|bored/i)) {
          emotion = "Tired"
          emoji = "😴"
        } else {
          emotion = "Neutral"
          emoji = "🤔"
        }

        // Update result
        const resultElement = document.getElementById("emotion-result")
        resultElement.innerHTML = `
                    <div class="alert alert-success">
                        <h4>Detected Emotion: ${emotion} ${emoji}</h4>
                        <p>Based on your text, you seem to be feeling ${emotion.toLowerCase()}.</p>
                    </div>
                `

        // Show result
        resultElement.style.display = "block"
      }
    })
  }

  // ===== MEMORY GAME =====
  const memoryGame = document.querySelector(".memory-game")

  if (memoryGame) {
    const cards = document.querySelectorAll(".memory-card")
    let hasFlippedCard = false
    let lockBoard = false
    let firstCard, secondCard

    function flipCard() {
      if (lockBoard) return
      if (this === firstCard) return

      this.classList.add("flip")

      if (!hasFlippedCard) {
        // First click
        hasFlippedCard = true
        firstCard = this
        return
      }

      // Second click
      secondCard = this

      checkForMatch()
    }

    function checkForMatch() {
      const isMatch = firstCard.dataset.framework === secondCard.dataset.framework

      isMatch ? disableCards() : unflipCards()
    }

    function disableCards() {
      firstCard.removeEventListener("click", flipCard)
      secondCard.removeEventListener("click", flipCard)

      resetBoard()
    }

    function unflipCards() {
      lockBoard = true

      setTimeout(() => {
        firstCard.classList.remove("flip")
        secondCard.classList.remove("flip")

        resetBoard()
      }, 1500)
    }

    function resetBoard() {
      ;[hasFlippedCard, lockBoard] = [false, false]
      ;[firstCard, secondCard] = [null, null]
    }

    function shuffle() {
      cards.forEach((card) => {
        const randomPos = Math.floor(Math.random() * 12)
        card.style.order = randomPos
      })
    }

    // Add event listeners to cards
    cards.forEach((card) => card.addEventListener("click", flipCard))

    // Shuffle cards
    shuffle()
  }
})
