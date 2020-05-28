<template>
  <div>
    <a-drawer
      :title="
        type === 'ADD' ? '新增用户' : type === 'EDIT' ? '编辑用户' : '用户详情'
      "
      :width="720"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-skeleton :loading="showSkeleton">
        <a-form-model
          ref="form"
          :model="formData"
          :labelCol="{ span: 10 }"
          :wrapperCol="{ span: 14 }"
          :rules="rules"
        >
          <a-row>
            <a-col :span="11">
              <a-form-model-item label="用户名" prop="username">
                <a-input
                  :disabled="type === 'INFO'"
                  v-model="formData.username"
                  placeholder="请输入用户名"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item
                v-if="type === 'ADD'"
                label="密码"
                prop="password"
              >
                <a-input-password
                  v-model="formData.password"
                  placeholder="请输入密码"
                  autocomplete="off"
                />
              </a-form-model-item>
              <a-form-model-item
                v-if="type === 'ADD'"
                label="确认密码"
                prop="rPassword"
              >
                <a-input-password
                  v-model="formData.rPassword"
                  placeholder="请再次输入密码"
                  autocomplete="off"
                />
              </a-form-model-item>
              <a-form-model-item label="邮箱" prop="email">
                <a-input
                  :disabled="type === 'INFO'"
                  v-model="formData.email"
                  placeholder="请输入邮箱"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item label="生日" prop="birthDay">
                <a-date-picker
                  valueFormat="YYYY-MM-DD"
                  :disabled="type === 'INFO'"
                  v-model="formData.birthDay"
                />
              </a-form-model-item>

              <a-form-model-item label="可用状态">
                <a-switch
                  :disabled="type === 'INFO'"
                  v-model="formData.enable"
                />
              </a-form-model-item>

              <a-form-model-item label="头像">
                <avatar-upload
                  :disabled="type === 'INFO'"
                  v-model="formData.avatar"
                ></avatar-upload>
              </a-form-model-item>
            </a-col>
            <a-col :span="11">
              <a-form-model-item label="手机号码" prop="mobile">
                <a-input
                  :disabled="type === 'INFO'"
                  v-model="formData.mobile"
                  placeholder="请输入手机号码"
                ></a-input>
              </a-form-model-item>

              <a-form-model-item label="真实姓名" prop="realName">
                <a-input
                  :disabled="type === 'INFO'"
                  v-model="formData.realName"
                  placeholder="请输入真实姓名"
                ></a-input>
              </a-form-model-item>

              <a-form-model-item label="昵称" prop="nickname">
                <a-input
                  :disabled="type === 'INFO'"
                  v-model="formData.nickname"
                  placeholder="请输入昵称"
                ></a-input>
              </a-form-model-item>

              <a-form-model-item label="工号" prop="workNo">
                <a-input
                  :disabled="type === 'INFO'"
                  v-model="formData.workNo"
                  placeholder="请输入工号"
                ></a-input>
              </a-form-model-item>

              <a-form-model-item label="性别">
                <a-select
                  :disabled="type === 'INFO'"
                  v-model="formData.gender"
                  style="width: 100%"
                  placeholder="请选择性别"
                >
                  <a-select-option
                    v-for="item in genderOptions"
                    :key="item.value"
                  >
                    {{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="锁定状态">
                <a-switch
                  :disabled="type === 'INFO'"
                  v-model="formData.locked"
                />
              </a-form-model-item>
              <a-form-model-item label="过期时间">
                <!-- v-model="formData.expireAt" -->
                <a-date-picker
                  valueFormat="x"
                  :showTime="true"
                  :disabled="type === 'INFO'"
                  v-model="formData.expireAt"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <div
          :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1
          }"
        >
          <a-button :style="{ marginRight: '8px' }" @click="onClose">
            取消
          </a-button>
          <a-button
            type="primary"
            :loading="loading"
            @click="submitForm('form')"
          >
            确认
          </a-button>
        </div>
      </a-skeleton>
    </a-drawer>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Emit, Prop, Watch } from 'vue-property-decorator'
