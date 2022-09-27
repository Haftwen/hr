import Layout from '@/layout'
export default {
  path: '/attendances',
  component: Layout,
  children: [
    {
      name: 'attendances',
      path: '',
      component: () => import('@/views/attendances/index.vue'),
      meta: { title: '考勤', icon: 'skill' }
    }
  ]
}
