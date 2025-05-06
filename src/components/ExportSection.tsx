import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Typography,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  FileDownload as FileDownloadIcon,
  VideoFile as VideoFileIcon,
  Lock as LockIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Video } from '../types';

interface ExportSectionProps {
  videos: Video[];
}

const ExportSection: React.FC<ExportSectionProps> = ({ videos }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = () => {
    // Export logic here
  };

  const handlePremiumClick = () => {
    setShowPopup(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create mailto link
    const subject = 'Premium Feature Interest - Pomodoro Timer';
    const body = `I'm interested in the premium video export feature. My email is: ${email}`;
    const mailtoLink = `mailto:leeseonwoo0324@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Simulate success
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setTimeout(() => {
        setShowPopup(false);
        setEmail('');
        setSubmitStatus('idle');
      }, 2000);
    }, 1000);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Export Options
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
          >
            Export as Text
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<VideoFileIcon />}
            endIcon={<LockIcon />}
            onClick={handlePremiumClick}
          >
            Premium - Export as Video
          </Button>
        </Box>
      </CardContent>

      <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
        <DialogTitle>
          Premium Feature - Coming Soon!
          <IconButton
            onClick={() => setShowPopup(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography paragraph>
            The video export feature is currently in beta. Enter your email below to be notified when it's available, and you'll receive free premium access!
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting || submitStatus === 'success'}
              sx={{ mt: 2 }}
            />
            {submitStatus === 'error' && (
              <Alert severity="error" sx={{ mt: 2 }}>
                There was an error submitting your email. Please try again or email us directly.
              </Alert>
            )}
            {submitStatus === 'success' && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Thank you for your interest! We'll be in touch soon.
              </Alert>
            )}
            <DialogActions>
              <Button onClick={() => setShowPopup(false)}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || submitStatus === 'success'}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ExportSection; 