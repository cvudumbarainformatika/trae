const product =
{
    path: 'gudangs/products',
    component: () => import('@/views/admin/gudangs/products/IndexPage.vue'),
    // children: [
    //   {
    //     path: '',
    //     name: 'admin-products',
    //     component: () => import('@/views/admin/gudangs/products/Products.vue'),
    //   },
    // ]
  }

  export default product
