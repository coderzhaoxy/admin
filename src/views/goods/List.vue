<template>
  <div>
    <!--     面包屑区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="_getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="_getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="110px"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="90px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="120px">
          <template slot-scope="scope">
            {{scope.row.add_time | showDate}}
          </template>
        </el-table-column>
        <el-table-column prop="address" width="140px" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"
                       @click="_getGoodsInfo(scope.row.goods_id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,3,5,10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!--      修改商品信息对话框-->
      <el-dialog title="修改商品信息" :visible.sync="editGoodsDialogVisible" width="40%">
        <el-form :model="goodsInfo" :rules="addFormRules" ref="goodsInfoRef" label-width="130px" class="demo-ruleForm">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="goodsInfo.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格(元)" prop="goods_price">
            <el-input v-model="goodsInfo.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="goodsInfo.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="goodsInfo.goods_weight"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="_editGoodsInfo">确 定</el-button>
  </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
  import {getGoodsList, editGoodsInfo, getGoodsInfo} from "../../network/goods";
  import {formatDate} from '../../common/untils'

  export default {
    name: "List",
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        goodsList: [],
        total: 0,
        //查询到的对象
        goodsInfo: {},
        editGoodsDialogVisible: false,
        addFormRules: {
          goods_name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          goods_price: [
            {required: true, message: '请输入商品价格', trigger: 'blur'}
          ],
          goods_weight: [
            {required: true, message: '请输入商品重量', trigger: 'blur'}
          ],
          goods_number: [
            {required: true, message: '请输入商品数量', trigger: 'blur'}
          ]
        },

      }
    },
    filters: {
      showDate: function (value) {
        let date = new Date(value * 1000)
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    created() {
      this._getGoodsList()
    },
    methods: {
      _getGoodsList() {
        getGoodsList(this.queryInfo.query, this.queryInfo.pagenum, this.queryInfo.pagesize).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取商品列表失败！')
          }
          this.goodsList = res.data.goods
          this.total = res.data.total
        })
      },
      goAddPage() {
        this.$router.push('/goods/add')
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this._getGoodsList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this._getGoodsList()
      },
      _getGoodsInfo(id) {
        getGoodsInfo(id).then(res => {
          this.goodsInfo = res.data
          console.log(this.goodsInfo);
        })
        this.editGoodsDialogVisible = true
      },
      _editGoodsInfo() {
        this.$refs.goodsInfoRef.validate(valid => {
          if (!valid) return
          editGoodsInfo(this.goodsInfo).then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('修改商品信息失败！')
            }
            this.$message.success('修改商品信息成功！')
            this._getGoodsList()
            this.editGoodsDialogVisible = false
          })
        })

      }
    }
  }
</script>

<style scoped>

</style>
