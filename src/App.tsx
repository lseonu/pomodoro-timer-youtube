import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  ThemeProvider,
  createTheme
} from '@mui/material';
import Timer from './components/Timer';
import VideoList from './components/VideoList';
import ExportSection from './components/ExportSection';
import { Video } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [totalSessions] = useState(4);
  const [workTime] = useState(25); // minutes
  const [breakTime] = useState(5); // minutes
  const [longBreakTime] = useState(15); // minutes
  const [longBreakAfter] = useState(4); // sessions

  const intervalRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          if (currentSession >= totalSessions) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }

          const isLongBreak = currentSession % longBreakAfter === 0;
          const breakDuration = isLongBreak ? longBreakTime : breakTime;
          setIsBreak(true);
          setCurrentSession((prev) => prev + 1);
          return breakDuration * 60;
        }

        return prev - 1;
      });
    }, 1000);

    setIsRunning(true);
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setTimeLeft(workTime * 60);
    setIsBreak(false);
    setCurrentSession(1);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Pomodoro Timer
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Timer
              timeLeft={timeLeft}
              isRunning={isRunning}
              isBreak={isBreak}
              currentSession={currentSession}
              totalSessions={totalSessions}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
            />
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Video Playlist
            </Typography>
            <VideoList
              videos={videos}
              onVideosChange={setVideos}
            />
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <ExportSection videos={videos} />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
 