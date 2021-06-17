const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../Models/User.js')
class UserController {
    async register(payload) {
        return new Promise((resolve, reject) => {
            const { login, email, password } = payload
            User.create({ login, email, password: bcrypt.hashSync(password, 10), created_at: Date.now() })
                .then(user => resolve(user))
                .catch(() => reject(401))
        })
    }
    async login(payload) {
        return new Promise((resolve, reject) => {
            const { login, password } = payload
            let user = User.findOne({ login }).then((user) => {
                if (bcrypt.compareSync(password, user.password)) { // сравнение хэша паролей
                    resolve(user)
                } else reject(401)
            })
        })
    }
}

module.exports = new UserController()