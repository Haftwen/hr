import Layout from '@/layout'
export default {
  path: '/approvals',
  component: Layout,
  children: [
    {
      name: 'approvals',
      // 路径不写为当前的默认
      path: '',
      component: () => import('@/views/approvals/index.vue'),
      meta: { title: '审批', icon: 'tree-table' }
    }
  ]
}
