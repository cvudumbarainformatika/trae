import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
// import { createPinia } from 'pinia'

// const pinia = createPinia()


// Tambahkan import untuk komponen pembelian
import PurchaseIndex from '@/views/admin/transaksi/pembelian/IndexPage.vue'
import PurchaseDetail from '@/views/admin/transaksi/pembelian/PurchaseDetail.vue'
import PurchaseForm from '@/views/admin/transaksi/pembelian/PurchaseForm.vue'




const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    // beforeEnter: (to, from, next) => {
    //   if (!auth.token) {
    //     next('/login')
    //   } else {
    //     next()
    //   }
    // },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('../views/admin/Dashboard.vue')
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('../views/admin/Users.vue')
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('../views/admin/Settings.vue')
      },
      {
        path: 'profile',
        name: 'admin-profile',
        component: () => import('../views/admin/Profile.vue')
      },
      // master data
      {
        path: 'master-data/products',
        name: 'admin-products',
        component: () => import('../views/admin/Products.vue')
      },
      {
        path: 'master-data/categories',
        name: 'admin-categories',
        component: () => import('../views/admin/Categories.vue')
      },
      {
        path: 'master-data/satuan',
        name: 'admin-satuan',
        component: () => import('../views/admin/Satuan.vue')
      },
      {
        path: 'master-data/suppliers',
        name: 'admin-suppliers',
        component: () => import('../views/admin/Suppliers.vue')
      },
      {
        path: 'master-data/customers',
        name: 'admin-customers',
        component: () => import('../views/admin/Customers.vue')
      },

      // transaksi
      {
        path:'transaksi/po',
        name: 'transaksi-po',
        component: () => import('../views/admin/transaksi/order_pembelian/IndexPage.vue')
      },
      {
        path:'transaksi/po/create',
        name: 'transaksi-po-create',
        component: () => import('../views/admin/transaksi/order_pembelian/PurchaseOrderForm.vue')
      },
      // Tambahkan rute untuk pembelian
      {
        path: 'transaksi/pembelian',
        name: 'purchase-index',
        component: PurchaseIndex,
        meta: { requiresAuth: true }
      },
      {
        path: 'transaksi/pembelian/create',
        name: 'purchase-create',
        component: PurchaseForm,
        meta: { requiresAuth: true }
      },
      {
        path: 'transaksi/pembelian/:id',
        name: 'purchase-detail',
        component: PurchaseDetail,
        meta: { requiresAuth: true }
      },
      // Tambahkan rute untuk penjualan
      {
        path: 'transaksi/penjualan',
        component: () => import('../views/admin/transaksi/penjualan/IndexPage.vue'),
        children: [
          {
            path: '',
            name: 'sales-list',
            component: () => import('../views/admin/transaksi/penjualan/SalesList.vue'),
            meta: { requiresAuth: true }
          },
          {
            path: 'tambah',
            name: 'sales-form',
            component: () => import('../views/admin/transaksi/penjualan/SalesForm.vue'),
            meta: { requiresAuth: true }
          },
          {
            path: 'kasir',
            name: 'sales-quick-form',
            component: () => import('../views/admin/transaksi/penjualan/SalesQuickFormWithTabs.vue'),
            meta: { requiresAuth: true }
          }
        ]
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const token = auth.token

  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  if (to.name === 'login' && token) {
    return next('/admin')
  }

  next()
})

export default router
