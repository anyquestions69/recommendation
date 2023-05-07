const express = require("express");
const userController = require("../controllers/userController.js");
const viewRouter = express.Router();
var path = require('path');
const auth = require('../middleware/auth.js')

viewRouter.get('/',auth.getUser, (req,res)=>{
  
        return  res.render('index.hbs', {
            user: req.user,
            notlogged: !req.user
            });

   
    
})
viewRouter.get('/login', (req,res)=>{res.render('login.hbs')})

module.exports = viewRouter