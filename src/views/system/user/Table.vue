<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model v-model="listQuery" layout="inline" :rules="rules">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="账号">
              <a-input
                v-model="listQuery.username"
                placeholder="请输入账号模糊查询"
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="手机号码">
              <a-input
                v-model="listQuery.mobile"
                placeholder="请输入手机号模糊查询"
              />
            </a-form-model-item>
          </a-col>
          <template v-if="expand">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="真实姓名">
                <a-input
                  v-model="listQuery.realName"
                  placeholder="请输入真实名称"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="工号">
                <a-input
                  v-model="listQuery.workNo"
                  placeholder="请输入工号模糊查询"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="可用状态">
                <a-select
                  default-value=""
                  v-model="listQuery.enable"
                  style="width: 100%"
                  placeholder="Tags Mode"
                >
                  <a-select-option
                    v-for="item in enableOptions"
                    :key="item.value"
                  >
                    {{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-model-item label="锁定状态">
                <a-select
                  default-value=""
                  v-model="listQuery.locked"
                  style="width: 100%"
                  placeholder="Tags Mode"
                >
                  <a-select-option
                    v-for="item in lockOptions"
                    :key="item.value"
                  >
                    {{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </template>
          <a-col :md="(!expand && 8) || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(expand && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="handleSearch()">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleResetSearch()"
                >重置</a-button
              >
              <a @click="toggleExpand" style="margin-left: 8px">
                {{ expand ? '收起' : '展开' }}
                <a-icon :type="expand ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="onAddClick">
        添加用户
      </a-button>
      <excel-upload name="syUser" :on-success="onExcelSuccess"></excel-upload>
      <a-button type="primary" icon="export" @click="exportExcel">
        导出
      </a-button>
    </div>

    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="tableData"
      :bordered="true"
      :loading="loading"
      :row-key="record => record.id"
      @change="handleTableChange"
      :scroll="{ x: 1800 }"
    >
      <a slot="name" slot-scope="text">{{ text }}</a>

      <span slot="avatar" slot-scope="avatar">
        <a-avatar :src="avatar" size="large" />
      </span>
      <span slot="enable" slot-scope="enable">
        <a-tag v-if="enable" color="blue">
          可用
        </a-tag>
        <a-tag v-else color="orange">
          不可用
        </a-tag>
      </span>

      <span slot="locked" slot-scope="locked">
        <a-tag v-if="locked" color="orange">
          已锁定
        </a-tag>
        <a-tag v-else color="blue">
          未锁定
        </a-tag>
      </span>

      <span slot="gender" slot-scope="gender">
        <a-tag v-if="gender === 'UNKONWN'" color="orange">
          未知
        </a-tag>
        <a-tag v-else-if="gender === 'MALE'" color="blue">
          男
        </a-tag>
        <a-tag v-else-if="gender === 'FEMALE'" color="pink">
          女
        </a-tag>
      </span>

      <span slot="createAt" slot-scope="createAt">
        {{ createAt | timeFormatter }}
      </span>

      <span slot="action" slot-scope="record">
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;" @click="onDetailsClick(record)">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="onEditClick(record)">编辑</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="onPasswordClick(record)">密码</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="onDeleteClick(record)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </a-table>
    <details-drawer
      :visible="detailsVisible"
      :type="drawerType"
      :selectedKey="selectedKey"
      @close="onDrawerClosed"
      @on-edit-success="onEditSuccess"
      @on-add-success="onAddSuccess"
    >
    </details-drawer>
    <a-modal
      title="修改密码"
      :visible="passwordVisible"
      :confirm-loading="passwordLoading"
      @ok="handlePasswordOk"
      @cancel="handlePasswordCancel"
    >
      <a-form-model
        ref="passwordForm"
        :model="passwordForm"
        :rules="passwordRules"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 14 }"
      >
        <a-form-model-item label="密码" prop="password">
          <a-input-password
            v-model="passwordForm.password"
            placeholder="请输入密码"
            autocomplete="off"
          />
        </a-form-model-item>
        <a-form-model-item label="确认密码" prop="rPassword">
          <a-input-password
            v-model="passwordForm.rPassword"
            placeholder="请再次输入密码"
            autocomplete="off"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { fetchList, password, remove } from '@/api/user'
import { downloadExcel } from '@/api/excel'
import DetailsDrawer from './DetailsDrawer.vue'
import md5 from 'md5'
import { Form } from 'ant-design-vue'
import ExcelUpload from '@/components/Upload/ExcelUpload.vue'
const defaultListQuery = {
  username: null,
  mobile: null,
  realName: null,
  workNo: null,
  enable: '',
  locked: '',
  current: 1,
  size: 10
}

const defaultPasswordForm = {
  password: '',
  rPassword: ''
}
@Component({
  name: 'UserTableLIst',
  components: {
    DetailsDrawer,
    ExcelUpload
  }
})
export default class extends Vue {
  private listQuery = Object.assign({}, defaultListQuery)
  private passwordForm = Object.assign({}, defaultPasswordForm)
  private labelCol = { span: 4 }
  private wrapperCol = { span: 14 }
  private expand = false
  private loading = false
  private detailsVisible = false
  private enableOptions = [
    { name: '全部', value: '' },
    { name: '可用', value: 'true' },
    { name: '不可用', value: 'false' }
  ]

  private lockOptions = [
    { name: '全部', value: '' },
    { name: '已锁定', value: 'true' },
    { name: '未锁定', value: 'false' }
  ]
  private rules = {
    mobile: [
      {
        min: 11,
        max: 11,
        message: '长度在 6 到 20 个字符',
        trigger: 'blur'
      }
    ]
  }
  private passwordRules = {
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在6-20之间', trigger: 'blur' }
    ],
    rPassword: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      {
        validator: this.validPass,
        trigger: 'blur'
      }
    ]
  }

  private columns = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220
    },
    {
      title: '账号',
      dataIndex: 'username',
      width: 140
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      width: 120
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      width: 120
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      scopedSlots: { customRender: 'avatar' },
      width: 70
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 140
    },
    {
      title: '工号',
      dataIndex: 'workNo',
      width: 120
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },

    {
      title: '性别',
      dataIndex: 'gender',
      scopedSlots: { customRender: 'gender' },
      width: 70
    },

    {
      title: '可用状态',
      dataIndex: 'enable',
      scopedSlots: { customRender: 'enable' },
      width: 90
    },
    {
      title: '锁定状态',
      dataIndex: 'locked',
      scopedSlots: { customRender: 'locked' },
      width: 90
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      scopedSlots: { customRender: 'createAt' },
      width: 190
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      scopedSlots: { customRender: 'action' }
    }
  ]

  private pagination = {
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showQuickJumper: true,
    showLessItems: true,
    total: 0
  }
  private tableData = []

  private drawerType = ''

  private selectedKey: string | null = null

  private passwordVisible = false
  private passwordLoading = false
  //lifecyle
  private created() {
    this.fetch()
  }

  //methods
  private toggleExpand() {
    this.expand = !this.expand
  }

  private handleSearch() {
    this.listQuery.current = 1
    this.fetch()
  }

  private handleResetSearch() {
    this.listQuery = Object.assign({}, defaultListQuery)
  }
  private handleTableChange(pagination: any) {
    this.listQuery.current = pagination.current
    this.listQuery.size = pagination.pageSize
    this.fetch()
  }
  private fetch() {
    this.loading = true
    fetchList(this.listQuery)
      .then((response: any) => {
        this.tableData = response.records
        this.pagination.total = response.total
      })
      .catch((err: any) => {
        console.log(err)
      })
      .finally(() => {
        this.loading = false
      })
  }
  private onDetailsClick(val: any) {
    this.drawerType = 'INFO'
    this.detailsVisible = !this.detailsVisible
    this.selectedKey = val.id
  }
  private onEditClick(val: any) {
    console.log(val)
    this.drawerType = 'EDIT'
    this.detailsVisible = !this.detailsVisible
    this.selectedKey = val.id
  }

  private onEditSuccess(val: any) {
    const newData = [...this.tableData]
    const target = newData.filter(
      (item: any) => this.selectedKey === item.id
    )[0] as any

    if (target) {
      Object.assign(target, val)
      this.tableData = newData
    }
  }

  private onAddSuccess(val: any) {
    this.listQuery.current = 1
    this.fetch()
  }

  private onPasswordClick(val: any) {
    this.passwordVisible = true
    this.selectedKey = val.id
  }
  private onDeleteClick(val: any) {
    let that = this
    this.$confirm({
      title: '确定要删除该用户吗?',
      onOk() {
        return remove(val.id).then(() => {
          that.$notification.success({
            message: '成功',
            description: '删除用户成功'
          })
          that.fetch()
        })
      }
    })
  }
  private onDrawerClosed(val: boolean) {
    this.detailsVisible = val
  }
  private onAddClick() {
    this.drawerType = 'ADD'
    this.selectedKey = null
    this.detailsVisible = true
  }

  handlePasswordOk(e: any) {
    this.passwordLoading = true

    let el: any = this.$refs.passwordForm
    el.validate((valid: boolean) => {
      if (valid) {
        let pass = md5(this.passwordForm.password!)
        password(this.selectedKey as string, { password: pass })
          .then(() => {
            this.$notification.success({
              message: '成功',
              description: '修改密码成功'
            })
            this.passwordVisible = false
          })
          .finally(() => {
            this.passwordLoading = false
          })
      } else {
        console.log('error submit!!')
        return false
      }
    })
    // setTimeout(() => {
    //   this.passwordVisible = false
    //   this.passwordLoading = false
    // }, 2000)
  }

  handlePasswordCancel(e: any) {
    if (!this.passwordLoading) {
      this.passwordForm = Object.assign({}, defaultPasswordForm)
      this.passwordVisible = false
    }
  }
  exportExcel() {
    downloadExcel({ name: 'syUser' }).then((res: any) => {
      console.log(res)
      let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      let url = window.URL.createObjectURL(blob)
      const link = document.createElement('a') // 创建a标签
      link.href = url
      link.download = '用户信息.xlsx' // 重命名文件
      link.click()
      URL.revokeObjectURL(url)
    })
  }

  validPass(rule: any, value: any, callback: any) {
    if (value !== this.passwordForm.password) {
      callback(new Error('两次输入的密码不一致'))
    } else {
      callback()
    }
  }
  onExcelSuccess() {
    this.fetch()
  }
}
</script>
