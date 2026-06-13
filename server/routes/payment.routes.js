import { create } from "axios"
import express from "express"
//import payments from "razorpay/dist/types/payments"*
import { createOrder, verifyPayment } from "../controllers/payment.controller.js"
import isAuth from "../middlewares/isAuth.js"



const paymentRouter = express.Router()

paymentRouter.post("/order" ,isAuth, createOrder)
paymentRouter.post("/verify" ,isAuth , verifyPayment)




export default paymentRouter