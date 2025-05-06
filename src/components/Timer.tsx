import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  IconButton
} from '@mui/material';
import { 
  PlayArrow as PlayIcon, 
  Pause as PauseIcon, 
  Refresh as RefreshIcon 
} from '@mui/icons-material';

interface TimerProps {
  timeLeft: number;
  isRunning: boolean;
  isBreak: boolean;
  currentSession: number;
  totalSessions: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const Timer: React.FC<TimerProps> = ({
  timeLeft,
  isRunning,
  isBreak,
  currentSession,
  totalSessions,
  onStart,
  onPause,
  onReset,
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        maxWidth: 400,
        mx: 'auto'
      }}
    >
      <Box 
        sx={{ 
          width: 200, 
          height: 200, 
          borderRadius: '50%', 
          border: '4px solid',
          borderColor: isBreak ? 'primary.main' : 'secondary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3
        }}
      >
        <Typography variant="h2" component="div">
          {formatTime(timeLeft)}
        </Typography>
      </Box>

      <Typography variant="h6" color="text.secondary" gutterBottom>
        Session {currentSession} of {totalSessions}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <IconButton
          onClick={isRunning ? onPause : onStart}
          color="primary"
          size="large"
          sx={{ 
            width: 64, 
            height: 64,
            bgcolor: isRunning ? 'error.main' : 'success.main',
            '&:hover': {
              bgcolor: isRunning ? 'error.dark' : 'success.dark'
            }
          }}
        >
          {isRunning ? <PauseIcon fontSize="large" /> : <PlayIcon fontSize="large" />}
        </IconButton>
        
        <IconButton
          onClick={onReset}
          color="primary"
          size="large"
          sx={{ 
            width: 64, 
            height: 64,
            bgcolor: 'grey.200',
            '&:hover': {
              bgcolor: 'grey.300'
            }
          }}
        >
          <RefreshIcon fontSize="large" />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Timer; 