// Settings Manager Module
class SettingsManager {
    constructor() {
        this.settings = {
            theme: 'blue',
            cursorEnabled: true,
            soundEnabled: true,
            ambientEnabled: true,  // Changed to true to enable ambient sound by default
            reducedMotion: false
        };
        
        // Get modal elements
        this.settingsModal = document.getElementById('settings-modal');
        this.openSettingsBtns = document.querySelectorAll('[data-section="settings"]');
        this.closeSettingsBtn = document.getElementById('close-settings');
        
        this.init();
    }
    
    init() {
        // Load saved settings
        this.loadSavedSettings();
        
        // Initialize settings UI
        this.initSettingsUI();
        
        // Initialize modal functionality
        this.initModal();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    loadSavedSettings() {
        // Load theme
        const savedTheme = localStorage.getItem('setting_theme');
        if (savedTheme) {
            this.settings.theme = savedTheme;
        }
        
        // Load cursor setting
        const savedCursorSetting = localStorage.getItem('setting_cursorEnabled');
        if (savedCursorSetting !== null) {
            this.settings.cursorEnabled = savedCursorSetting === 'true';
        }
        
        // Load sound setting
        const savedSoundSetting = localStorage.getItem('setting_soundEnabled');
        if (savedSoundSetting !== null) {
            this.settings.soundEnabled = savedSoundSetting === 'true';
        }
        
        // Load ambient setting
        const savedAmbientSetting = localStorage.getItem('setting_ambientEnabled');
        if (savedAmbientSetting !== null) {
            this.settings.ambientEnabled = savedAmbientSetting === 'true';
        }
        
        // Load reduced motion setting
        const savedMotionSetting = localStorage.getItem('setting_reducedMotion');
        if (savedMotionSetting !== null) {
            this.settings.reducedMotion = savedMotionSetting === 'true';
        }
        
        // Apply loaded settings
        this.applySettings();
    }
    
    saveSetting(key, value) {
        this.settings[key] = value;
        this.settings[key] = value;
        localStorage.setItem(`setting_${key}`, value);
    }
    
    applySettings() {
        // Apply theme
        this.applyTheme(this.settings.theme);
        
        // Apply cursor visibility and load/unload wobbly-cursor.js
        const wobblyCursorScriptId = 'wobbly-cursor-script';
        let wobblyCursorScript = document.getElementById(wobblyCursorScriptId);

        if (this.settings.cursorEnabled) {
            document.body.classList.remove('cursor-hidden');
            if (!wobblyCursorScript) {
                wobblyCursorScript = document.createElement('script');
                wobblyCursorScript.id = wobblyCursorScriptId;
                wobblyCursorScript.src = 'assets/js/wobbly-cursor.js';
                document.body.appendChild(wobblyCursorScript);
            }
        } else {
            document.body.classList.add('cursor-hidden');
            if (wobblyCursorScript) {
                wobblyCursorScript.remove();
            }
        }
        
        // Apply reduced motion
        this.applyReducedMotion(this.settings.reducedMotion);
        
        // Initialize audio settings - with retry logic for timing issues
        const applyAudioSettings = () => {
            if (window.audioManager) {
                window.audioManager.toggleSound(this.settings.soundEnabled);
                window.audioManager.toggleAmbient(this.settings.ambientEnabled);
            } else {
                // Retry after a short delay if audio manager isn't ready yet
                setTimeout(applyAudioSettings, 100);
            }
        };
        
        applyAudioSettings();
    }
    
    applyTheme(theme) {
        const root = document.documentElement;
        
        switch(theme) {
            case 'blue':
                root.style.setProperty('--color-accent-primary', '#0078D7');
                root.style.setProperty('--color-accent-highlight', '#a9d9ff');
                break;
            case 'pink':
                root.style.setProperty('--color-accent-primary', '#FF69B4');
                root.style.setProperty('--color-accent-highlight', '#ffb6c1');
                break;
            case 'green':
                root.style.setProperty('--color-accent-primary', '#4CAF50');
                root.style.setProperty('--color-accent-highlight', '#cfffe5');
                break;
        }
        
        // Store current theme
        document.body.setAttribute('data-theme', theme);
    }
    
    applyReducedMotion(reduced) {
        if (reduced) {
            document.documentElement.style.setProperty('--time-fast', '0.02s');
            document.documentElement.style.setProperty('--time-mid', '0.02s');
            document.documentElement.style.setProperty('--time-slow', '0.02s');
            document.body.classList.add('reduced-motion');
        } else {
            document.documentElement.style.setProperty('--time-fast', '0.18s');
            document.documentElement.style.setProperty('--time-mid', '0.35s');
            document.documentElement.style.setProperty('--time-slow', '0.6s');
            document.body.classList.remove('reduced-motion');
        }
    }
    
    initSettingsUI() {
        // Initialize theme buttons
        this.initThemeButtons();
        
        // Initialize toggles
        this.initToggles();
    }
    
    initThemeButtons() {
        const themeBtns = document.querySelectorAll('.theme-btn');
        themeBtns.forEach(btn => {
            const theme = btn.dataset.theme;
            
            // Set active state based on current theme
            if (theme === this.settings.theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    initToggles() {
        // Initialize cursor toggle
        const cursorToggle = document.getElementById('cursor-toggle');
        if (cursorToggle) {
            cursorToggle.checked = this.settings.cursorEnabled;
        }
        
        // Initialize sound toggle 
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.checked = this.settings.soundEnabled;
        }
        
        // Initialize motion toggle
        const motionToggle = document.getElementById('motion-toggle');
        if (motionToggle) {
            motionToggle.checked = this.settings.reducedMotion;
        }
    }
    
    initModal() {
        // Open settings modal
        this.openSettingsModal = () => {
            this.settingsModal.classList.add('active');
            if (window.audioManager) {
                window.audioManager.playClickSound(); // Play sound when opening
            }
            
            // Disable the main cursor while modal is open
            document.body.classList.add('cursor-hidden');
        };
        
        // Close settings modal
        this.closeSettingsModal = () => {
            this.settingsModal.classList.remove('active');
            if (window.audioManager) {
                window.audioManager.playAirClickSound();
            } // Play sound when closing
            
            // Re-enable the main cursor after modal closes
            setTimeout(() => {
                document.body.classList.remove('cursor-hidden');
            }, 150); // Match with modal close transition time
        };
        
        // Open modal when clicking settings icon in DS bar
        this.openSettingsBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openSettingsModal();
            });
        });
        
        // Close modal when clicking the close button
        if (this.closeSettingsBtn) {
            this.closeSettingsBtn.addEventListener('click', () => {
                this.closeSettingsModal();
            });
        }
        
        // Close modal when clicking outside modal content
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettingsModal();
            }
        });
    }
    
    setupEventListeners() {
        // Theme selection
        const themeBtns = document.querySelectorAll('.theme-btn');
        themeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const theme = btn.dataset.theme;
                
                // Update active state
                themeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update setting
                this.settings.theme = theme;
                this.applyTheme(theme);
                this.saveSetting('theme', theme);
                
                // Play sound
                if (window.audioManager) {
                    window.audioManager.playBubblePopSound();
                }
            });
        });
        
        // Cursor toggle
        const cursorToggle = document.getElementById('cursor-toggle');
        if (cursorToggle) {
            cursorToggle.addEventListener('change', () => {
                const cursorEnabled = cursorToggle.checked;
                this.setSetting('cursorEnabled', cursorEnabled); // Use setSetting to update and apply
                
                if (window.audioManager) {
                    if (cursorEnabled) {
                        window.audioManager.playBubblePopSound();
                    } else {
                        window.audioManager.playAirClickSound();
                    }
                }
            });
        }
        
        // Sound toggle
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('change', () => {
                const soundEnabled = soundToggle.checked;
                this.settings.soundEnabled = soundEnabled;
                this.saveSetting('soundEnabled', soundEnabled);
                
                if (window.audioManager) {
                    window.audioManager.toggleSound(soundEnabled);
                    if (soundEnabled) {
                        window.audioManager.playBubblePopSound();
                    }
                }
            });
        }
        
        // Reduced motion toggle
        const motionToggle = document.getElementById('motion-toggle');
        if (motionToggle) {
            motionToggle.addEventListener('change', () => {
                const reducedMotion = motionToggle.checked;
                this.settings.reducedMotion = reducedMotion;
                this.applyReducedMotion(reducedMotion);
                this.saveSetting('reducedMotion', reducedMotion);
                
                if (reducedMotion) {
                    if (window.audioManager) {
                        window.audioManager.playAirClickSound();
                    }
                } else {
                    if (window.audioManager) {
                        window.audioManager.playBubblePopSound();
                    }
                }
            });
        }
    }
    
    // Public methods for external use
    getSetting(key) {
        return this.settings[key];
    }
    
    setSetting(key, value) {
        this.settings[key] = value;
        this.saveSetting(key, value);
        this.applySettings();
    }
}

// Initialize the settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsManager;
}