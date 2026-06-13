import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import { analyzeResume , generateQuestion , finishInterview , submitAnswer, getMyInterview, getInterviewReport } from '../controllers/interview.controller.js'
import { upload } from "../middlewares/multer.js"

const interviewRouter = express.Router();

 interviewRouter.post("/resume",upload.single("resume"),analyzeResume)
 interviewRouter.post( "/generate-questions",(req,res,next)=>{
   console.log("ROUTE REACHED");
   next();
 },isAuth,generateQuestion)
 interviewRouter.post("/submitAnswer",isAuth,submitAnswer)
 interviewRouter.post("/finish",isAuth,finishInterview)
 interviewRouter.get("/test", (req,res)=>{
   res.json({message:"Interview Route Working"});
 });
interviewRouter.post("/generate-test",(req,res)=>{
  res.json({message:"POST ROUTE WORKING"});
});

interviewRouter.get("/get-interview",isAuth,getMyInterview)
interviewRouter.get("/report/:id",isAuth,getInterviewReport);


 

export default  interviewRouter;