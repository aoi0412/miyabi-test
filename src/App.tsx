import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { OfflineProvider } from './contexts/OfflineContext';
import { ServerSettings } from './components/settings/ServerSettings';
import { AppLayout } from './components/layout/AppLayout';
import { AlbumGrid } from './components/library/AlbumGrid';
import { SongList } from './components/library/SongList';
import { OfflineLibrary } from './components/offline/OfflineLibrary';
import { navidromeAPI } from './services/navidrome/api';
import type { Album, Song } from './types';
import { usePlayer } from './contexts/PlayerContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function MainApp() {
  const { authState, isLoading } = useAuth();
  const { playSong, addToQueue } = usePlayer();
  const [currentPage, setCurrentPage] = useState('albums');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumSongs, setAlbumSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authState.isAuthenticated && currentPage === 'albums') {
      loadAlbums();
    }
  }, [authState.isAuthenticated, currentPage]);

  const loadAlbums = async () => {
    setLoading(true);
    try {
      const data = await navidromeAPI.getAlbums('newest', 50);
      setAlbums(data);
    } catch (error) {
      console.error('Failed to load albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAlbumClick = async (album: Album) => {
    setLoading(true);
    try {
      const { songs } = await navidromeAPI.getAlbum(album.id);
      setSelectedAlbum(album);
      setAlbumSongs(songs);
    } catch (error) {
      console.error('Failed to load album songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSongClick = (song: Song) => {
    playSong(song);
    if (selectedAlbum && albumSongs.length > 0) {
      addToQueue(albumSongs);
    }
  };

  const handleBackToAlbums = () => {
    setSelectedAlbum(null);
    setAlbumSongs([]);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!authState.isAuthenticated) {
    return <ServerSettings open={true} />;
  }

  const getPageTitle = () => {
    if (selectedAlbum) return selectedAlbum.name;
    switch (currentPage) {
      case 'albums':
        return 'アルバム';
      case 'artists':
        return 'アーティスト';
      case 'offline':
        return 'オフライン';
      case 'settings':
        return '設定';
      default:
        return 'Miyabi';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (selectedAlbum) {
      return <SongList songs={albumSongs} onSongClick={handleSongClick} showDownload={true} />;
    }

    switch (currentPage) {
      case 'albums':
        return <AlbumGrid albums={albums} onAlbumClick={handleAlbumClick} />;
      case 'offline':
        return <OfflineLibrary />;
      default:
        return <div>Coming soon...</div>;
    }
  };

  return (
    <AppLayout
      title={getPageTitle()}
      onNavigate={(page) => {
        setCurrentPage(page);
        handleBackToAlbums();
      }}
      currentPage={currentPage}
    >
      {renderContent()}
    </AppLayout>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <PlayerProvider>
          <OfflineProvider>
            <MainApp />
          </OfflineProvider>
        </PlayerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
