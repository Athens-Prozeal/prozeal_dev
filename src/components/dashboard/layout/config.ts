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
    key: 'permit-to-work',
    title: 'Permit To Work',
    icon: 'clipboard',
    items: [
      {
        key: 'general',
        title: 'General',
        href: paths.menu.permitToWork.general.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.permitToWork.general.home },
      },
      {
        key: 'work',
        title: 'Work',
        href: paths.menu.permitToWork.work.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.permitToWork.work.home },
      },
    ],
  },
  {
    key: 'inspection',
    title: 'Inspection',
    icon: 'magnifying-glass',
    items: [
      // Categorized Checklists
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
        title: 'Pour Card - Column Concrete',
        href: paths.menu.inspection.pourCardForColumnConcrete.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.pourCardForColumnConcrete.home },
      },
      {
        key: 'pour-card-for-slab-concrete',
        title: 'Pour Card - Slab Concrete',
        href: paths.menu.inspection.pourCardForSlabConcrete.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.pourCardForSlabConcrete.home },
      },
      {
        key: 'pour-card-for-beam',
        title: 'Pour Card - Beam',
        href: paths.menu.inspection.pourCardForBeam.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.pourCardForBeam.home },
      }, // Pour Card For Plinth Beam/Lintel Beam/Roof Beam
      {
        key: 'plain-cement-concrete-work',
        title: 'Plain Cement Concrete Work',
        href: paths.menu.inspection.plainCementConcreteWork.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.plainCementConcreteWork.home },
      },
      {
        key: 'plastering',
        title: 'Plastering',
        href: paths.menu.inspection.plastering.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.plastering.home },
      },

      // Un-Categorized Checklists
      {
        key: 'ht-cable',
        title: 'HT Cable',
        href: paths.menu.inspection.htCable.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.htCable.home },
      },
      {
        key: 'cctv-installation',
        title: 'CCTV Installation',
        href: paths.menu.inspection.cctvInstallation.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.cctvInstallation.home },
      },
      {
        key: 'culvert-work',
        title: 'Culvert Work',
        href: paths.menu.inspection.culvertWork.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.culvertWork.home },
      },
      {
        key: 'nifps',
        title: 'NIFPS',
        href: paths.menu.inspection.nifps.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.nifps.home },
      },
      {
        key: 'remote-terminal-unit',
        title: 'Remote Terminal Unit',
        href: paths.menu.inspection.remoteTerminalUnit.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.remoteTerminalUnit.home },
      },
      {
        key: 'ups',
        title: 'UPS',
        href: paths.menu.inspection.ups.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.ups.home },
      },
      {
        key: 'icog-panel',
        title: 'ICOG Panel',
        href: paths.menu.inspection.icogPanel.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.icogPanel.home },
      },
      {
        key: 'painting',
        title: 'Painting',
        href: paths.menu.inspection.painting.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.painting.home },
      },
      {
        key: 'rcc',
        title: 'RCC',
        href: paths.menu.inspection.rcc.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.rcc.home },
      },
      {
        key: 'ac-distribution-board',
        title: 'AC Distribution Board',
        href: paths.menu.inspection.acDistributionBoard.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.acDistributionBoard.home },
      },
      {
        key: 'aux-transformer',
        title: 'AUX Transformer',
        href: paths.menu.inspection.auxTransformer.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.auxTransformer.home },
      },
      {
        key: 'busduct',
        title: 'Busduct',
        href: paths.menu.inspection.busduct.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.busduct.home },
      },
      {
        key: 'high-voltage-panel',
        title: 'High Voltage Panel',
        href: paths.menu.inspection.highVoltagePanel.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.highVoltagePanel.home },
      },
      {
        key: 'periphery-lighting',
        title: 'Periphery Lighting',
        href: paths.menu.inspection.peripheryLighting.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.peripheryLighting.home },
      },
      {
        key: 'plumbing',
        title: 'Plumbing',
        href: paths.menu.inspection.plumbing.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.plumbing.home },
      },
      {
        key: 'scada-system',
        title: 'SCADA System',
        href: paths.menu.inspection.scadaSystem.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.scadaSystem.home },
      },
      {
        key: 'wms',
        title: 'WMS',
        href: paths.menu.inspection.wms.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.wms.home },
      },
      {
        key: 'plant-boundary-and-fencing',
        title: 'Plant Boundary And Fencing',
        href: paths.menu.inspection.PlantBoundaryAndFencing.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.PlantBoundaryAndFencing.home },
      },
      {
        key: 'chain-link-fencing',
        title: 'Chain Link Fencing',
        href: paths.menu.inspection.chainLinkFencing.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.chainLinkFencing.home },
      },
      {
        key: 'potential-transformer',
        title: 'Potential Transformer',
        href: paths.menu.inspection.potentialTransformer.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.potentialTransformer.home },
      },
      {
        key: 'battery-bank-and-battery-charger',
        title: 'Battery Bank And Charger',
        href: paths.menu.inspection.batteryBankAndBatteryCharger.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.batteryBankAndBatteryCharger.home },
      },
      {
        key: 'control-cable-laying',
        title: 'Control Cable Laying',
        href: paths.menu.inspection.controlCableLaying.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.controlCableLaying.home },
      },
      {
        key: 'fire-alarm-panel',
        title: 'Fire Alarm Panel',
        href: paths.menu.inspection.fireAlarmPanel.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.fireAlarmPanel.home },
      },
      {
        key: 'inverter',
        title: 'Inverter',
        href: paths.menu.inspection.inverter.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.inverter.home },
      },
      {
        key: 'string-cables',
        title: 'String Cables',
        href: paths.menu.inspection.stringCables.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.stringCables.home },
      },
      {
        key: 'lightning-arrester',
        title: 'Lightning Arrester',
        href: paths.menu.inspection.lightningArrester.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.lightningArrester.home },
      },
      {
        key: 'string-cables2',
        title: 'String Cables 2',
        href: paths.menu.inspection.stringCables2.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.stringCables2.home },
      },

      // 2 witness
      {
        key: 'dcdb',
        title: 'DCDB',
        href: paths.menu.inspection.dcdb.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.dcdb.home },
      },
      {
        key: 'transmission-lines',
        title: 'Transmission Lines',
        href: paths.menu.inspection.transmissionLines.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.transmissionLines.home },
      },
      {
        key: 'outdoor-isolator-or-earth-switch',
        title: 'Outdoor Isolator/Earth Switch',
        href: paths.menu.inspection.OutdoorIsolatorOrEarthSwitch.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.OutdoorIsolatorOrEarthSwitch.home },
      },

      // Complex forms
      {
        key:'earthing-system',
        title: 'Earthing System',
        href: paths.menu.inspection.earthingSystem.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.earthingSystem.home },
      },
      {
        key: 'ht-cable-pre-com',
        title: 'HT Cable Pre-Commissioning',
        href: paths.menu.inspection.htCablePreCom.home,
        matcher: { type: 'startsWith' as const, href: paths.menu.inspection.htCablePreCom.home },
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
