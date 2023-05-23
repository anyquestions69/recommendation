const {Activity , User} = require('../app/models/user')
const { Op } = require("sequelize");

class Manager{
    async getActivities(req,res) {  
        let filter=req.query
        if(!filter.name){
            if(!filter.category){
            let result = await Activity.findAll({include:[User]})
            return res.send(result)
            }else{
                let category = filter.category.split(',')
                let result = await Activity.findAll({where:{
                    categoryId :{
                        [Op.or]: category
                    }
                    },
                    include:[User]})
                return res.send(result)
            }
        }else{
            if(!filter.category){
            let result = await Activity.findAll({
                include:[User],
                where:{ 
                    name:{
                        [Op.substring]: filter.name
                    }
                }
             })
             return res.send(result)
            }else{
                
                let category = filter.category.split(',')
                console.log(category)
                console.log(filter.name)
                let result = await Activity.findAll({where:{
                    [Op.and]: [
                    {
                        name:{
                        [Op.substring]: filter.name
                        }
                    },
                    {
                        categoryId :{
                        [Op.or]: category
                        }
                    }
                    ]
                    },
                    include:[User]})
                return res.send(result)
            }
        
        }
    }
    async getActCat(req,res){
        const catId = req.query.id
        console.log(catId)
        if(catId){
            let act = await Activity.findAll({where:{categoryId :{
                [Op.or]: catId.split(',')
            }}})
            return res.send(act)
        }else{
            let result = await Activity.findAll()
             return res.send(result)
        }
    }
    async getOne(req,res){
        let act = await Activity.findOne({where:{id:req.params['id']}, include:[User]})
        return res.send(act)
    }
    async viewOne(req,res){
        if(!Number.isInteger(parseInt(req.params['id']))){
            return res.render('activity.hbs', {
                user: req.user,
                notlogged: !req.user,
                activity:{name:req.params['id']}
                });
        }
        let act = await Activity.findOne({where:{id:Number(req.params['id'])}})
        return res.render('activity.hbs', {
            user: req.user,
            notlogged: !req.user,
            activity:act
            });
    }
    async postActivity(req,res){
        if (!req.body.name)return res.status(409).send("Введите название");
        let activity = {
            name:req.body.name
        }
        let result = await Activity.create(activity)
        return res.send(result)
    }
    async assing(req,res){
        let usr = await User.findOne({where:{id:req.user.id}})
        if(!usr)return res.send('Необходимо авторизоваться')
        let act = await Activity.findOne({where:{id:req.params['id']}})
        let result = await usr.addActivity(act, {through:{date:new Date()}})
        console.log(result)
        if(result){
            return res.send('Вы успешно записались!')
        }
        return res.send('Ошибка')
    }
}
let manager = new Manager()
module.exports = manager