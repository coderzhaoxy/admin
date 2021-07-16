<template>
  <div>
    <!--   面包屑 导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片视图区域-->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
      </el-alert>
      <el-steps :space="200" :active="activeIndex -0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :rules="addFormRules" :model="addForm" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs :before-leave="beforeTabLeave" @tab-click="tabClicked" v-model="activeIndex" :tab-position="'left'">
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_cat" label="商品分类">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <el-form-item :label="item.attr_name" v-for="item in  manyTableData" :key="item.attr_id">
              <!--复选框组-->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox size="mini" border :label="cb" :key="i" v-for="(cb,i) in item.attr_vals"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <el-upload :headers="headerObj" :on-success="handleSuccess"
                       action="http://timemeetyou.com:8889/api/private/v1/upload"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <quill-editor></quill-editor>
            <el-button class="add-goods" type="primary" @click="_addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!--      图片预览-->
      <el-dialog
        title="图片预览"
        :visible.sync="ImgDialogVisible"
        width="50%"
      >
        <img :src="previewPath" alt="" class="previewImg">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import {getCateList, getParamsData,addGoods} from "../../network/goods";
  import _ from 'lodash'

  export default {
    name: "Add",
    data() {
      return {
        activeIndex: '0',
        //添加新的商品
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          //商品所属的分类数组
          goods_cat: [],
          //图片的数组
          pics: [],
          //商品详情描述
          goods_introduce: '',
          attrs: []
        },
        cascaderProps: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        cateList: [],
        addFormRules: {
          goods_name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          goods_price: [
            {required: true, message: '请输入商品价格', trigger: 'blur'}
          ],
          goods_weight: [
            {required: true, message: '请输入商品重量', trigger: 'blur'}
          ], goods_number: [
            {required: true, message: '请输入商品数量', trigger: 'blur'}
          ], goods_cat: [
            {required: true, message: '请选择商品分类', trigger: 'blur'}
          ]
        },
        manyTableData: [],
        onlyTableData: [],
        headerObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        ImgDialogVisible: false,
        previewPath: ''
      }
    },
    created() {
      this._getCateList()
    },
    computed: {
      cateId() {
        if (this.addForm.goods_cat.length === 3) {
          return this.addForm.goods_cat[2]
        }
        return null
      }
    },
    methods: {
      _getCateList() {
        getCateList().then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取商品分类数据失败！')
          }
          this.cateList = res.data
          console.log(this.cateList);
        })
      },
      handleChange() {
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = []
        }
      },
      beforeTabLeave(activeName, oldActiveName) {
        if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          this.$message.error('请先选择商品分类！')
          return false
        }
      },
      tabClicked() {
        //证明访问的是动态参数面板
        if (this.activeIndex === '1') {
          getParamsData(this.cateId, 'many').then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('获取参数列表失败！')
            }
            res.data.forEach(item => {
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
            })
            this.manyTableData = res.data
            console.log(this.manyTableData);
          })
        } else if (this.activeIndex === '2') {
          getParamsData(this.cateId, 'only').then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('获取参数列表失败！')
            }
            this.onlyTableData = res.data
            console.log(this.onlyTableData);
          })
        }
      },
      //删除图片
      handleRemove(file) {
//获取将要删除的图片的临时路径
        //从pics数组中 找到这个图片对应的索引值
        //调用splice方法把图片信息对象 从pics数组中删除
        const filePath = file.response.data.tmp_path
        const i = this.addForm.pics.findIndex(item => {
          return item.pic === filePath
        })
        this.addForm.pics.splice(i, 1)
      },
      handlePreview(file) {
        this.previewPath = file.response.data.url
        this.ImgDialogVisible = true
      },
      handleSuccess(response) {
        const picInfo = {pic: response.data.tmp_path}
        this.addForm.pics.push(picInfo)

      },
      _addGoods() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) {
            return this.$message.error('请填写必要的表单项！')
          }
          //执行添加的业务逻辑
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
          this.manyTableData.forEach(item => {
            const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals.join(' ')}
            this.addForm.attrs.push(newInfo)
          })

          this.onlyTableData.forEach(item => {
            const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals.join}
            this.addForm.attrs.push(newInfo)
          })
          form.attrs = this.addForm.attrs
          addGoods(form).then(res=>{
              // console.log(res);
              // if (res.meta.status !== 201) {
              //   return this.$message.error('添加商品失败！')
              // }
            this.$message.success('添加商品成功！')
            this.$router.push('/goods')
          })
        })
      }
    }
  }
</script>

<style scoped>
  .previewImg {
    width: 100%;
  }

  .add-goods {
    margin-top: 20px;
  }
</style>
