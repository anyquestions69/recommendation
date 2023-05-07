const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();

userRouter.get("/", userController.getUsers);
//userRouter.post("/", userController.addUser);
userRouter.get("/:id", userController.getUser)
 
module.exports = userRouter;