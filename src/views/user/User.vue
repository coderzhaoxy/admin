<template>
  <div>
    <!--     面包屑区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <!--      头部搜索区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="_getUserList">
            <el-button slot="append" icon="el-icon-search" @click="_getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!--      表格区域-->
      <el-table :data="getUserList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="_editUserInfo(scope.row)">
            </el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="_removeUser(scope.row)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting" @click="_setRole(scope.row)">
              </el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
      <!--      底部分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleNumChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!--      添加用户的对话框-->
      <el-dialog
        title="添加用户"
        :visible.sync="addUserDialogVisible"
        width="40%"
        @close="addUserClosed">
        <!--添加用户的表单-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="_addUserInfo">确 定</el-button>
  </span>
      </el-dialog>
      <!--      修改用户信息的对话框-->
      <el-dialog
        title="修改信息"
        :visible.sync="editUserDialogVisible"
        width="40%"
      >
        <!--修改用户信息的表单-->
        <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="80px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="_putUserInfo">确 定</el-button>
  </span>
      </el-dialog>
<!--      分配角色的对话框-->
      <el-dialog
        title="分配角色"
        :visible.sync="setRolesDialogVisible"
        width="30%"
        @click="setRolesClosed">
        <div>
          <p>当前用户:{{userInfo.username}}</p>
          <p>当前角色:{{userInfo.role_name}}</p>
          <p>分配角色：
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select></p>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="setRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="_setRolesClick">确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  //网络请求相关方法
  import {
    getUserList,
    editState,
    addUserInfo,
    editUserInfo,
    putUserInfo,
    removeUser,
    setRolesClick
  } from "../../network/user";
  import {getRolesList} from '../../network/power'

  export default {
    name: "User",
    data() {
      //验证邮箱的自定义规则
      let checkEmail = (rule, value, cb) => {
        const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (regEmail.test(value)) {
          //合法的邮箱
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
      }
      //验证手机号的自定义规则
      let checkMobile = (rule, value, cb) => {
        const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
        if (regMobile.test(value)) {
          //合法的手机号
          return cb()
        }
        cb(new Error('请输入合法的手机号'))
      }
      return {
        //用户列表
        getUserList: [],
        //获取用户列表的参数对象
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 5
        },
        total: 0,
        //控制添加用户对话框的显示与隐藏
        addUserDialogVisible: false,
        //添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        //添加用户的表单验证规则
        addFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在3~10个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在6~15个字符', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'}, {
              validator: checkEmail, trigger: 'blur'
            }
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'}, {
              validator: checkMobile, trigger: 'blur'
            }
          ],
        },
        //控制修改用户信息的展示与隐藏
        editUserDialogVisible: false,
        //根据id查询到的对象
        editForm: {},
        //需要分配角色的用户对象
        userInfo: {},
        //角色列表
        rolesList:[],
        //控制分配角色对话框的显示与隐藏
        setRolesDialogVisible:false,
        //分配角色被绑定的值
        selectedRoleId:''
      }
    },
    created() {
      this._getUserList()
    },
    methods: {
      _getUserList() {
        getUserList(this.queryInfo.query, this.queryInfo.pagenum, this.queryInfo.pagesize).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取用户列表失败！')
          }
          this.getUserList = res.data.users
          this.total = res.data.total
        })
      },
      //每页多少条
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this._getUserList()
      },
      //当前多少页
      handleNumChange(newNum) {
        this.queryInfo.pagenum = newNum
        this._getUserList()
      },
      //监听状态的改变
      stateChange(userInfo) {
        editState(userInfo.id, userInfo.mg_state).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('设置用户状态失败！')
          }
          this.$message.success('设置用户状态成功！')
          this._getUserList()
        })
      },
      //添加用户的事件
      addUser() {
        this.addUserDialogVisible = true
      },
      //点击按钮提交用户信息进行表单的预验证并添加
      _addUserInfo() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return
          console.log(this.addForm);
          addUserInfo(this.addForm.username, this.addForm.password, this.addForm.email, this.addForm.mobile).then(res => {
            if (res.meta.status !== 201) {
              return this.$message.error('添加用户失败')
            }
            this.$message.success('添加用户成功')
            this.addUserDialogVisible = false
            this._getUserList()
          })
        })
      },
      //添加用户对话框的关闭事件
      addUserClosed() {
        this.$refs.addFormRef.resetFields()
      },
      //修改用户信息的事件
      _editUserInfo(row) {
        editUserInfo(row.id).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取用户信息失败！')
          }
          this.editForm = res.data
          this.editUserDialogVisible = true
        })
      },
      //修改用户信息并提交的事件
      _putUserInfo() {
        this.$refs.editFormRef.validate(valid => {
          if (!valid) return
          putUserInfo(this.editForm.id, this.editForm.email, this.editForm.mobile).then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('修改用户信息失败！')
            }
            this.editUserDialogVisible = false
            this._getUserList()
            this.$message.success('修改用户信息成功！')
          })
        })
      },
      //根据id删除用户的事件
      async _removeUser(row) {
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => {
          return err
        })
        //如果用户确认删除 则返回值为字符串confirm
        //如果用户取消删除 则返回值为字符串cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        removeUser(row.id).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败！')
          }
          this.$message.success('删除成功！')
          this._getUserList()
        })
      },
      //点击按钮分配角色
      _setRole(row) {
        this.userInfo = row
        console.log(this.userInfo);
        getRolesList().then(res=>{
          if (res.meta.status !== 200) {
            this.$message.error('获取角色列表失败')
          }
          this.rolesList = res.data
          console.log(this.rolesList);
          this.setRolesDialogVisible = true
        })
      },
      //点击按钮分配角色并发送请求
      _setRolesClick(){
        if(!this.selectedRoleId){
          return this.$message.error('请选择需要分配的角色！')
        }
        setRolesClick(this.userInfo.id,this.selectedRoleId).then(res=>{
          if (res.meta.status !== 200) {
            return this.$message.error('更新角色失败！')
          }
          this.$message.success('更新角色成功！')
          this.getUserList()
          this.setRolesDialogVisible = false
        })
      },
      //分配角色对话量的关闭事件
      setRolesClosed(){
        this.selectedRoleId = ''
        this.userInfo = {}
      }
    }
  }
</script>

<style scoped>

</style>
