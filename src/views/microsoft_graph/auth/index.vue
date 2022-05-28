<template>
  <div class="app-container">
    <el-empty image-size="120" :image="require('@/assets/loding/loading.gif')" description="授权中..." />
  </div>
</template>

<script>
import {signIn} from "@/api/microsoft_graph/auth"
import {Message} from "element-ui"

export default {
  name: "Auth",
  async created() {
    const data = {
      code: this.$route.query.code,
      state: this.$route.query.state
    }
    await this.sign(data)
  },

  methods: {
    sign(data) {
      signIn(data).then(res => {
        Message.success(res.message)
        setTimeout(() => {
          window.close()
        }, 1000)
      }).catch(err => {
        Message.error(err.message)
        setTimeout(() => {
          window.close()
        }, 2000)
      })
    }
  }
}
</script>

<style scoped>

</style>
