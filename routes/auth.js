const express = require("express")
const router = express.Router()
const userController = require("../controllers/users") //users is the controller

//connect it to the controller/users and then to register to process the data
router.post('/register', userController.register)   
router.post('/login', userController.login)   

module.exports = router;