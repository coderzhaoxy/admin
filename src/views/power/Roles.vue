<template>
  <div>
    <!--     面包屑区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesClick">添加角色</el-button>
        </el-col>
      </el-row>
      <!--      表格区域-->
      <el-table border stripe :data="rolesList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1 ===0?'bdtop':'','vcenter']" v-for="(item,i1) in scope.row.children"
                    :key="item.id">
              <!--            一级菜单-->
              <el-col :span="5">
                <el-tag closable @close="_removeRightById(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--              二级菜单-->
              <el-col :span="19">
                <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item1,i2) in item.children" :key="item1.id">
                  <el-col :span="6">
                    <el-tag closable @close="_removeRightById(scope.row,item1.id)" type="success">{{item1.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag @close="_removeRightById(scope.row,item2.id)" type="warning" closable
                            v-for="(item2,i3) in item1.children" :key="item2.id">{{item2.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="level">
          <template slot-scope="scope">
            <el-button type="primary" @click="_editRolesClick(scope.row)" size="mini" icon="el-icon-edit">编辑
            </el-button>
            <el-button type="danger" @click="_removeRolesClick(scope.row.id)" size="mini" icon="el-icon-delete">删除
            </el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRoles(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--    添加角色的对话框-->
      <el-dialog
        title="添加角色"
        :visible.sync="addRolesDialogVisible"
        width="50%" @close="addRolesDialogClosed"
      >
        <!--添加角色的表单-->
        <el-form :model="addRoles" :rules="addRolesRules" ref="addRolesRef" label-width="70px" class="demo-ruleForm">
          <el-form-item label="角色" prop="roleName">
            <el-input v-model="addRoles.roleName"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="roleDesc">
            <el-input v-model="addRoles.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="_addRolesInfo">确 定</el-button>
  </span>
      </el-dialog>
      <!--      修改角色信息的对话框-->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editRolesDialogVisible"
        width="50%" @close="editRolesDialogClosed"
      >
        <!--修改角色的表单-->
        <el-form :model="editRoles" :rules="addRolesRules" ref="editRolesRef" label-width="70px" class="demo-ruleForm">
          <el-form-item label="角色" prop="roleName">
            <el-input v-model="editRoles.roleName"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="roleDesc">
            <el-input v-model="editRoles.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="_editRolesInfo">确 定</el-button>
  </span>
      </el-dialog>
      <!--     分配权限的对话框-->
      <el-dialog
        title="分配权限"
        :visible.sync="showSetRolesDialogVisible"
        width="50%"
      >
        <el-tree
          :data="rightsList"
          show-checkbox
          node-key="id"
          :props="treeProps"
          default-expand-all
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="defaultKeys"
        ref="treeRef">
        </el-tree>
        <span slot="footer" class="dialog-footer">
    <el-button @click="showSetRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="_allotRights">确 定</el-button>
  </span>
      </el-dialog>
    </el-card>

  </div>
</template>

<script>
  import {
    getRolesList,
    addRolesInfo,
    editRolesClick,
    editRolesInfo,
    removeRolesClick,
    removeRightById,
    getRightsList,
    allotRights
  } from '../../network/power'

  export default {
    name: "Roles",
    data() {
      return {
        //角色列表
        rolesList: [],
        //控制添加角色对话框的展示与隐藏
        addRolesDialogVisible: false,
        //添加角色信息的校验规则
        addRolesRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 5, max: 15, message: '长度在5~15个字符', trigger: 'blur'}
          ],
          roleDesc: [
            {required: true, message: '请输入描述', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在6~15个字符', trigger: 'blur'}
          ],
        },
        //添加角色的对象
        addRoles: {
          roleDesc: '',
          roleName: ''
        },
        //控制修改角色对话框的显示与隐藏
        editRolesDialogVisible: false,
        //修改信息查到的对象
        editRoles: {},
        //控制分配权限的对话框
        showSetRolesDialogVisible: false,
        //所有的权限列表
        rightsList:[],
        //树形控件的id
        roleId:'',
        //树形控件的属性绑定对象
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        defaultKeys:[]

      }
    },
    created() {
      this._getRolesList()
    },
    methods: {
      //获取角色列表
      _getRolesList() {
        getRolesList().then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取角色列表失败！')
          }
          this.rolesList = res.data
          console.log(this.rolesList);
        })
      },
      //发送请求修改角色
      _addRolesInfo() {
        addRolesInfo(this.addRoles.roleName, this.addRoles.roleDesc).then(res => {
          if (res.meta.status !== 201) {
            return this.$message.error('添加角色失败！')
          }
          this.$message.success('添加角色成功！')
          this._getRolesList()
          this.addRolesDialogVisible = false
        })
      },
      //添加角色的事件
      addRolesClick() {
        this.addRolesDialogVisible = true
      },
      //添加角色对话框的关闭事件
      addRolesDialogClosed() {
        this.$refs.addRolesRef.resetFields()
      },
      //修改角色对话框的关闭事件
      editRolesDialogClosed() {
        this.$refs.editRolesRef.resetFields()
      },
      //点击展示修改角色信息的对话框
      _editRolesClick(row) {
        this.editRolesDialogVisible = true
        editRolesClick(row.id).then(res => {
          this.editRoles = res.data
        })
      },
      //点击确定按钮进行预验证 并发送请求修改用户信息
      _editRolesInfo() {
        this.$refs.editRolesRef.validate(valid => {
          if (!valid) return
          editRolesInfo(this.editRoles.roleId, this.editRoles.roleName, this.editRoles.roleDesc).then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('修改用户信息失败！')
            }
            this.editRolesDialogVisible = false
            this._getRolesList()
            this.$message.success('修改用户信息成功！')
          })
        })

      },
      //根据id删除对应的角色
      async _removeRolesClick(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => {
          console.log(err);
          return err
        })
        //如果用户确认删除 则返回值为字符串confirm
        //如果用户取消删除 则返回值为字符串cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        removeRolesClick(id).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败！')
          }
          this.$message.success('删除成功！')
          this._getRolesList()
        })
      },
      //根据id删除对应权限
      async _removeRightById(role, rightId) {
        const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
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
        removeRightById(role.id, rightId).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除权限失败！')
          }
          this.$message.success('删除权限成功！')
          role.children = res.data
        })
      },
      //点击按钮展示分配权限对话框
      showSetRoles(role) {
        console.log(role);
        this.roleId = role.id
        getRightsList('tree').then(res=>{
         this.rightsList = res.data
        })
        this.defaultKeys = []
        this.getLeafKeys(role,this.defaultKeys)
        this.showSetRolesDialogVisible = true
      },
      //通过递归的形式，获取角色下所有三级权限的id，并保存到数组中
      getLeafKeys(node, arr){
        if(!node.children){
          return arr.push(node.id)
        }
        node.children.forEach(item=>{
         return  this.getLeafKeys(item, arr)
        })
      },
      //点击按钮为角色分配权限
      _allotRights(){
        const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
        const idStr = keys.join(',')
        allotRights(this.roleId,idStr).then(res=>{
          if(res.meta.status !==200){
            return this.$message.error('分配权限失败！')
          }
          this.showSetRolesDialogVisible = false
          this._getRolesList()
          this.$message.success('分配权限成功！')
        })
      }
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
