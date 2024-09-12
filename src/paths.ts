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
      pourCardForPlinthBeam: {
        home: '/menu/inspection/pour-card-for-beam',
        add: '/menu/inspection/pour-card-for-beam/add',
      },
    },
  },

  errors: { notFound: '/errors/not-found' },
} as const;
