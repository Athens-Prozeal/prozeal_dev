import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  {
    key: 'toolboxtalk',
    title: 'Tool Box Talk',
    href: paths.menu.toolboxtalk.home,
    icon: 'users-four',
    matcher: { type: 'startsWith', href: paths.menu.toolboxtalk.home },
  },
  {
    key: 'inspection',
    title: 'Vehicle Inspection',
    icon: 'users-four',
    items: [{ key: 'vehicle', title: 'Vehicle', href: paths.menu.inspection.vehicle, icon: 'users-four' }],
  },
  { key: 'manpower', title: 'Manpower', href: paths.menu.manpower, icon: 'users-four' },
] satisfies NavItemConfig[];
