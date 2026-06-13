import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.services.js";
import User from "../models/user.model.js";
import Interview from "../models/interview.model.js";
export const analyzeResume = async (req, res) => {

  try {

    console.log(req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file required",
      });
    }

    // MEMORY STORAGE BUFFER
    const fileBuffer = req.file.buffer;

    const uint8Array = new Uint8Array(fileBuffer);

    // READ PDF
    const pdf = await pdfjsLib
      .getDocument({ data: uint8Array })
      .promise;

    let resumeText = "";

    // EXTRACT TEXT
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {

      const page = await pdf.getPage(pageNum);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str)
        .join(" ");

      resumeText += pageText + "\n";
    }

    resumeText = resumeText
      .replace(/\s+/g, " ")
      .trim();

    console.log("RESUME TEXT EXTRACTED");

    // AI PROMPT
    const messages = [
      {
        role: "system",
        content: `
Extract data from resume.

Return ONLY valid JSON.

Format:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
`
      },
      {
        role: "user",
        content: resumeText
      }
    ];

    // AI CALL
    const aiResponse = await askAi(messages);

    console.log("AI RESPONSE:", aiResponse);

    let parsed;

    try {

      parsed = JSON.parse(aiResponse);

    } catch (err) {

      console.log("JSON PARSE ERROR");

      return res.status(500).json({
        message: "AI returned invalid JSON",
      });
    }

    return res.json({
      success: true,
      role: parsed.role || "",
      experience: parsed.experience || "",
      projects: parsed.projects || [],
      skills: parsed.skills || [],
      resumeText,
    });

  } catch (error) {

    console.log("CONTROLLER ERROR:", error);

    return res.status(500).json({message: error.message,});
  }
};

export const generateQuestion = async(req,res)=>{
   console.log("GENERATE QUESTION HIT");

  try{
   
    let {role,experience,mode,resumeText,projects,skills}=req.body
    console.log("BODY RECEIVED:", req.body);

    role = role?.trim();
    experience=experience?.trim();
    mode=mode?.trim()

    if(!role || !experience || !mode){
      return res.status(400).json({message:"Role , Experience and Mode are required"})
    }
    console.log("USER ID:", req.userId);
    const user =await User.findById(req.userId)
    console.log("USER FOUND:", user);


    if(!user){
      return res.status(404).json({message:"User not found."})
    }

    if (user.credits < 50){
      return res.status(400).json({message:"Insufficient credits.Minimum 50 credits required"})
    }
const projectText = Array.isArray(projects) && projects.length?projects.join(" ,"):"None";

const skillsText = Array.isArray(skills) && skills.length?skills.join(" ,"):"None";

const safeResume = resumeText?.trim() || "None";

const userPrompt=`
Role:${role}
Experience:${experience}
InterviewMode:${mode}
Projects:${projectText}
Skills:${skillsText}
Resume:${safeResume}`;

if (!userPrompt.trim()){
  return res.status(400).json({message:"Prompt content is empty."});
}

const messages=[
  {
  role: "system",
  content:`

  You are a real  human interviewer conducting professional interview.
  
  Speak in simple , natural English as if you are directly talking to the candidate.
   
  Generate exactly 6 interview questions.
  
  Strict Rules:
  
  - Each questions must contain between 15 and 30 words.
  - Each question must be a single complete senttence.
  - Do Not Number them.
  - Do NOT add explanations.
  - Do Not add extra text before or after.
  - One question per line only.
  - Keep language simple and conversational.
  - Questions must feel practical and realistic.



  Difficulty progression:
  Question 1 -> easy
  Question 2 -> easy
  Question 3 -> medium
  Question 4 -> medium
  Question 5 -> hard
  Question 6 -> hard

  Make questions based on canditate's role , experience , interviewMode , projects ,
   skills,  and resume details.`

  }
  ,
  {
    role:"user",
    content: userPrompt
  }
];

const aiResponse= await askAi(messages)

if(!aiResponse || !aiResponse.trim()){
  console.log("AI returned empty response")
  return res.status(500).json({message:"AI returned empty response."});

} 

const questionsArray = aiResponse
 .split("\n")
 .map(q => q.trim())
 .filter(q => q.length>0)
 .slice(0,6);

 if(questionsArray.length===0){
  console.log("AI failed to generate questions")
  return res.status(500).json({message:" AI failed to generate questions."});
 }

 user.credits -=50;
 await user.save();

 console.log({role,experience,mode});

 const interview = await Interview.create({
  userId: user._id,
  role,
  experience :experience,
  mode,
  resumeText:safeResume,
  questions:questionsArray.map((q,index)=>({
    question:q,
    difficulty: ["easy","easy","medium","medium","hard","hard"][index],
    timelimit:[90,90,120,120,150,150][index],
  }))
 })

res.json({
  interviewId:interview._id,
  creditsLeft:user.credits,
  userName: user.name,
  questions:interview.questions
});
}catch(error){
  console.log(error)

  
  return res.status(500).json({message:`failed to create interview  ${error}`})
  }
}
export const submitAnswer = async (req,res)=>{

  try{
    const {interviewId, questionIndex , answer , timeTaken} = req.body

    const interview = await Interview.findById(interviewId);

if (!interview) {
  return res.status(404).json({
    message: "Interview not found"
  });
}
    

    const question = interview.questions[questionIndex];
     if(!question){
 return res.status(400).json({
   message:"Invalid question index"
 });
}

   

    // If no answer

    if(!answer){
      question.score = 0;
      question.feedback = "You  did not submit an answer.";
      question.answer = "";
       
    await interview.save();
    
    return res.json({
      feedback : question.feedback
    });
    }
  // If time exceeded

    if (timeTaken > question.timelimit){
      question.score = 0;
      question.feedback = "Time limit.exceeded.Answer not evaluated.";
      question.answer = answer;
      
      await interview.save();
      
      return res.json({
      feedback : question.feedback
    });
  }
    const messages =[
      {
        role : "system",
        content:`
  You are a professional human interviewer evaluating a candidate's answer in a real interview.

  Evaluate naturally and fairly , like a real person would.

  Score the answer in these areas (0 to 10);

  1.Confidence Does the answer sound clear,confident, and well-presented?
  2.Communicate Is the language simple, clear, and easy to understand?
  3.Correctness Is the answer accurate, relevant, and complete?

  Rules:

  -Be realistic and unbiased.
  -Do not give random high scores.
  -If the answer is weak, score low.
  -If the answer is strong and detailed , score high.
  -Consider clarity,structure and relevance.

  Calculate:
  finalScore = average of confidence,communication, and correctness (rounded to nearest whole number).

  Feedback Rules:
   
  -Write natural human feedback.
  -10 to 20 words only.
  -Sound like real interview feedback.
  -Can sugggest improvement if needed.
  -Do NOT repeatthe questions.
  -Do NOT explain the scoring
   -Keep tone professional and honest.


   Return ONLY valid JSON in this format:
   {
   "confidence": number,
   "communication": number,
   "correctness": number,
   "finalscore": number,
   "feedback": "short human feedback" 
   
      }
          `
      
    
      },
      {

        role: "user",
        content:`
        Question: ${question.question}
        Answer : ${answer}
        `
      }

    ];

  console.log("QUESTION:", question.question);
  console.log("ANSWER:", answer);

    const aiResponse = await askAi(messages )

    console.log("RAW AI RESPONSE:");
    console.log("AI RESPONSE:", aiResponse);

    let parsed;

try{
   parsed = JSON.parse(aiResponse);
}
catch(err){
   console.log("Submit Answer Error");
   console.log(error);

   return res.status(500).json({
      message:"error.message"
   });
}

    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalscore;
    question.feedback = parsed.feedback;

    await interview.save();


    return res.status(200).json({feedback:parsed.feedback})
}catch(error){


  console.log("JSON PARSE ERROR");
   console.log(aiResponse);
  return res.status(500).json({message:"AI returned invalid JSON"});
  }
   

}


