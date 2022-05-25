<template>
  <div class="app-container">
    <div class="menu-container">
      <el-row :gutter="20">
        <el-col :span="4" class="tree-container">
          <div class="menu-container-header">
            <el-input
              v-model="filterText"
              placeholder="输入关键字进行过滤"
              size="large"
            />
          </div>
          <el-tree
            v-if="treeVisible"
            ref="menuTree"
            :data="menuList"
            node-key="id"
            :props="defaultProps"
            class="permission-tree"
            default-expand-all
            :expand-on-click-node="false"
            :check-on-click-node="false"
            :filter-node-method="filterNode"
            :highlight-current="true"
            @node-contextmenu="openRightMenu"
            @node-click="handleNodeClick"
          />
        </el-col>
        <transition name="el-zoom-in-top">
          <el-col v-if="menuFormVisible" :span="8">
            <el-form
              ref="menuForm"
              :model="menuForm"
              :rules="menuRules"
              auto-complete="off"
              label-position="left"
              label-width="100px"
              :validate-on-rule-change="false"
              :hide-required-asterisk="true"
              class="menu-form"
              :disabled="menuFormDisable"
            >
              <el-form-item prop="menuName" label="菜单名称">
                <el-input
                  ref="menuName"
                  v-model="menuForm.menuName"
                  placeholder="菜单名称"
                  size="small"
                  class="input-width"
                  name="menuName"
                  type="text"
                  tabindex="1"
                  auto-complete="off"
                />
              </el-form-item>
              <el-form-item prop="menuUrl" label="菜单URL">
                <el-input
                  ref="menuUrl"
                  v-model="menuForm.menuUrl"
                  placeholder="菜单URL"
                  size="small"
                  class="input-width"
                  name="menuUrl"
                  type="text"
                  tabindex="2"
                  auto-complete="off"
                />
              </el-form-item>
              <el-form-item prop="menuIcon" label="菜单图标">
                <el-input
                  ref="menuIcon"
                  v-model="menuForm.menuIcon"
                  placeholder="菜单图标"
                  size="small"
                  class="input-width"
                  name="menuIcon"
                  type="text"
                  tabindex="3"
                  auto-complete="off"
                />
              </el-form-item>
              <el-form-item prop="menuParentId" label="父节点">
                <el-select
                  ref="menuParentId"
                  v-model="menuForm.menuParentId"
                  placeholder="父节点"
                  filterable
                  size="small"
                  class="input-width"
                  name="menuParentId"
                  tabindex="4"
                  auto-complete="off"
                  style="width: 100%"
                >
                  <el-option :key="'0'" :value="'0'" label="顶级菜单" />
                  <el-option
                    v-for="item in menuParentList"
                    :key="item.id"
                    :label="item.menuName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="enabled" label="启用">
                <el-checkbox v-model="menuForm.enabled" />
              </el-form-item>
              <transition name="el-zoom-in-top">
                <el-button
                  v-if="saveButtonVisible"
                  type="primary"
                  :loading="loading"
                  style="width:100%;margin-bottom:30px;"
                  @click.native.prevent="updateButtonVisible ? handleCreateMenu() : handleUpdateMenu()"
                >{{ updateButtonVisible ? '保存' : '更新' }}
                </el-button>
              </transition>
            </el-form>
          </el-col>
        </transition>
        <transition name="el-zoom-in-top">
          <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
            <li v-if="treeData.menuParentId === '0' && treeData.id !== '1'" @click="createMenu(treeData)">新建</li>
            <li v-if="treeData.id !== '1'" @click="updateMenu(treeData)">编辑</li>
            <li v-if="treeData.id !== '1'" @click="deleteMenu(treeData)">删除</li>
          </ul>
        </transition>
      </el-row>
    </div>
  </div>
</template>

<script>
import {generateChildrenMenu} from "@/utils/util"

