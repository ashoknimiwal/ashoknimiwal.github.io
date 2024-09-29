document.addEventListener('DOMContentLoaded', function() {
    // Profile picture pop-out effect
    const profilePic = document.getElementById('profilePic');
    profilePic.style.opacity = '0';
    setTimeout(() => {
        profilePic.style.opacity = '1';
        profilePic.style.animation = 'popOut 2s ease-out';
    }, 200);

    // Abstract toggle
    const abstractButtons = document.querySelectorAll('.btn-abstract');
    abstractButtons.forEach(button => {
        button.addEventListener('click', function() {
            const abstract = this.parentElement.nextElementSibling;
            if (abstract.style.display === 'none' || abstract.style.display === '') {
                abstract.style.display = 'block';
                this.innerHTML = '<i class="fas fa-book"></i> Hide Abstract';
            } else {
                abstract.style.display = 'none';
                this.innerHTML = '<i class="fas fa-book-open"></i> Abstract';
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Home link scroll to top
    const homeLink = document.getElementById('home-link');
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Load blog posts
    loadBlogPosts();
});

async function loadBlogPosts() {
    try {
        const response = await fetch('/api/blog-posts');
        const blogPosts = await response.json();
        const blogGrid = document.querySelector('.blog-grid');

        blogPosts.forEach(post => {
            const blogCard = createBlogCard(post);
            blogGrid.appendChild(blogCard);
        });
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.innerHTML = `
        <img src="${post.image}" alt="${post.title}">
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
    `;
    return card;
}