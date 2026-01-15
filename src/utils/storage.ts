import { ServerConfig } from '../types';

const SERVER_CONFIG_KEY = 'miyabi_server_config';

export function saveServerConfig(config: ServerConfig): void {
  localStorage.setItem(SERVER_CONFIG_KEY, JSON.stringify(config));
}

export function loadServerConfig(): ServerConfig | null {
  const stored = localStorage.getItem(SERVER_CONFIG_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearServerConfig(): void {
  localStorage.removeItem(SERVER_CONFIG_KEY);
}
