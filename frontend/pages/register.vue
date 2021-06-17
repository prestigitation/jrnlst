<template>
  <div class="register_container w-25 mr-auto ml-auto mt-3">
    <h3 class="text-center"> Регистрация </h3>
    <b-form @submit.prevent='register'>

      <b-form-group id="example-input-group-1" label="Login" label-for="example-input-1">
        <b-form-input type="text" v-model="$v.form.login.$model" :state="validateState('login')" placeholder="Придумайте логин(от 6 до 30 символов)" class="my-3"/>
        <b-form-invalid-feedback
            id="input-1-live-feedback"
          >Логин должен быть от 6 до 30 символов</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="example-input-group-2" label="Email" label-for="example-input-2">
        <b-form-input type="email" v-model="$v.form.email.$model" :state="validateState('email')" placeholder="Введите действующий e-mail" class="my-3"/>
        <b-form-invalid-feedback
            id="input-2-live-feedback"
          >Введите адрес электронной почты</b-form-invalid-feedback>
        </b-form-group>

      <b-form-group id="example-input-group-3" label="Password" label-for="example-input-3">
        <b-form-input type="password" v-model="$v.form.password.$model" :state="validateState('password')" placeholder="Придумайте пароль(от 6 до 30 символов)" class="my-3"/>
        <b-form-invalid-feedback
            id="input-3-live-feedback"
          >Пароль должен быть от 6 до 30 символов</b-form-invalid-feedback>
        </b-form-group>
      <b-button type="submit" variant='success' class="d-flex mr-auto ml-auto"> Зарегистрироваться </b-button>
    </b-form>

    <b-toast id="register_success" title="Регистрация" no-auto-hide variant='success'>
      <span>Вы успешно зарегистрировались!</span>
      <Nuxt-Link to="/"> Вернуться на главную страницу </Nuxt-Link>
    </b-toast>
    <b-toast id="register_fail" title="Регистрация" no-auto-hide variant='danger'>
      <span>Не удалось зарегистрироваться. Проверьте параметры запроса</span>
    </b-toast>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, email } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  data() {
    return {
      form : {
        login : null,
        email : null,
        password : null,
      }
    }
  },
  methods : {
    async register() {
      if(!this.$v.$anyError && !this.$v.error) { // если нет ошибок в валидации формы, переходим к регистрации пользователя
        await this.$axios.post('http://localhost:3001/register',this.form).then(({data}) => {
          this.$store.dispatch('authentificate',data) // фиксация аутентификации в хранилище
          this.$bvToast.show('register_success') //показ уведомления
        }).catch((e) => {
          console.log(e)
          this.$bvToast.show('register_fail')
        })
      }
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
  },
  validations: {
    form : {
      password : {
        minLength : minLength(6),
        maxLength : maxLength(30)
      },
      login : {
        minLength : minLength(6),
        maxLength : maxLength(30)
      },
      email : {
        required,
        email
      }
    }
  }
}
</script>

<style>

</style>
