// JS for contact form
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit");
    const errorDiv = document.getElementById("error");
    const successMsg = document.getElementById("success-msg");
    submitBtn.addEventListener("click", async () => {
        // Clear previous messages
        errorDiv.textContent = "";
        successMsg.textContent = "";
        // Collect form data
        const formData = new FormData(form);
        // Send data to PHP
        try {
            const response = await fetch("php/contact-handler.php", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (result.status === "success") {
                successMsg.textContent = result.message;
                successMsg.style.color = "green";
                form.reset();
            } else {
                errorDiv.textContent = result.message;
                errorDiv.style.color = "red";
            }
        } catch (error) {
            errorDiv.textContent = "An unexpected error occurred. Please try again.";
            errorDiv.style.color = "red";
        }
    });
});