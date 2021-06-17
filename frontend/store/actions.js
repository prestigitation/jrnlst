export const authentificate = (ctx, user) => {
    ctx.commit('auth', user)
}
export const logout = (ctx) => {
    ctx.commit('logout')
}