const express = require("express");
const groupController = require("../controllers/groupController.js");
const groupRouter = express.Router();
 
groupRouter.get('/cat', groupController.getActCat)
groupRouter.get("/", groupController.getGroups);
groupRouter.get('/:id', groupController.getOne)

 
module.exports = groupRouter;