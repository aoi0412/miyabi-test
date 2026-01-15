import React from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Box
} from '@mui/material';
import { Album } from '../../types';
import { navidromeAPI } from '../../services/navidrome/api';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

interface AlbumGridProps {
  albums: Album[];
  onAlbumClick: (album: Album) => void;
}

export function AlbumGrid({ albums, onAlbumClick }: AlbumGridProps) {
  const getCoverUrl = (album: Album) => {
    if (album.coverArt) {
      return navidromeAPI.getCoverArtUrl(album.coverArt, 300);
    }
    return '';
  };

  return (
    <Grid container spacing={2}>
      {albums.map((album) => (
        <Grid item xs={6} sm={4} md={3} lg={2} key={album.id}>
          <Card>
            <CardActionArea onClick={() => onAlbumClick(album)}>
              {album.coverArt ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={getCoverUrl(album)}
                  alt={album.name}
                  sx={{ objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.300'
                  }}
                >
                  <MusicNoteIcon sx={{ fontSize: 80, color: 'grey.500' }} />
                </Box>
              )}
              <CardContent>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  noWrap
                  title={album.name}
                >
                  {album.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  title={album.artist}
                >
                  {album.artist || 'Unknown Artist'}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
