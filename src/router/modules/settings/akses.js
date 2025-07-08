const akses =
{
  path: 'settings/akses',
  component: () => import('@/views/admin/settings/akses/IndexPage.vue'),
  children:[
    {
      path: '',
      name: 'settings-akses',
      component: () => import('@/views/admin/settings/akses/AksesPage.vue')
    }
  ]

}

export default akses
