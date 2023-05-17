const jwt = require('jsonwebtoken');
const {User} = require('../models/user')
const config = process.env;

class Auth{
    async authorized(req, res, next) {

    const token = req.cookies.accessToken

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, config.TOKEN_SECRET, async (err, user) => {
       
        if (err) return res.sendStatus(403)
        const usr = await User.findOne({where:{ email:user.email }})
        if (!usr) return res.sendStatus(403)
        req.user = usr

        next()
    })
    }
    async onlyAdmin(req,res,next){
        if(!req.user.is_admin)return res.status(403).send("Вы не являетесь администратором")
        next()
    }
    async onlyOwner(req,res,next){
        if(req.user.id!=req.params['id'])return res.status(403).send("Вы не можете изменять чужой аккаунт")
    }
    async getUser(req, res,next){
        const token = req.cookies.accessToken

    if (token == null)req.logged=false

    jwt.verify(token, config.TOKEN_SECRET, async (err, user) => {
       
        if (err)  {
            req.logged=false
            return next()
        }
        const usr = await User.findOne({where:{ email:user.email }})
        if (!usr) req.logged=false
        req.user=usr
        next()
    })
    }

}
module.exports = new Auth()