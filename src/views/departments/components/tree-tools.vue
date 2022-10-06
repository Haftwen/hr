<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width:100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex">
        <span style="margin-right: 8px">{{ treeNode.manager }}</span>
        <el-dropdown @command="handleCommand">
          <span>
            操作<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add">添加子部门</el-dropdown-item>
            <!-- 下拉选项不同头部是一个,下边是三个 -->
            <el-dropdown-item v-if="isRoot" command="edit">编辑部门</el-dropdown-item>
            <el-dropdown-item v-if="isRoot" command="del">删除部门</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { delDepartments } from '@/api/employees'
export default {
  name: 'HrsaasTreeTools',
  props: {
    // 兄弟节点需要这个数据把它传过去
    treeNode: {
      type: Object,
      required: true
    },
    //   让父组件通知它到底是那部分展示
    isRoot: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleCommand(type) {
      if (type === 'add') {
        // console.log('新增')
        // 通知父组件是新增内容 点击添加子部门的时候把当前数据传递给父亲
        this.$emit('addDept', this.treeNode)
      } else if (type === 'edit') {
        // console.log('编辑')
        this.$emit('editDept', this.treeNode)
      } else {
        // 删除操作需要二次确认采用组件***************
        this.$confirm('是否确定删除该部门?', '提示', {
          type: 'warning'
        }).then(res => {
          return delDepartments(this.treeNode.id)
        }).then(res => {
          this.$message.success('删除成功')
          // 通知父组件刷新列表
          this.$emit('refreshList')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
