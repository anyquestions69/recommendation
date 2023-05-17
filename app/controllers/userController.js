const {User, Enrolment, Activity} = require('../models/user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
require("dotenv").config();

class Manager{
    async getUsers(req,res) {  
        let  users= await User.findAll({include:[Activity], attributes: ['email','first_name','last_name']})
        return res.send(users)
    }
    async getUser(req,res){
        User.findOne({where: {id:req.params['id']}, include:[Activity], attributes: ['email','first_name','last_name']})
        .then((usr)=>{
            if(!usr) return res.send({"error":"wrong id"});
            return res.send(usr)
        }); 
    }
    
    async register(req, res)  {
        try {
          const { first_name, last_name, email, password, repass } = req.body;
          if(password!=repass)return res.status(412).send("Пароли не совпадают");
      
          if (!(email && password && first_name && last_name)) {
            return res.status(400).send("Необходимо заполнить все поля");
          }
          const oldUser = await User.findOne({where:{ email:email }});
          if (oldUser) {
            return res.status(409).send("Пользователь с таким email уже существует");
          }
          let encryptedPassword = await bcrypt.hash(password, 10);

          const user = await User.create({
            email: email.toLowerCase(), 
            password: encryptedPassword,
            first_name:first_name,
            last_name:last_name, 
            is_admin:false
          });
          
          const token =  jwt.sign(
            { user_id: user._id, email, isAdmin:user.is_admin },
            process.env.TOKEN_SECRET,
            {
              expiresIn: "2h",
            }
          );
          
          user.token = token;
          return res.status(201).cookie('accessToken',user.token, {httpOnly:true}).send(user.token);
        } catch (err) {
          console.log(err);
          return res.status(404).send(err);
        }
    }

    async  login(req, res)  {

        try {
          const { email, password } = req.body;
      
          if (!(email && password)) {
            res.status(400).send("All input is required");
          }
          const user = await User.findOne({where:{ email }});
          if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
              { id: user._id, email, isAdmin:user.isAdmin},
              process.env.TOKEN_SECRET,
              {
                expiresIn: "2h",
              }
            );
      
            user.token = token;
      
            return res.cookie('accessToken',user.token, {httpOnly:true}).status(200).json(user.token);
          }
          return res.status(400).send("Invalid Credentials");
        } catch (err) {
          console.log(err);
          return res.status(404).send(err);
        }
    }

    async logout(req,res){
      console.log(req)
      console.log(req.cookie)
      return res.clearCookie('accessToken').redirect('/')
    }
    
    async updateUser(req,res){

    }
    
    
}

let manager = new Manager()
module.exports = manager