<template>
  <div class="app-container">
    <el-card shadow="always">
      <el-tabs v-model="activeName">
        <div>88888</div>
        <el-tab-pane label="角色管理" name="first">
          <el-row>
            <el-button type="primary" style="margin-left:10px" size="small" icon="el-icon-plus" @click="isShowDialog">新增角色</el-button>
          </el-row>
          <!-- 表格 -->
          <el-table
            v-loading="loading"
            style="width: 100%"
            :data="roleList"
          >
            <!-- 当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据，
          用label属性来定义表格的列名。可以使用width属性来定义列宽。 -->
            <!-- <el-table-column
              prop="date"
              label="日期"
              width="180"
            />
            <el-table-column
              prop="name"
              label="姓名"
              width="180"
            />
            <el-table-column
              prop="address"
              label="地址"
            /> -->
            <el-table-column label="序号" width="120" type="index" />
            <el-table-column label="角色名称" width="240" prop="name" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="操作" width="240">
              <template slot-scope="{row}">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="editRole(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-row type="flex" justify="end" align="middle" style="height:60px">
            <!-- background就是背景色 -->
            <!-- curent-page 当前的页面-->
            <!-- page-size没一页展示的条数 -->
            <!-- page-sizes每页选择个数选择器的选项 -->
            <!-- total总共多少条数据 -->
            <!-- layout布局内容 -->
            <!-- current-change 改变当前页码触发 （current-page改变触发） -->
            <!-- size-change 改变页面数据条数的时候触发  page-size触发-->
            <el-pagination
              v-if=" total > 0"
              background
              layout="prev,pager,next,sizes"
              :total="total"
              :current-page.sync="page.page"
              :page-size.sync="page.pagesize"
              :page-sizes="[2,5,6,10]"
              @current-change="getRoleListApi"
              @size-change="getRoleListApi"
            />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <!-- 不可修改的表格 -->
          <el-form label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 输入框组件 -->
    <role-dilog ref="dialog" :show-dialog.sync="showDialog" @refreshList="getRoleListApi" />
  </div>
</template>

<script>
// 引入输入框的组件
import roleDilog from './components/roleDilog.vue'
import { getRoleList, deleteRole, getCompanyInfo } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  components: {
    roleDilog
  },
  data() {
    return {
      activeName: 'first',
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10
      },
      // 记录的总数
      total: 0,
      // 人员记录的数据
      roleList: [],
      loading: false,
      // 输入信息框的显示隐藏
      showDialog: false,
      // 公司信息
      companyInfo: {}
    }
  },
  mounted() {
    // 挂载阶段里边也可以发请求
    this.getRoleListApi()
    // 调用公司信息请求
    this.getCompanyInfoApi()
  },
  methods: {
    async  getRoleListApi() {
      try {
        this.loading = true
        const { rows, total } = await getRoleList(this.page)
        this.total = total
        this.roleList = rows
        // 优化当我删除了一整页的数据,页码没改变,此页会显示为空,总数居还有,然后需要页码往前推一下
        // 手动加判断再次发请求
        if (total > 0 && rows.length === 0) {
          this.page.page--
          this.getRoleListApi()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    isShowDialog() {
      this.showDialog = true
    },
    // 编辑功能，通过table的插槽拿到当前点击行的数据,然后给到提示框的formdata，打开弹出框回显
    editRole(row) {
      // 防止在页面操作数据的时候，弹框下边数据改变因为两者都是复杂类型，指向同一地址，因为
      // 数据简单，只需要浅拷贝即可复杂的可以json或者深拷贝
      // 因为row里有id所以在弹出组件我们可以根据formDta-id的有还是没有进行选择,
      // 看发送那种请求
      this.$refs.dialog.formData = { ...row }
      this.showDialog = true
    },
    // 根据删除功能
    async  delRole(id) {
      // 再次确认的弹框利用组件
      // 也能利用trycatch的方法
      // this.$confirm('你确定删除角色吗?', '提示', {
      //   confirmButtonText: '确认',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(success => {
      //   console.log('确认')
      // }, cancel => {
      //   console.log('取消')
      // })
      try {
        await this.$confirm('你确定删除角色吗?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 删除
        await deleteRole(id)
        // 刷新列表
        this.getRoleListApi()
      } catch (error) {
        console.log('取消')
      }
    },
    // 根据公司id发送请求获取公司信息
    async getCompanyInfoApi() {
      const data = await getCompanyInfo(this.companyId)
      this.companyInfo = data
      console.log(data)
    }
  },
  /* eslint-disable */
  computed: {
    ...mapGetters(['companyId'])
  }
}
</script>

<style>

</style>
