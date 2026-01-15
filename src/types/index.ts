// Navidrome/Subsonic API Types

export interface Album {
  id: string;
  name: string;
  artist?: string;
  artistId?: string;
  coverArt?: string;
  songCount?: number;
  duration?: number;
  created?: string;
  year?: number;
  genre?: string;
}

export interface Artist {
  id: string;
  name: string;
  albumCount?: number;
  coverArt?: string;
}

export interface Song {
  id: string;
  title: string;
  album?: string;
  albumId?: string;
  artist?: string;
  artistId?: string;
  coverArt?: string;
  duration?: number;
  track?: number;
  year?: number;
  genre?: string;
  size?: number;
  contentType?: string;
  suffix?: string;
  path?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songCount?: number;
  duration?: number;
  created?: string;
  changed?: string;
  coverArt?: string;
}

// Auth Types
export interface ServerConfig {
  url: string;
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  serverConfig: ServerConfig | null;
}

// Player Types
export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Song[];
  queueIndex: number;
  repeatMode: 'none' | 'all' | 'one';
  shuffle: boolean;
}

// Offline Types
export interface OfflineSong {
  id: string;
  songId: string;
  blob: Blob;
  metadata: Song;
  downloadedAt: Date;
}

export interface DownloadProgress {
  songId: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
}

// API Response Types
export interface SubsonicResponse<T> {
  'subsonic-response': {
    status: 'ok' | 'failed';
    version: string;
    error?: {
      code: number;
      message: string;
    };
  } & T;
}

export interface AlbumsResponse {
  albumList2?: {
    album: Album[];
  };
}

export interface ArtistsResponse {
  artists?: {
    index: {
      artist: Artist[];
    }[];
  };
}

export interface SongsResponse {
  album?: {
    song: Song[];
  } & Album;
}
