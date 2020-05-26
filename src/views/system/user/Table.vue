<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline" :rules="rules">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="账号">
              <a-input
                v-model="listQuery.username"
                placeholder="请输入账号模糊查询"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="手机号">
              <a-input
                v-model="listQuery.mobile"
                placeholder="请输入手机号模糊查询"
              />
            </a-form-item>
          </a-col>
          <template v-if="expand">
            <a-col :md="8" :sm="24">
              <a-form-item label="真实姓名">
                <a-input
                  v-model="listQuery.realName"
                  placeholder="请输入真实名称"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="工号">
                <a-input
                  v-model="listQuery.workNo"
                  placeholder="请输入工号模糊查询"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="可用状态">
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
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="锁定状态">
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
              </a-form-item>
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
      <a-button type="primary" icon="import">
        导入
      </a-button>
      <a-button type="primary" icon="export">
        导出
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="tableData"
      :bordered="true"
      :loading="loading"
      :row-key="record => record.id"
      @change="handleTableChange"
      :scroll="{ x: 1500 }"
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
              <a href="javascript:;" @click="onLockClick(record)">冻结</a>
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
      :userId="selectedId"
      @close="onDrawerClosed"
    >
    </details-drawer>
  </a-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { fetchList } from '@/api/user'
import DetailsDrawer from './DetailsDrawer.vue'
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
@Component({
  name: 'UserTableLIst',
  components: {
    DetailsDrawer
  }
})
export default class extends Vue {
  private listQuery = Object.assign({}, defaultListQuery)
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
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      scopedSlots: { customRender: 'action' }
    }
  ]
  private tableData = []

  private drawerType = ''

  private selectedId = null
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
  private handleTableChange() {}
  private fetch() {
    this.loading = true
    fetchList(this.listQuery)
      .then((response: any) => {
        this.tableData = response.records
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
    this.selectedId = val.id
  }
  private onEditClick(val: any) {
    this.drawerType = 'EDIT'
    this.detailsVisible = !this.detailsVisible
    this.selectedId = val.id
  }

  private onPasswordClick(val: any) {
    this.selectedId = val.id
  }
  private onLockClick(val: any) {
    this.selectedId = val.id
  }
  private onDeleteClick(val: any) {
    this.selectedId = val.id
  }
  private onDrawerClosed(val: boolean) {
    this.detailsVisible = val
  }
  private onAddClick() {
    this.drawerType = 'ADD'
    this.detailsVisible = true
  }
}
</script>
