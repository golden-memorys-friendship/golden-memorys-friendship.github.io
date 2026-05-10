import './style.css'

const path = window.location.pathname;
const isHome = path.endsWith('index.html') || path === '/';
const isBond = path.endsWith('bond.html');
const isMemories = path.endsWith('memories.html');
const isConnect = path.endsWith('connect.html');
const musicBtn = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const musicText = document.querySelector('.music-text');
let isPlaying = false;

function toggleMusic() {
  if (isPlaying) {
    bgMusic.pause();
    sessionStorage.setItem('musicPlaying', 'false');
    if (musicBtn) {
      musicBtn.classList.remove('playing');
      musicText.textContent = 'Play';
    }
  } else {
    bgMusic.play().then(() => {
      sessionStorage.setItem('musicPlaying', 'true');
      if (musicBtn) {
        musicBtn.classList.add('playing');
        musicText.textContent = 'Pause';
      }
    }).catch(err => console.log('Audio playback failed', err));
  }
  isPlaying = !isPlaying;
}

if (musicBtn && bgMusic) {
  musicBtn.addEventListener('click', toggleMusic);
}

// Save music time before leaving the page
window.addEventListener('beforeunload', () => {
  if (bgMusic) {
    sessionStorage.setItem('musicTime', bgMusic.currentTime);
  }
});
// Save periodically for mobile browsers
setInterval(() => {
  if (bgMusic && isPlaying) {
    sessionStorage.setItem('musicTime', bgMusic.currentTime);
  }
}, 1000);

// Universal Video Auto-Pause Music Logic
const allVideos = document.querySelectorAll('video');
allVideos.forEach(video => {
  if (bgMusic && video.getAttribute('data-keep-music') !== 'true') {
    video.addEventListener('play', () => {
      if (isPlaying) {
        toggleMusic(); // Pause music
        video.dataset.pausedMusic = 'true'; // Remember we paused it
      }
    });

    video.addEventListener('pause', () => {
      if (video.dataset.pausedMusic === 'true') {
        toggleMusic(); // Resume music
        video.dataset.pausedMusic = 'false';
      }
    });
  }
});

// Cinematic Page Transition Logic (Home Page)
const heroVideo = document.getElementById('hero-video');
if (heroVideo && isHome) {
  heroVideo.addEventListener('ended', () => {
    const transitionScreen = document.createElement('div');
    transitionScreen.className = 'ultra-transition';
    transitionScreen.innerHTML = `
      <div class="transition-circle"></div>
      <h2 class="transition-text">The Journey Continues...</h2>
    `;
    document.body.appendChild(transitionScreen);
    setTimeout(() => transitionScreen.classList.add('active'), 10);
    setTimeout(() => window.location.href = './bond.html', 2800);
  });
}

// Cinematic Transition for Bond Page
if (isBond) {
  const bondVideo = document.querySelector('.bond-section video');
  if (bondVideo) {
    bondVideo.addEventListener('ended', () => {
      const transitionScreen = document.createElement('div');
      transitionScreen.className = 'ultra-transition';
      transitionScreen.innerHTML = `
        <div class="transition-circle"></div>
        <h2 class="transition-text">Cherishing the Moments...</h2>
      `;
      document.body.appendChild(transitionScreen);
      setTimeout(() => transitionScreen.classList.add('active'), 10);
      setTimeout(() => window.location.href = './memories.html', 2800);
    });
  }
}

// Cinematic Transition from Memories to Connect
if (isMemories) {
  const nextBtn = document.getElementById('next-page-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const transitionScreen = document.createElement('div');
      transitionScreen.className = 'ultra-transition';
      transitionScreen.innerHTML = `
        <div class="transition-circle"></div>
        <h2 class="transition-text">A Final Message...</h2>
      `;
      document.body.appendChild(transitionScreen);
      setTimeout(() => transitionScreen.classList.add('active'), 10);
      setTimeout(() => window.location.href = './connect.html', 2800);
    });
  }
}


// Floating Emoji Mascot Logic
const floatingEmoji = document.createElement('div');
floatingEmoji.className = 'floating-emoji-mascot';

