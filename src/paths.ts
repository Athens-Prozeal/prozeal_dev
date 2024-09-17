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

    },
  },

  errors: { notFound: '/errors/not-found' },
} as const;
