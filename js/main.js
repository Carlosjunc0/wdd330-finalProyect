import { fetchData } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    updateCopyrightYear();
    loadHomeData();
});

async function loadHomeData() {
    const data = await fetchData('./data/home-data.json');
    if (!data) return;

    renderHero(data.hero);
    renderBenefits(data.benefits);
    renderModels(data.models);
    renderCTA(data.cta);
    renderFAQ(data.faq);

    renderReviews(data.reviews);
    initDeluxeCarousel();
}

function renderHero(heroData) {
    const container = document.getElementById('hero-container');
    container.innerHTML = `
        <div class="hero-content">
            <h1>${heroData.title}</h1>
            <p>${heroData.subtitle}</p>
        </div>
    `;
}

function renderBenefits(benefitsData) {
    const container = document.getElementById('benefits-container');
    container.innerHTML = benefitsData.map(benefit => `
        <article class="benefit-card">
            <h3>${benefit.title}</h3>
            <ul>
                ${benefit.items.map(item => `<li><strong>${item.split(':')[0]}:</strong> ${item.split(':')[1] || ''}</li>`).join('')}
            </ul>
        </article>
    `).join('');
}

function renderModels(modelsData) {
    const container = document.getElementById('models-container');
    container.innerHTML = modelsData.map(model => `
        <article class="model-card">
            <img src="${model.image}" alt="${model.title} digital invitation template preview" loading="lazy">
            <div class="model-info">
                <h3>${model.title}</h3>
                <p>${model.description}</p>
                <a href="invitation.html?template=${model.id}" class="btn-primary">View Invitation</a>
            </div>
        </article>
    `).join('');
}

function renderCTA(ctaData) {
    const container = document.getElementById('cta-container');
    container.innerHTML = `
        <div class="wrapper text-center">
            <h2>${ctaData.title}</h2>
            <p>${ctaData.description}</p>
            <a href="rsvp.html" class="btn-secondary">${ctaData.buttonText}</a>
        </div>
    `;
}

function renderFAQ(faqData) {
    const container = document.getElementById('faq-container');
    container.innerHTML = faqData.map(item => `
        <details class="faq-item">
            <summary>${item.question}</summary>
            <p>${item.answer}</p>
        </details>
    `).join('');
}

function renderReviews(reviewsData) {
    const track = document.getElementById('reviews-track');
    track.innerHTML = reviewsData.map(review => `
        <li class="carousel-slide">
            <p class="review-text">"${review.text}"</p>
            <p class="review-author">- ${review.author}</p>
        </li>
    `).join('');
}

function initDeluxeCarousel() {
    const track = document.getElementById('reviews-track');
    const dotsNav = document.getElementById('carousel-dots');
    if (!track) return;

    const slides = Array.from(track.children);
    if (slides.length === 0) return;

    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    let currentIndex = 0;

    dotsNav.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Go to review ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => moveToSlide(index));
        dotsNav.appendChild(dot);
    });

    const dots = Array.from(dotsNav.children);

    const moveToSlide = (targetIndex) => {
        if (targetIndex < 0) targetIndex = slides.length - 1;
        if (targetIndex >= slides.length) targetIndex = 0;

        track.style.transform = `translateX(-${targetIndex * 100}%)`;

        dots.forEach(dot => dot.classList.remove('active'));
        dots[targetIndex].classList.add('active');

        currentIndex = targetIndex;
    };

    nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
    prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));

    let autoPlayInterval = setInterval(() => moveToSlide(currentIndex + 1), 5000);

    track.closest('.deluxe-carousel-container').addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.closest('.deluxe-carousel-container').addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => moveToSlide(currentIndex + 1), 5000);
    });
} // <-- ¡AQUÍ TERMINA EL CARRUSEL!

// 2. Funciones globales fuera del carrusel
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');

    if (!mobileBtn || !mainNav) return;

    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        mainNav.classList.toggle('active');

        const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
        mobileBtn.setAttribute('aria-expanded', !isExpanded);
    });

    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !mobileBtn.contains(e.target) && mainNav.classList.contains('active')) {
            mobileBtn.classList.remove('active');
            mainNav.classList.remove('active');
            mobileBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

function updateCopyrightYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}