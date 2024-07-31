import { WorkSiteRole } from "./worksite";

export interface User {
  id: string;
  username?: string;
  email?: string;
  company?: string;
  firstName?: string;
  lastName?: string;
  workSites?: WorkSiteRole[];

  avatar?: string;
  [key: string]: unknown;
}


export interface SubContractor {
  id: number;
  username: string;
}
