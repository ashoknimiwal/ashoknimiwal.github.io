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

    // Load projects and blog posts
    loadProjectsAndBlogPosts();
});

async function loadProjectsAndBlogPosts() {
    try {
        const response = await fetch('static-data.json');
        const data = await response.json();
        
        const projectGrid = document.querySelector('.project-grid');
        data.projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectGrid.appendChild(projectCard);
        });

        const blogGrid = document.querySelector('.blog-grid');
        data.blogPosts.forEach(post => {
            const blogCard = createBlogCard(post);
            blogGrid.appendChild(blogCard);
        });
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function createProjectCard(project) {
    const card = document.createElement('a');
    card.className = 'project-card';
    card.href = project.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.innerHTML = `
        <img src="${project.image}" alt="${project.title}">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
    `;
    return card;
}

function createBlogCard(post) {
    const card = document.createElement('a');
    card.className = 'blog-card';
    card.href = post.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.innerHTML = `
        <img src="${post.image}" alt="${post.title}">
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
    `;
    return card;
}