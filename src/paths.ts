import { inspect } from 'util';

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
  menu:{
    toolboxtalk: {
      home: '/menu/toolboxtalk',
      add: '/menu/toolboxtalk/add',
      edit: '/menu/toolboxtalk/edit',
    },
    worker: '/menu/worker',
    manpower: {
      home:  '/menu/manpower',
      statistics: '/menu/manpower/statistics',
    },
    inspection: {
      vehicle: '/menu/inspection/vehicle',
    },
  },

  errors: { notFound: '/errors/not-found' },
} as const;
