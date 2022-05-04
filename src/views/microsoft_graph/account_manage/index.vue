<template>
  <div class="app-container">
    <el-table
      :data="account"
      border
      :height="table.height"
      :highlight-current-row="true"
      :row-style="{height: '25px'}"
      :default-sort="{prop: 'createTime', order: 'descending'}"
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
        min-width="350"
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
        min-width="50"
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
      }],
      table: {
        height: 0,
        rowClassName: ''
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
    tableRowClassName({ enabled }) {
      return 'row-style';
    }
  },

  created() {
    this.table.height = this.computedTableHeight();
    this.table.rowClassName = this.computedRowClassName();
    window.onresize = () => {
      return (() => {
        this.table.height = this.computedTableHeight();
      })();
    };
  },

  methods: {
    computedTableHeight() {
      return window.innerHeight - 178;
    },

    computedRowClassName() {
      return (row, index) => {
        return 'el-table-row-style';
        /* if (index % 2 === 0) {
          return 'table-row-light';
        } else {
          return 'table-row-dark';
        }*/
      }
    },

    getAccountList() {
      this.loading = true;
      this.loading = false;
      const search = {
        page: this.pagination.listQuery.page,
        limit: this.pagination.listQuery.limit
      };
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

<style lang="scss" scoped>
.el-table {
  width: 100%;

  .row-style {
    background-color: #fff;
    max-height: 25px;
  }
}

.el-pagination {
  margin-top: 20px;
  max-height: 50px;
  vertical-align: center;
}
</style>