if (isHome) {
  floatingEmoji.innerHTML = '👭'; // holding hands
} else if (isBond) {
  floatingEmoji.innerHTML = '👯‍♀️'; // dancing girls
} else if (isMemories) {
  floatingEmoji.innerHTML = '📸'; // camera
} else if (isConnect) {
  floatingEmoji.innerHTML = '🫶'; // heart hands
} else {
  floatingEmoji.innerHTML = '✨';
}
document.body.appendChild(floatingEmoji);

function showMascot() {
  setTimeout(() => {
    floatingEmoji.classList.add('visible');
  }, 1000);
}

// Secret Gate & Session Logic (Home Page)
const secretGate = document.getElementById('secret-gate');
const secretAnswer = document.getElementById('secret-answer');
const secretError = document.getElementById('secret-error');

// Attempt to auto-play music if Home is already unlocked
if (sessionStorage.getItem('unlocked') === 'true') {
  if (secretGate) secretGate.style.display = 'none';
  if (isHome) showMascot(); // Show immediately if already unlocked
  
  if (bgMusic) {
    // Restore playback position
    const savedTime = sessionStorage.getItem('musicTime');
    if (savedTime) {
      bgMusic.currentTime = parseFloat(savedTime);
    }
    
    // Auto-play only if user didn't explicitly pause it
    if (sessionStorage.getItem('musicPlaying') !== 'false') {
      bgMusic.play().then(() => {
        sessionStorage.setItem('musicPlaying', 'true');
        if (musicBtn) {
          musicBtn.classList.add('playing');
          musicText.textContent = 'Pause';
        }
        isPlaying = true;
      }).catch(err => console.log('Autoplay blocked on navigation'));
    }
  }
}

// Show immediately on pages without locks (Connect only now)
if (!isHome && !isBond && !isMemories) {
  showMascot();
}


if (secretGate && secretAnswer && sessionStorage.getItem('unlocked') !== 'true') {
  document.body.style.overflow = 'hidden';
  secretAnswer.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || secretAnswer.value.trim().length >= 2) {
      if (secretAnswer.value.trim() === '24') {
        sessionStorage.setItem('unlocked', 'true');
        secretGate.style.opacity = '0';
        document.body.style.overflow = '';
        
        if (!isPlaying && bgMusic) {
          toggleMusic();
        }

        setTimeout(() => {
          secretGate.style.display = 'none';
          showMascot(); // Show on fresh unlock
        }, 800);
      } else if (secretAnswer.value.trim().length >= 2) {
        secretError.textContent = "Incorrect answer. Try again!";
        secretError.style.opacity = '1';
        secretAnswer.value = '';
        setTimeout(() => secretError.style.opacity = '0', 2000);
      }
    }
  });
}

// Secret Gate & Session Logic (Memories Page -> Now on Bond page)
const secretGateMemories = document.getElementById('secret-gate-memories');
const secretAnswerMemories = document.getElementById('secret-answer-memories');
const secretErrorMemories = document.getElementById('secret-error-memories');

if (secretGateMemories && secretAnswerMemories) {
  if (sessionStorage.getItem('memoriesUnlocked') === 'true') {
    secretGateMemories.style.display = 'none';
    if (isBond) showMascot();
  } else {
    document.body.style.overflow = 'hidden';
    secretAnswerMemories.addEventListener('keyup', (e) => {
      const normalizedAnswer = secretAnswerMemories.value.toLowerCase().replace(/\s+/g, '');
      const correctAnswer = "july22,2023";
      
      if (e.key === 'Enter' || normalizedAnswer.length >= correctAnswer.length) {
        if (normalizedAnswer === correctAnswer) {
          sessionStorage.setItem('memoriesUnlocked', 'true');
          secretGateMemories.style.opacity = '0';
          document.body.style.overflow = '';
          setTimeout(() => {
            secretGateMemories.style.display = 'none';
            showMascot();
          }, 800);
        } else if (e.key === 'Enter' || normalizedAnswer.length >= correctAnswer.length) {
          secretErrorMemories.textContent = "Incorrect answer. Try again!";
          secretErrorMemories.style.opacity = '1';
          secretAnswerMemories.value = '';
          setTimeout(() => secretErrorMemories.style.opacity = '0', 2000);
        }
      }
    });
  }
}

