import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

function protectionLayer(req, res, next){
    const token = req.headers['authorization']

    if(!token){
        return res.status(404).json({message:'no token found'})
    }

    jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
        if(err){
            return res.status(404).json({message:'invalid token'})
        }

        req.userId = decoded.id;
        next()
    })
}

export default protectionLayer