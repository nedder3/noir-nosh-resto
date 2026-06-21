document.addEventListener('DOMContentLoaded', () => {
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
                if (!input.value.strip ? input.value.trim() : input.value) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Display reservation details in modal
                const name = document.getElementById('res-name').value;
                const date = document.getElementById('res-date').value;
                const time = document.getElementById('res-time').value;
                const guests = document.getElementById('res-guests').value;
                
                const modalDetails = document.getElementById('modal-reservation-details');
                if (modalDetails) {
                    modalDetails.innerHTML = `<strong>Invitado:</strong> ${name}<br><strong>Fecha:</strong> ${date} | <strong>Hora:</strong> ${time}<br><strong>Mesa para:</strong> ${guests} personas`;
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
