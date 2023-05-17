const Sequelize = require("sequelize");
const sequelize = require('../config/database')
const bcrypt = require('bcrypt')
function getDate(currentdate) { return currentdate.getDay() + "/" + currentdate.getMonth() 
+ "/" + currentdate.getFullYear() + " " 
+ currentdate.getHours() + ":" 
+ currentdate.getMinutes() + ":" + currentdate.getSeconds()  }

const Visitor = sequelize.define('visitor',{
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    ip:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

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
      desc: {
        type:Sequelize.TEXT,
        allowNull:true
      }
  })
  const Category = sequelize.define('category',{
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
      img: {
        type:Sequelize.STRING,
        allowNull:true
      }
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

const Group = sequelize.define('group',{
  id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
  }
})
User.hasOne(Role, { onDelete: "cascade"})
User.hasOne(Visitor, {onDelete:"cascade"})
Visitor.hasOne(User, {onDelete:"cascade"})
User.belongsToMany(Activity, {through: Enrolment});
Activity.belongsToMany(User, {through: Enrolment});
Activity.hasMany(Group, {onDelete:"cascade"})
Category.hasOne(Activity)
Group.hasMany(User, {onDelete:"cascade"})
User.hasMany(Group, {onDelete:"cascade"})
sequelize.sync({force: false}).then(async function (result){
   
        let pass =  bcrypt.hashSync(process.env.ADMIN_PASS, 10)
        console.log(pass)
        const [admin, сreated] = await  User.findOrCreate({where:{email:process.env.ADMIN_EMAIL},
          defaults:{
                password:  pass,
                first_name:'admin',
                last_name:'adminov',
                is_admin:true
                
        }})
        return admin
    
})
.catch(err=> console.log(err));

module.exports = {User, Activity, Enrolment, Visitor, Group, Category}