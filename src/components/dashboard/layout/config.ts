import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'toolboxtalk', title: 'Tool Box Talk', href: paths.menu.toolboxtalk, icon: 'users-four' },
  { key: 'worker', title: 'Worker', href: paths.menu.worker, icon: 'worker' },
  { key: 'manpower', title: 'Manpower', href: paths.menu.manpower, icon: 'users-four' },

] satisfies NavItemConfig[];
