import { getSiteURL } from '@/lib/get-site-url';
import { LogLevel } from '@/lib/logger';

export interface Config {
  site: { name: string; description: string; themeColor: string; url: string; serverURL: string };
  logLevel: keyof typeof LogLevel;
}

console.log("process.env", process.env);
console.log("process.env.serverURL", process.env.serverURL, process.env.NEXT_PUBLIC_LOG_LEVEL);

export const config: Config = {
  site: {
    name: 'Athenas',
    description: 'EHS Software',
    themeColor: '#090a0b',
    url: getSiteURL(),
    serverURL: process.env.serverURL ?? "http://localhost:3000",
  },
  logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) ?? LogLevel.ALL,
};
