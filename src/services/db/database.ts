import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { OfflineSong, Song } from '../../types';

export class MiyabiDatabase extends Dexie {
  offlineSongs!: Table<OfflineSong, string>;

  constructor() {
    super('MiyabiDB');

    this.version(1).stores({
      offlineSongs: 'id, songId, downloadedAt'
    });
  }

  async addOfflineSong(songId: string, blob: Blob, metadata: Song): Promise<string> {
    const id = `offline_${songId}`;
    await this.offlineSongs.put({
      id,
      songId,
      blob,
      metadata,
      downloadedAt: new Date()
    });
    return id;
  }

  async getOfflineSong(songId: string): Promise<OfflineSong | undefined> {
    return await this.offlineSongs.get(`offline_${songId}`);
  }

  async getAllOfflineSongs(): Promise<OfflineSong[]> {
    return await this.offlineSongs.toArray();
  }

  async deleteOfflineSong(songId: string): Promise<void> {
    await this.offlineSongs.delete(`offline_${songId}`);
  }

  async isOffline(songId: string): Promise<boolean> {
    const song = await this.getOfflineSong(songId);
    return !!song;
  }

  async getStorageSize(): Promise<number> {
    const songs = await this.getAllOfflineSongs();
    return songs.reduce((total, song) => total + song.blob.size, 0);
  }
}

export const db = new MiyabiDatabase();
