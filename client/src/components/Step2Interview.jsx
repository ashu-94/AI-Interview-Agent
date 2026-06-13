import React, { useState, useRef, useEffect } from 'react'
import maleVideo from "../assets/videos/male-ai.mp4"
import Timer from './Timer';
import femaleVideo from "../assets/videos/female-ai.mp4"
import { motion, AnimatePresence } from "framer-motion"
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa"
import axios from "axios"
import { BsArrowRight } from 'react-icons/bs';

function Step2Interview({ interviewData, onFinish }) {

  const { interviewId, questions = [], userName } = interviewData || {};

  const [isIntroPhase, setIsIntroPhase]   = useState(true);
  const [isMicOn, setIsMicOn]             = useState(true);
  const recognitionRef                    = useRef(null);
  const [isAISpeaking, setIsAISpeaking]   = useState(true);
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [answer, setAnswer]               = useState("");
  const [feedback, setFeedback]           = useState("");
  const [timeleft, setTimeLeft]           = useState(questions?.[0]?.timelimit || 90);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [voiceGender, setVoiceGender]     = useState("female");
  const [subtitle, setSubtitle]           = useState("");
  const [showQuestion, setShowQuestion]   = useState(false);

  const videoRef        = useRef(null);
  const isMicOnRef      = useRef(isMicOn);       // ✅ ref so callbacks always see latest value
  const isAISpeakingRef = useRef(isAISpeaking); // ✅ ref so startMic guard works correctly
  const introCompletedRef = useRef(false);
  const isSubmittingRef = useRef(false);

  // keep refs in sync
  useEffect(() => { 
    isMicOnRef.current = isMicOn; 
  },        
   [isMicOn]);

  useEffect(() => {
     isAISpeakingRef.current = isAISpeaking; 
    },[isAISpeaking]);


    useEffect(() => {
  isSubmittingRef.current = isSubmitting;
}, [isSubmitting]);


  const currentQuestion = questions?.[currentIndex];
  useEffect(() => {

    if (!currentQuestion) return;

  setTimeLeft(currentQuestion.timelimit || 90);

}, [currentIndex]);

  if (!questions || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading interview questions...
      </div>
    );
  }

  // ── Voice loading ──────────────────────────────────────────────
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice = voices.find((v) =>
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("female")
      );
      if (femaleVoice) { setSelectedVoice(femaleVoice); setVoiceGender("female"); return; }

      const maleVoice = voices.find((v) =>
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("henry") ||
        v.name.toLowerCase().includes("male")
      );
      if (maleVoice) { setSelectedVoice(maleVoice); setVoiceGender("male"); return; }

      setSelectedVoice(voices[0]);
      setVoiceGender(voices[0].name.toLowerCase().includes("female") ? "female" : "male");
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined)
      window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSrc = voiceGender === "female" ? femaleVideo : maleVideo;

  // ── Mic helpers ────────────────────────────────────────────────
   const startMic = () => {

  console.log("AI SPEAKING:", isAISpeakingRef.current);
  console.log("MIC REF:", recognitionRef.current);

  if (recognitionRef.current && !isAISpeakingRef.current) {

    console.log("STARTING MICROPHONE...");

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.log("MIC START ERROR:", error);
    }
  } else {

    console.log("MIC BLOCKED");
  }
};
  const stopMic = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
  };

  //toogle Mic
  const toggleMic = () => {
    if (isMicOnRef.current) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(prev => !prev);
  };

  // ── speakText ──────────────────────────────────────────────────
  const speakText = (text) => new Promise((resolve) => {
    if (!window.speechSynthesis || !selectedVoice) { resolve(); return; }

    window.speechSynthesis.cancel();

    const humanText = text.replace(/,/g, ", ...").replace(/\./g, ". ...");
    const utterance = new SpeechSynthesisUtterance(humanText);
    utterance.voice  = selectedVoice;
    utterance.rate   = 0.92;
    utterance.pitch  = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsAISpeaking(true);
      isAISpeakingRef.current = true;
      stopMic();
      videoRef.current?.play();
    };

    utterance.onend = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsAISpeaking(false);
      isAISpeakingRef.current = false;

      // ✅ restart mic after AI finishes speaking (if mic is on)
      setTimeout(() => {
        if (isMicOnRef.current) startMic();
      }, 300);

      setTimeout(() => { setSubtitle(""); resolve(); }, 300);
    };

    setSubtitle(text);
    window.speechSynthesis.speak(utterance);
  });

  // ── Interview flow ─────────────────────────────────────────────
  useEffect(() => {
    console.log(
  "INTERVIEW EFFECT",
  "isIntroPhase=", isIntroPhase,
  "currentIndex=", currentIndex
);
    if (!selectedVoice) return;


    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hello ${userName}, How are you? Welcome to your AI smart interview. It's great to meet you today. I hope you are feeling confident and ready to showcase your skills.`
        );
        setShowQuestion(true);
        await speakText(
          `You will be asked a series of ${questions.length} questions. You can answer by typing or using the microphone. Let's start with the first question. ${currentQuestion.question}`
        );

        introCompletedRef.current = true;
        setIsIntroPhase(false);

        return;

      } else if (currentQuestion && currentIndex > 0) {
        setShowQuestion(true);
        await speakText(`Next question.`);
        setShowQuestion(true);
        await speakText(`${currentQuestion.question}`);
      }

      // ✅ FIX: was length-2 (second-last), should be length-1 (last question)
      if (currentIndex === questions.length - 1) {
        await speakText("This is the final question. Give it your best.");
      }
    };

    runIntro();

  // ✅ FIX: removed currentQuestion/questions/userName from deps to prevent infinite re-runs
  }, [selectedVoice, isIntroPhase, currentIndex]);

  // ── Countdown timer ────────────────────────────────────────────
  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (isSubmitting) return;
    if(isAISpeaking)return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1){
           clearInterval(timer); 
           return 0;
           }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // ✅ FIX: was inside setInterval callback before

  }, [isIntroPhase, currentIndex, isSubmitting,isAISpeaking]);

  // ── Speech recognition setup ───────────────────────────────────
  useEffect(() => {
    
   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if(!SpeechRecognition){
   alert("Speech Recognition Not Supported");
   return;
}

const recognition = new SpeechRecognition();
recognition.onstart = () => {
  console.log("MIC STARTED");
};

recognition.onend = () => {
  console.log("MIC ENDED");
};

recognition.onerror = (event) => {
  console.log("MIC ERROR:", event.error);

   if (
      event.error === "network" ||
      event.error === "not-allowed"
  ){
      setIsMicOn(false);

      try{
        recognition.stop();
      }catch{}
  }
};
    recognition.lang  = "en-US";
    recognition.continuous = true;
    recognition.interimResults= false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };

    // auto-restart recognition if it stops unexpectedly while mic should be on
    recognition.onend = () => {

  console.log("MIC ENDED");

  if (isMicOnRef.current && 
    !isAISpeakingRef.current &&
      !isSubmittingRef.current)
       {

    console.log("RESTARTING MIC");

    try {
      recognition.start();
    } catch(error){
      console.log("MIC RESTART ERROR", error);
    }
  }
};

    recognitionRef.current = recognition;
  }, []);

  // ── Auto-submit when timer reaches 0 ───────────────────────────
  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    // ✅ FIX: was calling handleSubmit() which doesn't exist
    if (timeleft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeleft]);

  // ── Cleanup on unmount ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
        // ✅ FIX: removed .abort() — doesn't exist on webkitSpeechRecognition
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // ── Submit answer ──────────────────────────────────────────────
  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(
        "http://localhost:8000/api/interview/submitAnswer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          // ✅ FIX: was timeLeft (wrong case) — variable is timeleft
          timeTaken: currentQuestion.timelimit - timeleft,
        },
        { withCredentials: true }
      );

      // ✅ FIX: was setAnswer(result.data.feedback) — should store in feedback state
      setFeedback(result.data.feedback);
      await speakText(result.data.feedback);
      setIsSubmitting(false);

    } catch (error) {
      // ✅ show "You did not submit an answer." as feedback on error (matches screenshot)
      setFeedback(error.response?.data?.message || "You did not submit an answer.");
      setIsSubmitting(false);
    }
  };

  // ── Next question ──────────────────────────────────────────────
  const handleNext = async () => {

    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    //const nextQuestion = questions[currentIndex + 1];

    setCurrentIndex(currentIndex + 1);
    
  };

  // ── Finish interview ───────────────────────────────────────────
  // ✅ FIX: was "finishInetview" typo in previous versions
  const finishInterview = async () => {
     console.log("FINISH BUTTON CLICKED");
    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(
        "http://localhost:8000/api/interview/finish",
        { interviewId },
        { withCredentials: true }
      );
      console.log("FINISH API SUCCESS");
    console.log(result.data);

    onFinish(result.data);

    } catch (error) {
     console.log("FINISH API ERROR");

    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
    } else {
      console.log(error);
    }
    }
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-mist-900 px-4 flex items-center justify-center  sm:p-6">

      <div className="w-full max-w-7xl h-[85vh] bg-mist-700 rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden">

        {/* ── Left Panel ── */}
        <div className="w-full lg:w-[26%] bg-mist-700 flex flex-col items-center p-6 border-r border-green-300 h-full overflow-y-auto">

          {/* Video */}
          <div className="w-full h-[220px] flex-shrink-0 rounded-2xl overflow-hidden shadow-xl mb-4">
            <video
              src={videoSrc} key={videoSrc} ref={videoRef}
              muted playsInline autoPlay preload="auto"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Subtitle */}
          <div className="w-full min-h-[72px] mb-4">
            <AnimatePresence>
              {subtitle && (
                <motion.div
                  key={subtitle}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-sm"
                >
                  <p className="text-gray-700 text-xs sm:text-sm font-medium text-center leading-relaxed">
                    {subtitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status + Timer */}
          <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-md p-5 space-y-4">

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm font-semibold">Interview Status</span>
              {isAISpeaking && (
                <span className="text-sm font-semibold text-green-500">AI Speaking</span>
              )}
            </div>

            <div className="h-px bg-gray-200" />

            <div className="flex justify-center">
              {/* ✅ FIX: was currentQuestion?.timeLeft (wrong key) */}
              {!feedback &&(
              <Timer timeLeft={timeleft}
               totalTime={currentQuestion?.timelimit || 90} />
              )}
            </div>

            <div className="h-px bg-gray-200" />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-emerald-600">{currentIndex + 1}</span>
                <span className="text-xs text-gray-400">Current Question</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-emerald-600">{questions.length}</span>
                <span className="text-xs text-gray-400">Total Questions</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative">

          <h2 className="text-2xl sm:text-2xl font-bold text-black mb-6">
            AI Smart Interview
          </h2>

          {/* Question — step-by-step reveal */}
          <div className="relative mb-6 min-h-[100px]">
            <AnimatePresence mode="wait">
              {showQuestion ? (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-gray-100 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm"
                >
                  <p className="text-sm text-gray-500 mb-2">
                    Question {currentIndex + 1} of {questions.length}:
                  </p>
                  <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
                    {currentQuestion?.question || "No question available"}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-gray-50 p-4 sm:p-6 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center"
                >
                  <p className="text-gray-400 text-sm italic">
                    Please listen to the AI interviewer...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Answer textarea */}
          <textarea
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={!showQuestion || !!feedback}
            className="w-full h-48 p-4 border text-white  border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
          />

          {/* ✅ FIX: condition was inverted in original — !feedback shows action bar, feedback shows feedback panel */}
          {!feedback ? (
            <div className="flex items-center gap-4 mt-6">

              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={toggleMic}
                disabled={!showQuestion}
                className="px-4 py-3 bg-gray-900 text-white rounded-full shadow-md hover:bg-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={submitAnswer}
                disabled={isSubmitting || !showQuestion}
                className="flex-1 py-3 bg-emerald-500 text-white rounded-xl shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </motion.button>

            </div>

          ) : (

            // ── Feedback panel (matches screenshots) ──
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-emerald-50 border border-emerald-300 p-5 rounded-2xl shadow-sm"
            >
              <p className="text-emerald-700 font-medium mb-4">{feedback}</p>

              {/* ✅ FIX: button JSX was completely broken — className was outside the tag as text */}
              <button
                onClick={currentIndex === questions.length - 1 ? finishInterview : handleNext}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-2 font-semibold"
              >
                {currentIndex === questions.length - 1 ? "Finish Interview" : "Next Question"}
                {currentIndex !== questions.length - 1 && <BsArrowRight size={18} />}
              </button>

            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Step2Interview;
