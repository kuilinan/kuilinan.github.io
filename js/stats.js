// 🌟 小花园开放时间（改成你真正的上线时间！）
const LAUNCH_TIME = new Date(2026, 1, 16, 12, 0, 0); // 2026年2月16日12:00

// 📚 所有文章的列表（每新增一篇文章就在这里加一条）
const POSTS = [
    {
        title: "🎉 小花园开张啦 · 博客上线纪念",
        url: "posts/上线.html",
        date: "2026-02-16",
        category: "宝宝日记"
    },
    {
        title: "🍼 一枚超级小宝宝的自我介绍",
        url: "posts/自我介绍-温暖小角落.html",
        date: "2025-06-15",
        category: "宝宝日记"
    }
    // ✨ 以后有新文章就在这里继续添加，格式照抄～
];

// 运行时长更新函数
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
 // 统计文章数和总字数（带数字滚动动画）
async function calculateStats() {
    const totalPostsEl = document.getElementById('totalPosts');
    const totalWordsEl = document.getElementById('totalWords');
    const postListEl = document.getElementById('postWordList');

    if (!totalPostsEl || !totalWordsEl) return;

    // 先显示文章总数（直接显示，不滚动，因为一般很少）
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

    // 数字滚动动画：总字数
    animateNumber(totalWordsEl, 0, totalWords, 1500); // 1.5秒内从0滚动到总字数

    if (postListEl) {
        postListEl.innerHTML = postDetails.map(p => `
            <div class="post-word-item">
                <span class="post-word-title"><a href="${p.url}">${p.title}</a></span>
                <span class="post-word-count">${p.words} 字</span>
            </div>
        `).join('');
    }
}

// 数字滚动动画函数
function animateNumber(element, start, end, duration) {
    if (!element) return;
    const range = end - start;
    const increment = range / (duration / 16); // 每帧约16ms
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
// 页面加载后执行
window.addEventListener('DOMContentLoaded', () => {
    updateRunTime();
    setInterval(updateRunTime, 1000);
    calculateStats();
});