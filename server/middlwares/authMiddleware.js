const jwt = require("jsonwebtoken");
module.exports = (req, res, next)=>{
    try{

        //get token from header
        const token = req.header("authorization").split(" ")[1];
        const decryptedToken = jwt.verify(token, "sheymp");
        req.body.userId = decryptedToken.userId;
        next();
    } catch(error){
        res.send({
            success:false,
            message:error.mmessage
        })
    }
}