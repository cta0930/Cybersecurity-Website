// Cybersecurity based quiz with added functionality needed to use W3, two articles from Geeks for Geeks, and slay a dragon to get this to work correctly. The site that I used the most: https://hackr.io/blog/how-to-build-a-javascript-quiz-app // However, I didn't want to add the questions in the JS, i wanted to keep them in the html and use the js for gathering the input, calculating the score, and providing a simple output based on the score. I later added two additional functions: quiz reset and auto snap to the next question.
document.getElementById("quiz-submit-btn").addEventListener("click", function () {
    const questions = document.querySelectorAll('.quiz-question input[type="radio"]');
    const answers = {};
    let allAnswered = true;
    // Gather all answers
    questions.forEach((input) => {
        const name = input.name;
        if (!answers[name] && input.checked) {
            answers[name] = parseInt(input.value, 10);
        }
    });
    // Validate if all questions have been answered
    const totalQuestions = document.querySelectorAll('.quiz-question h3').length;
    if (Object.keys(answers).length !== totalQuestions) {
        alert("Please answer all questions before submitting!");
        return;
    }
    // Calculate and display the score
    const score = calculateScore(answers);
    showResults(score, totalQuestions);
});
// Calculate total score
function calculateScore(answers) {
    return Object.values(answers).reduce((total, value) => total + value, 0);
}
// Display test results
function showResults(score, totalQuestions) {
    const resultsDiv = document.getElementById("quiz-results");
    const scoreDisplay = document.getElementById("score");
    const adviceDisplay = document.getElementById("advice");
    resultsDiv.classList.remove("hidden");
    scoreDisplay.textContent = `Your score is: ${score}/${totalQuestions * 2}`;
    // Advice based on score
    if (score >= totalQuestions * 1.5) {
        adviceDisplay.textContent = "Excellent! Your cyber hygiene is looking solid. Keep it up!";
    } else if (score >= totalQuestions) {
        adviceDisplay.textContent = "Good job! There is some room for improvement though. Review some best practices for cybersecurity.";
    } else {
        adviceDisplay.textContent = "You could benefit from improving your cyber hygiene. Start by using strong passwords and enabling 2FA/MFA.";
    }
}
// Quiz reset and return to top using W3 to create the JS
function resetQuiz() {
    document.getElementById("cyber-hygiene-quiz-form").reset();
    const resultsDiv = document.getElementById("quiz-results");
    resultsDiv.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}
// Adding the ability to auto snap to next question. Used: https://www.w3schools.com/jsref/met_element_scrollintoview.asp
const questions = document.querySelectorAll(".quiz-question");
questions.forEach((question, index) => {
    const inputs = question.querySelectorAll("input[type='radio']");
    inputs.forEach((input) => {
        input.addEventListener("change", () => {
            if (index < questions.length - 1) {
                questions[index + 1].scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
                document.getElementById("quiz-submit-btn").scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
    });
});