import AvatarUpload from '@/components/Upload/AvatarUpload.vue'
import { create, update, details } from '@/api/user'
import md5 from 'md5'
import moment from 'moment'
interface UserReq {
  username: string
  realName: string
  nickname: string
  avatar: string
  password: string | null
  rPassword: string | null
  mobile: string
  workNo: string
  email: string
  gender: string
  birthDay: string | null
  enable: boolean
  expireAt: any
  locked: boolean
}

const defaultForm: UserReq = {
  username: '',
  realName: '',
  nickname: '',
  avatar: '',
  password: null,
  rPassword: null,
  mobile: '',
  workNo: '',
  email: '',
  gender: 'UNKNOWN',
  birthDay: null,
  enable: true,
  expireAt: null,
  locked: false
}

@Component({
  name: 'DetailsDrawer',
  components: {
    AvatarUpload
  }
})
export default class DetailsDrawer extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private visible!: boolean

  @Prop({
    type: String,
    default: 'ADD'
  })
  private type!: string

  @Prop({
    type: String
  })
  private selectedKey?: string

  private loading = false

  private formData = Object.assign({}, defaultForm)

  private showSkeleton = false

  private genderOptions = [
    { name: '未知', value: 'UNKNOWN' },
    { name: '男', value: 'MALE' },
    { name: '女', value: 'FEMALE' }
  ]
  private rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 5, max: 30, message: '长度在5-30之间', trigger: 'blur' }
    ],
    realName: [
      { required: true, message: '请输入实际姓名', trigger: 'blur' },
      { min: 2, max: 10, message: '长度在2-10之间', trigger: 'blur' }
    ],
    nickname: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在2-20之间', trigger: 'blur' }
    ],
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
    ],
    mobile: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { min: 8, max: 30, message: '长度在8-30之间', trigger: 'blur' }
    ],
    workNo: [{ max: 30, message: '长度在30之内', trigger: 'blur' }]
  }

  private onClose() {
    if (!this.loading) {
      this.close(false)
    }
  }
  @Emit()
  private close(val: boolean) {}

  @Emit()
  private onAddSuccess(val: any) {}

  @Emit()
  private onEditSuccess(val: any) {}

  @Watch('selectedKey')
  onChangeValue(newVal: string) {
    if (this.type !== 'ADD') {
      this.showSkeleton = true
      details(newVal).then((res: any) => {
        this.formData = res

        this.formData.expireAt = this.formData.expireAt
          ? moment(this.formData.expireAt)
          : null
        this.showSkeleton = false
      })
    } else {
      this.formData = Object.assign({}, defaultForm)
    }
  }

  validPass(rule: any, value: any, callback: any) {
    if (value !== this.formData.password) {
      callback(new Error('两次输入的密码不一致'))
    } else {
      callback()
    }
  }

  submitForm(formName: string) {
    let el: any = this.$refs[formName]
    el.validate((valid: boolean) => {
      if (valid) {
        this.loading = true
        if (this.type === 'ADD') {
          this.formData.password = md5(this.formData.password!)
          this.formData.rPassword = this.formData.password
          create(this.formData)
            .then((res: any) => {
              this.formData = Object.assign({}, defaultForm)
              this.$notification.success({
                message: '成功',
                description: '新增用户成功'
              })
              this.onAddSuccess(res)
            })
            .finally(() => {
              this.loading = false
              this.formData.password = null
              this.formData.rPassword = null
            })
        } else if (this.type === 'EDIT') {
          if (
            this.formData.expireAt != null &&
            this.formData.expireAt instanceof Object
          ) {
            this.formData.expireAt = this.formData.expireAt.format('x')
          }

          update(this.selectedKey!, this.formData)
            .then((res: any) => {
              this.$notification.success({
                message: '成功',
                description: '更新用户成功'
              })
              this.loading = false
              this.onClose()
              this.onEditSuccess(res)
            })
            .finally(() => {
              this.loading = false
            })
        }
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
}
</script>
