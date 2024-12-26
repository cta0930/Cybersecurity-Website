// Function to load RSS feed implementing PHP to fix CORS issues on two feeds. Sources include: https://dev.to/geekgalgroks/building-an-rss-reader-in-javascript-1ep0 / https://medium.com/@webdev_59507/integrating-a-medium-rss-feed-into-a-website-27a559810e73 / 
function loadRSSFeeds() {
    fetch('/php/rss-feed.php') // I had a couple issues and quickly ran out of time (patience) trying to debug and fix only to keep having the same CORS issues. So i turned to php after reading some comments on Stack Overflow. 
        .then(response => response.json())
        .then(data => {
            data.forEach((feed, index) => {
                const container = document.querySelector(`#rss-feed-${index + 1} .rss-content`);
                container.innerHTML = '';
                if (Array.isArray(feed)) {
                    feed.forEach(item => {
                        const rssItem = document.createElement("div");
                        rssItem.classList.add("rss-item");
                        const img = document.createElement("img");
                        img.src = item.image || 'https://cdn.pixabay.com/photo/2020/02/21/17/06/security-4868165_1280.jpg'; // placeholder image however, php will cover this too
                        img.alt = item.title;
                        img.loading = 'lazy';
                        rssItem.appendChild(img);
                        const title = document.createElement("h4");
                        title.textContent = item.title;
                        rssItem.appendChild(title);
                        const description = document.createElement("p");
                        description.textContent = item.description;
                        rssItem.appendChild(description);
                        const link = document.createElement("a");
                        link.href = item.link;
                        link.target = "_blank";
                        link.textContent = "Read more";
                        rssItem.appendChild(link);
                        container.appendChild(rssItem);
                    });
                } else {
                    const errorMsg = document.createElement("p");
                    errorMsg.textContent = "Error loading RSS feed.";
                    container.appendChild(errorMsg);
                }
            });
        })
        .catch(error => {
            console.error('Error loading RSS feeds:', error);
        });
}
// LoadRSSFeeds function and impement carousel (somehow). Using and modifying from: https://codepen.io/ix4/pen/abzxbwy
document.addEventListener("DOMContentLoaded", loadRSSFeeds);
function slideCarousel(feedId, direction) {
    const container = document.querySelector(`#${feedId} .carousel-container`);
    if (!container) {
        console.error(`Carousel container with ID ${feedId} not found.`);
        return;
    }
    const itemWidth = container.querySelector('.rss-item')?.offsetWidth + 15;
    if (!itemWidth) {
        console.error(`Failed to get item width. Is there at least one .rss-item in the container?`);
        return;
    }
    const scrollAmount = itemWidth;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    if (direction === 'next') {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
            setTimeout(() => {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            }, 500);
        }
    } else if (direction === 'prev') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        if (container.scrollLeft === 0) {
            setTimeout(() => {
                container.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
            }, 500);
        }
    }
}