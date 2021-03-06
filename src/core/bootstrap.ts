import Vue from 'vue'
import store from '@/store/'
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  DEFAULT_COLOR,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_COLOR_WEAK,
  SIDEBAR_TYPE,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_CONTENT_WIDTH_TYPE,
  DEFAULT_MULTI_TAB
} from '@/store/mutation-types'
import config from '@/config/defaultSettings'

export default function Initializer() {
  console.log(`API_URL: ${process.env.VUE_APP_API_BASE_URL}`)

  store.commit('app/SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
  store.commit('app/TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
  store.commit(
    'app/TOGGLE_LAYOUT_MODE',
    Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout)
  )
  store.commit(
    'app/TOGGLE_FIXED_HEADER',
    Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader)
  )
  store.commit(
    'app/TOGGLE_FIXED_SIDERBAR',
    Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar)
  )
  store.commit(
    'app/TOGGLE_CONTENT_WIDTH',
    Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth)
  )
  store.commit(
    'app/TOGGLE_FIXED_HEADER_HIDDEN',
    Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader)
  )
  store.commit(
    'app/TOGGLE_WEAK',
    Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak)
  )
  store.commit(
    'app/TOGGLE_COLOR',
    Vue.ls.get(DEFAULT_COLOR, config.primaryColor)
  )
  store.commit(
    'app/TOGGLE_MULTI_TAB',
    Vue.ls.get(DEFAULT_MULTI_TAB, config.multiTab)
  )
  store.commit('user/SET_ACCESS_TOKEN', Vue.ls.get(ACCESS_TOKEN))
  store.commit('user/SET_REFRESH_TOKEN', Vue.ls.get(REFRESH_TOKEN))

  // last step
}
