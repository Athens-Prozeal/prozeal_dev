export const paths = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password',
    selectWorkSite: '/auth/select-work-site',
  },
  dashboard: {
    overview: '/dashboard',
    settings:'/dashboard/settings',
    account: '/dashboard/account',
  },
  settings: '/dashboard/settings',
  account: '/dashboard/account',
  menu:{
    toolboxTalk: {
      home: '/menu/toolboxTalk',
      add: '/menu/toolboxTalk/add',
      edit: '/menu/toolboxTalk/edit',
    },
    worker: {
      home: '/menu/worker',
      add: '/menu/worker/add'
    },
    manpower: {
      home:  '/menu/manpower',
      add: '/menu/manpower/add',
      edit: '/menu/manpower/edit',
      statistics: '/menu/manpower/statistics',
    },
    safetyObservation: {
      home: '/menu/safety-observation',
      add: '/menu/safety-observation/add',
      edit: '/menu/safety-observation/edit',
    },
    inspection: {
      //  Categorized Checklists
      excavation: {
        home: '/menu/inspection/excavation',
        add: '/menu/inspection/excavation/add',
      },
      antiTermiteTreatment: {
        home: '/menu/inspection/anti-termite-treatment',
        add: '/menu/inspection/anti-termite-treatment/add',
      },
      plainCementConcreteWork: {
        home: '/menu/inspection/plain-cement-concrete-work',
        add: '/menu/inspection/plain-cement-concrete-work/add'
      },
      pourCardForColumnConcrete: {
        home: '/menu/inspection/pour-card-for-column-concrete',
        add: '/menu/inspection/pour-card-for-column-concrete/add',
      },
      pourCardForSlabConcrete: {
        home: '/menu/inspection/pour-card-for-slab-concrete',
        add: '/menu/inspection/pour-card-for-slab-concrete/add'
      },
      pourCardForBeam: { // Pour Card For Plinth Beam/Lintel Beam/Roof Beam
        home: '/menu/inspection/pour-card-for-beam',
        add: '/menu/inspection/pour-card-for-beam/add'
      },
      plastering: {
        home: '/menu/inspection/plastering',
        add: '/menu/inspection/plastering/add'
      },


      //  Un-Categorized Checklists
      htCable: {
        home: '/menu/inspection/ht-cable',
        add: '/menu/inspection/ht-cable/add',
      },
      cctvInstallation: {
        home: '/menu/inspection/cctv-installation',
        add: '/menu/inspection/cctv-installation/add',
      },
      culvertWork: {
        home: '/menu/inspection/culvert-work',
        add: '/menu/inspection/culvert-work/add',
      },
      nifps: {
        home: '/menu/inspection/nifps',
        add: '/menu/inspection/nifps/add',
      },
      remoteTerminalUnit: {
        home: '/menu/inspection/remote-terminal-unit',
        add: '/menu/inspection/remote-terminal-unit/add',
      },
      ups: {
        home: '/menu/inspection/ups',
        add: '/menu/inspection/ups/add',
      },
      icogPanel: {
        home: '/menu/inspection/icog-panel',
        add: '/menu/inspection/icog-panel/add',
      },
      painting: {
        home: '/menu/inspection/painting',
        add: '/menu/inspection/painting/add',
      },
      rcc: {
        home: '/menu/inspection/rcc',
        add: '/menu/inspection/rcc/add',
      },
      acDistributionBoard: {
        home: '/menu/inspection/ac-distribution-board',
        add: '/menu/inspection/ac-distribution-board/add',
      },
      auxTransformer: {
        home: '/menu/inspection/aux-transformer',
        add: '/menu/inspection/aux-transformer/add',
      },
      busduct: {
        home: '/menu/inspection/busduct',
        add: '/menu/inspection/busduct/add',
      },
      highVoltagePanel: {
        home: '/menu/inspection/high-voltage-panel',
        add: '/menu/inspection/high-voltage-panel/add',
      },
      peripheryLighting: {
        home: '/menu/inspection/periphery-lighting',
        add: '/menu/inspection/periphery-lighting/add',
      },
      plumbing: {
        home: '/menu/inspection/plumbing',
        add: '/menu/inspection/plumbing/add',
      },
      scadaSystem: {
        home: '/menu/inspection/scada-system',
        add: '/menu/inspection/scada-system/add',
      },
      wms: {
        home: '/menu/inspection/wms',
        add: '/menu/inspection/wms/add',
      },
      PlantBoundaryAndFencing: {
        home: '/menu/inspection/plant-boundary-and-fencing',
        add: '/menu/inspection/plant-boundary-and-fencing/add',
      },

      chainLinkFencing: {
        home: '/menu/inspection/chain-link-fencing',
        add: '/menu/inspection/chain-link-fencing/add',
      },
      potentialTransformer: {
        home: '/menu/inspection/potential-transformer',
        add: '/menu/inspection/potential-transformer/add',
      },

      // 2 witness
      dcdb: {
        home: '/menu/inspection/dcdb',
        add: '/menu/inspection/dcdb/add',
      },
      batteryBank: {
        home: '/menu/inspection/battery-bank',
        add: '/menu/inspection/battery-bank/add',
      },
      controlCableLaying: {
        home: '/menu/inspection/control-cable-laying',
        add: '/menu/inspection/control-cable-laying/add',
      },
      fireAlarmPanel: {
        home: '/menu/inspection/fire-alarm-panel',
        add: '/menu/inspection/fire-alarm-panel/add',
      },
      inverter: {
        home: '/menu/inspection/inverter',
        add: '/menu/inspection/inverter/add',
      },
      stringCables: {
        home: '/menu/inspection/string-cables',
        add: '/menu/inspection/string-cables/add',
      },
      lightningArrester: {
        home: '/menu/inspection/lightning-arrester',
        add: '/menu/inspection/lightning-arrester/add',
      },
      moduleInterconnection: {
        home: '/menu/inspection/module-interconnection',
        add: '/menu/inspection/module-interconnection/add',
      },
      transmissionLines: {
        home: '/menu/inspection/transmission-lines',
        add: '/menu/inspection/transmission-lines/add',
      },
      OutdoorIsolatorOrEarthSwitch: {
        home: '/menu/inspection/outdoor-isolator-or-earth-switch',
        add: '/menu/inspection/outdoor-isolator-or-earth-switch/add',
      },
      stringCables2: {
        home: '/menu/inspection/second-string-cables',
        add: '/menu/inspection/second-string-cables/add',
      },
    },
  },

  errors: { notFound: '/errors/not-found' },
} as const;
