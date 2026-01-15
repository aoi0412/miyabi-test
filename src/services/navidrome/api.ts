import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  ServerConfig,
  Album,
  Artist,
  Song,
  SubsonicResponse,
  AlbumsResponse,
  ArtistsResponse,
  SongsResponse
} from '../../types';
import { generateAuthParams, buildApiUrl } from './auth';

export class NavidromeAPI {
  private serverConfig: ServerConfig | null = null;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 30000,
    });
  }

  setServerConfig(config: ServerConfig) {
    this.serverConfig = config;
  }

  private getAuthParams() {
    if (!this.serverConfig) {
      throw new Error('Server configuration not set');
    }
    return generateAuthParams(this.serverConfig);
  }

  private buildUrl(endpoint: string, additionalParams: Record<string, string> = {}) {
    if (!this.serverConfig) {
      throw new Error('Server configuration not set');
    }
    const authParams = this.getAuthParams();
    const allParams = { ...authParams, ...additionalParams };
    return buildApiUrl(this.serverConfig.url, endpoint, allParams as any);
  }

  async ping(): Promise<boolean> {
    try {
      const url = this.buildUrl('ping.view');
      const response = await this.axiosInstance.get<SubsonicResponse<{}>>(url);
      return response.data['subsonic-response'].status === 'ok';
    } catch (error) {
      console.error('Ping failed:', error);
      return false;
    }
  }

  async getAlbums(type: 'newest' | 'recent' | 'frequent' | 'random' = 'newest', size: number = 50): Promise<Album[]> {
    try {
      const url = this.buildUrl('getAlbumList2.view', { type, size: size.toString() });
      const response = await this.axiosInstance.get<SubsonicResponse<AlbumsResponse>>(url);

      if (response.data['subsonic-response'].status === 'failed') {
        throw new Error(response.data['subsonic-response'].error?.message || 'Failed to fetch albums');
      }

      return response.data['subsonic-response'].albumList2?.album || [];
    } catch (error) {
      console.error('Failed to fetch albums:', error);
      throw error;
    }
  }

  async getArtists(): Promise<Artist[]> {
    try {
      const url = this.buildUrl('getArtists.view');
      const response = await this.axiosInstance.get<SubsonicResponse<ArtistsResponse>>(url);

      if (response.data['subsonic-response'].status === 'failed') {
        throw new Error(response.data['subsonic-response'].error?.message || 'Failed to fetch artists');
      }

      const indexes = response.data['subsonic-response'].artists?.index || [];
      return indexes.flatMap(index => index.artist);
    } catch (error) {
      console.error('Failed to fetch artists:', error);
      throw error;
    }
  }

  async getAlbum(id: string): Promise<{ album: Album; songs: Song[] }> {
    try {
      const url = this.buildUrl('getAlbum.view', { id });
      const response = await this.axiosInstance.get<SubsonicResponse<SongsResponse>>(url);

      if (response.data['subsonic-response'].status === 'failed') {
        throw new Error(response.data['subsonic-response'].error?.message || 'Failed to fetch album');
      }

      const albumData = response.data['subsonic-response'].album;
      if (!albumData) {
        throw new Error('Album not found');
      }

      const { song, ...albumInfo } = albumData;
      return {
        album: albumInfo as Album,
        songs: song || []
      };
    } catch (error) {
      console.error('Failed to fetch album:', error);
      throw error;
    }
  }

  getStreamUrl(id: string): string {
    if (!this.serverConfig) {
      throw new Error('Server configuration not set');
    }
    return this.buildUrl('stream.view', { id });
  }

  getCoverArtUrl(id: string, size: number = 300): string {
    if (!this.serverConfig) {
      throw new Error('Server configuration not set');
    }
    return this.buildUrl('getCoverArt.view', { id, size: size.toString() });
  }

  async downloadSong(id: string): Promise<Blob> {
    try {
      const url = this.getStreamUrl(id);
      const response = await this.axiosInstance.get(url, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to download song:', error);
      throw error;
    }
  }
}

export const navidromeAPI = new NavidromeAPI();
