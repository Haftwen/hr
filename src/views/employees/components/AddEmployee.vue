<template>
  <el-dialog title="新增员工" :visible="dialogVisible" @close="handleClose">
    <!-- 表单 -->
    <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" @focus=" getDepartments" />
        <!-- 通过树的时间讲点击内容显示到input框 -->
        <el-tree v-if="isShowTree" v-loading="loading" :data="treeData" :default-expand-all="true" :props="{ label: 'name' }" style="width:80%" @node-click="select" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>

    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="handleClose">取消</el-button>
          <el-button type="primary" size="small" @click="submit">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import { addEmployee } from '@/api/employees'
// el-form配置model和rules属性
// el-form-item配置prop属性
// 表单进行v-model双向绑定
// 工作中的聘用形式操作
import employeesEnum from '@/api/constant/employees'
export default {
  name: 'HrsaasAddEmployee',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 用户名必填，username，长度为1-4位
      // 手机号必填，mobile，需满足 正则表达式 /^1[3-9]\d{9}$/
      // 聘用形式必填， formOfEmployment
      // 工号必填，workNumber
      // 部门必填，departmentName
      // 入职时间必填， timeOfEntry
      // 转正时间可选，correctionTime
      // 表单校验的步骤
      hireType: employeesEnum.hireType,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空' }],
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }]
      },
      treeData: [],
      isShowTree: false,
      loading: false
    }
  },
  methods: {
    // 取消的时候 一般会做3件事
    // 1. 表单校验结果的重置
    // 2. formData 数组的重置
    // 3. 改变父组件的值
    handleClose() {
      // 取消时优化也需要树不显示
      this.isShowTree = false
      // 重置只是回到初始值，并没有回到空 因此当新增数据回显的时候，做了修改再点还会有，因此需要置空
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields() // 重置校验结果
      this.$emit('update:dialogVisible', false)
    },
    async getDepartments() {
      // 获得焦点显示树
      this.isShowTree = true
      //   加载框
      this.loading = true
      const { depts } = await getDepartments()
      //   调用封装的函数处理数据结构
      this.treeData = tranListToTreeData(depts, '')
      //   请求完加载状态关闭
      this.loading = false
    },
    select(node) {
      this.formData.departmentName = node.name
      //   选完以后关闭
      this.isShowTree = false
    //   loading加载优化
    },
    // 调接口发数据
    async  submit() {
      try {
        await this.$refs.addEmployee.validate()
        // 通过校验掉接口
        await addEmployee(this.formData)
        // 成功关闭弹窗
        this.handleClose()
        // 刷新页面
        this.$emit('reFresh')
        this.$message.success('新增成功！！')
      } catch (error) {
        this.$message.error('新增失败')
      }
    }
  }
}
</script>

