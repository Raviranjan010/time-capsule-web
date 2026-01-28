// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const soundToggle = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');
const formSection = document.getElementById('formSection');
const countdownSection = document.getElementById('countdownSection');
const unlockedSection = document.getElementById('unlockedSection');
const messageInput = document.getElementById('message');
const unlockTimeInput = document.getElementById('unlockTime');
const capsuleTitleInput = document.getElementById('capsuleTitle');
const displayMessage = document.getElementById('displayMessage');
const charCount = document.getElementById('charCount');
const lockBtn = document.getElementById('lockBtn');
const cancelBtn = document.getElementById('cancelBtn');
const resetBtn = document.getElementById('resetBtn');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const errorMessage = document.getElementById('errorMessage');

// Time elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const unlockDate = document.getElementById('unlockDate');

// Display elements
const capsuleTitleDisplay = document.getElementById('capsuleTitleDisplay');
const capsuleTitleUnlocked = document.getElementById('capsuleTitleUnlocked');
const lockedDateEl = document.getElementById('lockedDate');
const unlockedDateEl = document.getElementById('unlockedDate');

// State
let countdownInterval;
let soundEnabled = true;
let currentColor = 'orange';

// Sound effects (using Web Audio API)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (!soundEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'lock':
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(261.63, audioContext.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
        case 'unlock':
            oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(523.25, audioContext.currentTime + 0.4);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            break;
        case 'click':
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'error':
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
    }
}

// Theme Toggle
themeToggle.addEventListener('click', () => {
    playSound('click');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    // Animate the toggle
    themeToggle.style.transform = 'scale(0.8) rotate(180deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
});

// Sound Toggle
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    
    if (soundEnabled) {
        playSound('click');
    }
    
    // Animate the toggle
    soundToggle.style.transform = 'scale(0.8)';
    setTimeout(() => {
        soundToggle.style.transform = 'scale(1)';
    }, 200);
});

// Character Counter
messageInput.addEventListener('input', () => {
    const count = messageInput.value.length;
    charCount.textContent = count;
    
    if (count > 900) {
        charCount.style.color = 'var(--error-color)';
    } else if (count > 750) {
        charCount.style.color = 'var(--accent-color)';
    } else {
        charCount.style.color = 'var(--text-secondary)';
    }
});

// Quick Time Buttons
document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        playSound('click');
        const hours = parseInt(btn.dataset.hours);
        const now = new Date();
        now.setHours(now.getHours() + hours);
        
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        
        unlockTimeInput.value = `${year}-${month}-${day}T${hour}:${minute}`;
        
        // Animate button
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);
    });
});

// Color Picker
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        playSound('click');
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentColor = btn.dataset.color;
        
        // Update accent color
        const colors = {
            purple: '#667eea',
            blue: '#4facfe',
            pink: '#f093fb',
            green: '#43e97b',
            orange: '#fa709a'
        };
        
        document.documentElement.style.setProperty('--accent-color', colors[currentColor]);
    });
});

// Lock Button
lockBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    const unlockTime = unlockTimeInput.value;
    const title = capsuleTitleInput.value.trim();
    
    // Validation
    if (!message) {
        showError('Please write a message');
        return;
    }
    
    if (!unlockTime) {
        showError('Please select an unlock date and time');
        return;
    }
    
    const unlockDate = new Date(unlockTime);
    const now = new Date();
    
    if (unlockDate <= now) {
        showError('Unlock time must be in the future');
        return;
    }
    
    // Save to localStorage
    const capsuleData = {
        message: message,
        unlockTime: unlockTime,
        title: title || 'Untitled Capsule',
        color: currentColor,
        lockedAt: new Date().toISOString()
    };
    
    localStorage.setItem('timeCapsule', JSON.stringify(capsuleData));
    
    playSound('lock');
    startCountdown();
});

// Show Error
function showError(msg) {
    playSound('error');
    errorMessage.textContent = msg;
    errorMessage.classList.add('show');
    
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
}

// Start Countdown
function startCountdown() {
    const data = JSON.parse(localStorage.getItem('timeCapsule'));
    
    // Hide form, show countdown
    formSection.classList.add('hidden');
    countdownSection.classList.remove('hidden');
    countdownSection.classList.add('active');
    
    // Set color theme
    const colors = {
        purple: { start: '#667eea', end: '#764ba2' },
        blue: { start: '#4facfe', end: '#00f2fe' },
        pink: { start: '#f093fb', end: '#f5576c' },
        green: { start: '#43e97b', end: '#38f9d7' },
        orange: { start: '#fa709a', end: '#fee140' }
    };
    
    const colorTheme = colors[data.color];
    document.querySelectorAll('.time-card').forEach(card => {
        card.style.background = `linear-gradient(135deg, ${colorTheme.start}, ${colorTheme.end})`;
    });
    progressFill.style.background = `linear-gradient(90deg, ${colorTheme.start}, ${colorTheme.end})`;
    
    // Display title
    if (data.title) {
        capsuleTitleDisplay.textContent = data.title;
    }
    
    // Display unlock date
    const unlockDateTime = new Date(data.unlockTime);
    unlockDate.textContent = unlockDateTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Calculate total duration for progress bar
    const startTime = new Date(data.lockedAt);
    const endTime = new Date(data.unlockTime);
    const totalDuration = endTime - startTime;
    
    // Update countdown
    countdownInterval = setInterval(() => {
        const now = new Date();
        const diff = new Date(data.unlockTime) - now;
        
        if (diff <= 0) {
            clearInterval(countdownInterval);
            unlockCapsule(data);
            return;
        }
        
        // Calculate time units
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Update display with animation
        updateTimeDisplay(daysEl, days);
        updateTimeDisplay(hoursEl, hours);
        updateTimeDisplay(minutesEl, minutes);
        updateTimeDisplay(secondsEl, seconds);
        
        // Update progress bar
        const elapsed = now - startTime;
        const progress = Math.min((elapsed / totalDuration) * 100, 100);
        progressFill.style.width = `${progress}%`;
        progressPercent.textContent = `${Math.floor(progress)}%`;
    }, 1000);
}

