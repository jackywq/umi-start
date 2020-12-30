module.exports = [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './user/login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    //   authority: ['admin', 'user'],
    routes: [
      {
        path: '/',
        name: 'welcome',
        icon: 'smile',
        component: './Welcome',
      },
      {
        path: '/home',
        name: 'home',
        icon: 'home',
        component: './Home',
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        component: './Dashboard',
      },
      {
        path: '/systemSetting',
        name: 'systemSetting',
        icon: 'setting',
        routes: [
          {
            path: '/systemSetting/detail',
            name: 'detail',
            component: './systemSetting/detail',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
