document.addEventListener('DOMContentLoaded', function () {
    const pagesContainer = document.getElementById('pages');
    let currentPageIndex = 0;
    let isScrolling = false;
    let startY;

    function fetchRandomWikipediaPage() {
        return fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
            .then(response => response.json())
            .then(data => data.content_urls.desktop.page)
            .catch(error => console.error('Error fetching Wikipedia page:', error));
    }

    function addPage(url) {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        const iframe = document.createElement('iframe');
        iframe.src = url;
        pageDiv.appendChild(iframe);
        pagesContainer.appendChild(pageDiv);

        pageDiv.addEventListener('click', () => {
            window.open(url, '_blank');
        });

        if (pagesContainer.children.length === 1) {
            pageDiv.classList.add('active');
        }
    }

    async function preloadPages(count) {
        for (let i = 0; i < count; i++) {
            const url = await fetchRandomWikipediaPage();
            addPage(url);
        }
    }

    function showNextPage() {
        if (isScrolling) return; 
        isScrolling = true;

        const pages = pagesContainer.children;
        if (currentPageIndex < pages.length - 1) {
            currentPageIndex++;
            pagesContainer.style.transform = `translateY(-${currentPageIndex * 100}%)`;
        } else {

            preloadPages(3);
        }

        setTimeout(() => {
            isScrolling = false;
        }, 500); 
    }

    pagesContainer.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });

    pagesContainer.addEventListener('touchmove', (e) => {

        e.preventDefault();
    });

    pagesContainer.addEventListener('touchend', (e) => {
        const endY = e.changedTouches[0].clientY;
        if (startY - endY > 50) { 
            showNextPage();
        }
    });

    pagesContainer.addEventListener('wheel', (e) => {
        if (e.deltaY > 0) { 
            showNextPage();
        }
    });

    preloadPages(3);
});
