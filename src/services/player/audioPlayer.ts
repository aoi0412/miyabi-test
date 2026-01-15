import { Song } from '../../types';
import { navidromeAPI } from '../navidrome/api';
import { db } from '../db/database';

export type PlayerEventType = 'play' | 'pause' | 'ended' | 'timeupdate' | 'loadedmetadata' | 'error';

export class AudioPlayer {
  private audio: HTMLAudioElement;
  private currentSong: Song | null = null;
  private eventListeners: Map<PlayerEventType, Set<(event?: any) => void>> = new Map();

  constructor() {
    this.audio = new Audio();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.audio.addEventListener('play', () => this.emit('play'));
    this.audio.addEventListener('pause', () => this.emit('pause'));
    this.audio.addEventListener('ended', () => this.emit('ended'));
    this.audio.addEventListener('timeupdate', () => this.emit('timeupdate'));
    this.audio.addEventListener('loadedmetadata', () => this.emit('loadedmetadata'));
    this.audio.addEventListener('error', (e) => this.emit('error', e));
  }

  on(event: PlayerEventType, callback: (event?: any) => void) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: PlayerEventType, callback: (event?: any) => void) {
    this.eventListeners.get(event)?.delete(callback);
  }

  private emit(event: PlayerEventType, data?: any) {
    this.eventListeners.get(event)?.forEach(callback => callback(data));
  }

  async loadSong(song: Song): Promise<void> {
    this.currentSong = song;

    // Check if song is available offline
    const offlineSong = await db.getOfflineSong(song.id);

    if (offlineSong) {
      // Load from IndexedDB
      const url = URL.createObjectURL(offlineSong.blob);
      this.audio.src = url;
    } else {
      // Stream from server
      const streamUrl = navidromeAPI.getStreamUrl(song.id);
      this.audio.src = streamUrl;
    }

    this.audio.load();
  }

  play(): Promise<void> {
    return this.audio.play();
  }

  pause(): void {
    this.audio.pause();
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  seekTo(time: number): void {
    this.audio.currentTime = time;
  }

  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  getVolume(): number {
    return this.audio.volume;
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  getDuration(): number {
    return this.audio.duration || 0;
  }

  isPlaying(): boolean {
    return !this.audio.paused;
  }

  getCurrentSong(): Song | null {
    return this.currentSong;
  }
}

export const audioPlayer = new AudioPlayer();
