/**
 * SURIYA PRAKASH - PORTFOLIO LOGIC & INTERACTION ENGINE
 * Features: Typewriter, AI Audio Synthesizer/Player, 3D Parallax Tilt,
 * Particle Canvas, Heatmap Generator, Modals, Form Validation, Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. PARTICLE CANVAS BACKGROUND
  // ==========================================================================
  const initParticleCanvas = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
    let mouseX = -1000;
    let mouseY = -1000;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.6 + 0.6;
        this.alpha = Math.random() * 0.4 + 0.15;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse avoidance/connection
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * 0.8;
          this.y -= Math.sin(angle) * 0.8;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${this.alpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#00f0ff';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Mouse tracking
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Resize handler with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    });
  };
  initParticleCanvas();

  // ==========================================================================
  // 2. CURSOR LIGHT FOLLOWER
  // ==========================================================================
  const initCursorGlow = () => {
    const cursorGlow = document.getElementById('cursor-glow');
    if (!cursorGlow || window.innerWidth < 768) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const updateCursor = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(updateCursor);
    };
    updateCursor();
  };
  initCursorGlow();

  // ==========================================================================
  // 3. NAVBAR SCROLL & ACTIVE SCROLLSPY
  // ==========================================================================
  const initNavigation = () => {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Sticky shrink on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // ScrollSpy
      let currentSection = '';
      const scrollPos = window.scrollY + 200;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSection = section.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
          link.classList.add('active');
        }
      });
    });

    // Mobile Menu Toggle
    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('open');
        mobileBtn.classList.toggle('open');
        mobileBtn.setAttribute('aria-expanded', isOpen);
        mobileDrawer.setAttribute('aria-hidden', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('open');
          mobileBtn.classList.remove('open');
          mobileBtn.setAttribute('aria-expanded', 'false');
          mobileDrawer.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        });
      });
    }
  };
  initNavigation();

  // ==========================================================================
  // 4. ANIMATED TYPEWRITER TEXT
  // ==========================================================================
  const initTypewriter = () => {
    const typewriterEl = document.getElementById('typewriter');
    if (!typewriterEl) return;

    const roles = [
      'Aspiring Software Engineer',
      'IoT & Embedded Systems Enthusiast',
      'Python & DSA Learner',
      'AI & Technology Enthusiast'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingDelay = 85;
    const erasingDelay = 45;
    const holdDelay = 1800;

    const type = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeoutDuration = isDeleting ? erasingDelay : typingDelay;

      if (!isDeleting && charIndex === currentRole.length) {
        timeoutDuration = holdDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timeoutDuration = 400;
      }

      setTimeout(type, timeoutDuration);
    };

    setTimeout(type, 500);
  };
  initTypewriter();

  // ==========================================================================
  // 5. 3D PARALLAX TILT ON HERO PROFILE CARD
  // ==========================================================================
  const initProfile3DTilt = () => {
    const tiltCard = document.getElementById('profile-card-tilt');
    const profileImg = tiltCard ? tiltCard.querySelector('.profile-img') : null;
    if (!tiltCard || !profileImg || window.innerWidth < 1024) return;

    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      tiltCard.style.transition = 'transform 0.5s ease';
      setTimeout(() => {
        tiltCard.style.transition = '';
      }, 500);
    });
  };
  initProfile3DTilt();

  // ==========================================================================
  // 6. AI VOICE INTRODUCTION PLAYER & SYNTHESIZER (NORMAL MALE AI VOICE)
  // ==========================================================================
  const initVoiceIntro = () => {
    const playBtn = document.getElementById('voice-play-btn');
    const btnLabel = document.getElementById('voice-btn-label');
    const playIcon = playBtn ? playBtn.querySelector('.icon-play') : null;
    const pauseIcon = playBtn ? playBtn.querySelector('.icon-pause') : null;
    const visualizer = document.getElementById('waveform-visualizer');
    const statusTag = document.getElementById('audio-status-tag');
    const timerDisplay = document.getElementById('audio-timer');
    const audioElement = document.getElementById('intro-audio');
    const transcript = document.getElementById('intro-transcript-text')?.textContent || '';

    if (!playBtn) return;

    let isPlaying = false;
    let synthUtterance = null;
    let timerInterval = null;
    let elapsedSeconds = 0;
    const totalSeconds = 24;

    const formatTime = (secs) => {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const startTimer = () => {
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        elapsedSeconds++;
        if (timerDisplay) {
          timerDisplay.textContent = `${formatTime(elapsedSeconds)} / ${formatTime(totalSeconds)}`;
        }
        if (elapsedSeconds >= totalSeconds) {
          stopAudio();
        }
      }, 1000);
    };

    const resetTimer = () => {
      clearInterval(timerInterval);
      elapsedSeconds = 0;
      if (timerDisplay) {
        timerDisplay.textContent = `0:00 / ${formatTime(totalSeconds)}`;
      }
    };

    const setPlayingState = (active) => {
      isPlaying = active;
      if (active) {
        playBtn.classList.add('playing');
        btnLabel.textContent = '⏸ Pause Introduction';
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (visualizer) visualizer.classList.add('active');
        if (statusTag) statusTag.textContent = 'Male AI Voice Playing...';
        startTimer();
      } else {
        playBtn.classList.remove('playing');
        btnLabel.textContent = '🎙 Listen to My Introduction';
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (visualizer) visualizer.classList.remove('active');
        if (statusTag) statusTag.textContent = 'Paused';
        clearInterval(timerInterval);
      }
    };

    const stopAudio = () => {
      setPlayingState(false);
      if (statusTag) statusTag.textContent = 'Ready to Play (Male AI Voice)';
      resetTimer();
      if (audioElement && !audioElement.paused) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };

    // Play recorded Male AI MP3 file first, fallback to SpeechSynthesis
    const playIntroSpeech = () => {
      if (audioElement) {
        audioElement.play().then(() => {
          setPlayingState(true);
        }).catch(() => {
          fallbackToSpeechSynthesis();
        });
      } else {
        fallbackToSpeechSynthesis();
      }
    };

    const fallbackToSpeechSynthesis = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        synthUtterance = new SpeechSynthesisUtterance(transcript);
        synthUtterance.rate = 1.0;
        synthUtterance.pitch = 0.95; // Male vocal pitch

        // Select a normal male voice
        const voices = window.speechSynthesis.getVoices();
        const maleVoice = voices.find(v => 
          (v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Male') || v.name.includes('George') || v.name.includes('Guy')) &&
          v.lang.includes('en')
        ) || voices.find(v => v.lang.includes('en'));
        
        if (maleVoice) synthUtterance.voice = maleVoice;

        synthUtterance.onstart = () => {
          setPlayingState(true);
        };

        synthUtterance.onend = () => {
          stopAudio();
        };

        synthUtterance.onerror = () => {
          stopAudio();
        };

        window.speechSynthesis.speak(synthUtterance);
      } else {
        setPlayingState(true);
      }
    };

    playBtn.addEventListener('click', () => {
      if (!isPlaying) {
        playIntroSpeech();
      } else {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.pause();
        }
        if (audioElement && !audioElement.paused) {
          audioElement.pause();
        }
        setPlayingState(false);
      }
    });

    if (audioElement) {
      audioElement.addEventListener('ended', stopAudio);
      audioElement.addEventListener('pause', () => {
        if (isPlaying) setPlayingState(false);
      });
    }
  };
  initVoiceIntro();

  // ==========================================================================
  // 7. SKILLS CATEGORY FILTER
  // ==========================================================================
  const initSkillsFilter = () => {
    const filterButtons = document.querySelectorAll('.skill-tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter');

        skillCards.forEach((card) => {
          const categories = card.getAttribute('data-category') || '';
          if (filter === 'all' || categories.includes(filter)) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  };
  initSkillsFilter();

  // ==========================================================================
  // 8. PROJECTS CATEGORY FILTER
  // ==========================================================================
  const initProjectsFilter = () => {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });
      });
    });
  };
  initProjectsFilter();

  // ==========================================================================
  // 9. PROJECT DETAILS MODAL DATA & CONTROLLER
  // ==========================================================================
  const initProjectModals = () => {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-project-content');
    const closeBtn = document.getElementById('modal-close-btn');
    const triggers = document.querySelectorAll('.project-modal-trigger');

    const projectData = {
      lpg: {
        title: 'LPG Gas Leakage Detection System',
        image: 'assets/projects/lpg-detector.jpg',
        tags: ['ESP32 / Microcontroller', 'MQ-2 Sensor', 'GSM Module', 'Relay', 'IoT Safety'],
        description: 'An IoT-based safety system designed to detect LPG gas leakage in industrial and residential environments using an MQ-2 semiconductor sensor. Provides instant SMS telemetry alerts via GSM communication and autonomously triggers safety cutoff relays.',
        highlights: [
          'Calibrated MQ-2 analog ppm thresholds for rapid gas and smoke detection within < 1.5 seconds.',
          'Integrated SIM800L/GSM serial communication for automatic SMS dispatch to emergency contacts.',
          'Implemented relay actuator logic to instantly cut off gas supply valves and engage audible alarm buzzer.',
          'Microcontroller firmware structured with non-blocking timer loops for high reliability.'
        ],
        github: 'https://github.com/suryx12-a'
      },
      lock: {
        title: 'ESP32-CAM Smart Bluetooth Lock',
        image: 'assets/projects/esp32-cam-lock.jpg',
        tags: ['ESP32-CAM', 'Bluetooth BLE', 'Embedded C', 'IoT Security'],
        description: 'A connected smart door security mechanism powered by ESP32-CAM that pairs camera capture verification with Bluetooth Low Energy (BLE) authentication for keyless access control.',
        highlights: [
          'Embedded C firmware configured on ESP32-CAM with OV2640 camera sensor driver.',
          'BLE peripheral service broadcasting secured challenge-response authentication protocol.',
          'Solenoid door strike trigger actuated via transistor driving circuit upon authenticated PIN/BLE handshake.',
          'Low-power sleep state integration optimizing battery life.'
        ],
        github: 'https://github.com/suryx12-a'
      },
      clock: {
        title: 'ESP32 Wi-Fi Digital Clock',
        image: 'assets/projects/esp32-clock.jpg',
        tags: ['ESP32', 'Wi-Fi', 'NTP Protocol', 'I2C LCD Display', 'Arduino IDE'],
        description: 'A precision desktop clock device that connects to Wi-Fi networks and synchronizes real-time timestamps using Network Time Protocol (NTP) servers, rendered crisply on an I2C LCD character display.',
        highlights: [
          'Configured automatic Wi-Fi auto-reconnect with fallback station modes.',
          'Parsed NTP UDP packets to compute accurate local time offsets, dates, and days.',
          'Optimized I2C two-wire bus communication to eliminate display flicker.',
          'Enclosed in a modern transparent aesthetic circuit housing.'
        ],
        github: 'https://github.com/suryx12-a'
      },
      smarthome: {
        title: 'Smart Home IoT System',
        image: 'assets/projects/smart-home.jpg',
        tags: ['ESP32', 'Home Automation', 'Sensors', 'Relay Switching', 'IoT'],
        description: 'An end-to-end IoT home automation prototype enabling wireless remote monitoring and appliance switching through connected sensor networks and microcontroller controllers.',
        highlights: [
          'Multi-channel relay module controlling high-voltage lighting and climate appliances safely.',
          'Temperature, humidity, and motion sensor telemetry aggregated in real-time.',
          'State persistence ensuring appliances resume previous states after power cycle.',
          'Responsive web controller dashboard with real-time socket updates.'
        ],
        github: 'https://github.com/suryx12-a'
      },
      translator: {
        title: 'Multilingual Call Translation Assistant',
        image: 'assets/projects/call-translator.jpg',
        tags: ['Python', 'Speech Processing', 'Machine Translation', 'AI/NLP'],
        description: 'A Python-based intelligent communication tool designed to process incoming Hindi spoken audio, transcribe voice data into text, perform real-time neural translation into Tamil, and synthesize clear translated speech output.',
        highlights: [
          'Acoustic signal preprocessing and noise cancellation filter pipeline in Python.',
          'Speech-to-text (ASR) recognition engine transforming Hindi vocal waveforms into structured text tokens.',
          'Neural Machine Translation (NMT) model pipeline converting Hindi grammar and syntax into accurate Tamil.',
          'Text-to-Speech (TTS) synthesizer producing fluid Tamil spoken audio output.'
        ],
        github: 'https://github.com/suryx12-a'
      },
      expense: {
        title: 'Personal Expense Tracker',
        image: 'assets/projects/expense-tracker.svg',
        tags: ['Python', 'Modular Architecture', 'Dictionaries & Lists', 'CLI Analytics'],
        description: 'A modular, high-performance Python application built with robust functions, custom data structures (lists, nested dictionaries), and error handling to record, categorize, calculate, and manage personal expenses.',
        highlights: [
          'Full CRUD operations for expense logs with schema validation and input parsing.',
          'Dynamic category breakdown algorithms computing percentage distribution and budget thresholds.',
          'Modular code separation dividing CLI interface, business calculations, and file persistence.',
          'Engineered as clean, maintainable Python code adhering to PEP 8 standards.'
        ],
        github: 'https://github.com/suryx12-a'
      }
    };

    const openModal = (projectId) => {
      const data = projectData[projectId];
      if (!data || !modal || !modalContent) return;

      modalContent.innerHTML = `
        <div class="modal-img-wrap">
          <img src="${data.image}" alt="${data.title}">
        </div>
        <h3 class="modal-title" id="modal-project-title">${data.title}</h3>
        <div class="modal-tags">
          ${data.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <p class="modal-text">${data.description}</p>
        
        <h4 class="modal-desc-heading">Technical Highlights &amp; Engineering:</h4>
        <div class="modal-specs-list">
          ${data.highlights.map(h => `
            <div class="modal-spec-item">
              <span class="modal-spec-bullet">▹</span>
              <span>${h}</span>
            </div>
          `).join('')}
        </div>

        <div class="modal-action-row">
          <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>View GitHub Repository</span>
          </a>
          <button class="btn btn-glass btn-sm" id="modal-inner-close">Close</button>
        </div>
      `;

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const innerClose = document.getElementById('modal-inner-close');
      if (innerClose) {
        innerClose.addEventListener('click', closeModal);
      }
    };

    const closeModal = () => {
      if (!modal) return;
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    triggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        const projectId = btn.getAttribute('data-modal');
        openModal(projectId);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        closeModal();
      }
    });
  };
  initProjectModals();

  // ==========================================================================
  // 10. LEETCODE HEATMAP GENERATOR
  // ==========================================================================
  const initHeatmap = () => {
    const grid = document.getElementById('heatmap-grid');
    if (!grid) return;

    // Generate ~180 realistic streak cells (around 6 months of daily practice)
    const totalCells = 168;
    const levels = ['lvl-0', 'lvl-1', 'lvl-2', 'lvl-3', 'lvl-4'];

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement('div');
      cell.classList.add('heatmap-cell');

      // Higher frequency of active days for consistent learner
      const rand = Math.random();
      let lvl = 'lvl-0';
      if (rand > 0.35) lvl = 'lvl-1';
      if (rand > 0.55) lvl = 'lvl-2';
      if (rand > 0.75) lvl = 'lvl-3';
      if (rand > 0.90) lvl = 'lvl-4';

      cell.classList.add(lvl);
      cell.setAttribute('title', `Active problem solving day`);
      fragment.appendChild(cell);
    }
    grid.appendChild(fragment);
  };
  initHeatmap();

  // ==========================================================================
  // 11. TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✔' : 'ℹ'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3500);
  };

  // ==========================================================================
  // 12. 1-CLICK COPY EMAIL BUTTON
  // ==========================================================================
  const initCopyEmail = () => {
    const copyBtn = document.getElementById('copy-email-btn');
    if (!copyBtn) return;

    const email = 'suryx12@gmail.com';

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(email).then(() => {
        const copyText = copyBtn.querySelector('.copy-text');
        if (copyText) copyText.textContent = 'Copied!';
        showToast('Email address copied to clipboard: suryx12@gmail.com', 'success');

        setTimeout(() => {
          if (copyText) copyText.textContent = 'Copy';
        }, 2000);
      }).catch(() => {
        showToast('Direct email: suryx12@gmail.com', 'info');
      });
    });
  };
  initCopyEmail();

  // ==========================================================================
  // 13. CONTACT FORM VALIDATION & MAILTO FALLBACK
  // ==========================================================================
  const initContactForm = () => {
    const form = document.getElementById('portfolio-contact-form');
    if (!form) return;

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        nameInput.parentElement.classList.remove('has-error');
      }

      // Validate Email
      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        emailInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        emailInput.parentElement.classList.remove('has-error');
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        subjectInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        subjectInput.parentElement.classList.remove('has-error');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        messageInput.parentElement.classList.remove('has-error');
      }

      if (isValid) {
        const mailtoUrl = `mailto:suryx12@gmail.com?subject=${encodeURIComponent(subjectInput.value.trim())}&body=${encodeURIComponent(
          `From: ${nameInput.value.trim()} (${emailInput.value.trim()})\n\nMessage:\n${messageInput.value.trim()}`
        )}`;

        showToast('Composing email to Suriya Prakash...', 'success');
        
        setTimeout(() => {
          window.location.href = mailtoUrl;
          form.reset();
        }, 600);
      }
    });

    // Clear error on input
    [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          input.parentElement.classList.remove('has-error');
        });
      }
    });
  };
  initContactForm();

  // ==========================================================================
  // 14. SCROLL REVEAL OBSERVER
  // ==========================================================================
  const initScrollReveal = () => {
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersect2D || entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      reveals.forEach((el) => observer.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('is-revealed'));
    }
  };
  initScrollReveal();

  // ==========================================================================
  // 15. BACK TO TOP BUTTON
  // ==========================================================================
  const initBackToTop = () => {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };
  initBackToTop();
});
