import type { ServerConfig } from '../../types';
import { generateRandomString, generateAuthToken } from '../../utils/crypto';

export interface AuthParams {
  u: string;
  t: string;
  s: string;
  v: string;
  c: string;
  f: string;
}

export function generateAuthParams(config: ServerConfig): AuthParams {
  const salt = generateRandomString(6);
  const token = generateAuthToken(config.password, salt);

  return {
    u: config.username,
    t: token,
    s: salt,
    v: '1.16.1',
    c: 'Miyabi',
    f: 'json'
  };
}

export function buildApiUrl(baseUrl: string, endpoint: string, params: AuthParams): string {
  const url = new URL(`/rest/${endpoint}`, baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
}
