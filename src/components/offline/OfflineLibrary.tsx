
import { Box, Typography, Paper, Chip } from '@mui/material';
import { useOffline } from '../../contexts/OfflineContext';
import { SongList } from '../library/SongList';
import { usePlayer } from '../../contexts/PlayerContext';

export function OfflineLibrary() {
  const { offlineSongs, storageSize } = useOffline();
  const { playSong } = usePlayer();

  const formatStorageSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">オフラインライブラリ</Typography>
        <Chip
          label={`${offlineSongs.length}曲 • ${formatStorageSize(storageSize)}`}
          color="primary"
          variant="outlined"
        />
      </Box>

      {offlineSongs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            オフラインで再生できる曲がありません
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            楽曲の詳細画面からダウンロードアイコンをタップしてオフラインで利用できるようにしましょう
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <SongList songs={offlineSongs} onSongClick={playSong} />
        </Paper>
      )}
    </Box>
  );
}
