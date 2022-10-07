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
        <el-button size="small" type="warning">导入</el-button>
        <el-button size="small" type="danger">导出</el-button>
        <el-button size="small" type="primary">新增员工</el-button>
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
          <template>
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>

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
      </el-table>
    </el-card>
  </div>
</template>

<script>
// 由于一个个注册较为麻烦考虑到复用，使用全局注册
// import PageTools from '@/components/PageTools'
import { getEmployeeList } from '@/api/employees'
// 枚举数据的处理
import EnumHireType from '@/api/constant/employees'
export default {
  name: 'HrsaasIndex',
  components: {
    // PageTools
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
      hireType: EnumHireType.hireType
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
      return res.value
    }
  }

}
</script>

<style>

</style>
