<template>
  <div v-loading="loading" class="departments-container">
    <!-- 组织架构头部 -->
    <el-card>
      <tree-tools :tree-node="company" :is-root="false" @addDept="OpenDialog" />
    </el-card>
    <!-- 组织结构主体：树形控件 -->
    <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
    <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
    <el-tree :data="departs" :default-expand-all="true" :props="defaultProps">
      <tree-tools slot-scope="{data}" :tree-node="data" @addDept="OpenDialog" @editDept="editDept" @refreshList="getDepartmentsApi" />
    </el-tree>
    <!-- 弹窗组件在这里把currentNode传给这个组件 -->
    <add-deep ref="addDept" :dialog-visible.sync="dialogVisible" :tree-node="currentNode" />
  </div>
</template>
<script>
import treeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
// 引入弹窗组件
import addDeep from './components/add-deep.vue'
// 导入处理结构的函数
import { tranListToTreeData } from '@/utils'
export default {
  components: {
    treeTools,
    addDeep
  },
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [],
      company: { name: '', manager: '' },
      // 组件显隐
      dialogVisible: false,
      // tree-tools传过来的
      currentNode: {},
      // 让所有的操作都有一个loading状态
      loading: false
    }
  },
  mounted() {
    this.getDepartmentsApi()
  },
  methods: {
    async getDepartmentsApi() {
      try {
        this.loading = true
        const { depts, companyManage, companyName } = await getDepartments()
        this.departs = tranListToTreeData(depts, '')
        this.company = { name: companyName, manager: companyManage, id: '' }
      } finally {
        this.loading = false
      }
      // console.log(this.departs)
    },
    // 处理弹窗打开的函数
    OpenDialog(node) {
      // console.log(node)
      this.currentNode = node
      this.dialogVisible = true
    },
    // 点击编辑打开弹窗，回显数据
    editDept(node) {
      this.dialogVisible = true
      this.currentNode = node
      // 回显数据
      this.$refs.addDept.formData = { ...node }
    }
  }
}
</script>
<style lang="scss" scoped>
.departments-container {
width: 900px;
margin: 20px auto;
.el_card {
    .el_card__body {
      padding-right: 20px;
    }
  }
}
</style>
