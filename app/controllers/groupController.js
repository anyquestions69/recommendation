const {Activity , Group} = require('../models/user')
const { Op } = require("sequelize");
var url = "https://cleaner.dadata.ru/api/v1/clean/address";
var token = "5985dfed520414e420a61270acd6fed188809798";
const Dadata = require('dadata-suggestions');
const dadata = new Dadata(token);

   

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: groups } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, groups, totalPages, currentPage };
  };
  

class Manager{
    async getGroups(req,res) {  
        let {id, cat1, cat2, activity, days, status, type, schedule,page}=req.query
            let filter =[]
            let exclude
            
            if(id){
                if(!isNaN(id) && !isNaN(parseInt(id))){
                    filter.push({id:id})
                }else{
                    filter.push({activity:{
                        [Op.substring]: id
                    }})
                }
            }
            
            
            
            if(status==='true'){
                const today = new Date()
                const yyyy = today.getFullYear();
                let mm = today.getMonth() + 1; 
                let dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;
                let avMonths=[]
                for(let i =today.getMonth() ;i<=12;i++){ // +1
                    if (i < 10) i = '0' + i;
                    avMonths.push({[Op.substring]:i+'.'+yyyy})
                }
                filter.push({schedule_1:{
                    [Op.or]:avMonths
                }})
            }
            if(cat2){
                filter.push({cat2:{
                    [Op.or]:cat2.split(',')
                }})
            }
            if(activity){
                filter.push({activity:{
                    [Op.or]:activity.split(',')
                }})
            }
            if(days){
                let arr = days.split(',')
                let ar_obj=[]
                for(let i=0; i< arr.length;i++){
                    ar_obj.push({[Op.regexp]: `2023, [а-яА-Я|.|, ]*${arr[i]}` })
                }
                filter.push({schedule_1:{
                    [Op.or]: ar_obj 
                }})
            }
            if(type){
                if(type==1){
                    filter.push({activity:{
                    [Op.notLike]:'ОНЛАЙН%'
                    }})
                }else if(type==2){
                    filter.push({activity:{
                        [Op.like]:'ОНЛАЙН%'
                        }})
                    exclude =  {exclude: ['address']}
                }
            }



            let result

            if(filter.length>1){
             result= await Group.findAndCountAll( {offset: page>=1?((page-1)*10):0, limit: 5, where:{
                [Op.and]: filter
                }})
            }else{
                result= await Group.findAndCountAll( {offset: page>=1?((page-1)*10):0, limit: 5, where:filter[0], attributes:exclude})
                    //console.log(result)
            }
            let resData= getPagingData(result, page, 10)
            for(let i=0;i<resData.groups.length;i++){
                //console.log(resData.groups[i].activity)
                //dadata.address({ query: resData.groups[i].address, count: 1 }).then(r=>console.log(r)).catch(err=>console.log(err))
            }
            return res.send(resData)

    }
    async getActCat(req,res){
        const catId = req.query.id
        console.log(catId)
        let ids=[]
        if(catId){
            let act = await Group.findAll({where:{categoryId :{
                [Op.or]: catId.split(',')
            }}})
            
            for(let a in act){
                ids.push(a.id)
            }
            let result = await Group.findAll({where:{categoryId :{
                [Op.or]: ids.split(',')
            }}})
            return res.send(result)
        }else{
            let result = await Group.findAll()
             return res.send(result)
        }
    }
    async getOne(req,res){
        let act = await Group.findOne({where:{id:req.params['id']}})
        return res.send(act)
    }
    async viewOne(req,res){
        if(!Number.isInteger(parseInt(req.params['id']))){
            return res.render('group.hbs', {
                
                group:{name:req.params['id']}
                });
        }
        let group = await Group.findOne({where:{id:Number(req.params['id'])}})
        return res.render('group.hbs', {
            
            group:group
            });
    }
    
    async assing(req,res){
        /* let usr = await User.findOne({where:{id:req.user.id}})
        if(!usr)return res.send('Необходимо авторизоваться')
        let act = await Activity.findOne({where:{id:req.params['id']}})
        let result = await usr.addActivity(act, {through:{date:new Date()}})
        console.log(result)
        if(result){
            return res.send('Вы успешно записались!')
        }
        return res.send('Ошибка') */
    }
}
let manager = new Manager()
module.exports = manager