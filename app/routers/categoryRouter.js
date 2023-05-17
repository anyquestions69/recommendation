const express = require("express");
const categoryController = require("../controllers/categoryController.js");
const auth = require('../middleware/auth.js')
const categoryRouter = express.Router();
 

categoryRouter.get("/", categoryController.getCategories);
categoryRouter.get('/:id', categoryController.getOne)
categoryRouter.post("/", auth.authorized, auth.onlyAdmin,categoryController.postCategory)
 
module.exports = categoryRouter;