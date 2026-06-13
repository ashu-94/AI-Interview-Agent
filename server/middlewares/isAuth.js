import jwt from 'jsonwebtoken'

const isAuth = async (req, res, next) => {
    try{
        let {token} = req.cookies
        if(!token){
            return res.status(401).json({ message: "User does not have a token" })
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        
        if(!verifyToken){
            return res.status(401).json({ message: "Invalid token" })
        }
        req.userId = verifyToken.userId
        console.log("VERIFY TOKEN:", verifyToken)
       console.log("SET USER ID:", req.userId)

        next()

    }catch(error){
        res.status(500).json({ error: `isAuth Error occurred while verifying  token ${error}`})
    }
}
export default isAuth;