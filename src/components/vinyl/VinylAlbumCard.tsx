import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import type { Album } from '../../types';
import { navidromeAPI } from '../../services/navidrome/api';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

interface VinylAlbumCardProps {
  album: Album;
  onClick: (album: Album) => void;
}

export function VinylAlbumCard({ album, onClick }: VinylAlbumCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getCoverUrl = () => {
    if (album.coverArt) {
      return navidromeAPI.getCoverArtUrl(album.coverArt, 300);
    }
    return '';
  };

  return (
    <Box
      onClick={() => onClick(album)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        '&:active': {
          transform: 'translateY(-4px) scale(0.98)'
        }
      }}
    >
      {/* Vinyl Record Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%', // 1:1 aspect ratio
          marginBottom: 2
        }}
      >
        {/* Outer Vinyl Ring */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `
              radial-gradient(
                circle at center,
                #1a1a1a 0%,
                #2a2a2a 20%,
                #1a1a1a 40%,
                #2a2a2a 60%,
                #1a1a1a 80%,
                #0a0a0a 100%
              )
            `,
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.4),
              inset 0 0 20px rgba(0, 0, 0, 0.8)
            `,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            transform: isHovered ? 'rotate(15deg) scale(1.02)' : 'rotate(0deg)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70%',
              height: '70%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #0a0a0a, #1a1a1a)',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.9)'
            }
          }}
        >
          {/* Grooves */}
          {[...Array(12)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${70 + i * 2}%`,
                height: `${70 + i * 2}%`,
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.02)',
                pointerEvents: 'none'
              }}
            />
          ))}

          {/* Center Label with Album Art */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '45%',
              height: '45%',
              borderRadius: '50%',
              background: album.coverArt
                ? `url(${getCoverUrl()}) center/cover`
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
              border: '3px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent)',
                pointerEvents: 'none'
              }
            }}
          >
            {!album.coverArt && (
              <MusicNoteIcon sx={{ fontSize: 40, color: 'white', opacity: 0.7, zIndex: 1 }} />
            )}
          </Box>

          {/* Center Hole */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '10%',
              height: '10%',
              borderRadius: '50%',
              background: '#0a0a0a',
              boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.9)'
            }}
          />
        </Box>

        {/* Shine Effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.15), transparent 50%)',
            pointerEvents: 'none',
            opacity: isHovered ? 1 : 0.7,
            transition: 'opacity 0.3s ease'
          }}
        />
      </Box>

      {/* Album Info */}
      <Box sx={{ px: 1 }}>
        <Typography
          variant="body1"
          fontWeight="600"
          sx={{
            color: 'text.primary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.3,
            minHeight: '2.6em',
            mb: 0.5
          }}
        >
          {album.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {album.artist || 'Unknown Artist'}
        </Typography>
      </Box>
    </Box>
  );
}
