export const auth = (state, { _id, email, login }) => {
    if (_id && email && login) {
        state.user = {}
        state.user.id = _id
        state.user.email = email
        state.user.login = login
    }
}
export const setCurrentItem = (state, item) => {
    state.currentItem = item
}

export const clearCurrentItem = (state) => {
    state.currentItem = undefined
}

export const addItem = (state, item) => {

}