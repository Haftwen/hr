import Layout from '@/layout'
export default {
  path: '/approvals',
  component: Layout,
  children: [
    {
      name: 'approvals',
      path: '',
      component: () => import('@/views/approvals/index.vue'),
      meta: { title: '审批', icon: 'tree-table' }
    }
  ]
}
