<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-tabs
        :active-key="customActiveKey"
        :tab-bar-style="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="password" tab="用户名密码登录">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="用户名"
              v-decorator="[
                'username',
                {
                  rules: [
                    { required: true, message: '请输入用户名或邮箱地址' },
                    { min: 5, max: 20, message: '用户名长度在5-20位' }
                  ],
                  validateTrigger: 'blur'
                }
              ]"
            >
              <a-icon
                slot="prefix"
                type="user"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码"
              v-decorator="[
                'password',
                {
                  rules: [
                    { required: true, message: '请输入密码' },
                    { min: 6, max: 18, message: '密码长度在6-18位' }
                  ],
                  validateTrigger: 'blur'
                }
              ]"
            >
              <a-icon
                slot="prefix"
                type="lock"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="captcha" tab="手机验证码登录">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="手机号"
              v-decorator="[
                'mobile',
                {
                  rules: [
                    {
                      required: true,
                      pattern: /^1[34578]\d{9}$/,
                      message: '请输入正确的手机号'
                    }
                  ],
                  validateTrigger: 'blur'
                }
              ]"
            >
              <a-icon
                slot="prefix"
                type="mobile"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input
                  size="large"
                  type="text"
                  placeholder="验证码"
                  v-decorator="[
                    'captcha',
                    {
                      rules: [
                        { required: true, message: '请输入验证码' },
                        { min: 6, max: 6, message: '请输入6位有效验证码' }
                      ],
                      validateTrigger: 'blur'
                    }
                  ]"
                >
                  <a-icon
                    slot="prefix"
                    type="mail"
                    :style="{ color: 'rgba(0,0,0,.25)' }"
                  />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="
                  (!state.smsSendBtn && '获取验证码') || state.time + ' s'
                "
              />
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>

      <!-- <a-form-item>
        <a-checkbox v-decorator="['rememberMe']">
          自动登录
        </a-checkbox>
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa' } }"
          class="forge-password"
          style="float: right;"
        >
          忘记密码
        </router-link>
      </a-form-item> -->

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          html-type="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >
          确定
        </a-button>
      </a-form-item>

      <!-- <div class="user-login-other">
        <span>其他登录方式</span>
        <a>
          <a-icon class="item-icon" type="alipay-circle" />
        </a>
        <a>
          <a-icon class="item-icon" type="taobao-circle" />
        </a>
        <a>
          <a-icon class="item-icon" type="weibo-circle" />
        </a>
        <router-link class="register" :to="{ name: 'register' }">
          注册账户
        </router-link>
      </div> -->
    </a-form>

    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import md5 from 'md5'
import { timeFix } from '@/utils/util'
import { LoginState } from '@/interfaces/service-interface'

@Component({
  name: 'Login'
})
export default class Login extends Vue {
  @Action('Login', { namespace: 'user' })
  Login: any
  @Action('Logout', { namespace: 'user' })
  Logout: any

  // data
  private customActiveKey: string = 'password'
  // private loginBtn: boolean = false
  // login type: 0 email, 1 username, 2 telephone
  private loginType: number = 0
  private requiredTwoStepCaptcha: boolean = false
  private stepCaptchaVisible: boolean = false
  private erroeMessage = ''
  private form: any
  private state: LoginState = {
    time: 60,
    loginBtn: false,
    // login type: 0 email, 1 username, 2 telephone
    loginType: 0,
    smsSendBtn: false
  }

  constructor() {
    super()
  }

  // Lifecycle
  beforeCreate() {
    this.form = this.$form.createForm(this)
  }

  created() {}

  // methods
  // private handleUsernameOrEmail(_rule: any, value: string, callback: Function) {
  //   const { state } = this
  //   const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
  //   if (regex.test(value)) {
  //     state.loginType = 0
  //   } else {
  //     state.loginType = 1
  //   }
  //   callback()
  // }

