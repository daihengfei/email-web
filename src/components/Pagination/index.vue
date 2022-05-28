<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="device === 'mobile'? layoutMobile : layout"
      :page-sizes="pageSizes"
      :total="total_1"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {mapGetters} from "vuex"

function getPageList(limit) {
  let defaultPageList = [10, 30, 50, 100]
  defaultPageList.push(limit)
  defaultPageList = [...new Set(defaultPageList.sort((a, b) => a - b))]
  return defaultPageList
}

export default {
  name: "Pagination",
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    pagerCount: {
      type: Number,
      default: 10
    },
    limit: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return getPageList(this.limit)
      }
    },
    layout: {
      type: String,
      default: "sizes, prev, pager, next, jumper, ->, total"
    },
    layoutMobile: {
      type: String,
      default: "prev, total, next, jumper"
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tempCurrentPage: this.page,
      tempPageSize: this.limit
    }
  },
  computed: {
    total_1() {
      return this.total
    },
    currentPage: {
      get() {
        return this.tempCurrentPage
      },
      set(val) {
        if (this.tempCurrentPage !== val) {
          this.tempCurrentPage = val
          this.$emit("update:page", val)
        }
      }
    },
    pageSize: {
      get() {
        return this.tempPageSize
      },
      set(val) {
        if (this.tempPageSize !== val) {
          this.tempPageSize = val
          this.$emit("update:limit", val)
        }
      }
    },
    ...mapGetters(["device"])
  },
  methods: {
    resetPagination() {
      let defaultPageList = [10, 30, 50, 100]
      defaultPageList.push(this.limit)
      defaultPageList = [...new Set(defaultPageList.sort((a, b) => a - b))]
      this.pageSize = this.limit
      this.pageSizes = defaultPageList
      this.currentPage = 1
    },

    handleSizeChange(val) {
      this.$emit("pagination", {page: this.currentPage, limit: val})
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit("pagination", {page: val, limit: this.pageSize})
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  background: transparent;
  padding: 20px 16px;
  text-align: center;
  max-height: 50px;
  vertical-align: center;
}
.pagination-container.hidden {
  display: none;
}
</style>
