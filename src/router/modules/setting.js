import Layout from '@/layout'
export default {
  path: '/setting',
  component: Layout,
  children: [
    {
      name: 'setting',
      path: '',
      component: () => import('@/views/setting/index.vue'),
      meta: { title: '公司设置', icon: 'setting' }
    }
  ]
}
