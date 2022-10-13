<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-tabs v-model="activeName">
          <el-tab-pane label="登录账户设置" name="first">
            <!-- 表单 -->
            <el-form ref="form" label-width="80px" :rules="rules" :model="accountInfo">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="accountInfo.username" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="accountInfo.password" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="upDateInfo">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情" name="second">
            <userInfo />
          </el-tab-pane>
          <el-tab-pane label="岗位信息" name="third"><jobInfo /></el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getUserDetailById, saveUserDetailById } from '@/api/user.js'
import userInfo from './components/user-info.vue'
import jobInfo from './components/job-info.vue'
export default {
  name: 'HrsaasDetail',
  components: { userInfo, jobInfo },
  data() {
    return {
      activeName: 'first',
      accountInfo: {},
      rules: {
        username: [{ required: true, message: '请输入名字', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' },
          { min: 2, message: '密码最少六位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      // 根据路由传参的id获取具体信息(路由传参的方法需要下去再看)
      const res = await getUserDetailById(this.$route.params.id)
      //   console.log(res)
      this.accountInfo = res
    },
    // 保存用户信息
    // async await 有什么缺点 错误必须通过trycatch捕获
    async upDateInfo() {
      //   console.log(this.accountInfo)
      try {
        await this.$refs.form.validate()
        await saveUserDetailById(this.accountInfo)
        // 刷新列表
        this.getUserDetailById()
        //   提示信息
        this.$message.success('更新成功！！')
      } catch (error) {
        this.$message.error(error)
      }
    }
  }
}
</script>
    <style lang="">

    </style>
