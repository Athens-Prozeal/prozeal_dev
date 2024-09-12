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
    settings: '/dashboard/settings',
    account: '/dashboard/account',
  },
  settings: '/dashboard/settings',
  account: '/dashboard/account',
  menu: {
    toolboxTalk: {
      home: '/menu/toolboxtalk',
      add: '/menu/toolboxtalk/add',
      edit: '/menu/toolboxtalk/edit',
    },
    worker: {
      home: '/menu/worker',
      add: '/menu/worker/add',
    },
    manpower: {
      home: '/menu/manpower',
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
      excavation: {
        home: '/menu/inspection/excavation',
        add: '/menu/inspection/excavation/add',
      },
      antiTermiteTreatment: {
        home: '/menu/inspection/anti-termite-treatment',
        add: '/menu/inspection/anti-termite-treatment/add',
      },
      pourCardForColumnConcrete: {
        home: '/menu/inspection/pour-card-for-column-concrete',
        add: '/menu/inspection/pour-card-for-column-concrete/add',
      },
      pourCardForSlabConcrete: {
        home: '/menu/inspection/pour-card-for-slab-concrete',
        add: '/menu/inspection/pour-card-for-slab-concrete/add',
      },
      htCable: {
        home: '/menu/inspection/ht-cable',
        add: '/menu/inspection/ht-cable/add',
      },
      gridEarthing: {
        home: '/menu/inspection/grid-earthing',
        add: '/menu/inspection/grid-earthing/add',
      },
      gridEarthing053: {
        home: '/menu/inspection/grid-earthing-053',
        add: '/menu/inspection/grid-earthing-053/add',
      },
      roofTop: {
        home: '/menu/inspection/roof-top',
        add: '/menu/inspection/roof-top/add',
      },
      roofTop097: {
        home: '/menu/inspection/roof-top-097',
        add: '/menu/inspection/roof-top-097/add',
      },
      cableTrayConduit: {
        home: '/menu/inspection/cable-tray-conduit',
        add: '/menu/inspection/cable-tray-conduit/add',
      },
      cctvInstallation: {
        home: '/menu/inspection/cctv-installation',
        add: '/menu/inspection/cctv-installation/add',
      },
      culvertWork: {
        home: '/menu/inspection/culvert-work',
        add: '/menu/inspection/culvert-work/add',
      },
      dcdb: {
        home: '/menu/inspection/dcdb',
        add: '/menu/inspection/dcdb/add',
      },
      icogPanel: {
        home: '/menu/inspection/icog-panel',
        add: '/menu/inspection/icog-panel/add',
      },
      nifps: {
        home: '/menu/inspection/nifps',
        add: '/menu/inspection/nifps/add',
      },
      painting: {
        home: '/menu/inspection/painting',
        add: '/menu/inspection/painting/add',
      },
      potentialTransformer: {
        home: '/menu/inspection/potential-transformer',
        add: '/menu/inspection/potential-transformer/add',
      },
      remoteTerminalUnit: {
        home: '/menu/inspection/remote-terminal-unit',
        add: '/menu/inspection/remote-terminal-unit/add',
      },
      ups: {
        home: '/menu/inspection/ups',
        add: '/menu/inspection/ups/add',
      },
    },
  },
  

  errors: { notFound: '/errors/not-found' },
} as const;
