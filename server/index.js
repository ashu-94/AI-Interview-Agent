import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/connectDB.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import interviewRouter from "./routes/interview.routes.js";
import paymentRouter from "./routes/payment.routes.js"

const app = express() 
console.log("CLIENT_URL =", process.env.CLIENT_URL)
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Interview Agent API Running"
  });
});

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user",userRouter)
app.use("/api/interview",interviewRouter)
app.use("/api/payment", paymentRouter)

const PORT = process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})
