import _merge from 'lodash'

export const authentificate = (ctx, user) => {
    ctx.commit('auth', user)
}
export const logout = (ctx) => {
    ctx.commit('logout')
}
export const clearCurrentItem = (ctx) => {
    ctx.commit('clearCurrentItem')
}

export const changeCurrentItem = (ctx, item) => {
    ctx.commit('setCurrentItem', item)
}
export const newArticleItem = (ctx, item) => {
    ctx.commit('addItem', item)
}

export const clearArticle = (ctx) => {
    ctx.commit('clearArticle')
}

export const getEditedElement = (ctx, canvas_inner_id, canvas_type) => {
    ctx.commit('getEditedElement', canvas_inner_id, canvas_type)
}