// Secret Gate Logic (Third Page -> Memories/Gallery)
const secretGateGallery = document.getElementById('secret-gate-gallery');
const secretAnswerGallery = document.getElementById('secret-answer-gallery');
const secretErrorGallery = document.getElementById('secret-error-gallery');

if (secretGateGallery && secretAnswerGallery) {
  if (sessionStorage.getItem('galleryUnlocked') === 'true') {
    secretGateGallery.style.display = 'none';
    if (isMemories) showMascot();
  } else {
    document.body.style.overflow = 'hidden';
    secretAnswerGallery.addEventListener('keyup', (e) => {
      const val = secretAnswerGallery.value.trim().toLowerCase();
      const correct = "black";
      
      if (e.key === 'Enter' || val.length >= correct.length) {
        if (val === correct) {
          sessionStorage.setItem('galleryUnlocked', 'true');
          secretGateGallery.style.opacity = '0';
          document.body.style.overflow = '';
          setTimeout(() => {
            secretGateGallery.style.display = 'none';
            showMascot();
          }, 800);
        } else if (e.key === 'Enter' || val.length >= correct.length) {
          secretErrorGallery.textContent = "Incorrect color. Look closer at the first page!";
          secretErrorGallery.style.opacity = '1';
          secretAnswerGallery.value = '';
          setTimeout(() => secretErrorGallery.style.opacity = '0', 2000);
        }
      }
    });
  }
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// Populate Gallery dynamically
const galleryTrack = document.getElementById('galleryTrack');

// We use placeholders that look aesthetic, plus our generated images
const memories = [
  { src: './memories/WhatsApp Image 2026-05-10 at 8.10.44 AM (1).jpeg', type: 'image', title: 'Memories', desc: 'Always together.' },
  { src: './memories/WhatsApp Image 2026-05-10 at 8.10.44 AM (2).jpeg', type: 'image', title: 'Fun Times', desc: 'Laughter and joy.' },
  { src: './memories/WhatsApp Image 2026-05-10 at 8.10.44 AM.jpeg', type: 'image', title: 'Our Bond', desc: 'Unbreakable connection.' },
  { src: './memories/WhatsApp Image 2026-05-10 at 8.10.45 AM (1).jpeg', type: 'image', title: 'Adventures', desc: 'Exploring the world.' },
  { src: './memories/WhatsApp Image 2026-05-10 at 8.10.45 AM (2).jpeg', type: 'image', title: 'Smiles', desc: 'Happiness is with you.' },
  { src: './memories/WhatsApp Image 2026-05-10 at 8.10.45 AM.jpeg', type: 'image', title: 'Good Vibes', desc: 'Chilling out.' },
  { src: './memories/WhatsApp Image 2026-05-10 at 8.10.46 AM (1).jpeg', type: 'image', title: 'Sweet Moments', desc: 'Cherishing these days.' },
  { src: './memories/WhatsApp Image 2026-05-10 at 8.10.46 AM.jpeg', type: 'image', title: 'Together', desc: 'Best friends forever.' },
  { src: './memories/WhatsApp Image 2026-05-10 at 8.10.47 AM.jpeg', type: 'image', title: 'Forever', desc: 'No matter what.' },
  { src: './memories/WhatsApp Image 2026-05-10 at 8.10.48 AM.jpeg', type: 'image', title: 'Collage Love', desc: 'Beautiful moments combined.' },
  { src: './memories/WhatsApp Image 2026-05-10 at 8.10.48 AM (1).jpeg', type: 'image', title: 'Uyireeee', desc: 'My life, my soul.' },
  { src: './memories/WhatsApp Image 2026-05-10 at 8.10.48 AM (2).jpeg', type: 'image', title: 'Holding Hands', desc: 'A promise to stay.' },
  { src: './memories/WhatsApp Image 2026-05-10 at 8.10.49 AM.jpeg', type: 'image', title: 'Heart Shapes', desc: 'Love in every gesture.' },
  { src: './memories/WhatsApp Image 2026-05-10 at 8.10.49 AM (1).jpeg', type: 'image', title: 'Group Selfie', desc: 'The best crew.' },
  { src: './memories/WhatsApp Image 2026-05-10 at 8.10.49 AM (2).jpeg', type: 'image', title: 'Pure Joy', desc: 'Smiles that light up the room.' }
];

if (galleryTrack) {
  memories.forEach((memory, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item-new tilt-card';
    
    // Stagger animation based on index
    item.style.animationDelay = `${index * 0.1}s`;
    
    let mediaElement = '';
    if (memory.type === 'video') {
      mediaElement = `<video src="${memory.src}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit; pointer-events: none;"></video>`;
    } else {
      mediaElement = `<img src="${memory.src}" alt="${memory.title}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit; pointer-events: none;">`;
    }
    
    item.innerHTML = `
      ${mediaElement}
      <div class="gallery-overlay">
        <h3 style="margin-bottom: 0.5rem; font-family: 'Playfair Display', serif;">${memory.title}</h3>
        <p style="font-size: 0.9rem; color: rgba(255,255,255,0.8);">${memory.desc}</p>
      </div>
    `;
    
    item.addEventListener('click', () => openLightbox(memory));
    galleryTrack.appendChild(item);
  });
}

// Floating Particles Effect
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * -0.5 - 0.2;
    this.speedX = (Math.random() - 0.5) * 0.5;
    // Glowing pink/purple colors
    const colors = ['rgba(255, 126, 179, 0.4)', 'rgba(255, 117, 140, 0.4)', 'rgba(138, 35, 135, 0.4)'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    
    // Reset if it goes off screen
    if (this.y < 0) {
      this.y = height;
      this.x = Math.random() * width;
    }
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
  }
  
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const particleCount = window.innerWidth > 768 ? 100 : 40;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}
initParticles();

