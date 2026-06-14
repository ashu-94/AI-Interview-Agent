import React, { useState } from 'react';
import axios from "axios";
import { ServerURL } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import {
  BsBriefcase,
  BsGear,
  BsRocket,
  BsLightning,
  BsCheckCircleFill,
  BsChevronDown,
  BsFileEarmarkText,
  BsUpload,
  BsPerson,
  BsChatDots,
  BsCodeSlash,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";

function Step1SetUp({ onStart }) {
  const { userData } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedInterviewType, setSelectedInterviewType] = useState("Technical Interview");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);

  const roles = [
    { value: "Frontend Developer", icon: "💻" },
    { value: "Backend Developer", icon: "⚙️" },
    { value: "Full Stack Developer", icon: "🚀" },
    { value: "Data Scientist", icon: "📊" },
    { value: "DevOps Engineer", icon: "🔧" },
    { value: "Product Manager", icon: "📱" },
  ];

  const experienceLevels = [
    { value: "Fresher", label: "Fresher (0-3 year)", color: "from-green-500 to-emerald-500" },
    { value: "1-2 Years", label: "Junior (4-7 years)", color: "from-blue-500 to-cyan-500" },
    { value: "3-5 Years", label: "Mid-Level (8-12 years)", color: "from-violet-500 to-purple-500" },
    { value: "5+ Years", label: "Senior (12+ years)", color: "from-orange-500 to-red-500" },
  ];

  const interviewTypes = [
    {
      value: "Technical Interview",
      icon: <BsCodeSlash size={20} />,
      color: "from-violet-500 to-purple-500",
      borderColor: "border-violet-400/30",
      bgColor: "bg-violet-500/10",
    },
    {
      value: "HR Interview",
      icon: <BsPerson size={20} />,
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-400/30",
      bgColor: "bg-blue-500/10",
    },
    {
      value: "Managerial Interview",
      icon: <BsChatDots size={20} />,
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-400/30",
      bgColor: "bg-purple-500/10",
    },
  ];

  // Simulate resume upload and analysis
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);

    }
  };

  const handleUploadResume = async () => {
    try {

      if (!uploadedFile) {
        alert("Please upload resume");
        return;
      }

      setIsAnalyzing(true);

      const formData = new FormData();

      formData.append("resume", uploadedFile);

      const response = await axios.post(
          `${ServerURL}/api/interview/resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },

          withCredentials: true,
        }
      );

      console.log(response.data);

      setResumeAnalysis(response.data);

      // AUTO FILL ROLE
      setSelectedRole(response.data.role || "");

      // AUTO FILL EXPERIENCE
      setSelectedExperience(response.data.experience || "");

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Resume analysis failed"
      );

    } finally {

      setIsAnalyzing(false);

    }
  };

  const handleStart = async () => {

    if (userData?.credits < 50) {

      alert(
        "❌ Insufficient Credits\n\nUnable to proceed with interview.\nMinimum 50 credits required."
      );

      return;
    }

    try {
      setLoading(true)

      const result = await axios.post( `${ServerURL}/api/interview/generate-questions`,
        {
          role: selectedRole,
          experience: selectedExperience,
          mode: selectedInterviewType,
          resumeText: resumeAnalysis?.resumeText || "",
          projects: resumeAnalysis?.projects || [],
          skills: resumeAnalysis?.skills || []
        },
        { withCredentials: true });

      console.log(result.data)
      if (userData) {
        dispatch(setUserData({ ...userData, credits: result.data.creditsLeft }))
      }
      onStart(result.data)

    } catch (error) {

      console.log(error);

      if (error?.response?.status === 403 ||
        error?.response?.data?.message?.includes("Insufficient")) {

        alert(
          "❌ Insufficient Credits\n\nUnable to proceed with interview.\nMinimum 50 credits required."
        );

        return;
      }

      alert(
        error?.response?.data?.message ||
        "Failed to start interview"
      );
    }
    finally {
      setLoading(false);

    }

  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-slate-950 via-indigo-950/90 to-slate-900 px-4 py-12 relative overflow-hidden"
    >
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        {/* Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-3 bg-gradient-to-r from-violet-500/10 to-blue-500/10 
            backdrop-blur-sm border border-violet-400/20 px-5 py-2.5 rounded-full 
            shadow-lg shadow-violet-500/5">
            <HiSparkles size={18} className="text-violet-400" />
            <span className="text-slate-200 font-medium text-sm tracking-wide">
              Customize Your Interview Experience
            </span>
          </div>
        </motion.div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl rounded-3xl 
          shadow-2xl border border-white/10 overflow-hidden">

          <div className="grid md:grid-cols-2">
            {/* Left Panel - Info */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="p-8 md:p-12 flex flex-col justify-center 
              bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent"
            >
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-3">
                  Start Your AI Interview
                </h2>
                <p className="text-slate-400">
                  Practice real interview scenarios powered by AI. Improve communication, technical skills, and confidence.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: <BsBriefcase className="text-violet-400" size={24} />,
                    title: "Choose Role & Experience",
                    desc: "Select your target role and experience level"
                  },
                  {
                    icon: <BsCodeSlash className="text-blue-400" size={24} />,
                    title: "Smart Voice Interview",
                    desc: "Engage in realistic AI-powered conversations"
                  },
                  {
                    icon: <BsLightning className="text-purple-400" size={24} />,
                    title: "Performance Analytics",
                    desc: "Get detailed feedback and improvement insights"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl 
                      bg-white/5 backdrop-blur-sm group-hover:bg-white/10 
                      transition-all duration-300 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-slate-400 text-sm">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Panel - Form */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="p-8 md:p-12 flex flex-col justify-center border-l border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                Interview Setup
              </h3>

              <div className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                    <BsBriefcase className="text-violet-400" />
                    Select Role
                  </label>
                  <div className="relative">
                    <select value={selectedRole} onChange={(e) => setSelectedRole
                      (e.target.value)} className="w-full bg-white/5 
                    backdrop-blur-sm border border-white/10
                 rounded-xl px-4 py-3 text-white outline-none focus:ring-2
                  focus:ring-violet-500/50 focus:border-violet-500/50 hover:bg-white/10 
                 transition-all duration-300">
                      <option value="" className="bg-slate-900">
                        Select Role
                      </option>
                      {roles.map((role, index) => (
                        <option
                          key={index}
                          value={role.value}
                          className="bg-slate-900 text-white">
                          {role.icon} {role.value}
                        </option>
                      ))}
                    </select>


                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                    <BsGear className="text-blue-400" />
                    Experience Level
                  </label>
                  <div className="relative">
                    <select
                      value={selectedExperience}
                      onChange={(e) => setSelectedExperience(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10
  rounded-xl px-4 py-3 text-white outline-none
  focus:ring-2 focus:ring-violet-500/50
  focus:border-violet-500/50 hover:bg-white/10
  transition-all duration-300"
                    >
                      <option value="" className="bg-slate-900">
                        Select Experience
                      </option>

                      {experienceLevels.map((exp, index) => (
                        <option
                          key={index}
                          value={exp.value}
                          className="bg-slate-900 text-white"
                        >
                          {exp.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Interview Type Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                    <BsFileEarmarkText className="text-purple-400" />
                    Interview Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {interviewTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        onClick={() => setSelectedInterviewType(type.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative p-3 rounded-xl border transition-all duration-300
                          flex flex-col items-center justify-center gap-2
                          ${selectedInterviewType === type.value
                            ? `bg-gradient-to-br ${type.color} border-white/20 shadow-lg`
                            : `${type.bgColor} ${type.borderColor} hover:bg-white/10`
                          }`}
                      >
                        <div className={selectedInterviewType === type.value ? 'text-white' : 'text-slate-400'}>
                          {type.icon}
                        </div>
                        <span className={`text-xs font-medium text-center leading-tight
                          ${selectedInterviewType === type.value ? 'text-white' : 'text-slate-300'}`}>
                          {type.value.replace(' Interview', '')}
                        </span>
                        {selectedInterviewType === type.value && (
                          <div className="absolute top-1 right-1">
                            <BsCheckCircleFill className="text-white" size={14} />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                    <BsUpload className="text-green-400" />
                    Upload Resume (Optional)
                  </label>

                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <label
                    htmlFor="resume-upload"
                    className="block w-full bg-white/5 backdrop-blur-sm border-2 border-dashed 
                    border-white/20 rounded-xl p-6 text-center cursor-pointer
                    hover:bg-white/10 hover:border-violet-400/40 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <BsUpload className="text-violet-400" size={32} />
                      <p className="text-slate-300 text-sm">
                        {uploadedFile ? uploadedFile.name : "Click to upload resume"}
                      </p>
                      <p className="text-slate-500 text-xs">
                        PDF, DOC, or DOCX
                      </p>
                    </div>
                  </label>
                </div>

                {/* Analyze Resume Button */}

                <button
                  onClick={handleUploadResume}
                  disabled={isAnalyzing}
                  className="w-full py-3 rounded-xl bg-blue-500 
  hover:bg-blue-600 transition-all duration-300 
  text-white font-semibold"
                >
                  {isAnalyzing ? "Analyzing Resume..." : "Analyze Resume"}
                </button>

                {/* Analyzing State */}
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 
                      backdrop-blur-sm border border-violet-400/20 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent 
                          rounded-full animate-spin"></div>
                        <span className="text-violet-300 font-medium">
                          Analyzing resume...
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Resume Analysis Result */}
                <AnimatePresence>
                  {resumeAnalysis && (
                    <div className="mt-6 p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10">

                      <h3 className="text-xl font-bold text-white mb-4">
                        Resume Analysis Result
                      </h3>

                      {/* PROJECTS */}

                      <div className="mb-4">

                        <h4 className="text-white font-semibold mb-2">
                          Projects:
                        </h4>

                        <ul className="list-disc list-inside text-gray-300">

                          {resumeAnalysis?.projects?.map((project, index) => (
                            <li key={index}>
                              {project}
                            </li>
                          ))}

                        </ul>

                      </div>

                      {/* SKILLS */}

                      <div>

                        <h4 className="text-white font-semibold mb-2">
                          Skills:
                        </h4>

                        <div className="flex flex-wrap gap-2">

                          {resumeAnalysis?.skills?.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm"
                            >
                              {skill}
                            </span>
                          ))}

                        </div>

                      </div>

                    </div>

                  )}
                </AnimatePresence>

                {/* Start Button */}
                <motion.button
                  onClick={handleStart}
                  disabled={!selectedRole || !selectedExperience || loading || userData?.credits < 50}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full mt-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 
                    rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative flex items-center justify-center gap-2 
                    bg-gradient-to-r from-violet-600 to-indigo-600 
                    text-white py-4 rounded-xl font-semibold 
                    shadow-xl shadow-violet-500/20 transition-all duration-300">
                    <BsRocket className="group-hover:translate-x-1 transition-transform" />


                    {userData?.credits < 50 ? "Insufficient Credits" : loading ? "Starting..." : "Start Interview"}
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-slate-400 text-sm">
            Your interview will be saved to history • Average duration: 15-20 minutes
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Step1SetUp;
