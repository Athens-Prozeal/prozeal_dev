import { getSiteURL } from '@/lib/get-site-url';
import { LogLevel } from '@/lib/logger';

export interface Config {
  site: { name: string; description: string; themeColor: string; url: string; serverURL: string };
  logLevel: keyof typeof LogLevel;
}

export const config: Config = {
  site: {
    name: 'Athenas',
    description: 'EHS Software',
    themeColor: '#090a0b',
    url: getSiteURL(),
    serverURL: 'https://39fc-103-197-112-241.ngrok-free.app',
  },
  logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) ?? LogLevel.ALL,
};
