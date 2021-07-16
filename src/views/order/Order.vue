<template>
  <div>
    <!--   面包屑 导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片视图区域-->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--      订单列表数据-->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '0'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="in_send">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_send === '是'">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | showDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-location"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页区域-->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
                     :page-sizes="[3, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!--    修改地址的对话框-->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="city_data2017_element" v-model="addressForm.address1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {formatDate} from "../../common/untils";
  import city_data2017_element from "./city_data2017_element";
  import {getOrderList} from "../../network/orders";
  export default {
    name: "Order",
    data() {
      return {
        //查询对象
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10,
        },
        total: 0,
        orderList: [],
        addressVisible: false,
        addressForm: {
          address1: [],
          address2: ''
        },
        addressFormRules: {
          address1: [
            {required: true, message: '请选择省市区/县', trigger: 'blur'},
          ],
          address2: [
            {required: true, message: '请填写详细地址', trigger: 'blur'},
          ]
        },
        city_data2017_element: city_data2017_element,
        progressDialogVisible: false,
        progressInfo: {},
      }
    },
    filters: {
      showDate: function (value) {
        let date = new Date(value * 1000);
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    created() {
      this._getOrderList()
    },
    methods: {
      _getOrderList() {
        getOrderList(this.queryInfo).then(res => {
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error('请求订单列表失败！')
          }
          this.total = res.data.total
          this.orderList = res.data.goods
        })
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this._getOrderList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this._getOrderList()
      },
      //展示修改地址的对话框
      showBox() {
        this.addressVisible = true
      },
      addressDialogClosed() {
        this.$refs.addressFormRef.resetFields()
      },
    }
  }
</script>

<style scoped>
  .el-cascader {
    width: 100%;
  }
</style>
