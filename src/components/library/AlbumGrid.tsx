import { Box } from '@mui/material';
import type { Album } from '../../types';
import { VinylAlbumCard } from '../vinyl/VinylAlbumCard';

interface AlbumGridProps {
  albums: Album[];
  onAlbumClick: (album: Album) => void;
}

export function AlbumGrid({ albums, onAlbumClick }: AlbumGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
          xl: 'repeat(6, 1fr)'
        },
        gap: 4,
        p: 2
      }}
    >
      {albums.map((album) => (
        <VinylAlbumCard
          key={album.id}
          album={album}
          onClick={onAlbumClick}
        />
      ))}
    </Box>
  );
}
