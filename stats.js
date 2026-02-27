function updateRunTime() {
    const now = new Date();
    const diffMs = now - LAUNCH_TIME;
    if (diffMs < 0) {
        document.getElementById('runDays').innerText = '0';
        document.getElementById('runDetail').innerText = '还没开始～';
        return;
    }
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById('runDays').innerText = days;
    document.getElementById('runDetail').innerText = `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;
}

async function calculateStats() {
    const totalPostsEl = document.getElementById('totalPosts');
    const totalWordsEl = document.getElementById('totalWords');
    const postListEl = document.getElementById('postWordList');

    if (!totalPostsEl || !totalWordsEl) return;

    totalPostsEl.innerText = POSTS.length;

    let totalWords = 0;
    let postDetails = [];

    for (let post of POSTS) {
        try {
            const response = await fetch(post.url);
            const html = await response.text();
            const chineseChars = (html.match(/[\u4e00-\u9fa5]/g) || []).length;
            totalWords += chineseChars;
            postDetails.push({ title: post.title, url: post.url, words: chineseChars });
        } catch (e) {
            console.error('获取文章失败:', post.url, e);
            postDetails.push({ title: post.title, url: post.url, words: 0 });
        }
    }

    animateNumber(totalWordsEl, 0, totalWords, 1500);

    if (postListEl) {
        postListEl.innerHTML = postDetails.map(p => `
            <div class="post-word-item">
                <span class="post-word-title"><a href="${p.url}">${p.title}</a></span>
                <span class="post-word-count">${p.words} 字</span>
            </div>
        `).join('');
    }
}

function animateNumber(element, start, end, duration) {
    if (!element) return;
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.innerText = end;
            clearInterval(timer);
        } else {
            element.innerText = Math.floor(current);
        }
    }, 16);
}

window.addEventListener('DOMContentLoaded', () => {
    updateRunTime();
    setInterval(updateRunTime, 1000);
    calculateStats();
});