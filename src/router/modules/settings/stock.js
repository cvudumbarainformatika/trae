const stock =
{
  path: 'settings/stock',
  component: () => import('@/views/admin/settings/stock/IndexPage.vue'),
  children:[
    {
      path: '',
      name: 'settings-stock',
      component: () => import('@/views/admin/settings/stock/StockPage.vue')
    }
  ]

}

export default stock
