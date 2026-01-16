import { Box, Typography, IconButton, Slider, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { VinylRecord } from './VinylRecord';
import { usePlayer } from '../../contexts/PlayerContext';
import { navidromeAPI } from '../../services/navidrome/api';
import { extractColorsFromImage } from '../../utils/colorExtractor';
import type { ExtractedColors } from '../../utils/colorExtractor';

export function NowPlayingVinyl() {
  const {
    playerState,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    toggleRepeat,
    toggleShuffle
  } = usePlayer();

  const [colors, setColors] = useState<ExtractedColors>({
    dominant: 'rgb(102, 126, 234)',
    vibrant: 'rgb(118, 75, 162)',
    muted: 'rgb(90, 100, 150)'
  });

  const { currentSong, isPlaying, currentTime, duration } = playerState;

  useEffect(() => {
    if (currentSong?.coverArt) {
      const coverUrl = navidromeAPI.getCoverArtUrl(currentSong.coverArt, 300);
      extractColorsFromImage(coverUrl).then(setColors);
    }
  }, [currentSong?.id]);

  if (!currentSong) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Typography variant="h6" color="white">
          曲を選択してください
        </Typography>
      </Box>
    );
  }

  const coverUrl = currentSong.coverArt
    ? navidromeAPI.getCoverArtUrl(currentSong.coverArt, 400)
    : '';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(
            135deg,
            ${colors.dominant} 0%,
            ${colors.vibrant} 50%,
            ${colors.muted} 100%
          )
        `,
        transition: 'background 1s ease',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: 4,
          backdropFilter: 'blur(100px)'
        }}
      >
        {/* Vinyl Record */}
        <Box sx={{ mb: 6 }}>
          <VinylRecord coverArt={coverUrl} isPlaying={isPlaying} size={350} />
        </Box>

        {/* Track Info */}
        <Box sx={{ textAlign: 'center', mb: 4, width: '100%', maxWidth: 600 }}>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}
          >
            {currentSong.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 400,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}
          >
            {currentSong.artist || 'Unknown Artist'}
          </Typography>
          {currentSong.album && (
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                mt: 0.5,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              {currentSong.album}
            </Typography>
          )}
        </Box>

        {/* Progress Bar */}
        <Box sx={{ width: '100%', maxWidth: 600, mb: 2 }}>
          <Slider
            value={progress}
            onChange={(_, value) => {
              const newTime = (duration * (value as number)) / 100;
              seekTo(newTime);
            }}
            sx={{
              color: 'white',
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
                }
              },
              '& .MuiSlider-track': {
                height: 4,
                border: 'none',
                backgroundColor: 'white'
              },
              '& .MuiSlider-rail': {
                height: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {formatTime(currentTime)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {formatTime(duration)}
            </Typography>
          </Box>
        </Box>

        {/* Controls */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <IconButton
            onClick={toggleShuffle}
            sx={{
              color: playerState.shuffle ? 'white' : 'rgba(255, 255, 255, 0.5)',
              '&:hover': { color: 'white' }
            }}
          >
            <ShuffleIcon />
          </IconButton>

          <IconButton
            onClick={playPrevious}
            sx={{
              color: 'white',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <SkipPreviousIcon sx={{ fontSize: 40 }} />
          </IconButton>

          <IconButton
            onClick={togglePlayPause}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              width: 72,
              height: 72,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s'
            }}
          >
            {isPlaying ? <PauseIcon sx={{ fontSize: 40 }} /> : <PlayArrowIcon sx={{ fontSize: 40 }} />}
          </IconButton>

          <IconButton
            onClick={playNext}
            sx={{
              color: 'white',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <SkipNextIcon sx={{ fontSize: 40 }} />
          </IconButton>

          <IconButton
            onClick={toggleRepeat}
            sx={{
              color: playerState.repeatMode !== 'none' ? 'white' : 'rgba(255, 255, 255, 0.5)',
              '&:hover': { color: 'white' }
            }}
          >
            {playerState.repeatMode === 'one' ? (
              <RepeatOneIcon />
            ) : (
              <RepeatIcon />
            )}
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}
