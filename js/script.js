// Full JS for webpage but will have additional JS files for specific content.
// References for a majority of this work comes from https://www.w3schools.com/js/
document.addEventListener("DOMContentLoaded", () => {
    // Scroll to top button functionality
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (scrollToTopBtn) {
        window.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            scrollToTopBtn.style.display = scrollTop > 100 ? "block" : "none";
        };
        scrollToTopBtn.addEventListener("click", function (event) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" }); // https://www.w3schools.com/jsref/met_win_scrollto.asp
        });
    }
    // Pen test tools toggle for details using: https://devcamp.com/trails/javascript-in-the-browser/campsites/javascript-dom/guides/how-to-use-javascript-s-toggle-function
    function toggleTool(toolId) {
        const content = document.getElementById("tool-content-" + toolId);
        const allContents = document.querySelectorAll(".pen-tool-content");
        if (content) {
            // Hide other sections and show the current one
            allContents.forEach(function (c) {
                if (c !== content) {
                    c.classList.remove("active");
                }
            });
            content.classList.toggle("active");
        }
    }
    const penTools = document.querySelectorAll(".pen-tool");
    penTools.forEach((tool) => {
        const toolId = tool.getAttribute("onclick").match(/\d+/)[0];
        tool.addEventListener("click", () => toggleTool(toolId));
    });
    // Navigate to Quiz Button using W3 js examples
    const navigateToQuizBtn = document.getElementById("navigateToQuizBtn");
    if (navigateToQuizBtn) {
        navigateToQuizBtn.addEventListener("click", () => {
            window.location.href = "/cyberhygienequiz.html";
        });
    }
    // Password strength checker based on similiar script from https://www.passwordmonster.com/
    const passwordCheckerInput = document.getElementById("password-checker");
    const strengthText = document.getElementById("password-strength-text");
    const crackTime = document.getElementById("password-crack-time");
    if (passwordCheckerInput && strengthText && crackTime) {
        passwordCheckerInput.addEventListener("input", () => {
            const password = passwordCheckerInput.value;
            // Calculate password strength
            const { score, text, color } = calculatePasswordStrength(password);
            // Update strength text and color
            strengthText.textContent = `Strength: ${text}`;
            strengthText.style.color = color;
            // Way to estimate time to crack password based on complexity
            crackTime.textContent = `Estimated crack time: ${estimateCrackTime(password)}`;
        });
        function calculatePasswordStrength(password) {
            let score = 0;
            if (password.length >= 8) score++;
            if (/[A-Z]/.test(password)) score++;
            if (/[a-z]/.test(password)) score++;
            if (/[0-9]/.test(password)) score++;
            if (/[^A-Za-z0-9]/.test(password)) score++;
            const strengthLevels = [
                { text: "Very Weak", color: "red" },
                { text: "Weak", color: "orange" },
                { text: "Moderate", color: "yellow" },
                { text: "Strong", color: "blue" },
                { text: "Very Strong", color: "green" },
            ];
            return strengthLevels[Math.min(score, 4)];
        }
        // to avoid creating an overly complex version of the reference i used to script this out i used https://www.geeksforgeeks.org/create-a-password-strength-checker-using-html-css-and-javascript/
        function estimateCrackTime(password) {
            const charSetSize = getCharSetSize(password);
            const combinations = Math.pow(charSetSize, password.length);
            const guessesPerSecond = 1e9;
            const timeInSeconds = combinations / guessesPerSecond;
            return formatTime(timeInSeconds);
        }
        function getCharSetSize(password) {
            let size = 0;
            if (/[A-Z]/.test(password)) size += 26;
            if (/[a-z]/.test(password)) size += 26;
            if (/[0-9]/.test(password)) size += 10;
            if (/[^A-Za-z0-9]/.test(password)) size += 32;
            return size;
        }
        function formatTime(seconds) {
            if (seconds < 60) return `${Math.round(seconds)} seconds`;
            if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
            if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
            if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
            return `${Math.round(seconds / 31536000)} years`;
        }
    }
    // Password generator tool using https://www.geeksforgeeks.org/how-to-generate-a-random-password-using-javascript/
    const passwordLengthInput = document.getElementById("password-length");
    const generatePasswordBtn = document.getElementById("generate-password-btn");
    const generatedPassword = document.getElementById("generated-password");
    if (passwordLengthInput && generatePasswordBtn && generatedPassword) {
        generatePasswordBtn.addEventListener("click", () => {
            let length = parseInt(passwordLengthInput.value, 10) || 12;
            // Limit max length to 128 characters
            if (length > 128) {
                length = 128;
                passwordLengthInput.value = 128;
                alert("password length cannot exceed 128 characters. Setting to maximum length.");
            }
            const password = generatePassword(length);
            // Display generated password
            generatedPassword.textContent = `Generated Password: ${password}`;
        });
        function generatePassword(length) {
            const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:',.<>?";
            let password = "";
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * chars.length);
                password += chars[randomIndex];
            }
            return password;
        }
    }
});