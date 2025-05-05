import { TimerSettings, Video } from '../types';

export function exportToHTML(settings: TimerSettings, videos: Video[]) {
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <title>Pomodoro Timer</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: '#3b82f6',
            secondary: '#10b981',
            danger: '#ef4444',
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: #f3f4f6;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .video-container {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
    }
    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
  <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-4">Pomodoro Timer</h1>
      <div id="timer" class="text-6xl font-bold mb-8">${formatTime(settings.workTime * 60)}</div>
      <div id="video-container" class="mb-8 hidden">
        <div class="video-container">
          <div id="player"></div>
        </div>
      </div>
      <div class="flex justify-center gap-4">
        <button id="start-btn" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">Start</button>
        <button id="skip-btn" class="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors">Skip</button>
        <button id="reset-btn" class="px-6 py-3 bg-danger text-white rounded-lg hover:bg-danger/90 transition-colors">Reset</button>
      </div>
    </div>
  </div>

  <script>
    const settings = ${JSON.stringify({
      workTime: settings.workTime,
      breakTime: settings.breakTime,
      longBreakDuration: settings.longBreakDuration,
      sessions: settings.sessions,
      longBreakAfter: settings.longBreakAfter
    })};
    const videos = ${JSON.stringify(videos)};
    
    // Embedded position storage
    const videoPositions = JSON.parse(localStorage.getItem('pomodoroVideoPositions') || '{}');
    
    let timer;
    let timeLeft = settings.workTime * 60;
    let isRunning = false;
    let isBreak = false;
    let currentSession = 1;
    let currentVideoIndex = 0;
    let player = null;

    const timerElement = document.getElementById('timer');
    const videoContainer = document.getElementById('video-container');
    const startBtn = document.getElementById('start-btn');
    const skipBtn = document.getElementById('skip-btn');
    const resetBtn = document.getElementById('reset-btn');

    function updateTimer() {
      timerElement.textContent = formatTime(timeLeft);
      if (timeLeft === 0) {
        handleTimerComplete();
      }
    }

    function handleTimerComplete() {
      if (isBreak) {
        if (currentSession < settings.sessions) {
          isBreak = false;
          currentSession++;
          timeLeft = settings.workTime * 60;
          videoContainer.classList.add('hidden');
          if (player) {
            const videoId = videos[currentVideoIndex].id;
            videoPositions[videoId] = player.getCurrentTime();
            localStorage.setItem('pomodoroVideoPositions', JSON.stringify(videoPositions));
            player.destroy();
            player = null;
          }
        } else {
          isRunning = false;
          isBreak = false;
          currentSession = 1;
          timeLeft = settings.workTime * 60;
          videoContainer.classList.add('hidden');
          if (player) {
            player.destroy();
            player = null;
          }
        }
      } else {
        isBreak = true;
        const isLongBreak = currentSession % settings.longBreakAfter === 0;
        timeLeft = (isLongBreak ? settings.longBreakDuration : settings.breakTime) * 60;
        
        if (videos.length > 0) {
          videoContainer.classList.remove('hidden');
          currentVideoIndex = (currentVideoIndex + 1) % videos.length;
          loadVideo();
        }
      }
      updateTimer();
    }

    function loadVideo() {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(tag, firstScript);
        
        window.onYouTubeIframeAPIReady = () => {
          createPlayer();
        };
      } else {
        createPlayer();
      }
    }

    function createPlayer() {
      const videoId = videos[currentVideoIndex].id;
      const savedTime = videoPositions[videoId] || 0;
      
      player = new YT.Player('player', {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event) => {
            event.target.seekTo(savedTime, true);
            event.target.playVideo();
          }
        }
      });
    }

    startBtn.addEventListener('click', () => {
      isRunning = !isRunning;
      startBtn.textContent = isRunning ? 'Pause' : 'Start';
      
      if (isRunning) {
        timer = setInterval(() => {
          timeLeft--;
          updateTimer();
        }, 1000);
      } else {
        clearInterval(timer);
      }
    });

    skipBtn.addEventListener('click', handleTimerComplete);
    
    resetBtn.addEventListener('click', () => {
      clearInterval(timer);
      isRunning = false;
      isBreak = false;
      currentSession = 1;
      timeLeft = settings.workTime * 60;
      videoContainer.classList.add('hidden');
      startBtn.textContent = 'Start';
      if (player) {
        player.destroy();
        player = null;
      }
      updateTimer();
    });

    // Initialize timer with correct time
    updateTimer();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlTemplate], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pomodoro-timer.html';
  a.click();
  URL.revokeObjectURL(url);
} 