export const finishInterview = async (req,res)=>{
  try{ 
    const {interviewId} =req.body
    const interview = await  Interview.findById(interviewId)
    if(!interview){
      return res.status(404).json({
        message:"Interview not found"
      })
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore +=q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions
    ? totalScore / totalQuestions
    : 0;

    const avgConfidence = totalQuestions
    ? totalConfidence / totalQuestions
    : 0;

    const avgCommunication = totalQuestions
    ? totalCommunication / totalQuestions
    :0;

    const avgCorrectness = totalQuestions
    ? totalCorrectness / totalQuestions
    :0;

    interview.finalScore = finalScore;
    interview.status="Completed"

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication : Number(avgCommunication.toFixed(1)),
      correctness : Number(avgCorrectness.toFixed(1)),
      questionWiseScore : interview.questions.map((q)=>({
        question : q.question,
        score : q.score || 0,
        feedback : q.feedback || "",
        confidence : q.confidence || 0,
        communication :q.communication || 0,
        correctness : q.correctness || 0,
      })),

    })

}catch(error){

  return res.status(500).json({message:`failed to finish Interview ${error}`})
  }
}

export const getMyInterview = async(req,res) =>{
  try{

    const interview = await Interview.find({userId:req.userId})
    .sort({createdAt: -1})
    .select("role experience mode finalScore status createdAt");

    return res.status(200).json(interview)

  }catch(error){

    return res.status(500).json({message:`failed to find currentUser Interview ${error}`})

  }

}

export const getInterviewReport = async(req,res)=>{
  try{

    const interview =await Interview.findById(req.params.id)
    
    if(!interview){
      
      return res.status(404).json({message:"Interview Not Found"});

    }const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const avgConfidence = totalQuestions
    ? totalConfidence / totalQuestions
    : 0;

    const avgCommunication = totalQuestions
    ? totalCommunication / totalQuestions
    :0;

    const avgCorrectness = totalQuestions
    ? totalCorrectness / totalQuestions
    :0;


    return res.json({

      finalScore: interview.finalScore,
      confidence: Number(avgConfidence.toFixed(1)),
      communication : Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore:interview.questions

    });

}catch(error){

  return res.status(500).json({message:"Failed to find currentUser Interview report ${error}"})

  }
}

