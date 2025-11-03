document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');

    // Function to show the loading screen
    function showLoadingScreen() {
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    // Function to hide the loading screen with a fade-out effect
    function hideLoadingScreen() {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden'); // Start fade-out
            // Wait for the CSS transition to complete before setting display: none
            setTimeout(() => {
                loadingScreen.style.display = 'none';

                if (window.audioManager) window.audioManager.playBootUpChime();

                // Show boot-up message after loading screen is hidden
                const bootUpMessage = document.getElementById('boot-up-message');
                if (bootUpMessage) {
                    bootUpMessage.classList.add('visible');
                    setTimeout(() => {
                        bootUpMessage.classList.remove('visible');
                    }, 2000); // Display for 2 seconds
                }
            }, 500); // 0.5s matches the CSS transition duration
        }
    }

    // Generic function to close any modal
    function closeModal(modalElement) {
        if (modalElement) {
            modalElement.classList.remove('active');
            BODY.style.overflow = '';

            // Specific cleanup for project modal
            if (modalElement.id === 'project-modal') {
                const videoElement = modalElement.querySelector('video');
                if (videoElement) videoElement.pause();
            }
            
            // Play exit sound only if it's the settings modal
            if (modalElement.id === 'settings-modal' && window.audioManager) {
                window.audioManager.playMenuExitSound();
            }
        }
    }

    // Show the loading screen on initial load
    showLoadingScreen();

    // Hide the loading screen after a minimum display time
    const initialLoadingDelay = window.settingsManager.getSetting('reducedMotion') ? 100 : 1500; // Minimum 1.5 seconds display
    setTimeout(hideLoadingScreen, initialLoadingDelay);
    
    // --- Error Modal Functions ---
    const errorModal = document.getElementById('error-modal');
    const errorModalTitle = document.getElementById('error-modal-title');
    const errorModalMessage = document.getElementById('error-modal-message');
    const errorCloseButton = document.querySelector('.error-close-button');
    const errorOkButton = document.querySelector('.error-ok-button');

    // --- Settings Modal Functions ---
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsButton = document.getElementById('close-settings');

    function showSettingsModal() {
        if (settingsModal) {
            settingsModal.classList.add('active');
            BODY.style.overflow = 'hidden';
            if (window.audioManager) window.audioManager.playMenuEnterSound();
        }
    }

    // Event listeners for settings modal buttons
    if (closeSettingsButton) {
        closeSettingsButton.addEventListener('click', () => closeModal(settingsModal));
    }
    // Close on outside click
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeModal(settingsModal);
        });
    }
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsModal.classList.contains('active')) {
            closeModal(settingsModal);
        }
    });

    function showErrorModal(title, message) {
        if (errorModal) {
            errorModalTitle.textContent = title;
            errorModalMessage.textContent = message;
            errorModal.classList.add('active'); // Assuming 'active' class shows the modal
            BODY.style.overflow = 'hidden'; // Prevent scrolling behind modal
            if (window.audioManager) window.audioManager.playErrorSound(); // Play error sound
        }
    }

    // Event listeners for error modal buttons
    if (errorCloseButton) {
        errorCloseButton.addEventListener('click', () => closeModal(errorModal));
    }
    if (errorOkButton) {
        errorOkButton.addEventListener('click', () => closeModal(errorModal));
    }
    // Close on outside click
    if (errorModal) {
        errorModal.addEventListener('click', (e) => {
            if (e.target === errorModal) closeModal(errorModal);
        });
    }
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && errorModal.classList.contains('active')) {
            closeModal(errorModal);
        }
    });

    // --- Global Selectors ---
    const BODY = document.body;
    const HEADER = document.querySelector('header');
    const PROJECT_MODAL = document.getElementById('project-modal');
    const ALL_SECTIONS = document.querySelectorAll('section');
    const ALL_TILES = document.querySelectorAll('.channel-tile');
    const CONTACT_FORM = document.querySelector('.contact-form'); // Added global selector for contact form
    
    // --- Notification Functions (Kept outside DOMContentLoaded for global access) ---
    // Moved to the bottom of the file where the original functions were defined.

    // --- Core Navigation & Screen Management ---
    
