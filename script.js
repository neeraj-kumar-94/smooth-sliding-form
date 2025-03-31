document.addEventListener("DOMContentLoaded", () => {
    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const form = document.getElementById("contactForm");
    const submitBtn = form.querySelector("button[type='submit']");
    let isSubmitting = false; // Prevent multiple submissions

    // Create a progress bar
    const progressBarContainer = document.createElement("div");
    progressBarContainer.style.width = "100%";
    progressBarContainer.style.height = "5px";
    progressBarContainer.style.background = "#FDF8F7";
    progressBarContainer.style.position = "relative";
    progressBarContainer.style.marginBottom = "10px";

    const progressBar = document.createElement("div");
    progressBar.style.height = "100%";
    progressBar.style.width = "0%";
    progressBar.style.background = "#5D3E31";
    progressBar.style.transition = "width 0.3s ease-in-out";

    progressBarContainer.appendChild(progressBar);
    form.parentNode.insertBefore(progressBarContainer, form);

    // Create a message container
    const messageContainer = document.createElement("div");
    messageContainer.id = "form-message";
    messageContainer.style.marginTop = "10px";
    messageContainer.style.padding = "10px";
    messageContainer.style.textAlign = "center";
    form.appendChild(messageContainer);

    function updateMessage(text, isError = false) {
        messageContainer.textContent = text;
        messageContainer.style.color = isError ? "red" : "green";
    }

    function updateProgressBar() {
        let progress = ((currentIndex + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function updateSlider() {
        document.querySelector(".slides").style.transform = `translateX(-${currentIndex * 100}%)`;
        prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
        nextBtn.style.display = currentIndex === totalSlides - 1 ? "none" : "inline-block";
        updateProgressBar();
    }

    function validateInput() {
        const input = slides[currentIndex].querySelector(".inp-style[required]");
        if (input && !input.value.trim()) {
            updateMessage("Please fill this field", true);
            return false;
        }
        return true;
    }

    nextBtn.addEventListener("click", () => {
        if (validateInput() && currentIndex < totalSlides - 1) {
            currentIndex++;
            updateSlider();
            updateMessage(""); // Clear message
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
            updateMessage(""); // Clear message
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (isSubmitting) return; // Prevent multiple submissions
        isSubmitting = true;
        submitBtn.disabled = true; // Disable submit button
        updateMessage("Submitting form...");

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
                updateMessage("Form submitted successfully!");
                form.reset(); // Reset the form fields
                currentIndex = 0; // Reset to first slide
                updateSlider();
            })
            .catch(error => {
                updateMessage("Error: " + error, true);
            })
            .finally(() => {
                isSubmitting = false;
                submitBtn.disabled = false; // Re-enable submit button after submission
            });
    });

    updateSlider();
});
