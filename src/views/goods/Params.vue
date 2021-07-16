<template>
  <div>
    <!--     面包屑区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon>
      </el-alert>
      <el-row class="cat-row">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <el-table border :data="manyCateList" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag :key="i" v-for="(item,i) in scope.row.attr_vals" @close="handleClose(i,scope.row)" closable>{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput" size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="_showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="_removeParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" @click="addDialogVisible = true" :disabled="isBtnDisabled">添加属性</el-button>
          <el-table :data="onlyCateList" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag :key="i" v-for="(item,i) in scope.row.attr_vals" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                          ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="_showEditDialog(scope.row.attr_id)">编辑
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="_removeParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!--      添加属性的对话框-->
      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addDialogVisible"
        width="40%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="_addParams">确 定</el-button>
  </span>
      </el-dialog>
      <!--      修改属性的对话框-->
      <el-dialog
        :title="'修改'+titleText"
        :visible.sync="editFormDialogVisible"
        width="40%"
        @close="editFormDialogClosed">
        <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editFormDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="_editParams">确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import {
    getCateList,
    getParamsData,
    addParams,
    showEditDialog,
    editParams,
    removeParams
  } from "../../network/goods";

  export default {
    name: "Params",
    data() {
      return {
        cateList: [],
        cateProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        //级联选择器双向绑定的数据
        selectedCateKeys: [],
        manyCateList: [],
        onlyCateList: [],
        activeName: 'many',
        //添加参数的表单数据对象
        addForm: {
          attr_name: ''
        },
        addFormRules: {
          attr_name: [{required: true, message: '请输入参数名称', trigger: 'blur'},]
        },
        addDialogVisible: false,
        editForm: {},
        editFormDialogVisible: false
      }
    },
    computed: {
      cateId() {
        if (this.selectedCateKeys.length === 3) {
          return this.selectedCateKeys[2]
        }
        return null
      },
      titleText() {
        if (this.activeName === 'many') {
          return '动态参数'
        }
        return '静态属性'
      },
      isBtnDisabled() {
        if (this.selectedCateKeys.length !== 3) {
          return true
        }
        return false
      }
    },
    created() {
      this._getCateList()
    },
    methods: {
      _getCateList() {
        getCateList().then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取分类列表失败！')
          }
          this.cateList = res.data
        })
      },
      handleChange() {
        this._getParamsData()
      },
      _getParamsData() {
        if (this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = []
          return
        }
        getParamsData(this.cateId, this.activeName).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取参数失败！')
          }
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            item.inputVisible = false
            //文本框中输入的值
            item.inputValue = ''
          })
          if (this.activeName === 'many') {
            this.manyCateList = res.data
          } else {
            this.onlyCateList = res.data
          }
        })
      },
      handleClick() {
        this._getParamsData()
      },
      _addParams() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return
          addParams(this.cateId, this.addForm.attr_name, this.activeName).then(res => {
            if (res.meta.status !== 201) {
              return this.$message.error('添加失败')
            }
            this.$message.success('添加成功')
            this._getParamsData()
            this.addDialogVisible = false
          })

        })
      },
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      _showEditDialog(id) {
        showEditDialog(this.cateId, id, this.activeName).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取参数信息失败！')
          }
          this.editForm = res.data
          this.editFormDialogVisible = true
        })
      },
      //修改对话框 关闭事件
      editFormDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      _editParams() {
        this.$refs.editFormRef.validate(valid => {
          if (!valid) return
          editParams(this.cateId, this.editForm.attr_id, this.editForm.attr_name, this.activeName).then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('修改参数失败！')
            }
            this.$message.success('修改参数成功')
            this._getParamsData()
            this.editFormDialogVisible = false
          })
        })

      },
      async _removeParams(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => {
          return err
        })
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        removeParams(this.cateId, id).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除参数失败！')
          }
          this.$message.success('删除参数成功！')
          this._getParamsData()
        })
      },
      showInput(row) {
        row.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        })
      },
      handleInputConfirm(row) {
        if (row.inputValue.trim().length === 0) {
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        //如果没有返回 则证明输入的内容 需要做后续的处理
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        this.saveAttrValues(row)
      },
      saveAttrValues(row) {
        editParams(this.cateId, row.attr_id, row.attr_name, row.attr_sel, row.attr_vals.join(' ')).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('修改参数失败！')
          }
          this.$message.success('修改参数成功！')
        })
      },
      handleClose(i,row){
        row.attr_vals.splice(i,1)
        this.saveAttrValues(row)
      }
    }
  }
</script>

<style scoped>
  .cat-row {
    margin: 20px 0;
  }

  .el-cascader {
    width: 300px;
  }

  .el-tag {
    margin: 0 10px;
  }

  .input-new-tag {
    width: 120px;
  }
</style>