function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Intersection Observer for Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Select elements to animate that aren't already animated on load
document.querySelectorAll('.bond-text, .bond-image, .connect-grid').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  observer.observe(el);
});

// Parallax Effect
const heroBg = document.querySelector('.hero-bg-image');
const floatingBadges = document.querySelectorAll('.floating-badge');
const mainGlass = document.querySelector('.main-glass');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  
  if (heroBg) {
    // Move background down at half the scroll speed
    heroBg.style.transform = `translate3d(0, ${scrollY * 0.5}px, 0) scale(1.1)`;
  }
  
  if (mainGlass) {
    // Subtle parallax for the main card
    mainGlass.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
  }
  
  floatingBadges.forEach((badge, index) => {
    // Different speed for different badges based on index
    const speed = index === 0 ? -0.15 : 0.25;
    // The CSS animation uses transform, so we apply the parallax to margin-top or use a wrapper.
    // However, CSS animation `float` transforms Y. Overriding transform might kill the float animation.
    // Instead, we can apply parallax to `top` or `bottom` properties for these absolute elements!
    if (index === 0) {
      badge.style.marginTop = `${scrollY * speed}px`;
    } else {
      badge.style.marginBottom = `${scrollY * speed * -1}px`;
    }
  });
});
// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

function openLightbox(memory) {
  if (memory.type === 'video') {
    lightboxImg.style.display = 'none';
    lightboxVideo.style.display = 'block';
    lightboxVideo.src = memory.src;
  } else {
    lightboxVideo.style.display = 'none';
    lightboxImg.style.display = 'block';
    lightboxImg.src = memory.src;
  }
  lightboxCaption.innerHTML = `<h3>${memory.title}</h3><p style="font-size:1.1rem; color:rgba(255,255,255,0.8);">${memory.desc}</p>`;
  lightbox.classList.add('active');
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    if (lightboxVideo) lightboxVideo.pause();
  });
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      if (lightboxVideo) lightboxVideo.pause();
    }
  });
}

// Custom Cursor Logic
let cursor = document.querySelector('.cursor');
let follower = document.querySelector('.cursor-follower');

