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
        <a-button type="primary" @click="onClose">
          确认
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Emit, Prop, Watch } from 'vue-property-decorator'

@Component({
  name: 'DetailsDrawer'
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
  private userId?: string

  private onClose() {
    this.close(false)
  }
  @Emit()
  private close(val: boolean) {}

  @Watch('userId')
  onChangeValue(newVal: string) {
    // todo...
    console.log(newVal)
  }

  // export default {
  //   name: 'DetailsDrawer',
  //   props: {
  //     visible: {
  //       type: Boolean,
  //       default: false
  //     }
  //   },
  //   data() {
  //     return {
  //       form: this.$form.createForm(this)
  //     }
  //   },
  //   methods: {
  //     showDrawer() {
  //       this.visible = true
  //       this.$emit('visible', true)
  //     },
  //     onClose() {
  //       console.log('onclose')
  //       this.$emit('visible', false)
  //     }
  //   }
}
</script>
