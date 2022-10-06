<template>
  <!-- 新增部门的弹层 -->
  <!-- :visible="dialogVisible"属性控制组件的显示隐藏 -->
  <el-dialog :title="title" :visible="dialogVisible" @close="handleClose">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 部门名称（name）：必填 1-50个字符 / 同级部门中禁止出现重复部门

    部门编码（code）：必填 1-50个字符 / 部门编码在整个模块中都不允许重复

    部门负责人（manager）：必填

    部门介绍 ( introduce)：必填 1-300个字符 -->
    <!-- 匿名插槽 -->
    <el-form ref="addDeptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeesSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
          <!-- 把值给到我对应绑定的内容:value="item.username" -->
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button v-loading="loading" type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 新增需求
//  部门名称 同级部门中禁止出现重复部门
// 部门编码 在整个模块中都不允许重复
// 通过自定义校验函数validator来实现
// #6.3.1 部门编码 在整个模块中都不允许重复
import { getDepartments } from '@/api/departments'
import { getEmployeesSimple, addDepartments, updateDepartments } from '@/api/employees'
export default {
// 通过父组件控制弹窗的显示隐藏
// 父子
// 子到父用.sync 在关闭弹窗的时候 update：dialogVisible
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 子传父，父又传给子的
    treeNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 部门code不允许重复的规则
    const checkCodeRepeat = async(rule, value, callback) => {
      // 每次都获取最新数据
      const { depts } = await getDepartments()
      let isReapt = true
      // 编辑模式下失去焦点存在，自己与自己对比的情况需要排除掉自己只与其他对比
      if (this.formData.id) {
        isReapt = depts.some(ele => ele.id !== this.formData.id && ele.code === value)
      } else {
        isReapt = depts.some(ele => ele.code === value)
      }
      if (isReapt) {
        callback(new Error(`模块下已存在${value}编码`))
      } else {
        callback()
      }
    }
    // 每个部门中不允许名称重复
    const nameCheck = async(rule, value, callback) => {
      // 每次都获取最新数据
      const { depts } = await getDepartments()
      // 处于编辑模式的情况下 无法校验出同级部门的数据 先找同级的所有部门 再处理
      let isReapt = true
      if (this.formData.id) {
        const depstj1 = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id)
        // console.log(depstj1)
        isReapt = depstj1.some(ele => {
          return ele.name === value
        })
      } else {
      //   找到这个部门
        const depstj = depts.filter(item => item.pid === this.treeNode.id)
        isReapt = depstj.some(ele => {
          return ele.name === value
        })
      }
      console.log(isReapt)
      isReapt ? callback(new Error(`该部门下已经存在${value}部门名称`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称1-50个字符', trigger: 'blur' },
          { validator: nameCheck, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkCodeRepeat
          }
        ],
        manager: [
          { required: true, message: '部门负责人必填' }
        ],
        introduce: [
          { required: true, message: '部门介绍必填', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍1-300个字符', trigger: 'blur' }
        ]
      },
      peoples: [],
      loading: false
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      //   优化防止点完之后再点开有内容
      this.$refs.addDeptForm.resetFields()
      // 遗留
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    async getEmployeesSimple() {
      const res = await getEmployeesSimple()
      this.peoples = res
    },
    // 数据提交
    async submit() {
      // 校验数据不传参数返回的是promise根据promise得成功失败判断可不可以发送请求
      try {
        await this.$refs.addDeptForm.validate()
        // 新增得接口传参数
        // 根据有没有id判断我们是新增还是编辑，该采取那个接口
        if (this.formData.id) {
          // 编辑模式下
          await updateDepartments(this.formData)
        } else {
          // 因为是添加子部门，所以我们需要将新增的部门pid设置成当前部门的id，新增的部门就成了自己的子部门
          await addDepartments({ ...this.formData, pid: this.treeNode.id })
        }
        // 确定按钮的loading状态
        this.loading = true
        // 接口新增成功之后 消息提示成功
        this.$message.success(`${this.formData.id ? '编辑成功' : '新增成功'}`)
        // 刷新父组件的组织架构列表
        this.$parent.getDepartmentsApi()
        // 关闭弹窗
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
