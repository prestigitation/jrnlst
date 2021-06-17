<template>
  <div class="header_container ml-auto mr-auto mt-2 justify-content-between d-flex">
    <div class='header_user' v-if="getUser">
      {{getUserLogin}}
    </div>
    <div class='header_search'>
      search
    </div>
    <div class="header_auth d-flex">
      <div class="header_login mx-2" v-if="!getUser">
        <svg id="i-signin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M3 16 L23 16 M15 8 L23 16 15 24 M21 4 L29 4 29 28 21 28" />
        </svg>
        <Nuxt-Link to="/login">
         Войти
        </Nuxt-Link>
      </div>
      <div class="header_register mx-2" v-if="!getUser">
        <svg id="i-user" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M22 11 C22 16 19 20 16 20 13 20 10 16 10 11 10 6 12 3 16 3 20 3 22 6 22 11 Z M4 30 L28 30 C28 21 22 20 16 20 10 20 4 21 4 30 Z" />
        </svg>
        <Nuxt-Link to="/register">
          Зарегистрироваться
        </Nuxt-Link>
      </div>
      <div class="header_logout mx-2" v-if="getUser">
        <svg id="i-signout" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M28 16 L8 16 M20 8 L28 16 20 24 M11 28 L3 28 3 4 11 4" />
        </svg>
        <a href="#" @click.prevent='logout'>
          Выйти
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  methods : {
    logout() {
      this.$store.dispatch('logout')
      this.$router.go('/')
    }
  },
  computed: {
    ...mapGetters([
      'getUser','getUserId','getUserEmail','getUserLogin'
    ])
  }
}
</script>

<style>
  .header_container {
    width: 650px;
    padding : 15px;
    border-bottom-right-radius: 18px;
    border-bottom-left-radius: 18px;
    border : 1px solid black;
  }
</style>
