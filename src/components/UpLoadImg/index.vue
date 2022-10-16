<template>
  <div>
    <!-- :limit="1"控制智能上传一张图片 -->
    <el-upload
      v-loading="loading"
      class="upLoad"
      action="#"
      list-type="picture-card"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :file-list="fileList"
      :on-change="onChange"
      :http-request="httpRequest"
      :limit="1"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 预览图片的弹层 -->
    <el-dialog
      title="图片预览"
      :visible="isShow"
      width="50%"
      :before-close="close"
    >
      <img style="width:100%;" :src="imgUrl">
    </el-dialog>
  </div>
</template>

<script>
// 处理图片的包
import COS from 'cos-js-sdk-v5'
// console.log(COS)
// 创建cos实例
const cos = new COS({
  // 实际开发中 并不会这样写出于安全考虑 就会发送请求 从后端获取
  SecretId: 'AKIDRn4D6oMhr0va0B8rLZr0xgLq7LzQfdMq',
  SecretKey: 'HK8fwxjz6HKAqNis0yhAgEeqobDkLlz4'
})
export default {
  name: 'UploadImg',
  props: {
    // 传过来的原图片地址
    baseUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 上传的文件列表可以展示出来的 因此需要change的时候 把图片加入到这个数组
      fileList: [],
      isShow: false,
      imgUrl: '',
      loading: false
    }
  },
  watch: {
    // 由于父组件的请求是异步的，可能导致在created里进行操作fileList 会这边图片不显示 因此需要监视
    baseUrl() {
      this.fileList.push({
        name: 'default', url: this.baseUrl
      })
    }
  },
  methods: {
    onPreview(file) {
    //   console.log(file)
      this.imgUrl = file.url
      //   console.log('预览')
      this.isShow = true
    },
    //   删除要更新list数据（两个参数 一个是删除的文件 一个是删除以后的文件列表）
    onRemove(file, fileList) {
    //   console.log('移除')
      this.fileList = fileList
    },
    // 接收两个参数 file fileList 我们本地上传的时候 如果push（出现两张图）
    //   filelist赋值（请求的时候 会返回最新状态给我们data的filelist因此出现空的情况） 或者是赋值 都会有问题
    //   虽然第一次打印数组有两个数据但是 因为对象为引用数据类型 所以就下边为一个了 导致上边打开读取也就是一个了
    // 原因是因为 onchange 会触发两次 因为组件的action 也会触发一次
    // 解决方法：覆盖默认的action行为采用组件的属性
    onChange(file, fileList) {
      this.fileList = fileList
    },
    httpRequest({ file }) {
      this.loading = true
      // console.log(file)文件对象
      cos.putObject({
        Bucket: 'haftong-1314348528', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD',
        Body: file // 上传文件对象
        // onProgress: function(progressData) {
        //   // 这一步是干啥？？
        //   // console.log(JSON.stringify(progressData))
        // }
      }, (err, data) => {
        // err 上传失败的信息 ，如果成功 err为null
        // data 上传成功的信息
        // 如果有错误 那就 会结束 提示用户失败 但是 由于这个函数 在cos内部 因此 消息的this 指向不到vue 所以funcation采用箭头函数
        if (err) return this.$message.error('图片上传失败')
        // 能走到这里就代表上传 成功 成功之后进行什么 处理也要取决于我们的页面需求 因此 不能写死 可以让他触发事件
        // console.log(err || data)
        this.loading = false
        this.$message.success('图片上传成功')
        this.$emit('on-success', data)
      // 如果需要其他操作 只需要 拿着数据 在对应函数中处理就可以咯
      })
      // console.log('发请求')
    },
    // 上传之前文件的检查操作
    beforeUpload(file) {
    //   console.log(file)
      //   上传指定类型的文件
      const isType = ['image/jpeg', 'image/png', 'image/gif']
      const isAllow = isType.includes(file.type)
      if (!isAllow) {
        this.$message.error('只允许上传' + isType.join(',') + '类型的文件')
        return false
      }
      //   限制程序图片的大小
      const MaxSize = 1 * 1024 * 1024
      if (file.size > MaxSize) {
        this.$message.error('上传图片大小不能超过1M')
        return false
      }
    },
    // 关闭预览框
    close() {
      this.isShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
// 配合limit让上传一张图后隐藏添加框
.upLoad {
    width: 148px;
    height: 148px;
    overflow: hidden;
}
</style>
