import Layout from '@/layout'
export default {
  path: '/salarys',
  component: Layout,
  children: [
    {
      name: 'salarys',
      path: '',
      component: () => import('@/views/salarys/index.vue'),
      meta: { title: '工资', icon: 'money' }
    }
  ]
}
