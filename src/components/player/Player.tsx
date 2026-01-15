import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { usePlayer } from '../../contexts/PlayerContext';
import { navidromeAPI } from '../../services/navidrome/api';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';

export function Player() {
  const { playerState } = usePlayer();
  const { currentSong } = playerState;

  if (!currentSong) {
    return null;
  }

  const getCoverUrl = () => {
    if (currentSong.coverArt) {
      return navidromeAPI.getCoverArtUrl(currentSong.coverArt, 100);
    }
    return '';
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        borderRadius: 0
      }}
    >
      <Box sx={{ p: 2 }}>
        <ProgressBar />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          <Avatar
            src={getCoverUrl()}
            variant="rounded"
            sx={{ width: 56, height: 56 }}
          >
            <MusicNoteIcon />
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" fontWeight="bold" noWrap>
              {currentSong.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {currentSong.artist || 'Unknown Artist'}
            </Typography>
          </Box>

          <PlayerControls />
        </Box>
      </Box>
    </Paper>
  );
}