function navigateToChannel(channelId) {
    showLoadingScreen(); // Show loading screen immediately

    const transitionDuration = window.settingsManager.getSetting('reducedMotion') ? 0 : 300; // 300ms for transition
    const navigationDelay = window.settingsManager.getSetting('reducedMotion') ? 100 : 500; // Existing delay for content loading

    // Step 1: Start fade-out of current content
    BODY.classList.add('screen-fade-out');

    setTimeout(() => { // Wait for fade-out to complete before swapping content
        // Hide all sections first
        ALL_SECTIONS.forEach(section => section.classList.remove('visible', 'screen-fade-in')); // Remove screen-fade-in from old section

        const targetSection = document.getElementById(channelId);

        if (targetSection) {
            targetSection.classList.add('visible');
            // Update URL hash without triggering a full page reload
            history.pushState(null, '', `#${channelId}`);

            // Set focus to the first interactive element in the new channel for accessibility
            const firstInteractiveElement = targetSection.querySelector('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
            if (firstInteractiveElement) {
                firstInteractiveElement.focus();
            }
        } else {
            // If the channelId does not correspond to an existing section, show an error
            showErrorModal("Channel Loading Error!", `The channel "${channelId}" could not be found. Please try again.`);
            // Optionally, navigate to a default home screen if an error occurs
            document.getElementById('home').classList.add('visible');
            history.pushState(null, '', '#home');
        }

        // Step 2: Remove fade-out from body and start fade-in for new content section
        BODY.classList.remove('screen-fade-out');
        if (targetSection) {
            targetSection.classList.add('screen-fade-in'); // Apply fade-in to the new section
        }

        // Step 3: Hide loading screen and remove fade-in after new content is visible and animated
        setTimeout(() => {
            hideLoadingScreen();
            if (targetSection) {
                targetSection.classList.remove('screen-fade-in'); // Remove fade-in after animation
            }
        }, transitionDuration); // Wait for fade-in to complete
    }, transitionDuration); // Wait for fade-out to complete before swapping
}
    
    /** Initializes both Wii Channel tiles and DS Bar items */
    function initNavigation() {
        const navItems = document.querySelectorAll('.channel-tile, .ds-bar-item');

        navItems.forEach(item => {
            const channelId = item.dataset.channel || item.dataset.section;
            if (!channelId) return;

            item.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.audioManager) window.audioManager.playSound('select');
                
                // Clear and set active state only on the Wii/DS elements themselves
                document.querySelectorAll('.channel-tile.active, .ds-bar-item.active').forEach(el => el.classList.remove('active'));
                
                // Add active class to clicked item (or its related item)
                document.querySelectorAll(`[data-channel="${channelId}"], [data-section="${channelId}"]`).forEach(el => el.classList.add('active'));
                
                if (channelId === 'settings') {
                    showSettingsModal();
                } else {
                    navigateToChannel(channelId);
                }
            });
        });
        
        // --- Keyboard Navigation Setup (Wii Channels) ---
        // Existing keyboard logic is robust, but simplified its initialization here.
        if (ALL_TILES.length > 0) {
            // Set initial active state based on URL hash or default to first tile
            const initialId = window.location.hash ? window.location.hash.substring(1) : ALL_TILES[0].dataset.channel;
            
            // Ensure the correct channel is marked active
            document.querySelectorAll(`[data-channel="${initialId}"], [data-section="${initialId}"]`).forEach(el => el.classList.add('active'));
            
            // The actual navigation to the channel is now handled by the initial setup in DOMContentLoaded
            // Focus is handled by the keyboard listener itself via initialTile.focus() within setupKeyboardNavigation
            
            // Initialize keyboard navigation after a short delay
            setTimeout(setupKeyboardNavigation, 100);
        }
    }
    
    // The complex setupKeyboardNavigation function is kept largely the same for functionality.
    // ... (Your existing setupKeyboardNavigation function remains here)

    // --- Modernized Scroll Animations (Replacing repetitive code with IntersectionObserver) ---
    /** Replaces all instances of repetitive scroll animation checks. */
    function initVisibilityAnimations() {
        // Use one common class for all elements that should animate into view
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, {
            root: null, // Viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% visibility
        });

        // Target all elements that were previously checked individually
        document.querySelectorAll('.about-card, .skill-tile, .achievement-tile, .blog-post-tile, .project-tile, .testimonial-card').forEach(element => {
            observer.observe(element);
        });
    }


    // --- Project Modal Management ---
    function initProjectModal() {
        // Cache elements
        const modalElements = {
            title: document.getElementById('modal-project-title'),
            media: document.getElementById('modal-project-media'),
            description: document.getElementById('modal-project-description'),
            tech: document.getElementById('modal-project-tech'),
            link: document.getElementById('modal-project-link'),
            closeButton: document.querySelector('.close-button')
        };
        
        function closeProjectModal() {
            PROJECT_MODAL.classList.remove('active');
            BODY.style.overflow = '';
            const videoElement = modalElements.media.querySelector('video');
            if (videoElement) videoElement.pause();
        }

        function openProjectModal(tile) {
            modalElements.title.textContent = tile.dataset.name;
            modalElements.description.textContent = tile.dataset.description;
            modalElements.media.innerHTML = ''; // Clear media
            modalElements.tech.innerHTML = ''; // Clear tech

            // Media
            const mediaType = tile.dataset.video ? 'video' : tile.dataset.image ? 'image' : null;
            if (mediaType) {
                const element = document.createElement(mediaType);
                element.src = tile.dataset[mediaType];
                if (mediaType === 'video') {
                    element.controls = true;
                    element.autoplay = true;
                    element.loop = true;
                    element.muted = true;
                } else {
                    element.alt = tile.dataset.name;
                }
                modalElements.media.appendChild(element);
            }

            // Technologies
            if (tile.dataset.tech) {
                tile.dataset.tech.split(',').forEach(tech => {
                    const span = document.createElement('span');
                    span.classList.add('tech-icon');
                    span.textContent = tech;
                    modalElements.tech.appendChild(span);
                });
            }

            modalElements.link.href = tile.dataset.link;
            PROJECT_MODAL.classList.add('active'); // Use class for visibility
            BODY.style.overflow = 'hidden';
        }
        
        // Listeners
        modalElements.closeButton.addEventListener('click', () => closeModal(PROJECT_MODAL));
        PROJECT_MODAL.addEventListener('click', (e) => {
            if (e.target === PROJECT_MODAL) closeModal(PROJECT_MODAL);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && PROJECT_MODAL.classList.contains('active')) closeModal(PROJECT_MODAL);
        });

        // Project Tile Click Handler
        document.querySelectorAll('.project-tile').forEach(tile => {
            tile.addEventListener('click', (e) => {
                // Prevent modal if user clicks on a direct link within the tile
                if (e.target.tagName === 'A') return; 
                e.preventDefault(); 
                
                document.querySelectorAll('.project-tile').forEach(otherTile => otherTile.classList.remove('selected-tile'));
                tile.classList.add('selected-tile'); // Wii-style active selection
                openProjectModal(tile);
            });
        });
    }

    // --- Themed UI & Interaction Initializers (Combined for brevity) ---
    function initUIInteractions() {
        // Sound and Animation Event Listeners (Consolidated)
        document.querySelectorAll('.filter-btn, .contact-button, .submit-button, .project-link, nav ul li a, .project-tile, .skill-tile, .testimonial-card, .achievement-tile').forEach(element => {
            // General click/hover feedback
            element.addEventListener('click', function(e) {
                // Add click squish animation
                element.classList.add('click-animation');
                setTimeout(() => element.classList.remove('click-animation'), 300);
            });
        });
        
        // Themed Toggle Event Listeners (Theme and Sound)
        const themeToggle = document.getElementById('theme-toggle');
        const soundToggle = document.getElementById('sound-toggle');

        if (themeToggle) {
            themeToggle.addEventListener('change', () => {
                if (window.audioManager) window.audioManager.playAirClickSound();
                BODY.classList.add('click-animation');
                setTimeout(() => BODY.classList.remove('click-animation'), 300);
                // Rest of theme logic (dark/light class toggle) remains in its block
            });
        }
        // Sound toggle logic (with double-click for ambient) is complex and best kept in its original functional block.



        // Status bar logic
        const statusBar = document.getElementById('status-bar');
        const statusBarText = statusBar.querySelector('p');
        const defaultStatusBarMessage = "Welcome to my portfolio! Hover over a project or channel to learn more.";

        // Initialize status bar with default message
        statusBarText.textContent = defaultStatusBarMessage;

        const interactiveTiles = document.querySelectorAll('.channel-tile, .project-tile, .ds-bar-item');

        interactiveTiles.forEach(tile => {
            tile.addEventListener('mouseenter', () => {
                const description = tile.getAttribute('data-description');
                if (description) {
                    statusBarText.textContent = description;
                    statusBar.classList.add('visible');
                } else {
                    // Fallback for tiles without a specific description
                    let message = defaultStatusBarMessage;
                    if (tile.dataset.channel) {
                        const channelName = tile.dataset.channel.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                        message = `Explore the ${channelName} channel.`;
                    } else if (tile.classList.contains('project-tile')) {
                        message = `View details for ${tile.querySelector('h3').textContent}.`;
                    }
                    statusBarText.textContent = message;
                    statusBar.classList.add('visible');
                }
            });

            tile.addEventListener('mouseleave', () => {
                statusBarText.textContent = defaultStatusBarMessage; // Reset to default message
                statusBar.classList.add('visible'); // Keep visible with default text
            });
        });
    }




    // --- Contact Form Handling ---
    function initContactForm() {
        // 1. Get a reference to your form
        // Using the global CONTACT_FORM selector now
        
        if (!CONTACT_FORM) return;

        function validateForm(form) {
            const name = form.elements['name'].value.trim();
            const email = form.elements['email'].value.trim();
            const message = form.elements['message'].value.trim();
            
            // Simple email regex for quick client-side check
            const emailRegex = /^[^\s@]+@[^\s@]+\\.[^\s@]+$/; 

            if (!name || !email || !message || !emailRegex.test(email)) {
                showErrorModal("ERROR: Missing User Input.", "Please fill out all required fields before sending.");
                return false;
            }

            return true;
        }

        CONTACT_FORM.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop the form from submitting normally (reloading the page)
            
            if (window.audioManager) window.audioManager.playClickSound(); // Play click sound

            if (validateForm(CONTACT_FORM)) { // Use CONTACT_FORM here
                // 2. Simulate submission (Replace with actual server/service logic later)
                
                // Show success notification
                showNotification("📬 Message Sent! I'll get back to you soon.", 'success', 5000); 
                
                // Optional: Show a subtle confirmation notification after a delay
                setTimeout(() => {
                    showNotification("Check your Mii Message Board for a reply!", 'hint', 4000);
                }, 1000);

                // Clear the form fields after success
                CONTACT_FORM.reset(); // Use CONTACT_FORM here
                
            } else {
                // Validation failed (handled inside validateForm, but ensures form remains open)
            }
        });
    }


        // --- Final Execution ---


        // 1. Initializers


        initNavigation();


        initVisibilityAnimations(); // Replaces window.scroll + isInViewport checks


        initProjectModal();


        initUIInteractions();



        initContactForm();


    


        // Initial screen setup based on URL hash or default to home


        const initialHash = window.location.hash.substring(1);


        const initialChannel = initialHash || 'home';


        navigateToChannel(initialChannel);


    


    });

// --- Notification Functions ---
function showNotification(message, type = 'info', duration = 3000) {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        console.error('Notification container not found!');
        return;
    }

    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.textContent = message;

    notificationContainer.appendChild(notification);

    // Trigger digital pop-in animation
    requestAnimationFrame(() => {
        notification.classList.add('pop-in');
    });

    setTimeout(() => {
        // Trigger glitchy fade-out animation
        notification.classList.remove('pop-in');
        notification.classList.add('fade-out-glitch');

        // Remove notification after animation completes
        notification.addEventListener('animationend', () => {
            notification.remove();
        }, { once: true });
    }, duration);
}