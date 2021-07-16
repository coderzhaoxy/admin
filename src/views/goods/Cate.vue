<template>
  <div>
    <!--     面包屑区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--      树形表格区域-->
      <tree-table :data="goodsList" :columns="columns" show-index class="tree"
                  index-text="#" border :selection-type="false" :expand-type="false">
        <template slot-scope="scope" slot="isok">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: lightgreen"></i>
        </template>
        <template slot-scope="scope" slot="order">
          <el-tag type="primary" v-if="scope.row.cat_level ===0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level ===1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot-scope="scope" slot="opt">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="_editCate(scope.row.cat_id)">编辑
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="_removeCateInfo(scope.row.cat_id)">删除
          </el-button>
        </template>
      </tree-table>
      <!--      底部分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3,5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!--      添加分类对话框-->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="40%" @close="addCateFormClosed">
        <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="100px">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <el-cascader
              v-model="selectedKeys"
              :options="cateParentList"
              :props="cascaderProps"
              @change="handleChange" clearable></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="_addCate">确 定</el-button>
  </span>
      </el-dialog>
      <!--      修改分类对话框-->
      <el-dialog
        title="修改分类名称"
        :visible.sync="editCateDialogVisible"
        width="40%"
      >
        <el-form :model="newEditInfo" :rules="addCateFormRules" ref="addCateRef" label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="活动名称" prop="cat_name">
            <el-input v-model="newEditInfo.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="newEditCateInfo">确 定</el-button>
  </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
  import {getCateList, addCate, editCate, newCateInfo, removeCateInfo} from '../../network/goods'

  export default {
    name: "Cate",
    data() {
      return {
        //查询条件
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        //总得数据条数
        total: 0,
        goodsList: [],
        //为table指定列的定义
        columns: [
          {
            label: '  ',
            prop: 'cat_name'
          },
          {
            label: '是否有效',
            //表示将当前列定义为模板列
            type: 'template',
            //表示当前这一列使用的模板名称
            template: 'isok'
          }, {
            label: '排序',
            //表示将当前列定义为模板列
            type: 'template',
            //表示当前这一列使用的模板名称
            template: 'order'
          },
          {
            label: '操作',
            //表示将当前列定义为模板列
            type: 'template',
            //表示当前这一列使用的模板名称
            template: 'opt'
          },
        ],
        //控制添加分类对话框的显示与隐藏
        addCateDialogVisible: false,
        //  添加分类表单的数据对象
        addCateForm: {
          //将要添加分类的名称
          cat_name: '',
          //父级分类的id
          cat_pid: 0,
          //分类的等级，默认添加一级分类
          cat_level: 0
        },
        //添加分类表单的验证规则对象
        addCateFormRules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
          ]
        },
        //父级分类的数组
        cateParentList: [],
        //选中的父级分类的id数组
        selectedKeys: [],
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          expandTrigger: 'hover',
          checkStrictly: true
        },
        //控制修改分类名称的对话框
        editCateDialogVisible: false,
        //根据id查找到的对象
        newEditInfo: {}
      }
    },
    created() {
      this._getCateList()
    },
    methods: {
      _getCateList() {
        getCateList(3, this.queryInfo.pagenum, this.queryInfo.pagesize).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取商品分类数据列表失败！')
          }
          this.total = res.data.total
          this.goodsList = res.data.result
        })
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this._getCateList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this._getCateList()
      },
      showAddCateDialog() {
        this.getParentList()
        this.addCateDialogVisible = true
      },
      getParentList() {
        getCateList(2).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取父级分类失败！')
          }
          this.cateParentList = res.data
        })
      },
      handleChange() {
        //如果selectedKeys数组中的长度大于0 证明选中的父级分类
        //反之就说明没有选中任何父级分类
        if (this.selectedKeys.length > 0) {
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          this.addCateForm.cat_level = this.selectedKeys.length
        }
      },
      addCateFormClosed() {
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
      },
      //添加分类并发送请求
      _addCate() {
        this.$refs.addCateFormRef.validate(valid => {
          if (!valid) return
          addCate(this.addCateForm.cat_pid, this.addCateForm.cat_name, this.addCateForm.cat_level).then(res => {
            if (res.meta.status !== 201) {
              return this.$message.error('添加分类失败！')
            }
            this.$message.success('添加分类成功！')
            this._getCateList()
            this.addCateDialogVisible = false
          })
        })

      },
      //修改分类
      _editCate(id) {
        editCate(id).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取分类对象失败！')
          }
          this.newEditInfo = res.data
        })
        this.editCateDialogVisible = true
      },
      //发送请求修改分类数据
      newEditCateInfo() {
        this.$refs.addCateRef.validate(valid => {
          if (!valid) return
          newCateInfo(this.newEditInfo.cat_id, this.newEditInfo.cat_name).then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('修改分类数据失败！')
            }
            this.$message.success('修改分类数据成功')
            this._getCateList()
            this.editCateDialogVisible = false
          })
        })

      },
      //根据id删除分类
      async _removeCateInfo(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => {
          return err
        })
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除！')
        }
        removeCateInfo(id).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除分类失败！')
          }
          this.$message.success('删除分类成功！')
          this._getCateList()
        })
      }
    }
  }
</script>

<style scoped>
  .tree {
    margin-top: 20px;
  }

  .el-cascader {
    width: 100%;
  }
</style>
