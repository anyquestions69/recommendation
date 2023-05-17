const express = require('express')
require("dotenv").config();
const userRouter = require("./routers/userRouter.js");
const activityRouter = require("./routers/activityRouter.js");
const authRouter = require('./routers/auth.js')
const categoryRouter = require('./routers/categoryRouter.js')
const viewRouter = require('./routers/staticRouter.js')
const hbs = require('hbs')
var cookieParser = require('cookie-parser');
const jsonParser = express.json();
const api = express.Router()

const app = express()
console.log(process.env.TOKEN_SECRET)
app.set("view engine", "hbs");
app.set("views", __dirname+"/views/templates")
hbs.registerPartials(__dirname + "/views/templates/partials");
hbs.registerHelper("divideby", function(number) {
    if(number%3==0 && number!=0){
    return new hbs.SafeString('</div><div class="row">');
    }else{
        return new hbs.SafeString('');
    }
  });

app.use(cookieParser());
app.use(jsonParser)
app.use("/static",express.static(__dirname + "/views/static"))


api.use("/users", userRouter);
api.use("/activities", activityRouter);
api.use('/auth', authRouter)
api.use('/categories', categoryRouter)


app.use('/api', api)
app.use('/', viewRouter)

app.listen(3000,()=>{
    console.log('works')
})