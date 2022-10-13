<template>
  <div>
    <page-tools>
      <template v-slot:before>
        <span>共{{ total }}条记录</span>
      </template>
      <!-- 如果传过来的有值 -->
      <!-- <template #after="scoped"> -->
      <!-- <template v-slot:before="scoped"> -->
      <template #after>
        <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
        <el-button size="small" type="danger" @click="exportExcel">导出</el-button>
        <el-button size="small" type="primary" @click="addEmployee">新增员工</el-button>
      </template>
    </page-tools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="工号" prop="workNumber" />
        <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatterFn" />
        <!-- <template slot-scope="{row}">
          过滤器解决文本格式化
          <span>{{row.....}}</span>
        </template> -->
        <el-table-column label="部门" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="{row}">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState">
          <template slot-scope="{row}">
            <el-switch
              :value="row.enableState===1"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="goDetaial(row)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页组件 -->
    <el-row type="flex" justify="end" align="middle" style="height: 60px">
      <el-pagination
        layout="prev, pager, next,sizes,total"
        :total="total"
        :current-page.sync="page.page"
        :page-size.sync="page.size"
        :page-sizes="[2,5,10]"
        @current-change="getEmployeeList"
        @size-change="getEmployeeList"
      />
    </el-row>
    <!-- 新增员工 -->
    <addEmployee :dialog-visible.sync="dialogVisible" @reFresh="getEmployeeList" />
  </div>
</template>

<script>
// 由于一个个注册较为麻烦考虑到复用，使用全局注册
// import PageTools from '@/components/PageTools'
import { getEmployeeList, delEmployee } from '@/api/employees'
// 枚举数据的处理
import EnumHireType from '@/api/constant/employees'
import addEmployee from './components/AddEmployee.vue'
export default {
  name: 'HrsaasIndex',
  components: {
    // PageTools
    addEmployee
  },
  data() {
    return {
      page: {
        page: 1, // 当前页码
        size: 10
      },
      list: [], // 接数据的
      total: 0, // 总数
      loading: false,
      hireType: EnumHireType.hireType,
      dialogVisible: false
    }
  },

  mounted() {
    this.getEmployeeList()
  },

  methods: {
    async getEmployeeList() {
      try {
        this.loading = true
        const { rows, total } = await getEmployeeList(this.page)
        this.list = rows
        this.total = total
      } finally {
        this.loading = false
      }
    },
    formatterFn(row, column, cellvalue) {
      // 数组方法find
      const res = this.hireType.find(ele => ele.id === cellvalue)
      // console.log(res)
      // 当有人没整表单验证加了空数据的时候报错 用这个解决*********
      return res && res.value || '非正式'
    },
    // 新增员工
    addEmployee() {
      this.dialogVisible = true
    },
    // 删除员工
    async del(id) {
      // console.log(row)
      // 需要拿到删除对应的id 插槽
      // 二次确认
      // 调接口刷新页面
      try {
        await this.$confirm('确定删除吗？', '提示', {
          type: 'warning'
        })
        // 掉接口
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.fail('删除成功')
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    async  exportExcel() {
      // console.log(2)
      // 文件懒加载 import（‘路径’）
      // 它的返回值是一个promise
      // import('@/vendor/Export2Excel.js').then((res) => {
      //   // 导入成功的回调 res当中含有我需要的方法
      //   console.log(res)
      // })
      // 发送请求拿到数据 处理数据
      const { rows } = await getEmployeeList({ page: 1, size: this.total })
      // console.log(rows)
      // 处理逻辑******************************
      // 映射表
      const headersPathMap = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职时间': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 对数据进行处理
      // 表头 替换
      const header = Object.keys(headersPathMap)
      // const header = ['手机号', '姓名', '入职时间', '聘用形式', '转正日期', '工号', '部门']
      // 表格内容一个数组就是对应一行的数据
      // 内容数据与表头保持一致
      const data = rows.map(item => {
        // return []
        return header.map(ele => {
          // 根据表头找到表头对应的数据
          if (ele === '聘用形式') {
            const find = this.hireType.find(hire => {
              return hire.id === item[headersPathMap[ele]]
            })
            // console.log(find)
            return find ? find.value : '未知'
          }
          // ****
          return item[headersPathMap[ele]]
        })
      })
      // *************************************
      const { export_json_to_excel } = await import('@/vendor/Export2Excel.js')
      export_json_to_excel({
        header, // 表头 必填
        // data当中的数组一每个数组对应一行的数据
        data, // 具体数据 必填
        filename: 'excel-list', // 非必填 文件名
        autoWidth: true, // 非必填 单元格自适应
        bookType: 'xlsx' // 非必填 导出类型
        // 复杂表头
        //         multiHeader: [['手机号', '主要信息', '', '', '', '', '部门']],
        // merges: ['A1:A2', 'B1:F1', 'G1:G2'],
      })
    },
    // 点击去详情页
    goDetaial(row) {
      this.$router.push('/employees/detail/' + row.id)
    }
  }

}
</script>

<style>

</style>
