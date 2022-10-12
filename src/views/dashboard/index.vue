<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <!-- <UploadExcel :handle-success="handleSuccess" :before-upload="beforeUpload" /> -->
    <!-- <svg-icon iconClass="eye-open"></svg-icon> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  // created() {
  // // 测试能用token不
  //   this.$store.dispatch('user/getUserInfo')
  // },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    handleSuccess(data) {
      console.log(data)
      // 上传完拿到具体处理的数据进行其他业务
    },
    beforeUpload(file) {
      // 上传之前需要的校验规则
      console.log(file)
      if (file.size > 1024) {
        this.$message.error('文件太大')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
