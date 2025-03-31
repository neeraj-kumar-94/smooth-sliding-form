        document.addEventListener("DOMContentLoaded", () => {
            let currentIndex = 0;
            const slides = document.querySelectorAll(".slide");
            const totalSlides = slides.length;
            const prevBtn = document.getElementById("prevBtn");
            const nextBtn = document.getElementById("nextBtn");
            const form = document.getElementById("contactForm");
            let isSubmitting = false; // Prevent multiple submissions

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

            function updateSlider() {
                document.querySelector(".slides").style.transform = `translateX(-${currentIndex * 100}%)`;
                prevBtn.style.display = currentIndex === 0 ? "none" : "inline-block";
                nextBtn.style.display = currentIndex === totalSlides - 1 ? "none" : "inline-block";
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
                        isSubmitting = false;
                    })
                    .catch(error => {
                        updateMessage("Error: " + error, true);
                        isSubmitting = false;
                    });
            });

            updateSlider();
        });
