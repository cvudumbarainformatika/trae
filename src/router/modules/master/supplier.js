const supplier =
{
  path: 'master-data/suppliers',
  component: () => import('@/views/admin/master/supplier/IndexPage.vue'),
  children:[
    {
      path: '',
      name: 'admin-suppliers',
      component: () => import('@/views/admin/master/supplier/Suppliers.vue')
    }
  ]

}

export default supplier
