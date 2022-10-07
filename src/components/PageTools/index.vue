<template>
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col v-if="showBefore">
        <div :class="`before ${type}`">
          <i :class="`el-icon-${type}`" />
          <!-- 定义前面得插槽 -->
          <slot name="before" />
          <!-- <span>共25条记录</span> -->
        </div>
      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <!-- 定义后面的插槽 -->
          <slot name="after" />
          <!-- <el-button size="small" type="warning">导入</el-button>
          <el-button size="small" type="danger">导出</el-button> -->
        </el-row>
      </el-col>
    </el-row>
  </el-card>
  <!-- 组件支持四种状态 info success warning error -->
  <!-- 可以通过父组件传递状态过来 来控制左边我需要显示的对应的状态动态类名的方式 -->
  <!-- 需要对传过来的状态进行一个validator校验 看看是不是 在规定的状态之内 -->
</template>
<script>
export default {
  name: 'PageTools',
  //   type和showbefore为的是组件功能完善
  props: {
    type: {
      type: String,
      default: 'info',
      validator(value) {
        if (['info', 'success', 'warning', 'error'].includes(value)) {
          return true
        }
        return false
      }
    },
    showBefore: {
      type: Boolean,
      default: true
    }
    // 父组件啥都没传
  }
}
</script>
  <style lang='scss'>
   .page-tools {
      margin: 10px 0;
      .before {
        line-height: 34px;
        display: inline-block;
        border-radius: 3px;
        i {
          margin-right: 5px;
        }
        &.info {
          padding: 0px 10px;
          border: 1px solid rgba(145, 213, 255, 1);
          background: rgba(230, 247, 255, 1);
          i {
            color: #409eff;
          }
        }
        &.success {
        padding: 0px 10px;
        border: 1px solid #c2e7b0;
        background: #f0f9eb;
        i {
          color: #67c23a;
        }
      }

      &.warning {
        padding: 0px 10px;
        border: 1px solid #f5dab1;
        background: #fdf6ec;
        i {
          color: #e6a23c;
        }
      }

      &.error {
        padding: 0px 10px;
        border: #fbc4c4;
        background: #fef0f0;
        i {
          color: #f56c6c;
        }
      }
      }
   }
  </style>
