export interface WorkSite {
    id: string;
    name: string;
}

export interface WorkSiteRole{
    id: string; // Change to work_Site_id
    name: string;
    role: string;
    display_role: string | null;
}
