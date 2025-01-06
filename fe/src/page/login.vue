<template>
    <div>
        <div>
            <b-card no-body>
                <b-form-input placeholder="输入验证令牌" type="number" v-model="token"></b-form-input>
                <b-button @click="verifyToken" size="sm" variant="info">验证</b-button>
            </b-card>

        </div>
    </div>

</template>
<script>
export default {
    name: 'loginPage',
    data() {
        return {
            token: ''
        }
    },
    mounted() {
    },

    methods: {

        verifyToken() {
            if (this.token === null | this.token.length !== 6) {
                this.$bvToast.toast('请输入6位数字令牌', {
                    title: '提示',
                    variant: 'warning',
                    solid: true,
                    autoHideDelay: 3000,
                })
                return
            }
            this.$http.post('/verify/token', {token: this.token}).then((resp) => {
                console.log(resp)
                if (resp.data.code === 0) {
                    window.location.href = `/?token=${this.token}`
                } else {
                    this.$bvToast.toast('验证失败', {
                        title: '提示',
                        variant: 'warning',
                        solid: true,
                        autoHideDelay: 3000,
                    })
                }

            })
        },

    },
    watch: {}

}
</script>
<style>
.nav-link {
    background-color: aquamarine;
}
</style>