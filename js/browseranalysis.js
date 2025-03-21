// Browser analysis tool full JS
document.getElementById("analyze-btn").addEventListener("click", () => {
    document.getElementById("clear-btn").style.display = "inline-block";
    analyzeBrowser();
});

document.getElementById("clear-btn").addEventListener("click", () => {
    document.querySelectorAll("#results .result-section ul").forEach((ul) => {
        ul.replaceChildren(); // clears safely
    });
    document.getElementById("map").style.display = "none";
    document.getElementById("clear-btn").style.display = "none";
});

function analyzeBrowser() {
    displayBrowserInfo();
    displayNetworkInfo();
    displayFingerprintingData();
    displayTrackingHistory();
    displaySecurityHeaders();
    displayRecommendations();
}

// 1. Browser information
function displayBrowserInfo() {
    const browserInfo = document.querySelector("#browser-info ul");
    browserInfo.replaceChildren();

    const items = [
        ["User Agent", navigator.userAgent],
        ["Language", navigator.language],
        ["Cookies Enabled", navigator.cookieEnabled ? "Yes" : "No"],
    ];
    items.forEach(([label, value]) => addListItem(browserInfo, label, value));
}

// 2. Network information
function displayNetworkInfo() {
    const networkInfo = document.querySelector("#network-info ul");
    networkInfo.replaceChildren();

    fetch("https://ipapi.co/json/")
        .then((response) => response.json())
        .then((data) => {
            const items = [
                ["IP Address", data.ip],
                ["City", data.city],
                ["Region", data.region],
                ["Country", data.country_name],
                ["ISP", data.org],
            ];
            items.forEach(([label, value]) => addListItem(networkInfo, label, value));

            const mapDiv = document.getElementById("map");
            mapDiv.style.display = "block";
            const map = L.map("map").setView([data.latitude, data.longitude], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
            L.marker([data.latitude, data.longitude]).addTo(map).bindPopup("Your Approximate Location").openPopup();
        })
        .catch(() => {
            addListItem(networkInfo, "", "Unable to retrieve network information.");
        });
}

// 3. Fingerprinting data
function displayFingerprintingData() {
    const fingerprintingInfo = document.querySelector("#fingerprinting-info ul");
    fingerprintingInfo.replaceChildren();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.fillText("Browser Fingerprinting", 10, 50);
    const canvasData = canvas.toDataURL();

    const items = [
        ["Canvas Fingerprint", canvasData.slice(0, 50)],
        ["Screen Resolution", `${window.screen.width}x${window.screen.height}`],
        ["Time Zone", Intl.DateTimeFormat().resolvedOptions().timeZone],
        ["WebGL Renderer", getWebGLRenderer()],
    ];
    items.forEach(([label, value]) => addListItem(fingerprintingInfo, label, value));
}

// Helper for WebGL info
function getWebGLRenderer() {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    if (!gl) return "Not supported";
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Unavailable";
}

// 4. Tracking history
function displayTrackingHistory() {
    const trackingInfo = document.querySelector("#tracking-info ul");
    trackingInfo.replaceChildren();

    const items = [
        ["Referrer", document.referrer || "None"],
        ["Cookies in Use", document.cookie ? document.cookie.split("; ").length.toString() : "0"],
        ["Do Not Track", navigator.doNotTrack || "Not Enabled"],
    ];
    items.forEach(([label, value]) => addListItem(trackingInfo, label, value));
}

// 5. Simulated security header info
function displaySecurityHeaders() {
    const securityInfo = document.querySelector("#security-headers ul");
    securityInfo.replaceChildren();

    const items = [
        ["Referrer Policy", "Simulated"],
        ["Content Security Policy", "Simulated"],
    ];
    items.forEach(([label, value]) => addListItem(securityInfo, label, value));
}

// 6. Privacy recommendations
function displayRecommendations() {
    const recommendations = document.querySelector("#recommendations ul");
    recommendations.replaceChildren();

    const list = [
        "Use privacy-focused browsers like Brave or Firefox.",
        "Install browser extensions like Privacy Badger.",
        "Disable cookies and tracking in your browser settings.",
        "Use a VPN to mask your IP address.",
        "Enable two-factor authentication for accounts.",
    ];
    list.forEach((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        recommendations.appendChild(li);
    });
}

// Safe helper for adding labeled <li>
function addListItem(parent, label, value) {
    const li = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = label ? `${label}: ` : "";
    li.appendChild(strong);
    li.appendChild(document.createTextNode(value));
    parent.appendChild(li);
}