if (!cursor) {
  cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);
}
if (!follower) {
  follower = document.createElement('div');
  follower.className = 'cursor-follower';
  document.body.appendChild(follower);
}

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    cursor.style.opacity = '1';
  }
  if (follower) {
    follower.style.opacity = '1';
  }
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.15;
  followerY += (mouseY - followerY) * 0.15;
  if (follower) {
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Magnetic hover effect for Custom Cursor
document.querySelectorAll('a, button, input, textarea, .gallery-item, .lightbox-close').forEach(el => {
  el.addEventListener('mouseenter', () => { if (follower) follower.classList.add('active'); });
  el.addEventListener('mouseleave', () => { if (follower) follower.classList.remove('active'); });
});

// Pro Level 3D Tilt Effect
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = ((y - centerY) / centerY) * -10; // Max 10deg
    const tiltY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'none';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
  });
});

// Premium Staggered Page Transition Logic
const transitionContainer = document.createElement('div');
transitionContainer.style.position = 'fixed';
transitionContainer.style.top = '0';
transitionContainer.style.left = '0';
transitionContainer.style.width = '100vw';
transitionContainer.style.height = '100vh';
transitionContainer.style.zIndex = '9999999';
transitionContainer.style.pointerEvents = 'none';
transitionContainer.style.display = 'flex';
document.body.appendChild(transitionContainer);

const transitionBars = [];
for(let i = 0; i < 5; i++) {
  const bar = document.createElement('div');
  bar.style.flex = '1';
  bar.style.height = '100%';
  bar.style.backgroundColor = '#130428'; // Deep dark purple matching theme
  bar.style.borderRight = '1px solid rgba(255,126,179,0.05)';
  bar.style.transform = 'translateY(100%)';
  bar.style.transition = 'transform 0.6s cubic-bezier(0.85, 0, 0.15, 1)';
  transitionContainer.appendChild(bar);
  transitionBars.push(bar);
}

// Entrance Animation (Slide up to reveal page)
window.addEventListener('load', () => {
  transitionBars.forEach(bar => {
    bar.style.transition = 'none';
    bar.style.transform = 'translateY(0)';
  });
  
  void transitionContainer.offsetWidth; // reflow
  
  transitionBars.forEach((bar, index) => {
    setTimeout(() => {
      bar.style.transition = 'transform 0.7s cubic-bezier(0.85, 0, 0.15, 1)';
      bar.style.transform = 'translateY(-100%)';
    }, index * 80);
  });
});

// Exit Animation (Slide up to cover page)
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = link.getAttribute('href');
    if (target && target.endsWith('.html')) {
      e.preventDefault();
      
      transitionBars.forEach(bar => {
        bar.style.transition = 'none';
        bar.style.transform = 'translateY(100%)';
      });
      
      void transitionContainer.offsetWidth;
      
      transitionBars.forEach((bar, index) => {
        setTimeout(() => {
          bar.style.transition = 'transform 0.7s cubic-bezier(0.85, 0, 0.15, 1)';
          bar.style.transform = 'translateY(0)';
        }, index * 80);
      });
      
      setTimeout(() => {
        window.location.href = target;
      }, 700 + (transitionBars.length * 80));
    }
  });
});

// Physical Magnetic Button Effect
const magneticElements = document.querySelectorAll('[data-magnetic]');
magneticElements.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    btn.style.transition = 'none';
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = `translate(0px, 0px)`;
    btn.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
  });
});


// Background Music Logic
if (musicBtn) {
  // Add magnetic cursor hover effect to music button
  musicBtn.addEventListener('mouseenter', () => { if (follower) follower.classList.add('active'); });
  musicBtn.addEventListener('mouseleave', () => { if (follower) follower.classList.remove('active'); });
}

// Add Global Scroll Animations (AOS)
const globalScrollObserverOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const globalScrollObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-reveal');
      observer.unobserve(entry.target);
    }
  });
}, globalScrollObserverOptions);

document.querySelectorAll('h1, h2, h3, p, .glass-card, video').forEach((el, index) => {
  if (!el.classList.contains('gallery-item-new') && !el.closest('#farewell-overlay') && !el.closest('.lightbox')) {
    el.classList.add('reveal-hidden');
    el.style.transitionDelay = `${(index % 5) * 0.1}s`;
    globalScrollObserver.observe(el);
  }
});
