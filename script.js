document.addEventListener('DOMContentLoaded', function() {
    // ... (keep existing code for profile picture and smooth scrolling) ...
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
    
    // Load all sections
    loadAllSections();
});

async function loadAllSections() {
    try {
        const sections = ['news', 'publications', 'talks', 'projects', 'blogPosts', 'miscellaneous'];
        for (const section of sections) {
            const response = await fetch(`api/${section}.json`);
            const data = await response.json();
            populateSection(section, data);
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function populateSection(section, data) {
    const container = document.getElementById(`${section}-container`);
    if (!container) {
        console.error(`Container not found for section: ${section}`);
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    data.forEach(item => {
        const element = createSectionElement(section, item);
        if (element) {
            container.appendChild(element);
        }
    });
}

function createSectionElement(section, item) {
    switch(section) {
        case 'news':
            return createNewsElement(item);
        case 'publications':
            return createPublicationElement(item);
        case 'talks':
            return createTalkElement(item);
        case 'projects':
            return createProjectCard(item);
        case 'blogPosts':
            return createBlogCard(item);
        case 'miscellaneous':
            return createMiscellaneousElement(item);
        default:
            return null;
    }
}

function createNewsElement(newsItem) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${newsItem.date}</strong> - ${parseNewsContent(newsItem.content)}`;
    return li;
}

function parseNewsContent(content) {
    return content.replace(/<([^>]+)>/g, (match, p1) => {
        const [text, url] = p1.split('|');
        return `<a href="${url}" target="_blank">${text}</a>`;
    });
}

function createPublicationElement(publication) {
    const element = document.createElement('div');
    element.className = 'publication';
    element.innerHTML = `
        <h4>${publication.title}</h4>
        <p class="authors">${publication.authors}</p>
        <p class="journal">${publication.journal}</p>
        <div class="pub-buttons">
            ${createButton('abstract', 'fas fa-book-open', 'Abstract', publication.abstract)}
            ${createButton('doi', 'fas fa-link', 'DOI', publication.doi)}
            ${createButton('pdf', 'fas fa-file-pdf', 'PDF', publication.pdf)}
        </div>
        <div class="abstract">
            <p>${publication.abstract || 'Abstract not available.'}</p>
        </div>
    `;
    
    const abstractButton = element.querySelector('.btn-abstract');
    if (abstractButton && publication.abstract) {
        abstractButton.addEventListener('click', toggleAbstract);
    }
    
    return element;
}

function createTalkElement(talk) {
    const element = document.createElement('div');
    element.className = 'talk';
    element.innerHTML = `
        <h4>${talk.title}</h4>
        <p>${talk.date} - ${talk.event}, ${talk.location}</p>
        <div class="talk-buttons">
            ${createButton('code', 'fas fa-code', 'Code', talk.code)}
            ${createButton('slides', 'fas fa-desktop', 'Slides', talk.slides)}
            ${createButton('video', 'fas fa-video', 'Video', talk.video)}
        </div>
    `;
    return element;
}

function createButton(type, iconClass, text, content) {
    if (!content) {
        return `<button class="btn btn-${type} inactive" disabled><i class="${iconClass}"></i> ${text}</button>`;
    }
    if (type === 'abstract') {
        return `<button class="btn btn-${type}"><i class="${iconClass}"></i> ${text}</button>`;
    }
    return `<a href="${content}" class="btn btn-${type}" target="_blank"><i class="${iconClass}"></i> ${text}</a>`;
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

function createMiscellaneousElement(item) {
    const li = document.createElement('li');
    li.innerHTML = parseMiscellaneousContent(item.content);
    return li;
}

function parseMiscellaneousContent(content) {
    return content.replace(/<([^>]+)>/g, (match, p1) => {
        const [text, url] = p1.split('|');
        return `<a href="${url}" target="_blank">${text}</a>`;
    });
}

function toggleAbstract() {
    const abstract = this.parentElement.nextElementSibling;
    if (abstract.style.display === 'none' || abstract.style.display === '') {
        abstract.style.display = 'block';
        this.innerHTML = '<i class="fas fa-book"></i> Hide Abstract';
    } else {
        abstract.style.display = 'none';
        this.innerHTML = '<i class="fas fa-book-open"></i> Abstract';
    }
}