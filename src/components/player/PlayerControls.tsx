
import { Box, IconButton, Slider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { usePlayer } from '../../contexts/PlayerContext';

export function PlayerControls() {
  const {
    playerState,
    togglePlayPause,
    playNext,
    playPrevious,
    toggleRepeat,
    toggleShuffle,
    setVolume
  } = usePlayer();

  const handleVolumeChange = (_: Event, value: number | number[]) => {
    setVolume(Array.isArray(value) ? value[0] : value);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        onClick={toggleShuffle}
        color={playerState.shuffle ? 'primary' : 'default'}
        size="small"
      >
        <ShuffleIcon />
      </IconButton>

      <IconButton onClick={playPrevious}>
        <SkipPreviousIcon />
      </IconButton>

      <IconButton
        onClick={togglePlayPause}
        color="primary"
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': { bgcolor: 'primary.dark' }
        }}
      >
        {playerState.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>

      <IconButton onClick={playNext}>
        <SkipNextIcon />
      </IconButton>

      <IconButton onClick={toggleRepeat} color="default" size="small">
        {playerState.repeatMode === 'one' ? (
          <RepeatOneIcon color="primary" />
        ) : (
          <RepeatIcon color={playerState.repeatMode === 'all' ? 'primary' : 'inherit'} />
        )}
      </IconButton>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, minWidth: 120 }}>
        <VolumeUpIcon fontSize="small" />
        <Slider
          value={playerState.volume}
          onChange={handleVolumeChange}
          min={0}
          max={1}
          step={0.01}
          size="small"
          sx={{ width: 80 }}
        />
      </Box>
    </Box>
  );
}
