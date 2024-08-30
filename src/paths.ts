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
    toolboxtalk: {
      home: '/menu/toolboxtalk',
      add: '/menu/toolboxtalk/add',
      edit: '/menu/toolboxtalk/edit',
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
    inspection: {
      excavation: {
        home: '/menu/inspection/excavation',
        add: '/menu/inspection/excavation/add'
      },
      antiTermiteTreatment: {
        home: '/menu/inspection/anti-termite-treatment',
        add: '/menu/inspection/anti-termite-treatment/add'
      },

    },
  },

  errors: { notFound: '/errors/not-found' },
} as const;
