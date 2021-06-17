const mongoose = require('mongoose')
const { Schema } = mongoose


const userSchema = new Schema({
    login: {
        type: String,
        required: true,
        min: [6, 'Содержимое логина - от 6 символов'],
        max: [30, 'Содержимое логина - до 30 символов']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User