export default {
  name: "MenuManage",
  data() {
    return {
      filterText: "",
      menuList: [],
      top: 0,
      left: 0,
      treeVisible: true,
      visible: false,
      menuFormVisible: false,
      menuFormDisable: true,
      loading: false,
      saveButtonVisible: false,
      updateButtonVisible: true,
      defaultProps: {
        children: "children",
        label: "menuName"
      },
      treeNode: [],
      treeData: [],
      menuForm: {
        menuName: "",
        menuParentId: "",
        menuUrl: "",
        menuIcon: "",
        id: "",
        enabled: false
      },
      menuRules: {
        menuName: [
          {required: true, message: "请输入菜单名称", trigger: "blur"}
        ],
        menuUrl: [
          {required: true, message: "请输入菜单URL", trigger: "blur"}
        ],
        menuIcon: [
          {required: true, message: "请输入菜单图标", trigger: "blur"}
        ]
      }
    }
  },

  computed: {
    menuParentList() {
      return this.menuList.filter(function(data) {
        // 只返回id是偶数的
        return data.menuParentId === "0" && data.id !== "1"
      })
    }
  },

  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val)
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu)
      } else {
        document.body.removeEventListener("click", this.closeMenu)
      }
    }
  },
  async created() {
    await this.getMenuList()
  },
  methods: {
    async getMenuList() {
      this.$store.dispatch("menu/getAllMenu").then(async(res) => {
        this.menuList = generateChildrenMenu(res.menuList)
      })
    },

    handleCreateMenu() {
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch("menu/addMenu", this.menuForm).then(async() => {
            this.loading = false
            this.menuFormVisible = false
            this.treeVisible = false
            await this.getMenuList()
            this.treeVisible = true
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },

    handleUpdateMenu() {
      debugger
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch("menu/updateMenu", this.menuForm).then(async() => {
            this.loading = false
            this.menuFormVisible = false
            this.treeVisible = false
            await this.getMenuList()
            this.treeVisible = true
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },

    filterNode(value, data) {
      if (!value) return true
      return data.menuName.indexOf(value) !== -1
    },

    handleNodeClick(data, node, obj) {
      this.visible = false
      this.saveButtonVisible = false
      this.menuFormDisable = true
      this.menuForm = data
      if (this.menuFormVisible) {
        this.$refs.menuForm.clearValidate()
      } else {
        this.menuFormVisible = true
      }
    },

    openRightMenu(event, data, node, obj) {
      this.$refs.menuTree.setCurrentKey(node.key)
      const menuMinWidth = 135
      const offsetLeft = this.$el.getBoundingClientRect().left
      const offsetTop = this.$el.getBoundingClientRect().top
      const offsetWidth = this.$el.offsetWidth
      const maxLeft = offsetWidth - menuMinWidth
      const left = event.clientX - offsetLeft - 15
      const top = event.clientY - offsetTop - 25

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = top
      this.treeNode = node
      this.treeData = data
      this.visible = true
    },

    closeMenu() {
      this.visible = false
    },

    handleScroll() {
      this.closeMenu()
    },

    createMenu(treeData) {
      this.updateButtonVisible = true
      this.saveButtonVisible = true
      this.menuFormDisable = false
      if (this.menuFormVisible) {
        this.$refs.menuForm.resetFields()
      }
      this.menuForm = {
        menuName: "",
        menuParentId: treeData.id,
        menuUrl: "",
        menuIcon: "",
        id: "",
        enabled: true
      }
      this.menuFormVisible = true
    },

    updateMenu(treeData) {
      this.updateButtonVisible = false
      this.saveButtonVisible = true
      this.menuFormDisable = false
      this.menuForm = treeData
      if (this.menuFormVisible) {
        this.$refs.menuForm.clearValidate()
      } else {
        this.menuFormVisible = true
      }
    },

    deleteMenu(treeData) {
      const data = {
        menuId: treeData.id
      }
      this.$store.dispatch("menu/deleteMenu", data).then(async() => {
        this.menuFormVisible = false
        this.treeVisible = false
        await this.getMenuList()
        this.treeVisible = true
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-container {
  padding: 10px;
  height: 100%;

  .tree-container {
    min-width: 200px;
    min-height: 500px;
    max-height: 800px;
    height: calc(100vh - 200px);
    overflow: auto;

    .el-tree {
      border: none;

      .el-tree-node__content {
        padding: 0;
      }

      .el-tree-node__label {
        width: auto;
        margin-top: 14px;
        float: right;
        font-size: 20px;
        color: #999999;
        line-height: 35px;
        letter-spacing: 1px;
      }
    }
  }

  &-header {
    display: flex;
    background-color: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
  }

  .permission-tree {
    padding-top: 30px;
    margin-bottom: 30px;
    font-size: xxx-large;
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }

  .menu-form {
    min-width: 500px;
    width: 80%;
    padding: 70px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
}

</style>
