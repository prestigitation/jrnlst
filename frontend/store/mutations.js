import { _ } from "core-js"

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

export const clearArticle = (state) => {
    state.article = undefined
}

export const addItem = (state, item) => {
    let article
    if (state.article) {
        article = state.article
        article.push(item)
    } else {

        article = [{...item }]
    }
    state.article = article
}

export const getEditedElement = (state, canvas_inner_id, canvas_type) => {
    state.currentItem = state.article.filter(elem => elem.canvas_inner_id == canvas_inner_id)
}

export const replaceArticleElement = (state, item) => {
    state.currentItem = item
    let article = state.article
    for (let i = 0; i < article.length; i++) {
        if (article[i].canvas_inner_id == item.canvas_inner_id && article[i].canvas_type == item.canvas_type) {
            article[i] = item
        }
    }
    state.article = article
}
