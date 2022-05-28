<template>
  <div class="app-container">
    <div class="header">
      <el-input
        v-model="search.emailSearch"
        placeholder="邮箱"
        size="small"
        clearable
      />
      <el-input
        v-model="search.userNameSearch"
        placeholder="用户名"
        size="small"
        clearable
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
      <el-button type="primary" icon="el-icon-search" size="small" @click="searchClick">查询</el-button>
      <el-button type="primary" size="small" @click="resetSearch">重置</el-button>
      <el-button type="primary" size="small" style="float: right" @click="addData">新建</el-button>
    </div>
    <el-divider />
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="account"
      border
      :height="table.height"
      :highlight-current-row="true"
      :default-sort="{prop: 'createTime', order: 'descending'}"
      size="mini"
      @sort-change="changeSort"
    >
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
            @click.native.prevent="addData(scope.$index, account)"
          >
            编辑
          </el-button>
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
      ref="pagination"
      :total="pagination.total"
      :page.sync="pagination.listQuery.page"
      :limit.sync="pagination.listQuery.limit"
      @pagination="getAccountList"
    />
    <transition name="el-fade-in-linear">
      <el-dialog :title="addPage.title" :visible.sync="addPage.dialogFormVisible" class="pub_dialog">
        <el-steps :active="addPage.active" align-center finish-status="success">
          <el-step title="用户信息" />
          <el-step title="用户授权" />
          <el-step title="确认信息" />
        </el-steps>
        <el-divider />
        <div class="dialog-container">
          <div v-show="addPage.active === 0" class="infoForm">
            <transition name="el-zoom-in-top">
              <el-form ref="addForm" :model="addPage.form" :rules="addPage.formRules" label-width="120px" size="small">
                <el-form-item label="邮箱" prop="userEmail">
                  <el-input v-model="addPage.form.userEmail" size="small" placeholder="请输入邮箱" maxlength="128" />
                </el-form-item>
                <el-form-item label="应用程序ID" prop="clientId">
                  <el-input
                    v-model="addPage.form.clientId"
                    size="small"
                    placeholder="请输入应用程序ID"
                    maxlength="128"
                  />
                </el-form-item>
                <el-form-item label="租户ID" prop="clientId">
                  <el-input
                    v-model="addPage.form.tenantId"
                    size="small"
                    placeholder="请输入租户ID"
                    maxlength="128"
                  />
                </el-form-item>
                <el-form-item label="机密" prop="secretKey">
                  <el-input v-model="addPage.form.secretKey" size="small" placeholder="请输入机密" maxlength="128" />
                </el-form-item>
              </el-form>
            </transition>
          </div>
          <div v-show="addPage.active === 1" class="auth">
            <el-empty image-size="120" :image="require('@/assets/loding/loading.gif')" description="授权中..." />
          </div>
          <div v-show="addPage.active === 2" class="descriptions">
            <el-descriptions title="详细信息" :column="2" size="medium" border label-style="min-width:95px">
              <el-descriptions-item>
                <template slot="label">显示名称</template>
                {{ addPage.form.displayName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">名称</template>
                {{ addPage.form.userName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">邮箱</template>
                {{ addPage.form.userEmail }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">应用程序ID</template>
                {{ addPage.form.clientId }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">租户ID</template>
                {{ addPage.form.tenantId }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">机密</template>
                {{ addPage.form.secretKey }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">刷新token</template>
                {{ addPage.form.refreshToken }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">认证token</template>
                {{ addPage.form.accessToken }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" :disabled="addPage.active <= 0" @click="preStep">上一步</el-button>
          <el-button type="primary" size="small" @click="nextStep">{{
            addPage.active === 2 ? "确定" : "下一步"
          }}
          </el-button>
        </div>

      </el-dialog>
    </transition>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"
import {createAccount, deleteAccount, getAccountList} from "@/api/microsoft_graph/acount_manage"
import {Message} from "element-ui"
import {getLoginUrl, getTempClientInfo} from "@/api/microsoft_graph/auth"
import {timestampToTime} from "@/utils/util"

export default {
  name: "AccountManage",
  components: {Pagination},
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
        }],
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      account: [],
      loading: false,
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
      },
      addPage: {
        title: "",
        dialogFormVisible: false,
        active: 0,
        form: {
          displayName: "",
          userName: "",
          userEmail: "daihengfei@live.com",
          userId: "",
          clientId: "31e69c1a-744f-4011-a7de-53c679edeb79",
          tenantId: "8c9ca7b2-959e-4720-b081-432c77a66652",
          secretKey: "T6k7Q~UOHjsSQwAhwWkr2X3PQQLbfICauE7ej",
          accessToken: "",
          refreshToken: ""
        },
        formRules: {
          userEmail: [{
            required: true,
            message: "请输入用户邮箱",
            trigger: "blur"
          }],
          clientId: [{
            required: true,
            message: "请输入应用程序ID",
            trigger: "blur"
          }],
          secretKey: [{
            required: true,
            message: "请输入机密",
            trigger: "blur"
          }]
        },
        iframes: {
          src: ""
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
        this.pagination.listQuery.limit = this.computedPageSize(this.table.height)
      })()
    }
    await this.getAccountList()
  },

  methods: {
    computedTableHeight() {
      return window.innerHeight - 223 - 40
    },

    computedPageSize(height) {
      return Math.floor((height - 10) / 45 - 1)
    },

    async changeSort(column) {
      this.table.sortBy.prop = column.prop
      this.table.sortBy.order = column.order === "ascending" ? "ascending" : "descending"
      await this.getAccountList()
    },

    getAccountList() {
      this.loading = true
      const search = {
        page: this.pagination.listQuery.page,
        size: this.pagination.listQuery.limit,
        userEmail: this.search.emailSearch,
        userName: this.search.userNameSearch,
        createTime: this.search.dateSearch,
        enabled: this.search.enabledSearch,
        sortByProp: this.table.sortBy.prop,
        sortByOrder: this.table.sortBy.order
      }
      getAccountList(search).then(res => {
        const {total, clientInfos} = JSON.parse(res.data)
        this.account = clientInfos
        this.pagination.total = total
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.pagination.total = 0
        this.accountList = []
        Message.error(err.message)
      })
    },

    searchClick() {
      this.pagination.listQuery.page = 1
      this.pagination.listQuery.limit = this.computedPageSize(this.table.height)
      this.$refs.pagination.resetPagination()
      this.getAccountList()
    },

    resetSearch() {
      this.search.emailSearch = ""
      this.search.userNameSearch = ""
      this.search.dateSearch = []
      this.search.enabledSearch = ""
      this.pagination.listQuery.page = 1
      this.pagination.listQuery.limit = this.computedPageSize(this.table.height)
      this.$refs.pagination.resetPagination()
      this.searchClick()
    },

    addData(index, rows) {
      if (rows !== undefined && rows[index] !== undefined) {
        this.addPage.title = "编辑"
        this.addPage.form.displayName = rows[index].displayName
        this.addPage.form.userEmail = rows[index].userEmail
        this.addPage.form.clientId = rows[index].clientId
        this.addPage.form.tenantId = rows[index].tenantId
        this.addPage.form.secretKey = rows[index].secretKey
      } else {
        this.addPage.title = "新增"
      }
      this.addPage.active = 0
      this.addPage.dialogFormVisible = true
    },

    deleteData(index, rows) {
      this.$confirm("确定删除该账号吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async() => {
        deleteAccount(rows[index].id).then(res => {
          Message.success("删除成功")
          this.getAccountList()
        }).catch(err => {
          Message.error(err.message)
        })
      }).catch(() => {
        Message.info("已取消删除")
      })
    },

    preStep() {
      this.addPage.active--
    },

    nextStep() {
      if (this.addPage.active === 0) {
        const {form} = this.addPage
        this.$refs.addForm.validate(valid => {
          if (valid) {
            getLoginUrl(form).then(res => {
              this.addPage.active++
              window.open(res.data, "_blank")
              this.$confirm("授权成功了吗？", "提示", {
                confirmButtonText: "成功",
                cancelButtonText: "失败",
                type: "info"
              }).then(async() => {
                getTempClientInfo(form.userEmail).then(res => {
                  const data = JSON.parse(res.data)
                  this.addPage.form.displayName = data.displayName
                  this.addPage.form.userName = data.userName
                  this.addPage.form.userId = data.userId
                  this.addPage.form.accessToken = data.accessToken
                  this.addPage.form.refreshToken = data.refreshToken
                  this.addPage.active++
                }).catch(err => {
                  Message.error(err.message)
                })
              }).catch(() => {
                this.addPage.active--
                Message.info("已取消授权")
              })
            }).catch(err => {
              Message.error(err.message)
            })
          }
        })
      } else if (this.addPage.active === 2) {
        createAccount(this.addPage.form).then(res => {
          Message.success("保存成功")
          this.addPage.dialogFormVisible = false
          this.getAccountList()
        }).catch(err => {
          Message.error(err.message)
        })
      } else {
        this.addPage.active++
      }
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
  //height: 40px;
  //line-height: 40px;
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

  .dialog-container {
    //width: 60%;
    height: 40vh !important;
    overflow: auto !important;
  }

  .infoForm {
    width: 100%;
    height: 100%;
    .el-form {
      width: 90%;
    }
  }

  .auth {
    text-align: center;
  }

  .descriptions {
    width: 100%;

    .my-label {
      width: 120px;
      min-width: 120px;
    }
  }
</style>
