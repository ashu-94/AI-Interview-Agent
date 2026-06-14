import jwt from 'jsonwebtoken'

const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: "User does not have a token" })
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)

        if (!verifyToken) {
            return res.status(401).json({ message: "Invalid token" })
        }
        req.userId = verifyToken.userId


        next()

    } catch (error) {
        res.status(500).json({ error: `isAuth Error occurred while verifying  token ${error}` })
    }
}
export default isAuth;