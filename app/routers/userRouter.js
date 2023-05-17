const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();
const auth = require('../middleware/auth.js')

userRouter.get("/", userController.getUsers);
//userRouter.post("/", userController.addUser);
userRouter.get("/:id", userController.getUser)
userRouter.put('/:id',auth.authorized, auth.onlyOwner, userController.updateUser)
 
module.exports = userRouter;