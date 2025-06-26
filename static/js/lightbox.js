// smooth scroll when clicking nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

// hamburger menu stuff
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
});

document.querySelectorAll('.mobile-menu-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});
        }
    });
});

// logo fade in/out on scroll + nav hide/show
const heroLogo = document.getElementById('heroLogo');
const navLogo = document.getElementById('navLogo');
const header = document.getElementById('header');
const portfolioSection = document.getElementById('portfolio');

let lastScrollY = 0;
let portfolioTop = 0;
let scrollTimer = null;

// update portfolio position when window resizes
function updatePortfolioPosition() {
    portfolioTop = portfolioSection.offsetTop;
}

updatePortfolioPosition();
window.addEventListener('resize', updatePortfolioPosition);

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;
    
    // hero logo fade out
    const heroFadeProgress = Math.min(scrollY / (heroHeight * 0.18), 1);
    
    if (heroFadeProgress > 0) {
        const scale = 1 - (heroFadeProgress * 0.3);
        heroLogo.style.transform = `scale(${scale})`;
        heroLogo.style.opacity = 1 - heroFadeProgress;
    } else {
        heroLogo.style.transform = 'scale(1)';
        heroLogo.style.opacity = 1;
    }

    // nav logo fade in
    const navFadeStart = heroHeight * 0.10;
    const navFadeEnd = heroHeight * 0.15;
    
    if (scrollY < navFadeStart) {
        navLogo.style.opacity = 0;
    } else if (scrollY > navFadeEnd) {
        navLogo.style.opacity = 1;
    } else {
        const navProgress = (scrollY - navFadeStart) / (navFadeEnd - navFadeStart);
        navLogo.style.opacity = navProgress;
    }
    
    // throttle the nav hide/show
    if (scrollTimer) clearTimeout(scrollTimer);
    
    scrollTimer = setTimeout(() => {
        // only hide nav after portfolio section
        if (scrollY > portfolioTop + 100) {
            const scrollDifference = Math.abs(scrollY - lastScrollY);
            
            if (scrollDifference > 5) {
                if (scrollY > lastScrollY) {
                    // scrolling down - hide nav
                    header.classList.add('nav-hidden');
                } else {
                    // scrolling up - show nav
                    header.classList.remove('nav-hidden');
                }
            }
        } else {
            // above portfolio - always show nav
            header.classList.remove('nav-hidden');
        }
        
        lastScrollY = scrollY;
    }, 10);
});

// lightbox for portfolio images
const portfolioItems = document.querySelectorAll('.portfolio-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDescription = document.getElementById('lightboxDescription');

let currentImageIndex = 0;
const images = Array.from(portfolioItems);

const captions = [
    { title: "Band Photography", description: "Leah Conolly, Mule Haggard Vocalist, Lexington, KY." },
    { title: "Wedding Photography", description: "Speed Art Museum | Shot on 85mm 1.2" },
    { title: "Portrait Photography", description: "Reagan Etherington | Creative shoot at Mount St. Francis" },
    { title: "Personal Branding", description: "Evan Matthews | Matthews Design branding photography" },
    { title: "Group Portraits", description: "Corporate group and headshot photography available." },
    { title: "Wedding Moments", description: "Weddings, elopements, and engagement photography available." },
    { title: "Creative Portraits", description: "Looking to collab? I'm always interested in creative portrait sessions." },
    { title: "Couple Photography", description: "Romantic sessions celebrating relationships." },
    { title: "Portrait Photography", description: "Studio portrait work." },
    { title: "Portrait Photography", description: "Reagan Etherington" },
    { title: "Fashion Photography", description: "Shot on behalf of Him Gentleman's Boutique" },
    { title: "Product Photography", description: "Commercial product photography." },
    { title: "Portrait Photography", description: "AKA Buff Thomas" },
    { title: "Branding Photography", description: "Shot on behalf of Heaven Hill Distilliers" },
    { title: "Product Photography", description: "Green River Whiskey." },
    { title: "Creative Portraits", description: "Shot on behalf of Ravens Roost" }
];

function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxContent() {
    const currentItem = images[currentImageIndex];
    const imgSrc = currentItem.querySelector('img').src;
    const caption = captions[currentImageIndex];

    lightboxImage.src = imgSrc;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    lightboxTitle.textContent = caption.title;
    lightboxDescription.textContent = caption.description;
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightboxContent();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateLightboxContent();
}

portfolioItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', nextImage);
lightboxPrev.addEventListener('click', prevImage);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
});

// photo of the day navigation
const potdThumbnails = document.querySelectorAll('.potd-thumbnail');
const potdFeaturedImage = document.querySelector('.potd-featured-image img');
const potdFeaturedDate = document.querySelector('.potd-date');
const potdFeaturedTitle = document.querySelector('.potd-featured-content .potd-title');
const potdFeaturedCaption = document.querySelector('.potd-caption');
const potdPrevBtn = document.getElementById('potdPrev');
const potdNextBtn = document.getElementById('potdNext');

let currentPotdIndex = 0;

// find which thumbnail is active on load
potdThumbnails.forEach((thumbnail, index) => {
    if (thumbnail.classList.contains('active')) {
        currentPotdIndex = index;
    }
});

function updatePotdDisplay(index) {
    const thumbnail = potdThumbnails[index];
    if (!thumbnail) return;
    
    const date = thumbnail.dataset.date;
    const image = thumbnail.dataset.image;
    const caption = thumbnail.dataset.caption;
    const title = thumbnail.dataset.title;

    potdFeaturedImage.style.opacity = '0';
    setTimeout(() => {
        potdFeaturedImage.src = image;
        potdFeaturedImage.alt = `Photo of the Day - ${date}`;
        potdFeaturedDate.textContent = date;
        potdFeaturedTitle.textContent = title;
        potdFeaturedCaption.textContent = caption;
        potdFeaturedImage.style.opacity = '1';
    }, 200);

    // update which thumbnail looks active
    potdThumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
    
    currentPotdIndex = index;
}

// click on thumbnails
potdThumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        updatePotdDisplay(index);
    });
});

// arrow buttons for potd
if (potdPrevBtn && potdNextBtn) {
    potdPrevBtn.addEventListener('click', () => {
        const newIndex = currentPotdIndex > 0 ? currentPotdIndex - 1 : potdThumbnails.length - 1;
        updatePotdDisplay(newIndex);
    });
    
    potdNextBtn.addEventListener('click', () => {
        const newIndex = currentPotdIndex < potdThumbnails.length - 1 ? currentPotdIndex + 1 : 0;
        updatePotdDisplay(newIndex);
    });
}