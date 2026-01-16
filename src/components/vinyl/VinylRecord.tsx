import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

interface VinylRecordProps {
  coverArt?: string;
  isPlaying: boolean;
  size?: number;
}

export function VinylRecord({ coverArt, isPlaying, size = 300 }: VinylRecordProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50); // 50ms = 20fps

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <Box
      sx={{
        width: size,
        height: size,
        position: 'relative',
        margin: '0 auto'
      }}
    >
      {/* Vinyl Record */}
      <Box
        sx={{
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
            0 10px 40px rgba(0, 0, 0, 0.5),
            inset 0 0 20px rgba(0, 0, 0, 0.8)
          `,
          transform: `rotate(${rotation}deg)`,
          transition: isPlaying ? 'none' : 'transform 0.5s ease-out',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #0a0a0a, #1a1a1a)',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.9)'
          }
        }}
      >
        {/* Center Label with Album Art */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            background: coverArt
              ? `url(${coverArt}) center/cover`
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent)',
              pointerEvents: 'none'
            }
          }}
        />

        {/* Center Hole */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8%',
            height: '8%',
            borderRadius: '50%',
            background: '#0a0a0a',
            boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.9)'
          }}
        />

        {/* Grooves Effect */}
        {[...Array(15)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${60 + i * 2.5}%`,
              height: `${60 + i * 2.5}%`,
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.03)',
              pointerEvents: 'none'
            }}
          />
        ))}
      </Box>

      {/* Reflection/Shine Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), transparent 50%)',
          pointerEvents: 'none',
          mixBlendMode: 'overlay'
        }}
      />
    </Box>
  );
}
