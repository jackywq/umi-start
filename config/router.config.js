module.exports = [
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
];