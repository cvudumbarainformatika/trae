const product =
{
    path: 'master-data/products',
    component: () => import('@/views/admin/master/products/IndexPage.vue'),
    children: [
      {
        path: '',
        name: 'admin-products',
        component: () => import('@/views/admin/master/products/Products.vue'),
      },
    ]
  }

  export default product
