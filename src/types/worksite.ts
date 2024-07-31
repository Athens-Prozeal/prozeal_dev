export interface WorkSite {
    id: string;
    name: string;
}

export interface WorkSiteRole{
    id: string;
    name: string;
    role: string;
    display_role: string | null;
}
