// Browser analysis tool full JS
// listening for click to analyz-btn
document.getElementById("analyze-btn").addEventListener("click", () => {
    document.getElementById("clear-btn").style.display = "inline-block";
    analyzeBrowser();
});
// listen for click to clear-btn and clears results and map
document.getElementById("clear-btn").addEventListener("click", () => {
    document.getElementById("results").querySelectorAll(".result-section ul").forEach((ul) => {
        ul.innerHTML = "";
    });
    document.getElementById("map").style.display = "none";
    document.getElementById("clear-btn").style.display = "none";
});
// define function and items to display. I will number each and outline below. More can be added but for the sake of saving time we will limit to six.
function analyzeBrowser() {
    displayBrowserInfo();         //One:   https://github.com/bowser-js/bowser
    displayNetworkInfo();         //Two:   Uses ipapi.co see: https://ipapi.co/api/#complete-location5 adapted from the JS example.
    displayFingerprintingData();  //Three: Source = https://www.kelche.co/blog/web/fingerprinting/
    displayTrackingHistory();     //Four:  Source = https://peterthaleikis.com/posts/how-to-check-do-not-track-(dnt)-in-javascript/
    displaySecurityHeaders();     //Five   Completely simulated and not functional. My idea was to find a way to integrate security headers related to referrer policy and CSP. I need to find a different way to talk about browser security measures honestly.
    displayRecommendations();     //Six    Using object references from https://www.w3schools.com/jsref/prop_html_innerhtml.asp for DOM element.
}
// 1. Browser information
function displayBrowserInfo() {
    const browserInfo = document.querySelector("#browser-info ul");
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const cookiesEnabled = navigator.cookieEnabled ? "Yes" : "No";
    browserInfo.innerHTML = `
    <li><strong>User Agent:</strong> ${userAgent}</li>
    <li><strong>Language:</strong> ${language}</li>
    <li><strong>Cookies Enabled:</strong> ${cookiesEnabled}</li>
  `;
}
// 2. Network information
function displayNetworkInfo() {
    // uses fetch to send request to ipapi then extracts the data to be displayed in the hidden html fields once user interaction occurs via analyze-btn
    const networkInfo = document.querySelector("#network-info ul");
    fetch("https://ipapi.co/json/")
        .then((response) => response.json())
        .then((data) => {
            //adding bold to better stand out
            networkInfo.innerHTML = `
        <li><strong>IP Address:</strong> ${data.ip}</li>
        <li><strong>City:</strong> ${data.city}</li>
        <li><strong>Region:</strong> ${data.region}</li>
        <li><strong>Country:</strong> ${data.country_name}</li>
        <li><strong>ISP:</strong> ${data.org}</li>
      `;
            //following leafletjs.com with minor adjustments. We fetched the IP data from ipapi in json format which includes the lat/long. Leaflet will center on this location using setView with zoom level 13. From there the rest of this is simple using Leaflets reference.
            const mapDiv = document.getElementById("map");
            mapDiv.style.display = "block";
            const map = L.map("map").setView([data.latitude, data.longitude], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
            L.marker([data.latitude, data.longitude]).addTo(map).bindPopup("Your Approximate Location").openPopup();
        })
        .catch(() => {
            networkInfo.innerHTML = "<li>Unable to retrieve network information.</li>";
        });
}
// 3. Fingerprinting data
function displayFingerprintingData() {
    const fingerprintingInfo = document.querySelector("#fingerprinting-info ul");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.fillText("Browser Fingerprinting", 10, 50);
    const canvasData = canvas.toDataURL();
    fingerprintingInfo.innerHTML = `
    <li><strong>Canvas Fingerprint:</strong> ${canvasData.slice(0, 50)}</li>
    <li><strong>Screen Resolution:</strong> ${window.screen.width}x${window.screen.height}</li>
    <li><strong>Time Zone:</strong> ${Intl.DateTimeFormat().resolvedOptions().timeZone}</li>
    <li><strong>WebGL Renderer:</strong> ${getWebGLRenderer()}</li>
  `;
}
// Helper used for WebGL rendering info
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

    trackingInfo.innerHTML = `
    <li><strong>Referrer:</strong> ${document.referrer || "None"}</li>
    <li><strong>Cookies in Use:</strong> ${document.cookie.split("; ").length || 0}</li>
    <li><strong>Do Not Track:</strong> ${navigator.doNotTrack || "Not Enabled"}</li>
  `;
}
// 5. Security header information
function displaySecurityHeaders() {
    const securityInfo = document.querySelector("#security-headers ul");
    securityInfo.innerHTML = `
    <li><strong>Referrer Policy:</strong> Simulated</li>
    <li><strong>Content Security Policy:</strong> Simulated</li>
  `;
}
// 6. Privacy recommendations general statements
function displayRecommendations() {
    const recommendations = document.querySelector("#recommendations ul");
    recommendations.innerHTML = `
    <li>Use privacy-focused browsers like Brave or Firefox.</li>
    <li>Install browser extensions like Privacy Badger.</li>
    <li>Disable cookies and tracking in your browser settings.</li>
    <li>Use a VPN to mask your IP address.</li>
    <li>Enable two-factor authentication for accounts.</li>
  `;
}