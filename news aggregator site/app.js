// ========== CONFIG ========== //
// const NEWS_API_KEY = 'YOUR_NEWSAPI_KEY_HERE'; // <-- Remove from frontend
// const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';
const NEWS_API_URL = '/api/news'; // Use backend proxy
const DEFAULT_COUNTRY = 'us';
const TOPICS = [
    'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'
];

// ========== DOM ELEMENTS ========== //
const newsFeed = document.getElementById('news-feed');
const categoryFilters = document.getElementById('category-filters');
const topicsSelect = document.getElementById('topics');
const savePreferencesBtn = document.getElementById('savePreferences');

// ========== USER PREFERENCES ========== //
function getUserPreferences() {
    const prefs = localStorage.getItem('preferredTopics');
    return prefs ? JSON.parse(prefs) : [];
}

function setUserPreferences(topics) {
    localStorage.setItem('preferredTopics', JSON.stringify(topics));
}

// ========== RENDER TOPICS ========== //
function renderTopics() {
    topicsSelect.innerHTML = '';
    TOPICS.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
        topicsSelect.appendChild(option);
    });
    // Set selected from preferences
    const prefs = getUserPreferences();
    for (let i = 0; i < topicsSelect.options.length; i++) {
        if (prefs.includes(topicsSelect.options[i].value)) {
            topicsSelect.options[i].selected = true;
        }
    }
}

// ========== RENDER CATEGORY FILTERS ========== //
function renderCategoryFilters() {
    categoryFilters.innerHTML = '';
    const prefs = getUserPreferences();
    const categories = prefs.length ? prefs : TOPICS;
    categories.forEach(topic => {
        const btn = document.createElement('button');
        btn.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
        btn.dataset.topic = topic;
        btn.onclick = () => {
            document.querySelectorAll('#category-filters button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            fetchAndRenderNews(topic);
        };
        categoryFilters.appendChild(btn);
    });
    // Activate first by default
    if (categoryFilters.firstChild) {
        categoryFilters.firstChild.classList.add('active');
        fetchAndRenderNews(categoryFilters.firstChild.dataset.topic);
    }
}

// ========== FETCH & RENDER NEWS ========== //
async function fetchAndRenderNews(topic) {
    newsFeed.innerHTML = '<p>Loading news...</p>';
    try {
        // const url = `${NEWS_API_URL}?country=${DEFAULT_COUNTRY}&category=${topic}&apiKey=${NEWS_API_KEY}`;
        const url = `${NEWS_API_URL}?category=${topic}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status !== 'ok') throw new Error(data.message || 'Failed to fetch news');
        renderNews(data.articles);
    } catch (err) {
        newsFeed.innerHTML = `<p style=\"color:red;\">Error: ${err.message}</p>`;
    }
}

function renderNews(articles) {
    if (!articles.length) {
        newsFeed.innerHTML = '<p>No news found for this category.</p>';
        return;
    }
    newsFeed.innerHTML = articles.map(article => `
        <div class="news-card">
            ${article.urlToImage ? `<img src="${article.urlToImage}" alt="">` : ''}
            <h2>${article.title}</h2>
            <p>${article.description || ''}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        </div>
    `).join('');
}

// ========== EVENT LISTENERS ========== //
savePreferencesBtn.addEventListener('click', () => {
    const selected = Array.from(topicsSelect.selectedOptions).map(opt => opt.value);
    setUserPreferences(selected);
    renderCategoryFilters();
});

// ========== INIT ========== //
renderTopics();
renderCategoryFilters();