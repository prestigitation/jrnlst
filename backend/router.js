const express = require('express')
const router = express.Router()
const UserController = require('./Controllers/UserController')



router.post('/register', async(req, res) => {
    await UserController.register(req.body).then(user => res.json(user)).catch(err => res.sendStatus(401))
})
router.post('/login', async(req, res) => {
    await UserController.login(req.body).then(user => res.json(user)).catch(err => res.sendStatus(401))
})

module.exports = router