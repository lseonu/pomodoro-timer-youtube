export interface TimerSettings {
  workTime: number;
  breakTime: number;
  studyDuration: number;
  breakDuration: number;
  sessions: number;
  longBreakAfter: number;
  longBreakDuration: number;
}

export interface Video {
  id: string;
  url: string;
  title: string;
}

export interface TimerState {
  isRunning: boolean;
  isBreak: boolean;
  currentSession: number;
  timeLeft: number;
  totalSessions: number;
}

export interface TimerProps {
  settings: TimerSettings;
  videos: Video[];
  timerState?: TimerState;
  onTimerStateChange?: (state: TimerState) => void;
}

export interface ExportSectionProps {
  settings: TimerSettings;
  videos: Video[];
  onExport?: () => void;
}

export type VideoTimeMap = Record<string, number>;

// YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: new (elementId: string | HTMLElement, config: YT.PlayerOptions) => YT.Player;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }

  namespace YT {
    interface PlayerOptions {
      videoId: string;
      playerVars?: {
        autoplay?: 0 | 1;
        rel?: 0 | 1;
        modestbranding?: 0 | 1;
        playsinline?: 0 | 1;
        enablejsapi?: 0 | 1;
        origin?: string;
        mute?: 0 | 1;
        controls?: 0 | 1;
        fs?: 0 | 1;
        iv_load_policy?: 1 | 3;
      };
      events?: {
        onReady?: (event: { target: Player }) => void;
        onStateChange?: (event: { data: number; target: Player }) => void;
      };
    }

    interface Player {
      playVideo(): void;
      pauseVideo(): void;
      stopVideo(): void;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      getCurrentTime(): number;
      getPlayerState(): number;
      destroy(): void;
    }

    type PlayerState = Window['YT']['PlayerState'];
  }
}

export type { YT }; 