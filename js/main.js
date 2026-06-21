document.addEventListener('DOMContentLoaded', () => {
    // 0. Language Translation Logic
    function updateLanguage(lang) {
        if (typeof translations === 'undefined' || !translations[lang]) return;
        
        const t = translations[lang];
        
        // Translate elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.value = t[key];
                } else {
                    el.innerHTML = t[key];
                }
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key] !== undefined) {
                el.setAttribute('placeholder', t[key]);
            }
        });

        // Translate document title
        let pageKey = 'home';
        const path = window.location.pathname;
        if (path.includes('menu.html')) {
            pageKey = 'menu';
        } else if (path.includes('reservation.html')) {
            pageKey = 'reservation';
        } else if (path.includes('404.html')) {
            pageKey = '404';
        }
        
        if (t[`title_${pageKey}`]) {
            document.title = t[`title_${pageKey}`];
        }
        
        // Translate meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && t.meta_desc) {
            metaDesc.setAttribute('content', t.meta_desc);
        }

        // Keep language switcher dropdowns in sync
        document.querySelectorAll('.lang-select').forEach(select => {
            select.value = lang;
        });

        // Store active language
        localStorage.setItem('selectedLanguage', lang);
    }

    // Initialize Language
    const initialLang = localStorage.getItem('selectedLanguage') || 'es';
    updateLanguage(initialLang);

    // Setup language dropdown event listeners
    document.addEventListener('change', (e) => {
        if (e.target && e.target.classList.contains('lang-select')) {
            updateLanguage(e.target.value);
        }
    });

    // 1. Header Scroll Effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when links are clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const triggerBottom = (window.innerHeight / 5) * 4;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };
    
    if (revealElements.length > 0) {
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Run initially
    }

    // 4. Menu Filtering (menu.html)
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuItems = document.querySelectorAll('.menu-item-card');

    if (menuTabs.length > 0 && menuItems.length > 0) {
        menuTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                menuTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.getAttribute('data-filter');

                menuItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    // Reset animation state
                    item.style.display = 'none';
                    item.style.animation = 'none';
                    
                    // Filter and animate
                    if (filter === 'all' || category === filter) {
                        // Force reflow to restart animation
                        void item.offsetWidth;
                        item.style.display = 'flex';
                        item.style.animation = 'fadeInUp 0.5s ease forwards';
                    }
                });
            });
        });
    }

    // 5. Reservation Form Submit & Modal Handling (reservation.html)
    const reservationForm = document.getElementById('reservation-form');
    const modalOverlay = document.getElementById('success-modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (reservationForm && modalOverlay) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation
            let isValid = true;
            const inputs = reservationForm.querySelectorAll('input, select');
            inputs.forEach(input => {
                if (!input.value) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Display reservation details in modal
                const name = document.getElementById('res-name').value;
                const date = document.getElementById('res-date').value;
                const time = document.getElementById('res-time').value;
                const guests = document.getElementById('res-guests').value;
                
                const activeLang = localStorage.getItem('selectedLanguage') || 'es';
                const t = (typeof translations !== 'undefined') ? translations[activeLang] : null;
                
                const labelGuest = t ? t.detail_guest : 'Invitado';
                const labelDate = t ? t.detail_date : 'Fecha';
                const labelTime = t ? t.detail_time : 'Hora';
                const labelTableFor = t ? t.detail_table_for : 'Mesa para';
                const labelPeople = t ? (guests === '1' ? t.detail_person : t.detail_people) : (guests === '1' ? 'persona' : 'personas');

                const modalDetails = document.getElementById('modal-reservation-details');
                if (modalDetails) {
                    modalDetails.innerHTML = `<strong>${labelGuest}:</strong> ${name}<br><strong>${labelDate}:</strong> ${date} | <strong>${labelTime}:</strong> ${time}<br><strong>${labelTableFor}:</strong> ${guests} ${labelPeople}`;
                }

                // Show modal
                modalOverlay.classList.add('active');
                reservationForm.reset();
            }
        });
        
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                modalOverlay.classList.remove('active');
            });
        }

        // Close modal when clicking outside
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }
});
