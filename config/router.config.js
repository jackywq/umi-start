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
                path: '/home',
                name: 'home',
                icon: 'home',
                routes: [
                    {
                        path: '/home/manage',
                        name: 'manage',
                        component: './home/manage'
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