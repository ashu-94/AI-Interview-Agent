import express from 'express'
import { googleAuth,register } from "../controllers/auth.controller.js" 
import {login,logout} from "../controllers/auth.controller.js"


const authRouter = express.Router()

authRouter.post("/google", googleAuth)
authRouter.get("/logout", logout)
authRouter.post("/register", register)
authRouter.post("/login", login)


export default authRouter