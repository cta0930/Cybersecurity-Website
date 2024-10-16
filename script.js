// Load RSS feeds using the API from rss2json restricted to http for security
loadRSSFeed('rss-feed-1', 'https://feeds.feedburner.com/TheHackersNews', 'q1jeju8ttovjd2z0u6c14g3qczdyt1uowjucs9mp');
loadRSSFeed('rss-feed-2', 'https://www.bleepingcomputer.com/feed/', 'q1jeju8ttovjd2z0u6c14g3qczdyt1uowjucs9mp');
loadRSSFeed('rss-feed-3', 'https://www.recordedfuture.com/feed', 'q1jeju8ttovjd2z0u6c14g3qczdyt1uowjucs9mp');

// RSS feed loading with API integrated
function loadRSSFeed(feedId, feedUrl, apiKey) {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}&api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const items = data.items;
            const container = document.querySelector(`#${feedId} .rss-content`);
            container.innerHTML = ''; // Clear existing items

            items.forEach((item, index) => {
                if (index < 15) { // Limit to only 15 articles to load
                    const title = item.title;
                    const link = item.link;
                    const description = item.description || '';
                    const image = item.thumbnail || item.enclosure?.link;

                    const rssItem = document.createElement("div");
                    rssItem.classList.add("rss-item");

                    // images added if they are available
                    if (image) {
                        const img = document.createElement("img");
                        img.src = image;
                        img.alt = title;
                        rssItem.appendChild(img);
                    }

                    const rssTitle = document.createElement("h4");
                    rssTitle.textContent = title;
                    rssItem.appendChild(rssTitle);

                    const rssDesc = document.createElement("p");
                    rssDesc.textContent = description;
                    rssItem.appendChild(rssDesc);

                    const rssLink = document.createElement("a");
                    rssLink.href = link;
                    rssLink.target = "_blank";
                    rssLink.textContent = "Read more";
                    rssItem.appendChild(rssLink);

                    container.appendChild(rssItem);
                }
            });
        })
        .catch(error => console.error('Error loading RSS feed:', error));
}

// Carousel sliding functionality and adjust to make smooth
function slideCarousel(feedId, direction) {
    const container = document.querySelector(`#${feedId} .carousel-container`);
    const itemWidth = container.querySelector('.rss-item').offsetWidth + 15;
    const scrollAmount = itemWidth;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (direction === 'next') {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
            // at end of scroll, return back to start
            setTimeout(() => {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            }, 500);
        }
    } else if (direction === 'prev') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        if (container.scrollLeft === 0) {
            // reversed function from above
            setTimeout(() => {
                container.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
            }, 500);
        }
    }
}

// Mobile view menu for small screens
function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    const menuIcon = document.querySelector(".fa-bars");
    const closeIcon = document.querySelector(".fa-times");

    const navRight = window.getComputedStyle(navLinks).right;
    console.log("Current right value: ", navRight);  // Debug log

    if (navRight === "0px") {
        navLinks.style.right = "-100%";
        menuIcon.style.display = "block";
        closeIcon.style.display = "none";
    } else {
        navLinks.style.right = "0%";
        menuIcon.style.display = "none";
        closeIcon.style.display = "block";
    }
}

// return to top scroll function
var scrollToTopBtn = document.getElementById("scrollToTopBtn");
window.onscroll = function () {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 100) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};
scrollToTopBtn.addEventListener("click", function (event) {
    event.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
// pen test tools toggle for details
function toggleTool(toolId) {
    var content = document.getElementById("tool-content-" + toolId);
    var allContents = document.querySelectorAll('.pen-tool-content');

    // at each selection hide prior selection
    allContents.forEach(function (c) {
        if (c !== content) {
            c.classList.remove('active');
        }
    });
    content.classList.toggle('active');
}
