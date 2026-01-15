import React from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { usePlayer } from '../../contexts/PlayerContext';

export function ProgressBar() {
  const { playerState, seekTo } = usePlayer();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (_: Event, value: number | number[]) => {
    const time = Array.isArray(value) ? value[0] : value;
    seekTo(time);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="caption" sx={{ minWidth: 45, textAlign: 'right' }}>
        {formatTime(playerState.currentTime)}
      </Typography>

      <Slider
        value={playerState.currentTime}
        onChange={handleSeek}
        min={0}
        max={playerState.duration || 0}
        step={1}
        size="small"
        sx={{ flex: 1 }}
      />

      <Typography variant="caption" sx={{ minWidth: 45 }}>
        {formatTime(playerState.duration)}
      </Typography>
    </Box>
  );
}
