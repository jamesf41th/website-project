document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Slide-Out Menu with Blur Backdrop & Scroll Lock
    const menuToggle = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('close-btn');
    const mobileDrawer = document.getElementById('mobile-drawer') || document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    function openMenu() {
        if (mobileDrawer) mobileDrawer.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.classList.add('menu-open');
    }

    function closeMenu() {
        if (mobileDrawer) mobileDrawer.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.mobile-nav-links a, #nav-links a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });


    // 2. Interactive Order Buttons
    document.querySelectorAll('.order-btn').forEach(button => {
        button.addEventListener('click', () => {
            const coffeeName = button.getAttribute('data-coffee') || 'Coffee';
            alert(`Thank you! 1x ${coffeeName} has been added to your order.`);
        });
    });


    // 3. Seamless Infinite Testimonials Carousel
    const track = document.getElementById('testimonial-track');
    const wrapper = document.getElementById('carousel-wrapper');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (track && wrapper) {
        const originalCards = Array.from(track.querySelectorAll('.review-card'));
        let currentIndex = 0;
        let slideInterval;
        let isTransitioning = false;

        if (originalCards.length > 0) {
            const cloneCount = Math.min(3, originalCards.length);
            for (let i = 0; i < cloneCount; i++) {
                track.appendChild(originalCards[i].cloneNode(true));
            }

            const allCards = track.querySelectorAll('.review-card');

            function moveToSlide(index, animate = true) {
                track.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
                const stepWidth = allCards[0].offsetWidth + 20;
                track.style.transform = `translateX(-${index * stepWidth}px)`;
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
                if (currentIndex <= 0) {
                    currentIndex = originalCards.length;
                    moveToSlide(currentIndex, false);
                    track.offsetHeight;
                }
                currentIndex--;
                moveToSlide(currentIndex, true);
            }

            track.addEventListener('transitionend', () => {
                isTransitioning = false;
                if (currentIndex >= originalCards.length) {
                    currentIndex = 0;
                    moveToSlide(currentIndex, false);
                }
            });

            function startAutoSlide() {
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 3000);
            }

            function stopAutoSlide() {
                clearInterval(slideInterval);
            }

            if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
            if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoSlide(); });

            let startX = 0;
            wrapper.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stopAutoSlide(); }, { passive: true });
            wrapper.addEventListener('touchend', (e) => {
                const diff = startX - e.changedTouches[0].clientX;
                if (diff > 50) nextSlide();
                else if (diff < -50) prevSlide();
                startAutoSlide();
            });

            let isDragging = false;
            wrapper.addEventListener('mousedown', (e) => { isDragging = true; startX = e.clientX; stopAutoSlide(); });
            wrapper.addEventListener('mouseup', (e) => {
                if (!isDragging) return;
                isDragging = false;
                const diff = startX - e.clientX;
                if (diff > 50) nextSlide();
                else if (diff < -50) prevSlide();
                startAutoSlide();
            });

            wrapper.addEventListener('mouseenter', stopAutoSlide);
            wrapper.addEventListener('mouseleave', () => { isDragging = false; startAutoSlide(); });
            window.addEventListener('resize', () => { isTransitioning = false; moveToSlide(currentIndex, false); });

            startAutoSlide();
        }
    }


    // 4. Click-to-Copy with Floating Toast Notification
    const copyToast = document.getElementById('copy-toast');
    let toastTimeout;

    document.querySelectorAll('.copy-item').forEach(item => {
        item.addEventListener('click', () => {
            const textToCopy = item.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                if (copyToast) {
                    copyToast.textContent = `✓ Copied: ${textToCopy}`;
                    copyToast.classList.add('show');
                    clearTimeout(toastTimeout);
                    toastTimeout = setTimeout(() => copyToast.classList.remove('show'), 2500);
                }
            });
        });
    });


    // 5. Universal Scroll-Spy (Works with ANY navbar link class)
    const sections = Array.from(document.querySelectorAll('section[id], footer[id]'));
    const navAnchors = Array.from(document.querySelectorAll('header nav a[href^="#"], .mobile-nav-links a[href^="#"]'));

    function updateActiveNav() {
        if (sections.length === 0 || navAnchors.length === 0) return;

        let activeId = sections[0].getAttribute('id').toLowerCase();
        const scrollPos = window.scrollY + 200;

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                activeId = sec.getAttribute('id').toLowerCase();
            }
        });

        // Bottom of page check for footer Contact Us
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 30) {
            activeId = sections[sections.length - 1].getAttribute('id').toLowerCase();
        }

        navAnchors.forEach(a => {
            const hrefId = a.getAttribute('href').replace('#', '').toLowerCase();
            if (hrefId === activeId || (hrefId === 'home' && activeId === 'hero')) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
});

// 6. Hide Navbar on Scroll Down, Show on Scroll Up
    const headerElement = document.querySelector('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Don't trigger at the very top bounce or if mobile menu is open
        if (currentScrollY <= 20) {
            headerElement.classList.remove('nav-hidden');
            lastScrollY = currentScrollY;
            return;
        }

        if (document.body.classList.contains('menu-open')) return;

        if (currentScrollY > lastScrollY && currentScrollY > 80) {
            // Scrolling Down -> Hide Header
            headerElement.classList.add('nav-hidden');
        } else if (currentScrollY < lastScrollY) {
            // Scrolling Up -> Show Header
            headerElement.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
    });
