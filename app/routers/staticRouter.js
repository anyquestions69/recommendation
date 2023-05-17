const express = require("express");
const userController = require("../controllers/userController.js");
let activityController=require("../controllers/activityController.js");
const viewRouter = express.Router();
var path = require('path');
const auth = require('../middleware/auth.js')
const visit = require('../middleware/visitor.js')
const {Activity} = require('../models/user.js')

viewRouter.get('/',auth.getUser, visit.newUser,async(req,res)=>{
    let act = await Activity.findAll()
        return  res.render('index.hbs', {
            user: req.user,
            notlogged: !req.user,
            newUser:req.newUser,
            activities:act
            });

})
viewRouter.get('/login', (req,res)=>{res.render('login.hbs')})
viewRouter.get('/register', (req,res)=>{res.render('register.hbs')})
viewRouter.get('/admin',auth.authorized, auth.onlyAdmin, (req,res)=>{
    return  res.render('admin.hbs', {
        user: req.user,
        notlogged: !req.user
        });
})
viewRouter.get('/activities/:id',auth.getUser, activityController.viewOne)

module.exports = viewRouter