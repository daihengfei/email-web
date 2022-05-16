<template>
  <div class="app-container">
    <div class="header">
      <el-input
        v-model="search.emailSearch"
        placeholder="邮箱"
        size="small"
      />
      <el-input
        v-model="search.userNameSearch"
        placeholder="用户名"
        size="small"
      />
      <el-date-picker
        v-model="search.dateSearch"
        :default-time="['00:00:00', '23:59:59']"
        type="daterange"
        align="right"
        unlink-panels
        :editable="false"
        range-separator="至"
        start-placeholder="起始创建日期"
        end-placeholder="结束创建日期"
        :picker-options="pickerOptions"
        value-format=" yyyy-MM-dd HH:mm:ss.SSS"
        popper-class="date-picker-popper"
        size="small"
      />
      <el-select
        ref="isEnabled"
        v-model="search.enabledSearch"
        placeholder="是否启用"
        clearable
        size="small"
        class="input-width"
        name="enabledSearch"
        auto-complete="off"
      >
        <el-option :key="'0'" :value="'0'" label="未启用" />
        <el-option :key="'1'" :value="'1'" label="启用" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" size="small" @click="getAccountList">查询</el-button>
    </div>
    <el-table
      :data="account"
      border
      :height="table.height"
      :highlight-current-row="true"
      :default-sort="{prop: 'createTime', order: 'descending'}"
      size="mini"
      @sort-change="changeSort"
    >
      <af-table-column
        type="index"
        width="50"
      />
      <af-table-column
        prop="userEmail"
        label="邮箱"
        min-width="420"
        :show-overflow-tooltip="true"
      />
      <af-table-column
        prop="userName"
        label="用户名"
        min-width="80"
        :show-overflow-tooltip="true"
      />
      <af-table-column
        prop="displayName"
        label="显示名称"
        min-width="80"
        :show-overflow-tooltip="true"
      />
      <af-table-column
        prop="clientId"
        label="应用程序ID"
        min-width="300"
        :show-overflow-tooltip="true"
      />
      <af-table-column
        prop="createdAt"
        label="创建人"
        min-width="80"
        :show-overflow-tooltip="true"
      />
      <af-table-column
        prop="createTime"
        label="创建日期"
        min-width="140"
        sortable="custom"
        :formatter="dateFormatter"
        :show-overflow-tooltip="true"
      />
      <af-table-column
        prop="updatedAt"
        label="更新人"
        min-width="80"
        :show-overflow-tooltip="true"
      />
      <af-table-column
        prop="updateTime"
        label="更新日期"
        min-width="140"
        sortable="custom"
        :formatter="dateFormatter"
      />
      <af-table-column
        prop="enabled"
        label="启用"
        min-width="80"
        :formatter="formatEnabled"
        :show-overflow-tooltip="true"
      />
      <af-table-column
        fixed="right"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="deleteData(scope.$index, account)"
          >
            移除
          </el-button>
        </template>
      </af-table-column>
    </el-table>
    <Pagination
      :total="pagination.total"
      :page.sync="pagination.listQuery.page"
      :limit.sync="pagination.listQuery.limit"
      @pagination="getAccountList"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"
import { getAccountList } from "@/api/microsoft_graph/acount_manage"
import { timestampToTime } from "@/utils/util"
import { Message } from "element-ui"

export default {
  name: "AccountManage",
  components: { Pagination },
  data() {
    return {
      search: {
        emailSearch: "",
        userNameSearch: "",
        dateSearch: [],
        enabledSearch: ""
      },
      pickerOptions: {
        shortcuts: [{
          text: "最近一周",
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit("pick", [start, end])
          }
        }, {
          text: "最近一个月",
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit("pick", [start, end])
          }
        }, {
          text: "最近三个月",
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit("pick", [start, end])
          }
        }]
      },
      account: [],
      table: {
        height: 0,
        sortBy: {
          prop: "createTime",
          order: "descending"
        }
      },
      pagination: {
        total: 0,
        listQuery: {
          page: 1,
          limit: 10
        }
      }
    }
  },

  computed: {},

  async created() {
    this.table.height = this.computedTableHeight()
    this.pagination.listQuery.limit = this.computedPageSize(this.table.height)
    window.onresize = () => {
      return (() => {
        this.table.height = this.computedTableHeight()
      })()
    }
    await this.getAccountList()
  },

  methods: {
    computedTableHeight() {
      return window.innerHeight - 223
    },

    computedPageSize(height) {
      return Math.floor(height / 45 - 1)
    },

    async changeSort(column) {
      this.table.sortBy.prop = column.prop
      this.table.sortBy.order = column.order === "ascending" ? "ascending" : "descending"
      await this.getAccountList()
    },

    getAccountList() {
      this.loading = true
      const search = {
        search: JSON.stringify({
          page: this.pagination.listQuery.page,
          size: this.pagination.listQuery.limit,
          userEmail: this.search.emailSearch,
          userName: this.search.userNameSearch,
          createTime: this.search.dateSearch,
          enabled: this.search.enabledSearch === "1",
          sortByProp: this.table.sortBy.prop,
          sortByOrder: this.table.sortBy.order
        })
      }
      getAccountList(search).then(res => {
        this.loading = false
        const { total, clientInfos } = JSON.parse(res.data)
        this.account = clientInfos
        this.pagination.total = total
      }).catch(err => {
        this.loading = false
        this.pagination.total = 0
        this.accountList = []
        Message.error(err.message)
      })
    },

    deleteData(index, rows) {
      this.$confirm("确定删除该账号吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async() => {
        Message.success("删除成功")
        await this.getAccountList()
      }).catch(() => {
        Message.info("已取消删除")
      })
    },

    formatEnabled(row, column, cellValue) {
      if (cellValue) {
        return "是"
      } else {
        return "否"
      }
    },

    dateFormatter(row, column, cellValue) {
      return timestampToTime(cellValue)
    }
  }
}
</script>

<style>
.el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
  width: 270px;
  margin-right: 10px;
}

</style>

<style lang="scss" scoped>
.header {
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  height: 40px;
  line-height: 40px;
  margin-bottom: 5px;

  .el-input, .el-select {
    width: 150px;
    margin-right: 10px;
  }

  .el-button {
    max-height: 32px;
  }
}

.el-table {
  width: 100%;
}
</style>
