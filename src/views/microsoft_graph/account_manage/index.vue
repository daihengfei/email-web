<template>
  <div class="app-container">
    <div class="header">
      <el-input
        v-model="emailSearch"
        placeholder="邮箱"
        size="small"
      />
      <el-input
        v-model="userNameSearch"
        placeholder="用户名"
        size="small"
      />
      <el-date-picker
        v-model="dataSearch"
        type="daterange"
        align="right"
        unlink-panels
        :editable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        popper-class="date-picker-popper"
        size="small"
      />
      <el-button type="primary" icon="el-icon-search" size="small" @click="getAccountList">搜索</el-button>
    </div>
    <el-table
      :data="account"
      border
      :height="table.height"
      :highlight-current-row="true"
      :default-sort="{prop: 'createTime', order: 'descending'}"
      size="mini"
    >
      <el-table-column
        prop="userEmail"
        label="邮箱"
        min-width="120"
      />
      <el-table-column
        prop="userName"
        label="用户名"
        min-width="80"
      />
      <el-table-column
        prop="displayName"
        label="显示名称"
        min-width="80"
      />
      <el-table-column
        prop="clientId"
        label="应用程序ID"
        min-width="300"
      />
      <el-table-column
        prop="createdAt"
        label="创建人"
        min-width="80"
      />
      <el-table-column
        prop="createTime"
        label="创建日期"
        min-width="120"
        sortable
      />
      <el-table-column
        prop="updatedAt"
        label="更新人"
        min-width="80"
      />
      <el-table-column
        prop="updateTime"
        label="更新日期"
        min-width="120"
        sortable
      />
      <el-table-column
        prop="enabled"
        label="启用"
        min-width="80"
        sortable
      />
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
import Pagination from '@/components/Pagination';
import { getAccountList } from '@/api/microsoft_graph/acount_manage';
export default {
  name: 'AccountManage',
  components: { Pagination },
  data() {
    return {
      emailSearch: '',
      userNameSearch: '',
      dataSearch: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      account: [{
        userEmail: '1',
        userName: '1',
        displayName: '1',
        clientId: '1',
        enabled: true,
        createdAt: '1',
        updatedAt: '1',
        createTime: '1',
        updateTime: '1'
      }, {
        userEmail: '2',
        userName: '1',
        displayName: '1',
        clientId: '1',
        enabled: true,
        createdAt: '1',
        updatedAt: '1',
        createTime: '2',
        updateTime: '1'
      }],
      table: {
        height: 0
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

  computed: {

  },

  created() {
    this.table.height = this.computedTableHeight();
    window.onresize = () => {
      return (() => {
        this.table.height = this.computedTableHeight();
      })();
    };
  },

  methods: {
    computedTableHeight() {
      return window.innerHeight - 223;
    },

    getAccountList() {
      this.loading = true;
      this.loading = false;
      const search = {
        search: {
          page: this.pagination.listQuery.page,
          limit: this.pagination.listQuery.limit,
          userEmail: this.emailSearch,
          userName: this.userNameSearch,
          createTime: this.dataSearch
        }
      };
      console.log(search);
      getAccountList(search).then(res => {
        this.account = res.data.data;
        this.pagination.total = res.data.total;
      });
      /* this.getAccountListApi().then(res => {
        this.loading = false;
        this.pagination.total = res.data.total;
        this.accountList = res.data.list;
      }).catch(err => {
        this.loading = false;
        this.pagination.total = 0;
        this.accountList = [];
      });*/
    }
  }
}
</script>

<style>
.el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
  width: 270px;
  margin-right: 10px;
  /*padding-top: 0;*/
}
/*.el-range-input{
  padding-top: 3px;
}
.el-range-separator{
  padding-top: 3px;
}*/
</style>

<style lang="scss" scoped>
.header{
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  height: 40px;
  line-height: 40px;
  margin-bottom: 5px;

  .el-input{
    width: 150px;
    margin-right: 10px;
  }

  .el-button{
    max-height: 32px;
  }
}

.el-table {
  width: 100%;
}
</style>
