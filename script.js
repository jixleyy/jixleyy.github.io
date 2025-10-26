// JavaScript for Language Learning Website

document.addEventListener('DOMContentLoaded', function() {
    // Language selection functionality
    const languageLinks = document.querySelectorAll('[data-language]');
    languageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedLanguage = this.getAttribute('data-language');
            activateLanguage(selectedLanguage);
        });
    });

    // Language card click functionality
    const languageCards = document.querySelectorAll('.language-card');
    languageCards.forEach(card => {
        card.addEventListener('click', function() {
            const language = this.getAttribute('data-language');
            activateLanguage(language);
        });
    });

    // Activity buttons functionality
    const activityButtons = document.querySelectorAll('.activity-card .btn');
    activityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.activity-card');
            const title = card.querySelector('h5').textContent;
            showActivityStarted(title);
        });
    });

    // Audio playback functionality
    const audioButtons = document.querySelectorAll('.play-audio');
    audioButtons.forEach(button => {
        button.addEventListener('click', function() {
            const audioId = this.getAttribute('data-audio');
            playAudio(audioId);
        });
    });

    // Quiz functionality
    setupQuiz();

    // Initialize the app
    initializeDashboard();
});

function activateLanguage(language) {
    // Remove active class from all language cards
    document.querySelectorAll('.language-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to selected language card
    document.querySelector(`[data-language="${language}"]`).classList.add('active');
    
    // Update UI based on selected language
    const languageName = language.charAt(0).toUpperCase() + language.slice(1);
    showNotification(`Switched to ${languageName} mode`, 'info');
}

function showActivityStarted(activityName) {
    showNotification(`Starting: ${activityName}`, 'success');
    
    // Add visual feedback
    const button = event.target;
    const originalText = button.textContent;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 1500);
}

function playAudio(audioId) {
    // In a real app, this would play actual audio
    // For this template, we'll simulate the action
    showNotification(`Playing pronunciation for: ${audioId.replace(/-/g, ' ')}`, 'info');
    
    // Visual feedback
    const button = event.target.closest('.play-audio');
    const originalIcon = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    
    setTimeout(() => {
        button.innerHTML = originalIcon;
    }, 1000);
}

function initializeDashboard() {
    // Initialize progress bars with animation
    animateProgressBars();
    
    // Initialize any other dashboard elements
    setupLessonPreviews();
}

function animateProgressBars() {
    // Animate progress bars when they come into view
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-in-out';
            bar.style.width = width;
        }, 300);
    });
}

function setupLessonPreviews() {
    // Set up interactive elements in lesson previews
    const lessonCards = document.querySelectorAll('.lesson-content');
    lessonCards.forEach(card => {
        // Add event listeners for lesson cards if needed
    });
}

function setupQuiz() {
    // Add click functionality to quiz options
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options in the same question
            const question = this.closest('.quiz-question');
            const options = question.querySelectorAll('.quiz-option');
            options.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });
    
    // Add submit functionality to quiz
    const submitButtons = document.querySelectorAll('.quiz-section .btn-primary');
    submitButtons.forEach(button => {
        button.addEventListener('click', function() {
            checkQuizAnswers();
        });
    });
}

function checkQuizAnswers() {
    // In a real app, this would validate answers
    // For the template, we'll just show a notification
    showNotification('Checking your answers...', 'info');
    
    // Simulate processing time
    setTimeout(() => {
        // For demo purposes, mark first option of each question as correct
        const questions = document.querySelectorAll('.quiz-question');
        questions.forEach(question => {
            const options = question.querySelectorAll('.quiz-option');
            // Reset all options
            options.forEach(opt => {
                opt.classList.remove('correct', 'incorrect');
            });
            
            // Mark first option as correct for demo
            options[0].classList.add('correct');
        });
        
        showNotification('Quiz completed! 2/2 correct answers.', 'success');
    }, 1500);
}

function showNotification(message, type) {
    // Create a notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed notification-highlight`;
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    
    notification.innerHTML = `
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Additional utility functions for language learning features
function startQuiz(questions) {
    // Initialize quiz functionality
    console.log('Starting quiz with', questions.length, 'questions');
}

function trackLearningProgress(language, activity) {
    // Track user progress (in a real app, this would connect to a backend)
    console.log(`Progress tracked for ${language} - ${activity}`);
}

// Example function for spaced repetition system
function scheduleReview(language, item, difficulty) {
    let interval;
    
    switch(difficulty) {
        case 'easy':
            interval = 7; // days
            break;
        case 'medium':
            interval = 3;
            break;
        case 'hard':
            interval = 1;
            break;
        default:
            interval = 1;
    }
    
    console.log(`Scheduling review for ${item} in ${interval} days`);
    
    return new Date(Date.now() + interval * 24 * 60 * 60 * 1000);
}

// Function to handle vocabulary practice
function practiceVocabulary(vocabSet, language) {
    // Shuffle vocabulary set
    const shuffled = [...vocabSet].sort(() => Math.random() - 0.5);
    
    console.log(`Practicing ${shuffled.length} vocabulary items in ${language}`);
    return shuffled;
}

// Function to handle grammar exercises
function startGrammarExercise(grammarPoint) {
    console.log(`Starting exercise for grammar point: ${grammarPoint}`);
    // In a real app, this would load the specific exercise
}

// Function to handle lesson progression
function completeLesson(lessonId) {
    console.log(`Marking lesson ${lessonId} as complete`);
    // In a real app, this would update the user's progress
}

// Function placeholder - removed streak tracking as it can be harmful to learning
function updateStreak() {
    // Streak tracking removed to promote healthy learning habits
    // Focus on consistent, sustainable practice rather than daily streaks
}