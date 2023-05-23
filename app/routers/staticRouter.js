const express = require("express");
const viewRouter = express.Router();
var path = require('path');
const visit = require('../middleware/visitor.js')
const groupController = require('../controllers/groupController.js')

viewRouter.get('/',visit.newUser,async(req,res)=>{
    
        return  res.render('index.hbs', {
            newUser:req.newUser
            });

})
viewRouter.get('/test',(req,res)=>{
    return res.render('test.hbs')
})
viewRouter.get('/groups/:id', groupController.viewOne)
viewRouter.get('/store-data', (req,res)=>{
    return res.render('loading.hbs')
})


module.exports = viewRouter