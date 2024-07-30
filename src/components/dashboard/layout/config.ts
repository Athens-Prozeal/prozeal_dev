import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

let allNavItems: NavItemConfig[] = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  {
    key: 'toolboxtalk',
    title: 'Tool Box Talk',
    href: paths.menu.toolboxtalk.home,
    icon: 'tool-box',
    matcher: { type: 'startsWith' as const, href: paths.menu.toolboxtalk.home },
  },
  { key: 'worker', title: 'Worker', href: paths.menu.worker.home, icon: 'worker' },
  {
    key: 'inspection',
    title: 'Vehicle Inspection',
    icon: 'magnifying-glass',
    items: [{ key: 'vehicle', title: 'Vehicle', href: paths.menu.inspection.vehicle, icon: 'users-four' }],
  },
  { key: 'manpower', 
    title: 'Manpower', 
    href: paths.menu.manpower.home, 
    icon: 'users-four',
    matcher: { type: 'startsWith' as const, href: paths.menu.manpower.home },
  },
];

const getNavItems = () => {
  const role = localStorage.getItem('role');
  if (role === 'sub_contractor') {
    allNavItems = allNavItems.filter(item => item.key !== 'overview');
  }
  return allNavItems;
};

export const navItems: NavItemConfig[] = getNavItems();
