import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Song, DownloadProgress } from '../types';
import { db } from '../services/db/database';
import { navidromeAPI } from '../services/navidrome/api';

interface OfflineContextType {
  offlineSongs: Song[];
  downloadQueue: DownloadProgress[];
  downloadSong: (song: Song) => Promise<void>;
  deleteSong: (songId: string) => Promise<void>;
  isOffline: (songId: string) => boolean;
  refreshOfflineSongs: () => Promise<void>;
  storageSize: number;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [offlineSongs, setOfflineSongs] = useState<Song[]>([]);
  const [downloadQueue, setDownloadQueue] = useState<DownloadProgress[]>([]);
  const [storageSize, setStorageSize] = useState(0);

  const refreshOfflineSongs = async () => {
    const songs = await db.getAllOfflineSongs();
    setOfflineSongs(songs.map(s => s.metadata));
    const size = await db.getStorageSize();
    setStorageSize(size);
  };

  useEffect(() => {
    refreshOfflineSongs();
  }, []);

  const downloadSong = async (song: Song) => {
    const progress: DownloadProgress = {
      songId: song.id,
      progress: 0,
      status: 'downloading'
    };

    setDownloadQueue(prev => [...prev, progress]);

    try {
      const blob = await navidromeAPI.downloadSong(song.id);
      await db.addOfflineSong(song.id, blob, song);

      setDownloadQueue(prev =>
        prev.map(p =>
          p.songId === song.id
            ? { ...p, progress: 100, status: 'completed' }
            : p
        )
      );

      await refreshOfflineSongs();

      setTimeout(() => {
        setDownloadQueue(prev => prev.filter(p => p.songId !== song.id));
      }, 2000);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadQueue(prev =>
        prev.map(p =>
          p.songId === song.id
            ? { ...p, status: 'failed' }
            : p
        )
      );
    }
  };

  const deleteSong = async (songId: string) => {
    await db.deleteOfflineSong(songId);
    await refreshOfflineSongs();
  };

  const isOffline = (songId: string): boolean => {
    return offlineSongs.some(s => s.id === songId);
  };

  return (
    <OfflineContext.Provider
      value={{
        offlineSongs,
        downloadQueue,
        downloadSong,
        deleteSong,
        isOffline,
        refreshOfflineSongs,
        storageSize
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
}
