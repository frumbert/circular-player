/**
 * Circular Audio Player - Self-contained, reusable audio player
 * Usage: new CircularAudioPlayer(container, audioSrc, options)
 */

class CircularAudioPlayer {
  static instances = [];
  
  constructor(container, audioSrc, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.audioSrc = audioSrc;
    this.options = {
      size: options.size || 80,
      lineColor: options.lineColor || '#007bff',
      lineWidth: options.lineWidth || 4,
      ...options
    };
    
    this.audio = new Audio(this.audioSrc);
    this.isPlaying = false;
    this.isDragging = false;
    this.wheelVelocity = 0;
    this.wheelTimeout = null;
    
    CircularAudioPlayer.instances.push(this);
    
    this.init();
  }
  
  init() {
    this.createPlayer();
    this.attachEvents();
    this.startAnimationLoop();
  }
  
  createPlayer() {
    const size = this.options.size;
    const half = size / 2;
    const radius = half - this.options.lineWidth;
    
    this.container.innerHTML = `
      <div class="circular-audio-player" style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        user-select: none;
        cursor: pointer;
      ">
        <svg width="${size}" height="${size}" style="
          position: absolute;
          top: 0;
          left: 0;
          transform: rotate(-90deg);
          filter: drop-shadow(0 0 ${this.options.lineWidth * 2}px rgba(0,0,0,0.1));
        ">
          <circle
            cx="${half}"
            cy="${half}"
            r="${radius}"
            fill="white"
            stroke="none"
          />
          <circle
            class="progress-ring"
            cx="${half}"
            cy="${half}"
            r="${radius}"
            fill="none"
            stroke="${this.options.lineColor}"
            stroke-width="${this.options.lineWidth}"
            stroke-linecap="round"
            stroke-dasharray="${2 * Math.PI * radius}"
            stroke-dashoffset="${2 * Math.PI * radius}"
          />
        </svg>
        <div class="control-btn" style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${size * 0.4}px;
          height: ${size * 0.4}px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="${size * 0.4}" height="${size * 0.4}" viewBox="0 0 24 24">
            <path class="play-icon" fill="${this.options.lineColor}" d="M8 5v14l11-7z"/>
            <g class="pause-icon" fill="${this.options.lineColor}" style="display: none;">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </g>
          </svg>
        </div>
      </div>
    `;
    
    this.progressRing = this.container.querySelector('.progress-ring');
    this.playIcon = this.container.querySelector('.play-icon');
    this.pauseIcon = this.container.querySelector('.pause-icon');
    this.controlBtn = this.container.querySelector('.control-btn');
    this.circumference = 2 * Math.PI * radius;
  }
  
  attachEvents() {
    // Play/Pause click
    this.controlBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePlayPause();
    });
    
    // Audio events
    this.audio.addEventListener('ended', () => {
      this.pause();
    });
    
    this.audio.addEventListener('loadedmetadata', () => {
      this.updateProgress();
    });
    
    this.audio.addEventListener('timeupdate', () => {
      if (!this.isDragging) {
        this.updateProgress();
      }
    });
    
    // Mousewheel scrubbing
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.handleWheel(e);
    }, { passive: false });
  }
  
  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
  
  play() {
    // Pause all other instances
    CircularAudioPlayer.instances.forEach(instance => {
      if (instance !== this && instance.isPlaying) {
        instance.pause();
      }
    });
    
    this.audio.play();
    this.isPlaying = true;
    this.playIcon.style.display = 'none';
    this.pauseIcon.style.display = 'block';
  }
  
  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.playIcon.style.display = 'block';
    this.pauseIcon.style.display = 'none';
  }
  
  updateProgress() {
    if (!this.audio.duration) return;
    
    const progress = this.audio.currentTime / this.audio.duration;
    const offset = this.circumference - (progress * this.circumference);
    this.progressRing.style.strokeDashoffset = offset;
  }
  
  handleWheel(e) {
    if (!this.audio.duration) return;
    
    const delta = -e.deltaY;
    this.wheelVelocity += delta * 0.001;
    
    clearTimeout(this.wheelTimeout);
    this.wheelTimeout = setTimeout(() => {
      this.wheelVelocity = 0;
    }, 100);
    
    this.isDragging = true;
    this.scrubAudio(delta * 0.1);
    
    setTimeout(() => {
      this.isDragging = false;
    }, 50);
  }
  
  scrubAudio(deltaTime) {
    if (!this.audio.duration) return;
    
    let newTime = this.audio.currentTime + deltaTime;
    newTime = Math.max(0, Math.min(newTime, this.audio.duration));
    this.audio.currentTime = newTime;
    this.updateProgress();
  }
  
  startAnimationLoop() {
    const animate = () => {
      if (Math.abs(this.wheelVelocity) > 0.001) {
        this.scrubAudio(this.wheelVelocity);
        this.wheelVelocity *= 0.95; // Decay
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
  
  destroy() {
    this.pause();
    this.audio.src = '';
    const index = CircularAudioPlayer.instances.indexOf(this);
    if (index > -1) {
      CircularAudioPlayer.instances.splice(index, 1);
    }
    this.container.innerHTML = '';
  }
}

// Export for module systems or attach to window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CircularAudioPlayer;
} else {
  window.CircularAudioPlayer = CircularAudioPlayer;
}
