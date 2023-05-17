const express = require("express");
const userController = require("../controllers/userController.js");
const authRouter = express.Router();
const auth = require('../middleware/auth.js')

authRouter.get("/logout", auth.authorized, userController.logout)
authRouter.post("/register", userController.register);
authRouter.post('/login', userController.login)

module.exports = authRouter