  private handleTabClick(key: string) {
    this.customActiveKey = key
    // this.form.resetFields()
  }

  private handleSubmit(e: any) {
    e.preventDefault()
    const { Login, state } = this
    const validateFieldsKey =
      this.customActiveKey === 'password'
        ? ['username', 'password']
        : ['mobile', 'captcha']

    this.form.validateFields(
      validateFieldsKey,
      { force: true },
      (err: any, values: any) => {
        if (!err) {
          const loginReq = { ...values, grant_type: this.customActiveKey }
          loginReq.password = md5(loginReq.password)
          Login(loginReq)
            .then((res: any) => this.loginSuccess(res))
            .catch((err: any) => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          state.loginBtn = false
        }
      }
    )

    // const {
    //   form: { validateFields },
    //   state,
    //   customActiveKey,
    //   Login
    // } = this

    // state.loginBtn = true

    // const validateFieldsKey =
    //   customActiveKey === 'tab1'
    //     ? ['username', 'password']
    //     : ['mobile', 'captcha']

    // validateFields(
    //   validateFieldsKey,
    //   { force: true },
    //   (err: any, values: any) => {
    //     if (!err) {
    //       console.log('login form', values)
    //       const loginParams = { ...values }
    //       delete loginParams.username
    //       loginParams[!state.loginType ? 'email' : 'username'] = values.username
    //       loginParams.password = md5(values.password)
    //       Login(loginParams)
    //         .then((res: any) => this.loginSuccess(res))
    //         .catch((err: any) => this.requestFailed(err))
    //         .finally(() => {
    //           state.loginBtn = false
    //         })
    //     } else {
    //       setTimeout(() => {
    //         state.loginBtn = false
    //       }, 600)
    //     }
    //   }
    // )
  }

  private getCaptcha(e: Event) {
    e.preventDefault()
    const {
      form: { validateFields },
      state
    } = this

    validateFields(['mobile'], { force: true }, (err: any, values: any) => {
      if (!err) {
        state.smsSendBtn = true

        const interval = window.setInterval(() => {
          if (state.time-- <= 0) {
            state.time = 60
            state.smsSendBtn = false
            window.clearInterval(interval)
          }
        }, 1000)

        const hide = this.$message.loading('验证码发送中..', 0)
        //   getSmsCaptcha({ mobile: values.mobile })
        //     .then(res => {
        //       const reponse = res as any
        //       setTimeout(() => hide, 2500)
        //       this.$notification['success']({
        //         message: '提示',
        //         description:
        //           '验证码获取成功，您的验证码为：' + reponse.result.captcha,
        //         duration: 8
        //       })
        //     })
        //     .catch((err: any) => {
        //       setTimeout(() => hide, 1)
        //       clearInterval(interval)
        //       state.time = 60
        //       state.smsSendBtn = false
        //       this.requestFailed(err)
        //     })
      }
    })
  }

  private stepCaptchaSuccess() {
    this.loginSuccess()
  }

  private stepCaptchaCancel() {
    this.Logout().then(() => {
      // this.loginBtn = false
      this.stepCaptchaVisible = false
    })
  }

  private loginSuccess(res?: any) {
    // check res.homePage define, set $router.push name res.homePage
    // Why not enter onComplete
    /*
      this.$router.push({ name: 'analysis' }, () => {
        console.log('onComplete')
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      })
      */
    this.$router.push({ path: '/' })
    // 延迟 1 秒显示欢迎信息
    setTimeout(() => {
      this.$notification.success({
        message: '欢迎',
        description: `${timeFix()}，欢迎回来`
      })
    }, 1000)
  }

  private requestFailed(err: any) {
    this.erroeMessage = err.error_description || '请求出现错误，请稍后再试'
    console.log(err.response)
    this.$notification.error({
      message: '错误',
      description: this.erroeMessage
    })
    // this.$notification['error']({
    //   message: this.erroeMessage,
    //   description: '',
    //   duration: 4
    // })
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
