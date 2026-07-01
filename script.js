// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeAudio();
    initializeScrollAnimations();
    handleViewportHeight();
});

// ========================================
// GERENCIAMENTO DE ÁUDIO
// ======================================== 

let audioElement = null;
let isAudioPlaying = false;

function initializeAudio() {
    audioElement = document.createElement('audio');
    audioElement.id = 'background-music';
    audioElement.src = 'background-music.wav';
    audioElement.loop = true;
    audioElement.volume = 0.3;
    audioElement.preload = 'auto';
    document.body.appendChild(audioElement);
    
    createAudioControl();
    attemptAutoPlay();
}

function createAudioControl() {
    const audioControl = document.createElement('div');
    audioControl.id = 'audio-control';
    audioControl.innerHTML = `
        <button id="audio-toggle" class="audio-toggle" title="Ativar/Desativar Música">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="audio-icon">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>
            </svg>
        </button>
    `;
    document.body.appendChild(audioControl);
    
    const style = document.createElement('style');
    style.textContent = `
        #audio-control {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
        }
        
        .audio-toggle {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #B2AC88 0%, #708238 100%);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(112, 130, 56, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }
        
        .audio-icon {
            width: 24px;
            height: 24px;
        }
        
        .audio-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 24px rgba(112, 130, 56, 0.4);
            border-color: rgba(255, 255, 255, 0.5);
        }
        
        .audio-toggle:active {
            transform: scale(0.95);
        }
        
        .audio-toggle.muted {
            background: linear-gradient(135deg, rgba(178, 172, 136, 0.5) 0%, rgba(112, 130, 56, 0.5) 100%);
            opacity: 0.7;
        }
        
        @media (max-width: 768px) {
            #audio-control {
                bottom: 20px;
                right: 20px;
            }
            
            .audio-toggle {
                width: 45px;
                height: 45px;
            }
            
            .audio-icon {
                width: 22px;
                height: 22px;
            }
        }
        
        @media (max-width: 480px) {
            #audio-control {
                bottom: 15px;
                right: 15px;
            }
            
            .audio-toggle {
                width: 40px;
                height: 40px;
            }
            
            .audio-icon {
                width: 20px;
                height: 20px;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.getElementById('audio-toggle').addEventListener('click', toggleAudio);
}

function attemptAutoPlay() {
    const playPromise = audioElement.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                isAudioPlaying = true;
                updateAudioButton();
            })
            .catch(() => {
                addUserInteractionListener();
            });
    }
}

function addUserInteractionListener() {
    const events = ['click', 'touchstart'];
    
    events.forEach(event => {
        document.addEventListener(event, function playOnInteraction() {
            if (!isAudioPlaying && audioElement) {
                audioElement.play().then(() => {
                    isAudioPlaying = true;
                    updateAudioButton();
                }).catch(err => console.log('Erro ao reproduzir áudio:', err));
            }
            events.forEach(e => document.removeEventListener(e, playOnInteraction));
        }, { once: true });
    });
}

function toggleAudio() {
    if (isAudioPlaying) {
        audioElement.pause();
        isAudioPlaying = false;
    } else {
        audioElement.play().catch(err => console.log('Erro ao reproduzir áudio:', err));
        isAudioPlaying = true;
    }
    updateAudioButton();
}

function updateAudioButton() {
    const button = document.getElementById('audio-toggle');
    if (button) {
        const svg = button.querySelector('svg');
        if (svg) {
            if (isAudioPlaying) {
                svg.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>';
            } else {
                svg.innerHTML = '<path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16216899 C3.34915502,0.9050716 2.40734225,1.01519454 1.77946707,1.4864866 C0.994623095,2.11788954 0.837654326,3.20738225 1.15159189,3.99289916 L3.03521743,10.4338922 C3.03521743,10.5909896 3.34915502,10.7480871 3.50612381,10.7480871 L16.6915026,11.5335739 C16.6915026,11.5335739 17.1624089,11.5335739 17.1624089,12.0048660 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" fill="currentColor"/>';
            }
        }
        button.classList.toggle('muted', !isAudioPlaying);
        button.title = isAudioPlaying ? 'Desativar Música' : 'Ativar Música';
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.invitation-container, .detail-item, .location-wrapper, .comfort-container, .closing-content, .confirmation-content').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// VIEWPORT HEIGHT FIX
// ========================================

function handleViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    window.addEventListener('resize', () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
}

// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========================================
// CONSOLE LOG
// ========================================

console.log('%c🎉 Convite de Noivado - Anderson & Janine', 'color: #B2AC88; font-size: 16px; font-weight: bold;');
console.log('%cDesenvolvido com amor ❤️', 'color: #708238; font-size: 12px;');
