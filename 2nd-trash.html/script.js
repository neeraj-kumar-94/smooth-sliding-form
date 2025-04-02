document.addEventListener("DOMContentLoaded", () => {
    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const form = document.getElementById("contactForm");
    const submitBtn = form.querySelector("button[type='submit']");
    const progressBar = document.querySelector(".progress-bar");
    const progressSteps = document.querySelectorAll(".progress-step");
    const messageContainer = document.getElementById("form-message");
    let isSubmitting = false;

    function updateProgressBar() {
        // Calculate progress
        const progress = ((currentIndex + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;

        // Update step labels
        progressSteps.forEach((step, index) => {
            if (index <= currentIndex) {
                step.classList.add("active");
            } else {
                step.classList.remove("active");
            }
        });
    }

    function showMessage(text, type = "error") {
        messageContainer.textContent = text;
        messageContainer.className = "message-container";
        messageContainer.classList.add(`${type}-message`);
        messageContainer.style.display = "block";

        // Hide message after 5 seconds if it's not a loading message
        if (type !== "loading") {
            setTimeout(() => {
                messageContainer.style.display = "none";
            }, 5000);
        }
    }

    function hideMessage() {
        messageContainer.style.display = "none";
    }

    function validateInput() {
        const currentSlide = slides[currentIndex];
        const input = currentSlide.querySelector(".inp-style[required]");

        if (input) {
            if (!input.value.trim()) {
                showMessage("Please fill this field", "error");
                return false;
            }

            // Email validation
            if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                showMessage("Please enter a valid email address", "error");
                return false;
            }

            // Phone validation (simple check for at least 6 digits)
            if (input.type === "tel" && !/^[\d\s\-+]{6,}$/.test(input.value)) {
                showMessage("Please enter a valid phone number", "error");
                return false;
            }
        }

        hideMessage();
        return true;
    }

    function updateSlider() {
        document.querySelector(".slides").style.transform = `translateX(-${currentIndex * 100}%)`;
        prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
        nextBtn.style.display = currentIndex === totalSlides - 1 ? "none" : "inline-block";
        updateProgressBar();
    }

    function nextSlide() {
        if (validateInput() && currentIndex < totalSlides - 1) {
            currentIndex++;
            updateSlider();
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
            hideMessage();
        }
    }

    // Make functions global for button onclick events
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        isSubmitting = true;
        submitBtn.disabled = true;
        showMessage("Submitting form...", "loading");

        let formData = new FormData(form);
        let data = {};
        formData.forEach((value, key) => { data[key] = value });

        fetch("https://script.google.com/macros/s/AKfycbzOdBjQt-CZaAQ7yKudIsLXcL-wl_1BKRECVp0ofXe7xURBP5bLtkn1YHKvcIvJ_DzP/exec", {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        })
            .then(() => {
                showMessage("Form submitted successfully!", "success");
                form.reset();
                currentIndex = 0;
                updateSlider();
            })
            .catch(error => {
                showMessage("Error submitting form. Please try again.", "error");
                console.error("Submission error:", error);
            })
            .finally(() => {
                isSubmitting = false;
                submitBtn.disabled = false;
            });
    });

    // Initialize
    updateSlider();
});