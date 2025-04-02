document.addEventListener("DOMContentLoaded", () => {
    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const progressBar = document.querySelector(".progress-bar");
    const messageContainer = document.getElementById("form-message");
    let isSubmitting = false;

    // Prevent form submission on Enter key press except for submit button
    form.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.type !== 'submit' && e.target.type !== 'textarea') {
            e.preventDefault();
            if (currentIndex < totalSlides - 1) {
                nextSlide();
            }
        }
    });

    function updateProgressBar() {
        const progress = ((currentIndex + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function showMessage(text, type = "error") {
        messageContainer.textContent = text;
        messageContainer.className = "message-container";
        messageContainer.classList.add(`${type}-message`);
        messageContainer.style.display = "block";

        if (type !== "loading") {
            setTimeout(() => {
                messageContainer.style.display = "none";
            }, 5000);
        }
    }

    function hideMessage() {
        messageContainer.style.display = "none";
    }

    function validateCurrentSlide() {
        const currentSlide = slides[currentIndex];
        const inputs = currentSlide.querySelectorAll(".inp-style[required], input[type='radio'][required]");

        for (const input of inputs) {
            if (input.type === 'radio') {
                // Check if at least one radio button is selected
                const radioGroup = document.querySelectorAll(`input[name="${input.name}"]`);
                const isRadioSelected = Array.from(radioGroup).some(radio => radio.checked);
                if (!isRadioSelected) {
                    showMessage("Please select a gender", "error");
                    return false;
                }
            } else {
                if (!input.value.trim()) {
                    showMessage(`Please fill the ${input.placeholder || input.name} field`, "error");
                    return false;
                }

                if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                    showMessage("Please enter a valid email address", "error");
                    return false;
                }

                if (input.type === "tel" && !/^[\d\s\-+]{6,}$/.test(input.value)) {
                    showMessage("Please enter a valid phone number", "error");
                    return false;
                }
            }
        }

        hideMessage();
        return true;
    }

    function updateSlider() {
        slides.forEach(slide => {
            slide.classList.remove("active");
        });

        slides[currentIndex].classList.add("active");

        prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";

        if (currentIndex === totalSlides - 1) {
            nextBtn.style.display = "none";
            submitBtn.style.display = "inline-block";
        } else {
            nextBtn.style.display = "inline-block";
            submitBtn.style.display = "none";
        }

        updateProgressBar();

        // Focus on first input in current slide
        const firstInput = slides[currentIndex].querySelector('input, textarea');
        if (firstInput) {
            firstInput.focus();
        }
    }

    function nextSlide() {
        if (validateCurrentSlide()) {
            currentIndex++;
            updateSlider();
        }
    }

    function prevSlide() {
        currentIndex--;
        updateSlider();
        hideMessage();
    }

    // Event listeners for buttons
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        // Validate all slides before submission
        for (let i = 0; i < totalSlides; i++) {
            currentIndex = i;
            if (!validateCurrentSlide()) {
                updateSlider(); // Show the slide with error
                return;
            }
        }

        // All validations passed, proceed with submission
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