// Update Time Display with Animation
function updateTimeDisplay(element, value) {
    const formattedValue = String(value).padStart(2, '0');
    if (element.textContent !== formattedValue) {
        element.style.transform = 'scale(1.2)';
        element.textContent = formattedValue;
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }
}

// Unlock Capsule
function unlockCapsule(data) {
    playSound('unlock');
    
    countdownSection.classList.remove('active');
    countdownSection.classList.add('hidden');
    unlockedSection.classList.remove('hidden');
    unlockedSection.classList.add('active');
    
    displayMessage.textContent = data.message;
    
    if (data.title) {
        capsuleTitleUnlocked.textContent = data.title;
    }
    
    // Display metadata
    const lockedAt = new Date(data.lockedAt);
    lockedDateEl.textContent = lockedAt.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const unlockedAt = new Date();
    unlockedDateEl.textContent = unlockedAt.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Trigger confetti animation
    createConfetti();
}

// Create Confetti Effect
function createConfetti() {
    const colors = ['#667eea', '#48bb78', '#f5576c', '#fee140', '#00f2fe'];
    const confettiContainer = document.querySelector('.unlock-animation');
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = '0s';
            confettiContainer.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 2000);
        }, i * 50);
    }
}

// Copy Button
copyBtn.addEventListener('click', async () => {
    playSound('click');
    const data = JSON.parse(localStorage.getItem('timeCapsule'));
    
    try {
        await navigator.clipboard.writeText(data.message);
        
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="btn-icon">✓</span> Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, #48bb78, #38d39f)';
        copyBtn.style.borderColor = '#48bb78';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
            copyBtn.style.borderColor = '';
        }, 2000);
    } catch (err) {
        showError('Failed to copy message');
    }
});

// Share Button
shareBtn.addEventListener('click', async () => {
    playSound('click');
    const data = JSON.parse(localStorage.getItem('timeCapsule'));
    
    const shareData = {
        title: data.title || 'Time Capsule',
        text: `I just unlocked my time capsule: "${data.message.substring(0, 100)}${data.message.length > 100 ? '...' : ''}"`,
    };
    
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            // Fallback: copy to clipboard
            const shareText = `${shareData.title}\n\n${shareData.text}`;
            await navigator.clipboard.writeText(shareText);
            
            const originalText = shareBtn.innerHTML;
            shareBtn.innerHTML = '<span class="btn-icon">✓</span> Copied!';
            
            setTimeout(() => {
                shareBtn.innerHTML = originalText;
            }, 2000);
        }
    } catch (err) {
        console.error('Share failed:', err);
    }
});

// Cancel Button
cancelBtn.addEventListener('click', () => {
    playSound('click');
    
    if (confirm('Are you sure you want to cancel and reset your time capsule?')) {
        clearInterval(countdownInterval);
        localStorage.removeItem('timeCapsule');
        location.reload();
    }
});

// Reset Button
resetBtn.addEventListener('click', () => {
    playSound('click');
    clearInterval(countdownInterval);
    localStorage.removeItem('timeCapsule');
    location.reload();
});

// Set minimum date/time to now
function setMinDateTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // Minimum 5 minutes from now
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    
    unlockTimeInput.min = `${year}-${month}-${day}T${hour}:${minute}`;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    
    // Load sound preference
    const savedSound = localStorage.getItem('soundEnabled');
    soundEnabled = savedSound === null ? true : savedSound === 'true';
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    
    // Set minimum date/time
    setMinDateTime();
    
    // Check if there's an active capsule
    const savedCapsule = localStorage.getItem('timeCapsule');
    if (savedCapsule) {
        const data = JSON.parse(savedCapsule);
        const unlockTime = new Date(data.unlockTime);
        const now = new Date();
        
        if (unlockTime <= now) {
            // Already unlocked
            unlockCapsule(data);
        } else {
            // Still counting down
            startCountdown();
        }
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to lock message
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !formSection.classList.contains('hidden')) {
            lockBtn.click();
        }
    });
});

// Handle visibility change (pause/resume countdown)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, but keep countdown running
    } else {
        // Page is visible again
        const savedCapsule = localStorage.getItem('timeCapsule');
        if (savedCapsule) {
            const data = JSON.parse(savedCapsule);
            const unlockTime = new Date(data.unlockTime);
            const now = new Date();
            
            // Check if it should be unlocked while user was away
            if (unlockTime <= now && !unlockedSection.classList.contains('active')) {
                clearInterval(countdownInterval);
                unlockCapsule(data);
            }
        }
    }
});

// Prevent accidental page close when countdown is active
window.addEventListener('beforeunload', (e) => {
    const savedCapsule = localStorage.getItem('timeCapsule');
    if (savedCapsule && countdownSection.classList.contains('active')) {
        e.preventDefault();
        e.returnValue = '';
    }
});
