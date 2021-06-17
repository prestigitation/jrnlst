import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import state from './state'
import * as mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

//export const plugins = [createPersistedState()]

Vue.use(Vuex)

const store = () => new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
})

export default store
