<template>
  <div class='w-25 mx-auto mt-3'>
    <h3 class="text-center"> Вход </h3>
    <b-form @submit.prevent='log_in'>
      <b-form-input type="text" v-model="login" placeholder="Введите логин" class="my-3"/>
      <b-form-input type="password" v-model="password" placeholder="Введите пароль от аккаунта" class="my-3"/>
      <b-button type="submit" variant='warning' class='d-flex mx-auto'> Отправить </b-button>
    </b-form>
    <b-toast id="login_fail" title="Аутентификация" no-auto-hide variant='danger'>
      <span>Не удалось войти. Проверьте параметры запроса</span>
    </b-toast>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login : '',
      password : '',
    }
  },
  methods : {
    async log_in() {
      await this.$axios.post('http://localhost:3001/login',{ login : this.login, password : this.password}).then(({data}) => {
        this.$store.dispatch('authentificate',data)
        this.$router.go('/')
      }).catch(() => {
        this.$bvToast.show('login_fail')
      })
    }
  }
}
</script>

<style>

</style>
