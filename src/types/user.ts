export interface WorkSite{
  id: number;
  name: string;
  role: string;
}

export interface User {
  id: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  workSites?: WorkSite[];

  avatar?: string;
  [key: string]: unknown;
}

