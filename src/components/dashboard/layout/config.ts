import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

let allNavItems: NavItemConfig[] = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  {
    key: 'toolbox-talk',
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
      // Categorized Checklists
      {key: 'excavation', title: 'Excavation', href: paths.menu.inspection.excavation.home, matcher: { type: 'startsWith' as const, href: paths.menu.inspection.excavation.home },},
      {key: 'anti-termite-treatment', title: 'Anti Termite Treatment', href: paths.menu.inspection.antiTermiteTreatment.home, matcher: { type: 'startsWith' as const, href: paths.menu.inspection.antiTermiteTreatment.home },},
      {key: 'pour-card-for-column-concrete', title: 'Pour Card - Column Concrete', href: paths.menu.inspection.pourCardForColumnConcrete.home, matcher: { type: 'startsWith' as const, href: paths.menu.inspection.pourCardForColumnConcrete.home },},
      {key: 'pour-card-for-slab-concrete', title: 'Pour Card - Slab Concrete', href: paths.menu.inspection.pourCardForSlabConcrete.home, matcher: { type: 'startsWith' as const, href: paths.menu.inspection.pourCardForSlabConcrete.home },},
      {key: 'pour-card-for-beam', title: 'Pour Card - Beam', href: paths.menu.inspection.pourCardForBeam.home, matcher: { type: 'startsWith' as const, href: paths.menu.inspection.pourCardForBeam.home },}, // Pour Card For Plinth Beam/Lintel Beam/Roof Beam
      {key: 'plain-cement-concrete-work', title: 'Plain Cement Concrete Work', href: paths.menu.inspection.plainCementConcreteWork.home, matcher: { type: 'startsWith' as const, href: paths.menu.inspection.plainCementConcreteWork.home },},

      // Un-Categorized Checklists
      {key: 'ht-cable', title: 'HT Cable', href: paths.menu.inspection.htCable.home, matcher: { type: 'startsWith' as const, href: paths.menu.inspection.htCable.home },},
      {key: 'cctv-installation', title: 'CCTV Installation', href: paths.menu.inspection.cctvInstallation.home, matcher: { type: 'startsWith' as const, href: paths.menu.inspection.cctvInstallation.home },},
      {key: 'culvert-work', title: 'Culvert Work', href: paths.menu.inspection.culvertWork.home, matcher: { type: 'startsWith' as const, href: paths.menu.inspection.culvertWork.home },},
      {key: 'nifps', title: 'NIFPS', href: paths.menu.inspection.nifps.home, matcher: { type: 'startsWith' as const, href: paths.menu.inspection.nifps.home },},
      {key: 'remote-terminal-unit', title: 'Remote Terminal Unit', href: paths.menu.inspection.remoteTerminalUnit.home, matcher: { type: 'startsWith' as const, href: paths.menu.inspection.remoteTerminalUnit.home },},
      {key: 'ups', title: 'UPS', href: paths.menu.inspection.ups.home, matcher: { type: 'startsWith' as const, href: paths.menu.inspection.ups.home },},
      {key: 'icog-panel', title: 'ICOG Panel', href: paths.menu.inspection.icogPanel.home, matcher: { type: 'startsWith' as const, href: paths.menu.inspection.icogPanel.home },},
      {key: 'painting', title: 'Painting', href: paths.menu.inspection.painting.home, matcher: { type: 'startsWith' as const, href: paths.menu.inspection.painting.home },},
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
