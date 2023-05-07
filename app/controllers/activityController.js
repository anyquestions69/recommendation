const {Activity , User} = require('../models/user')

class Manager{
    async getActivities(req,res) {  
        let result = await Activity.findAll({raw:true})
        return res.send(result)
    }
    async getOne(req,res){
        let act = await Activity.findOne({where:{id:req.params['id']}, include:[User], attributes:['email']})
        return res.send(act)
    }
    async postActivity(req,res){
        let activity = {
            name:req.body.name
        }
        let result = await Activity.create(activity)
        return res.send(result)
    }
    async assing(req,res){
        console.log(req.user)
        let usr = await User.findOne({where:{id:1}})
        let act = await Activity.findOne({where:{id:req.params['id']}})
        let result = await usr.addActivity(act, {through:{date:new Date()}})
        return res.send(result)
    }
}
let manager = new Manager()
module.exports = manager