const jwt = require('jsonwebtoken')

const auth = function(req, res, next){
    try{
        let token = req.headers["x-api-key"]
        if(!token){
            return res.status(401).send({ status: false, message: "Please provide token"})
        }

        jwt.verify(token, "CACA", (err, decodedToken) => {
            if(err && err.message == 'jwt expired') return res.status(401).send({ status: false, message: "Session Expired! Please login again." })
            if(err) return res.status(401).send({ status: false, message: "Incorrect Token" })

            req.token = decodedToken
            next()
        })
    } catch(err){
        return res.status(500).send({ status: false, message: err.message})
    }
}

module.exports = {auth}