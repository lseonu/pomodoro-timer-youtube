# Pomodoro Timer with YouTube Integration

A modern Pomodoro Timer application that helps you stay focused and productive by integrating YouTube videos during break times. Built with React, TypeScript, and Vite.

## Features

- Customizable work and break durations
- YouTube video playback during breaks
- Video position tracking (resumes from where you left off)
- Drag-and-drop video playlist management
- Export timer settings and video list as HTML
- Modern and responsive UI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lseonu/pomodoro-timer-youtube.git
   cd pomodoro-timer-youtube
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Set your desired work and break durations in the Timer Settings section
2. Add YouTube videos to your break time playlist
3. Click "Start Timer" to begin your work session
4. When the break starts, your selected video will play automatically
5. The timer will notify you when it's time to get back to work

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect the configuration and deploy your app

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 