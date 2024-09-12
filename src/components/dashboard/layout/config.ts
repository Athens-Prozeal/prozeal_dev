import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

let allNavItems: NavItemConfig[] = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  {
    key: 'toolboxtalk',
    title: 'Toolbox Talk',
    href: paths.menu.toolboxTalk.home,
    icon: 'tool-box',
    matcher: { type: 'startsWith' as const, href: paths.menu.toolboxTalk.home },
  },
  {
    key: 'worker',
    title: 'Worker',
    href: paths.menu.worker.home,
    icon: 'worker',
    matcher: { type: 'startsWith' as const, href: paths.menu.worker.home },
  },
  {
    key: 'safety-observation',
    title: 'Safety Observation',
    href: paths.menu.safetyObservation.home,
    icon: 'shield',
    matcher: { type: 'startsWith' as const, href: paths.menu.safetyObservation.home },
  },
  {
    key: 'inspection',
    title: 'Inspection',
    icon: 'magnifying-glass',
    items: [
      {
        key: 'excavation',
        title: 'Excavation',
        href: paths.menu.inspection.excavation.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.excavation.home },
      },
      {
        key: 'anti-termite-treatment',
        title: 'Anti Termite Treatment',
        href: paths.menu.inspection.antiTermiteTreatment.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.antiTermiteTreatment.home },
      },
      {
        key: 'pour-card-for-column-concrete',
        title: 'Pour Card Column Concrete',
        href: paths.menu.inspection.pourCardForColumnConcrete.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.pourCardForColumnConcrete.home },
      },
      {
        key: 'pour-card-for-slab-concrete',
        title: 'Pour Card Slab Concrete',
        href: paths.menu.inspection.pourCardForSlabConcrete.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.pourCardForSlabConcrete.home },
      },
      {
        key: 'ht-cable',
        title: 'HT Cable',
        href: paths.menu.inspection.htCable.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.htCable.home },
      },
      {
        key: 'pour-card-for-beam',
        title: 'Pour Card For Beam',
        href: paths.menu.inspection.pourCardForPlinthBeam.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.pourCardForPlinthBeam.home },
      },
    ],
  },
  {
    key: 'manpower',
    title: 'Manpower',
    href: paths.menu.manpower.home,
    icon: 'users-four',
    matcher: { type: 'startsWith' as const, href: paths.menu.manpower.home },
  },
];

const getNavItems = () => {
  const role = localStorage.getItem('role');
  if (role === 'sub_contractor') {
    allNavItems = allNavItems.filter((item) => item.key !== 'overview');
  }
  if (role === 'quality_inspector') {
    allNavItems = allNavItems.filter(
      (item) => item.key !== 'manpower' && item.key !== 'overview' && item.key !== 'worker'
    );
  }
  return allNavItems;
};

export const navItems: NavItemConfig[] = getNavItems();
