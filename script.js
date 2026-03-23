document.addEventListener('DOMContentLoaded', function() {
    // --- Theme Toggle ---
    initTheme();

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Email Footer Button ---
    const emailBtn = document.getElementById('email-button');
    if (emailBtn) {
        emailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const emailParts = {
                username: 'ashoknimiwal1998',
                domain: 'gmail.com'
            };
            const existing = this.parentElement.querySelector('.email-text');
            if (existing) {
                existing.remove();
            } else {
                const span = document.createElement('span');
                span.className = 'email-text';
                span.textContent = `username@${emailParts.domain}; username = ${emailParts.username}`;
                this.parentElement.insertBefore(span, this.nextSibling);
            }
        });
    }

    // --- Home Link ---
    const homeLink = document.getElementById('home-link');
    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Load All Sections ---
    loadAllSections();
});

// ============================================
// THEME
// ============================================

function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('theme');

    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateThemeIcon();

    if (toggle) {
        toggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateThemeIcon();
        });
    }
}

function updateThemeIcon() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    const theme = document.documentElement.getAttribute('data-theme');
    toggle.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
}

// ============================================
// DATA LOADING
// ============================================

async function loadAllSections() {
    try {
        const aboutResponse = await fetch('api/about.json');
        const aboutData = await aboutResponse.json();
        populateAbout(aboutData);

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

// ============================================
// ABOUT
// ============================================

function populateAbout(data) {
    // Profile image
    const profileContainer = document.getElementById('about-profile');
    if (profileContainer) {
        const img = document.createElement('img');
        img.src = data.profileImage;
        img.alt = data.name;
        img.className = 'profile-pic';
        img.id = 'profilePic';
        img.style.opacity = '0';
        profileContainer.appendChild(img);
        setTimeout(() => {
            img.style.opacity = '1';
            img.style.animation = 'popOut 1.5s ease-out';
        }, 200);
    }

    // Text content + social links
    const contentContainer = document.getElementById('about-content');
    if (contentContainer) {
        let html = `<h2>About Me</h2>`;
        if (data.greeting) {
            html += `<p>${data.greeting}</p>`;
        }
        data.bio.forEach(para => {
            html += `<p>${para}</p>`;
        });
        html += `<div class="social-links">`;
        data.links.forEach(link => {
            html += `<a href="${link.url}" target="_blank" aria-label="${link.label}"><i class="${link.icon}"></i></a>`;
        });
        html += `</div>`;
        contentContainer.innerHTML = html;
    }
}

function populateSection(section, data) {
    const container = document.getElementById(`${section}-container`);
    if (!container) return;

    container.innerHTML = '';

    // News gets special scroll treatment
    if (section === 'news') {
        populateNews(container, data);
        return;
    }

    data.forEach(item => {
        const element = createSectionElement(section, item);
        if (element) {
            container.appendChild(element);
        }
    });
}

function createSectionElement(section, item) {
    switch (section) {
        case 'publications': return createPublicationElement(item);
        case 'talks': return createTalkElement(item);
        case 'projects': return createProjectCard(item);
        case 'blogPosts': return createBlogCard(item);
        case 'miscellaneous': return createMiscellaneousElement(item);
        default: return null;
    }
}

// ============================================
// NEWS (with scroll/expand)
// ============================================

const NEWS_VISIBLE_COUNT = 10;

function populateNews(container, data) {
    const wrapper = document.createElement('div');
    wrapper.className = 'news-scroll-wrapper';

    if (data.length > NEWS_VISIBLE_COUNT) {
        wrapper.classList.add('scrollable');
    }

    const ul = document.createElement('ul');
    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong class="news-date">${item.date}</strong><span class="sep-bullet">&bull;</span><span class="news-text">${parseLinkedContent(item.content)}</span>`;
        ul.appendChild(li);
    });
    wrapper.appendChild(ul);
    container.appendChild(wrapper);
}

function parseLinkedContent(content) {
    return content.replace(/<([^>]+)>/g, (match, p1) => {
        const [text, url] = p1.split('|');
        if (url) {
            return `<a href="${url}" target="_blank">${text}</a>`;
        }
        return match;
    });
}

// ============================================
// PUBLICATIONS
// ============================================

function createPublicationElement(publication) {
    const element = document.createElement('div');
    element.className = 'publication';
    const yearDisplay = publication.year
        ? `<span class="separator">&bull;</span>${publication.year}`
        : '';

    // Build buttons
    let buttonsHtml = '';
    buttonsHtml += createButton('abstract', 'fas fa-book-open', 'Abstract', publication.abstract);
    if (publication.citation) {
        buttonsHtml += createButton('citation', 'fas fa-quote-right', 'Cite', publication.citation);
    }
    buttonsHtml += createButton('doi', 'fas fa-link', 'DOI', publication.doi);
    buttonsHtml += createButton('pdf', 'fas fa-file-pdf', 'PDF', publication.pdf);

    element.innerHTML = `
        <h4>${publication.title}</h4>
        <p class="journal-year">${publication.journal}${yearDisplay}</p>
        <div class="pub-buttons">
            ${buttonsHtml}
        </div>
        <div class="abstract">
            <div class="abstract-inner">
                <p>${publication.abstract || 'Abstract not available.'}</p>
            </div>
        </div>
        ${publication.citation ? `
        <div class="citation">
            <div class="citation-inner">
                <p>${publication.citation}</p>
            </div>
        </div>
        ` : ''}
    `;

    // Wire up abstract toggle
    const abstractButton = element.querySelector('.btn-abstract');
    if (abstractButton && publication.abstract) {
        abstractButton.addEventListener('click', function() {
            toggleExpandable(this, '.abstract', 'fas fa-book-open', 'Abstract', 'fas fa-book', 'Hide Abstract');
        });
    }

    // Wire up citation toggle
    const citationButton = element.querySelector('.btn-citation');
    if (citationButton && publication.citation) {
        citationButton.addEventListener('click', function() {
            toggleExpandable(this, '.citation', 'fas fa-quote-right', 'Cite', 'fas fa-quote-left', 'Hide');
        });
    }

    return element;
}

function toggleExpandable(btn, selector, iconOpen, textOpen, iconClose, textClose) {
    const parent = btn.closest('.publication') || btn.closest('.talk');
    const target = parent.querySelector(selector);
    if (!target) return;

    const isOpen = target.classList.contains('show');
    if (isOpen) {
        target.classList.remove('show');
        btn.innerHTML = `<i class="${iconOpen}"></i> ${textOpen}`;
    } else {
        target.classList.add('show');
        btn.innerHTML = `<i class="${iconClose}"></i> ${textClose}`;
    }
}

// ============================================
// TALKS
// ============================================

function createTalkElement(talk) {
    const element = document.createElement('div');
    element.className = 'talk';

    // Tag (e.g., Forthcoming)
    const tagHtml = talk.tag
        ? `<span class="talk-tag">${talk.tag}</span>`
        : '';

    // Audience
    const audienceHtml = talk.audience
        ? `<span class="talk-audience">${talk.audience}</span>`
        : '';

    // Description button
    const descBtnHtml = talk.description
        ? createButton('description', 'fas fa-align-left', 'Description', talk.description)
        : createButton('description', 'fas fa-align-left', 'Description', '');

    element.innerHTML = `
        <h4>${talk.title}</h4>
        <div class="talk-meta">
            <p>${talk.date} <span class="sep-bullet">&bull;</span> ${talk.event}, ${talk.location}</p>
            ${tagHtml}
            ${audienceHtml}
        </div>
        <div class="talk-buttons">
            ${descBtnHtml}
            ${createButton('code', 'fas fa-code', 'Code', talk.code)}
            ${createButton('slides', 'fas fa-desktop', 'Slides', talk.slides)}
            ${createButton('video', 'fas fa-video', 'Video', talk.video)}
        </div>
        ${talk.description ? `
        <div class="talk-description">
            <div class="talk-description-inner">
                <p>${talk.description}</p>
            </div>
        </div>
        ` : ''}
    `;

    // Wire up description toggle
    const descBtn = element.querySelector('.btn-description');
    if (descBtn && talk.description) {
        descBtn.addEventListener('click', function() {
            toggleExpandable(this, '.talk-description', 'fas fa-align-left', 'Description', 'fas fa-times', 'Hide');
        });
    }

    return element;
}

// ============================================
// BUTTONS
// ============================================

function createButton(type, iconClass, text, content) {
    if (!content) {
        return `<button class="btn btn-${type} inactive" disabled><i class="${iconClass}"></i> ${text}</button>`;
    }
    // Expandable button types (handled via JS click, not links)
    if (type === 'abstract' || type === 'citation' || type === 'description') {
        return `<button class="btn btn-${type}"><i class="${iconClass}"></i> ${text}</button>`;
    }
    return `<a href="${content}" class="btn btn-${type}" target="_blank"><i class="${iconClass}"></i> ${text}</a>`;
}

// ============================================
// PROJECT CARDS
// ============================================

function createProjectCard(project) {
    const card = document.createElement('a');
    card.className = 'project-card';

    if (project.slug) {
        card.href = `projects/${project.slug}.html`;
    } else {
        card.href = project.link;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
    }

    const statusClass = project.status === 'Active' ? '' : 'wip';
    const statusText = project.status || 'In Progress';

    card.innerHTML = `
        <img src="${project.image}" alt="${project.title}">
        <div class="card-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="card-status">
                <span class="status-dot ${statusClass}"></span>
                ${statusText}
            </div>
        </div>
    `;
    return card;
}

// ============================================
// BLOG CARDS
// ============================================

function createBlogCard(post) {
    const card = document.createElement('a');
    card.className = 'blog-card';

    if (post.slug) {
        card.href = `blogs/post.html?post=${post.slug}`;
    } else if (post.link) {
        card.href = post.link;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
    } else {
        card.href = '#';
        card.style.opacity = '0.5';
        card.style.pointerEvents = 'none';
    }

    const tag = post.tag || 'Article';

    card.innerHTML = `
        <img src="${post.image}" alt="${post.title}">
        <div class="card-content">
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="card-tag">${tag}</div>
        </div>
    `;
    return card;
}

// ============================================
// MISCELLANEOUS
// ============================================

function createMiscellaneousElement(item) {
    const li = document.createElement('li');
    li.innerHTML = parseLinkedContent(item.content);
    return li;
}
