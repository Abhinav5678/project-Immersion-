const TOPICS = [
    'All', 'General', 'Technology', 'Business', 'Sports', 'Entertainment', 'Health', 'Science', 'World'
];

const categoryNav = document.getElementById('category-filters');
TOPICS.forEach(topic => {
    const btn = document.createElement('button');
    btn.textContent = topic;
    btn.onclick = () => selectTopic(topic);
    categoryNav.appendChild(btn);
});

function selectTopic(topic) {
    Array.from(categoryNav.children).forEach(btn => {
        btn.classList.toggle('active', btn.textContent === topic);
    });
    fetchAndRenderNews(topic);
}

async function fetchNews(topic) {
    const API_KEY = 'a9cbba0a1a7d4471ad161fcdbc1aec36';
    const categoryMap = {
        'General': 'general',
        'Technology': 'technology',
        'Business': 'business',
        'Sports': 'sports',
        'Entertainment': 'entertainment',
        'Health': 'health',
        'Science': 'science',
        'World': 'general'
    };
    let url;
    if (topic === 'All') {
        url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=8&apiKey=${API_KEY}`;
    } else {
        const category = categoryMap[topic] || 'general';
        url = `https://newsapi.org/v2/top-headlines?category=${encodeURIComponent(category)}&country=us&pageSize=8&apiKey=${API_KEY}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === "ok") {
            return data.articles.map(article => ({
                title: article.title,
                description: article.description,
                url: article.url,
                urlToImage: article.urlToImage || 'https://via.placeholder.com/400x180?text=No+Image',
            }));
        } else {
            return [{
                title: "Error fetching news",
                description: data.message || "Unknown error",
                url: "#",
                urlToImage: "https://via.placeholder.com/400x180?text=Error",
            }];
        }
    } catch (err) {
        return [{
            title: "Network Error",
            description: err.message,
            url: "#",
            urlToImage: "https://via.placeholder.com/400x180?text=Error",
        }];
    }
}

async function fetchAndRenderNews(topic) {
    const newsFeed = document.getElementById('news-feed');
    newsFeed.innerHTML = '<p>Loading...</p>';
    const articles = await fetchNews(topic);
    newsFeed.innerHTML = '';
    articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <img src="${article.urlToImage}" alt="News Image">
            <div class="news-card-content">
                <div class="news-card-title">${article.title}</div>
                <div class="news-card-desc">${article.description}</div>
                <a class="news-card-link" href="${article.url}" target="_blank">Read more</a>
            </div>
        `;
        newsFeed.appendChild(card);
    });
}

selectTopic('All');

const loginForm = document.getElementById('login-form');
const loginStatus = document.getElementById('login-status');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        if (email && password) {
            loginStatus.textContent = 'Login successful! (Demo only)';
            loginStatus.style.color = '#1a7f37';
            loginForm.reset();
        } else {
            loginStatus.textContent = 'Please enter both email and password.';
            loginStatus.style.color = '#b33f3f';
        }
    });
}