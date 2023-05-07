const express = require("express");
const userController = require("../controllers/userController.js");
const authRouter = express.Router();


 authRouter.post("/register", userController.register);
 authRouter.post('/login', userController.login)
module.exports = authRouter