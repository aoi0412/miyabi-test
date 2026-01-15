import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadIcon from '@mui/icons-material/Download';
import OfflinePinIcon from '@mui/icons-material/OfflinePin';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Song } from '../../types';
import { navidromeAPI } from '../../services/navidrome/api';
import { useOffline } from '../../contexts/OfflineContext';

interface SongListProps {
  songs: Song[];
  onSongClick: (song: Song) => void;
  showDownload?: boolean;
}

export function SongList({ songs, onSongClick, showDownload = false }: SongListProps) {
  const { downloadSong, isOffline } = useOffline();

  const getCoverUrl = (song: Song) => {
    if (song.coverArt) {
      return navidromeAPI.getCoverArtUrl(song.coverArt, 100);
    }
    return '';
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <List>
      {songs.map((song) => (
        <ListItem
          key={song.id}
          secondaryAction={
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {showDownload && (
                isOffline(song.id) ? (
                  <OfflinePinIcon color="success" />
                ) : (
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadSong(song);
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                )
              )}
              <IconButton edge="end" onClick={() => onSongClick(song)}>
                <PlayArrowIcon />
              </IconButton>
            </Box>
          }
          disablePadding
        >
          <ListItemButton onClick={() => onSongClick(song)}>
            <ListItemAvatar>
              {song.coverArt ? (
                <Avatar src={getCoverUrl(song)} variant="rounded" />
              ) : (
                <Avatar variant="rounded">
                  <MusicNoteIcon />
                </Avatar>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={song.title}
              secondary={
                <>
                  {song.artist && (
                    <Typography component="span" variant="body2" color="text.secondary">
                      {song.artist}
                    </Typography>
                  )}
                  {song.duration && (
                    <Typography component="span" variant="body2" color="text.secondary">
                      {' • '}
                      {formatDuration(song.duration)}
                    </Typography>
                  )}
                </>
              }
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
