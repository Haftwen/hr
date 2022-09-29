<template>
  <el-dialog
    :title="title"
    width="50%"
    :visible.sync="showDialog"
    :before-close="closeDialog"
  >
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="formData"
    >
      <el-form-item
        prop="name"
        label="角色"
        :rules="[{
          required:true,message:'角色必填',trigger:'blur'
        }]"
      >
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea" row="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="submit">确 定</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
// 导入新增的接口
import { addRole, updateRole } from '@/api/setting'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '',
        description: ''
      },
      loading: false
    }
  },
  computed: {
    title() {
      // 优化根据有没有id来控制弹出框标题的显示
      return this.formData.id ? '编辑角色' : '新增角色'
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:showDialog', false)
      //   关闭的时候还需要将弹出框输入的内容回到上一次的值
      this.$refs.roleDialogForm.resetFields()
      // 当我们点击编辑,点击关闭,再新增的时候,数据还在,包括id也存在,因为上边的重置是回到初始值,因此我们需要
      // 把其数据全部置空,只有这种等号形式才能把之前的formData数据清空
      this.formData = {
        name: '',
        description: ''
      }
    },
    // 点击确认，发送请求清空表单
    async submit() {
      try {
        // 校验一下表单再去提交数据
        await this.$refs.roleDialogForm.validate()
        // 通过校验添加数据的时候也加载一下loading提示
        this.loading = true
        // 校验完发送请求
        // 因为row里有id所以在弹出组件我们可以根据formDta-id的有还是没有进行选择,
        // 看发送那种请求
        this.formData.id ? await updateRole(this.formData) : await addRole(this.formData)
        // 提升信息后期再说
        this.$message.success(this.formData.id ? '编辑成功' : '新增成功')
        // 新增成功页面刷新，本质就是重新调用一下接口
        this.$emit('refreshList')
        // 再去调用函数清空内容关闭窗口
        this.closeDialog()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

