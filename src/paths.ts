export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password',  selectWorkSite: '/auth/select-work-site', },
  dashboard: {
    overview: '/dashboard',
    settings: '/dashboard/settings',
    account: '/dashboard/account',
  },
  menu:{
    toolboxtalk: '/menu/toolboxtalk',
    worker: '/menu/worker',
    manpower:'/menu/manpower',
  },

  errors: { notFound: '/errors/not-found' },
} as const;
