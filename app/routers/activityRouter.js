const express = require("express");
const activityController = require("../controllers/activityController.js");
const auth = require('../middleware/auth.js')
const activityRouter = express.Router();
 

activityRouter.get("/", activityController.getActivities);
activityRouter.get('/:id', activityController.getOne)
activityRouter.post("/", auth.authorized, auth.onlyAdmin,activityController.postActivity);
activityRouter.post("/:id",  auth.authorized,activityController.assing);
 
module.exports = activityRouter;