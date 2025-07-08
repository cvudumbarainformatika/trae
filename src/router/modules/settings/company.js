const company =
{
  path: 'settings/company',
  name: 'settings-company',
  component: () => import('@/views/admin/settings/company/IndexPage.vue'),
  // children:[
  //   {
  //     path: '',
  //     name: 'settings-company',
  //     component: () => import('@/views/admin/settings/app/companyPage.vue')
  //   }
  // ]

}

export default company
