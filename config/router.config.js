module.exports = [
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
                path: '/dashboard',
                name: 'dashboard',
                icon: 'dashboard',
                component: './Dashboard',  
            },
            {
                path: '/systemSetting',
                name: 'systemSetting',
                icon: 'systemSetting',
                routes: [
                    {
                        path: '/systemSetting/detail',
                        name: 'detail',
                        component: './systemSetting/detail'
                    }
                ]
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