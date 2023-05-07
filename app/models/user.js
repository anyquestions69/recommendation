const Sequelize = require("sequelize");
const sequelize = require('../config/database')
const bcrypt = require('bcrypt')
function getDate(currentdate) { return currentdate.getDay() + "/" + currentdate.getMonth() 
+ "/" + currentdate.getFullYear() + " " 
+ currentdate.getHours() + ":" 
+ currentdate.getMinutes() + ":" + currentdate.getSeconds()  }

const Role = sequelize.define("role",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    first_name:{
       type: Sequelize.STRING,
    },
    last_name:{
        type: Sequelize.STRING,
     },
     is_admin:{
        type:Sequelize.BOOLEAN,
        default:false
     }
  });

  const Activity = sequelize.define('activity',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
  })
  const Enrolment = sequelize.define("enrolment", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    date: {                   
      type: Sequelize.DATE,
      allowNull: false,
      default:Date.now()
    }
});
User.hasOne(Role, { onDelete: "cascade"})
User.belongsToMany(Activity, {through: Enrolment});
Activity.belongsToMany(User, {through: Enrolment});
sequelize.sync({force: false}).then(async function (result){
   
        let pass = await bcrypt.hash(process.env.ADMIN_PASS, 10)
        console.log(pass)
        const {admin, сreated} = await  User.findOrCreate({where:{email:process.env.ADMIN_EMAIL},
          defaults:{
                password:  pass,
                first_name:'admin',
                last_name:'adminov',
                is_admin:true
                
        }})
        return admin
    
})
.catch(err=> console.log(err));

module.exports = {User, Activity, Enrolment}