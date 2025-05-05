export interface Video {
  id: string;
  url: string;
  title: string;
  description?: string;
}

export interface TimerSettings {
  studyDuration: number; // in minutes
  breakDuration: number; // in minutes
  sessions: number;
  longBreakDuration: number; // in minutes
  longBreakAfter: number; // after how many sessions
}

export interface TimerState {
  isRunning: boolean;
  isBreak: boolean;
  currentSession: number;
  timeLeft: number; // in seconds
  currentVideoIndex: number;
} 