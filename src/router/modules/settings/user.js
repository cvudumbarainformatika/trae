const users =
{
  path: 'settings/users',
  component: () => import('@/views/admin/settings/users/IndexPage.vue'),
  children:[
    {
      path: '',
      name: 'settings-users',
      component: () => import('@/views/admin/settings/users/UsersPage.vue')
    }
  ]

}

export default users
