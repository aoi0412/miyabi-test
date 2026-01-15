
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Box
} from '@mui/material';
import type { Album } from '../../types';
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
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(6, 1fr)'
        },
        gap: 2
      }}
    >
      {albums.map((album) => (
        <Box key={album.id}>
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
        </Box>
      ))}
    </Box>
  );
}
