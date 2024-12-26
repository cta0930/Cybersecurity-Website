// Header word play us typed.js library from mattboldt.github.io/typed.js/docs/
document.addEventListener("DOMContentLoaded", function () {
    var typed = new Typed(".skills", {
        strings: ["Cybersecurity Professional", "Digital Privacy Consultant", "Marine Veteran"],
        typeSpeed: 100,
        backSpeed: 100,
        backDelay: 1000,
        loop: true
    });
});
// Resume download button script
function downloadResume() {
    const link = document.createElement('a');
    link.href = '../documents/Cody_Tilley_Resume.pdf'; //double check document is saved with correct name
    link.download = 'Cody_Tilley_Resume.pdf';
    link.click();
}
// Navigate to contact page
function navtoContact() {
    window.location.href = "../contact.html";
}
// Get the side navigation
const sideNav = document.getElementById("side-nav");
const homeSection = document.querySelector(".Home");
window.addEventListener("scroll", () => {
    // Check if we have scrolled past the Home section
    if (window.scrollY > homeSection.offsetHeight) {
        sideNav.classList.add("visible"); // Show the side navigation
    } else {
        sideNav.classList.remove("visible"); // Hide the side navigation
    }
});
// Salary calculator project mostly borrowed from https://github.com/shuddha2021/Statewise-Tax-Calculator/blob/main/index.html //
function calculateSalary() {
    var hourlyPay = parseFloat(document.getElementById("hourly-pay").value);
    var hoursPerWeek = parseFloat(document.getElementById("hours-per-week").value);
    var state = document.getElementById("state").value;
    if (isNaN(hourlyPay) || isNaN(hoursPerWeek) || !state) {
        alert("Please enter valid data for all fields.");
        return;
    }
    // Basic salary calculations weekly, monthly, annually
    const weeklyGross = hourlyPay * hoursPerWeek;
    const monthlyGross = weeklyGross * 4;
    const annualGross = weeklyGross * 52;
    // Tax state and federal
    const federalTax = calculateFederalTax(annualGross);
    const stateTax = annualGross * getStateTaxRate(state);  // Calculate state tax based on the selected state
    const medicareTax = annualGross * 0.0145;  // 1.45% Medicare tax
    const socialSecurityTax = annualGross * 0.062;  // 6.2% Social security tax
    const totalTax = federalTax + stateTax + medicareTax + socialSecurityTax;
    const annualNet = annualGross - totalTax;
    const monthlyNet = annualNet / 12;
    const weeklyNet = annualNet / 52;
    // Update the results in the HTML
    document.getElementById("weekly-pay").innerText = `$${weeklyNet.toFixed(2)}`;
    document.getElementById("monthly-pay").innerText = `$${monthlyNet.toFixed(2)}`;
    document.getElementById("annual-pay").innerText = `$${annualNet.toFixed(2)}`;
}
// Federal tax calculations brackets are from the IRS website
function calculateFederalTax(income) {
    if (income <= 9875) return income * 0.1;
    if (income <= 40125) return 987.5 + (income - 9875) * 0.12;
    if (income <= 85525) return 4617.5 + (income - 40125) * 0.22;
    if (income <= 163300) return 14605.5 + (income - 85525) * 0.24;
    if (income <= 207350) return 33271.5 + (income - 163300) * 0.32;
    if (income <= 518400) return 47367.5 + (income - 207350) * 0.35;
    return 156235 + (income - 518400) * 0.37;
}
// State tax rate function for all 50 states **courtesy of Github and does NOT factor in state tax brackets for simplicity. *this will produce slightly skewed income information
function getStateTaxRate(state) {
    const stateTaxRates = {
        "Alabama": 0.05,
        "Alaska": 0.00,
        "Arizona": 0.025,
        "Arkansas": 0.055,
        "California": 0.09,
        "Colorado": 0.045,
        "Connecticut": 0.05,
        "Delaware": 0.052,
        "Florida": 0.00,
        "Georgia": 0.0575,
        "Hawaii": 0.08,
        "Idaho": 0.06,
        "Illinois": 0.0495,
        "Indiana": 0.0323,
        "Iowa": 0.07,
        "Kansas": 0.053,
        "Kentucky": 0.05,
        "Louisiana": 0.045,
        "Maine": 0.0715,
        "Maryland": 0.055,
        "Massachusetts": 0.05,
        "Michigan": 0.0425,
        "Minnesota": 0.075,
        "Mississippi": 0.05,
        "Missouri": 0.054,
        "Montana": 0.0675,
        "Nebraska": 0.0684,
        "Nevada": 0.00,
        "New Hampshire": 0.00,
        "New Jersey": 0.0637,
        "New Mexico": 0.049,
        "New York": 0.0685,
        "North Carolina": 0.0525,
        "North Dakota": 0.0227,
        "Ohio": 0.045,
        "Oklahoma": 0.05,
        "Oregon": 0.09,
        "Pennsylvania": 0.0307,
        "Rhode Island": 0.055,
        "South Carolina": 0.07,
        "South Dakota": 0.00,
        "Tennessee": 0.00,
        "Texas": 0.00,
        "Utah": 0.0495,
        "Vermont": 0.062,
        "Virginia": 0.0575,
        "Washington": 0.00,
        "West Virginia": 0.06,
        "Wisconsin": 0.0627,
        "Wyoming": 0.00
    };
    return stateTaxRates[state] || 0;
}