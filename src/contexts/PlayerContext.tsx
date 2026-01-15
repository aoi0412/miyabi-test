import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { PlayerState, Song } from '../types';
import { audioPlayer } from '../services/player/audioPlayer';

interface PlayerContextType {
  playerState: PlayerState;
  playSong: (song: Song) => Promise<void>;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  addToQueue: (songs: Song[]) => void;
  clearQueue: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    queue: [],
    queueIndex: -1,
    repeatMode: 'none',
    shuffle: false
  });

  useEffect(() => {
    const handlePlay = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleTimeUpdate = () => {
      setPlayerState(prev => ({
        ...prev,
        currentTime: audioPlayer.getCurrentTime(),
        duration: audioPlayer.getDuration()
      }));
    };

    const handleEnded = () => {
      if (playerState.repeatMode === 'one') {
        audioPlayer.play();
      } else {
        playNext();
      }
    };

    audioPlayer.on('play', handlePlay);
    audioPlayer.on('pause', handlePause);
    audioPlayer.on('timeupdate', handleTimeUpdate);
    audioPlayer.on('ended', handleEnded);

    return () => {
      audioPlayer.off('play', handlePlay);
      audioPlayer.off('pause', handlePause);
      audioPlayer.off('timeupdate', handleTimeUpdate);
      audioPlayer.off('ended', handleEnded);
    };
  }, [playerState.repeatMode, playerState.queueIndex]);

  const playSong = async (song: Song) => {
    await audioPlayer.loadSong(song);
    await audioPlayer.play();
    setPlayerState(prev => ({
      ...prev,
      currentSong: song
    }));
  };

  const togglePlayPause = () => {
    if (audioPlayer.isPlaying()) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
  };

  const playNext = useCallback(() => {
    if (playerState.queue.length === 0) return;

    let nextIndex = playerState.queueIndex + 1;

    if (nextIndex >= playerState.queue.length) {
      if (playerState.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        audioPlayer.stop();
        return;
      }
    }

    setPlayerState(prev => ({ ...prev, queueIndex: nextIndex }));
    playSong(playerState.queue[nextIndex]);
  }, [playerState.queue, playerState.queueIndex, playerState.repeatMode]);

  const playPrevious = () => {
    if (playerState.queue.length === 0) return;

    if (audioPlayer.getCurrentTime() > 3) {
      audioPlayer.seekTo(0);
      return;
    }

    let prevIndex = playerState.queueIndex - 1;

    if (prevIndex < 0) {
      if (playerState.repeatMode === 'all') {
        prevIndex = playerState.queue.length - 1;
      } else {
        return;
      }
    }

    setPlayerState(prev => ({ ...prev, queueIndex: prevIndex }));
    playSong(playerState.queue[prevIndex]);
  };

  const seekTo = (time: number) => {
    audioPlayer.seekTo(time);
  };

  const setVolume = (volume: number) => {
    audioPlayer.setVolume(volume);
    setPlayerState(prev => ({ ...prev, volume }));
  };

  const addToQueue = (songs: Song[]) => {
    setPlayerState(prev => {
      const newQueue = [...prev.queue, ...songs];
      let newIndex = prev.queueIndex;

      if (prev.queueIndex === -1 && newQueue.length > 0) {
        newIndex = 0;
        playSong(newQueue[0]);
      }

      return {
        ...prev,
        queue: newQueue,
        queueIndex: newIndex
      };
    });
  };

  const clearQueue = () => {
    audioPlayer.stop();
    setPlayerState(prev => ({
      ...prev,
      queue: [],
      queueIndex: -1,
      currentSong: null
    }));
  };

  const toggleRepeat = () => {
    setPlayerState(prev => {
      const modes: Array<'none' | 'all' | 'one'> = ['none', 'all', 'one'];
      const currentIndex = modes.indexOf(prev.repeatMode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      return { ...prev, repeatMode: nextMode };
    });
  };

  const toggleShuffle = () => {
    setPlayerState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  };

  return (
    <PlayerContext.Provider
      value={{
        playerState,
        playSong,
        togglePlayPause,
        playNext,
        playPrevious,
        seekTo,
        setVolume,
        addToQueue,
        clearQueue,
        toggleRepeat,
        toggleShuffle
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}
