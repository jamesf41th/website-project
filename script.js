// 1. Mobile Slide-Out Menu with Blur Backdrop & Scroll Lock
const menuToggle = document.getElementById('menu-toggle');
const closeBtn = document.getElementById('close-btn');
const mobileDrawer = document.getElementById('mobile-drawer');
const navOverlay = document.getElementById('nav-overlay');

function openMenu() {
    mobileDrawer.classList.add('active');
    navOverlay.classList.add('active');
    document.body.classList.add('menu-open');
}

function closeMenu() {
    mobileDrawer.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);
navOverlay.addEventListener('click', closeMenu);

document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// 2. Interactive Order Buttons
const orderButtons = document.querySelectorAll('.order-btn');

orderButtons.forEach(button => {
    button.addEventListener('click', () => {
        const coffeeName = button.getAttribute('data-coffee');
        alert(`Thank you! 1x ${coffeeName} has been added to your order.`);
    });
});

// 3. Seamless Infinite Testimonials Carousel (Auto-slide + Arrows + Swipe)
const track = document.getElementById('testimonial-track');
const wrapper = document.getElementById('carousel-wrapper');
const originalCards = Array.from(document.querySelectorAll('.review-card'));
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentIndex = 0;
let slideInterval;
let isTransitioning = false;

// Clone the first 3 cards and append them to the end for a seamless infinite loop
const cloneCount = 3;
for (let i = 0; i < cloneCount; i++) {
    const clone = originalCards[i].cloneNode(true);
    track.appendChild(clone);
}

const allCards = document.querySelectorAll('.review-card');

function getStepWidth() {
    const gap = 20; // Matches CSS gap
    return allCards[0].offsetWidth + gap;
}

function moveToSlide(index, animate = true) {
    track.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
    const moveAmount = index * getStepWidth();
    track.style.transform = `translateX(-${moveAmount}px)`;
}

function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    moveToSlide(currentIndex, true);
}

function prevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    // If at the very start, instantly jump to the cloned end first, then slide left
    if (currentIndex <= 0) {
        currentIndex = originalCards.length;
        moveToSlide(currentIndex, false);
        track.offsetHeight; // Force browser to apply instant jump before animating
    }

    currentIndex--;
    moveToSlide(currentIndex, true);
}

// Silently snap back to the real first card after sliding onto a clone
track.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (currentIndex >= originalCards.length) {
        currentIndex = 0;
        moveToSlide(currentIndex, false);
    }
});

// Auto-slide controls
function startAutoSlide() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3000);
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

// Arrow Button Events
nextBtn.addEventListener('click', () => {
    nextSlide();
    startAutoSlide();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    startAutoSlide();
});

// Touch Swipe Events (Mobile & Tablets)
let startX = 0;

wrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAutoSlide();
}, { passive: true });

wrapper.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) {
        nextSlide(); // Swiped left -> moves forward to the left
    } else if (diff < -50) {
        prevSlide(); // Swiped right -> moves backward to the right
    }
    startAutoSlide();
});

// Mouse Drag Swipe Events (PC)
let isDragging = false;

wrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    stopAutoSlide();
});

wrapper.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.clientX;

    if (diff > 50) {
        nextSlide();
    } else if (diff < -50) {
        prevSlide();
    }
    startAutoSlide();
});

wrapper.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        startAutoSlide();
    }
});

// Pause on hover on PC
wrapper.addEventListener('mouseenter', stopAutoSlide);
wrapper.addEventListener('mouseleave', startAutoSlide);

// Recalculate cleanly on window resize
window.addEventListener('resize', () => {
    isTransitioning = false;
    moveToSlide(currentIndex, false);
});

// Start automatic sliding
startAutoSlide();

// 4. Click-to-Copy Phone Number & Email in Footer
const copyItems = document.querySelectorAll('.copy-item');

copyItems.forEach(item => {
    item.addEventListener('click', () => {
        const textToCopy = item.getAttribute('data-copy');
        const originalText = item.textContent;

        navigator.clipboard.writeText(textToCopy).then(() => {
            item.textContent = `✓ Copied: ${textToCopy}`;
            item.style.color = '#e08e35';

            // Restore original text after 2 seconds
            setTimeout(() => {
                item.textContent = originalText;
                item.style.color = '';
            }, 2000);
        });
    });
});
