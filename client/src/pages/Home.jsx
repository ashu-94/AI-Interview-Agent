import React from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
  BsArrowRight,
} from "react-icons/bs";

import { HiSparkles } from "react-icons/hi";
import Auth from "./Auth";
import AuthModel from "../components/AuthModel";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import evalImg from "../assets/videos/ai-question-answers.png";
import agentImg from "../assets/videos/ai interview.png";
import hrImg from "../assets/videos/hr.png";
import techImg from "../assets/videos/technology.png";
import confidence from "../assets/videos/confidence.png";
import creditImg from "../assets/videos/credit.png";
import resumeImg from "../assets/videos/resume skills.png";
import pdfImg from "../assets/videos/pdf.jpg";
import history from "../assets/videos/history ai.png";


function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuthModel, setShowAuthModel] = React.useState(false);
  const navigate = useNavigate();

  return (
    <div className="app-container min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/90 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Badge */}
        <div className="flex justify-center mt-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 bg-gradient-to-r from-violet-500/10 to-blue-500/10 
            backdrop-blur-sm border border-violet-400/20 px-5 py-2.5 rounded-full 
            shadow-lg shadow-violet-500/5"
          >
            <HiSparkles size={18} className="text-violet-400" />
            <span className="text-slate-200 font-medium text-sm tracking-wide">
              Experience the Future of Interviewing
            </span>
          </motion.div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-20 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.15] max-w-6xl mx-auto"
          >
            Revolutionize Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
              Interview
            </span>
            <br />
            <span className="text-4xl md:text-5xl lg:text-6xl font-normal text-slate-300">
              with{" "}
            </span>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center whitespace-nowrap bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500
                         text-white px-8 py-3 rounded-2xl font-bold 
                         shadow-2xl shadow-violet-500/30 relative"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 rounded-2xl blur-xl opacity-50"></span>
              <span className="relative">AI-Agents</span>
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-slate-400 mt-8 max-w-3xl mx-auto leading-relaxed
            font-normal tracking-wide"
          >
            Master your interview skills with AI-powered mock interviews that
            simulate real scenarios, deliver personalized feedback, and provide
            detailed performance analytics.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-4 mt-12"
          >
            <motion.button
              onClick={() => {
                if (!userData) {
                  setShowAuthModel(true);
                  return;
                }
                navigate("/interview");
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div
                className="relative flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 
              font-semibold px-8 py-4 rounded-full text-white
              shadow-xl shadow-violet-500/20 transition-all duration-300 animate-bounce"
              >
                Start Interview
                <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>

            <motion.button
              onClick={() => {
                if (!userData) {
                  setShowAuthModel(true);
                  return;
                }
                navigate("/history");
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="flex items-center gap-2 bg-white/5 backdrop-blur-md border
               border-white/10 font-semibold px-8 py-4 rounded-full text-slate-200
              hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                View History
              </div>
            </motion.button>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 mb-32 px-4 max-w-7xl mx-auto">
          {[
            {
              icon: <BsRobot size={28} />,
              gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
              borderColor: "border-violet-400/20",
              iconColor: "text-violet-400",
              glowColor: "shadow-violet-500/10",
              title: "Role & Experience Selection",
              desc: "Choose your desired interview role and experience level to tailor the AI agent's behavior and questions.",
            },
            {
              icon: <BsMic size={28} />,
              gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
              borderColor: "border-blue-400/20",
              iconColor: "text-blue-400",
              glowColor: "shadow-blue-500/10",
              title: "Smart Voice Interaction",
              desc: "Engage in realistic interview scenarios with AI-powered voice interaction and natural conversation flow.",
            },
            {
              icon: <BsClock size={28} />,
              gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
              borderColor: "border-purple-400/20",
              iconColor: "text-purple-400",
              glowColor: "shadow-purple-500/10",
              title: "Real-Time Analysis",
              desc: "Receive instant feedback and comprehensive performance analysis throughout your interview session.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`
                group relative backdrop-blur-md rounded-2xl p-8
                transition-all duration-500 border
                flex-1 md:max-w-sm text-left flex flex-col
                bg-gradient-to-br ${item.gradient}
                ${item.borderColor}
                shadow-xl ${item.glowColor}
                hover:shadow-2xl hover:${item.glowColor}
                hover:border-opacity-40
              `}
            >
              {/* Icon */}
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-xl 
                bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm
                ${item.iconColor} mb-6
                group-hover:scale-110 transition-transform duration-300`}
              >
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3 text-white">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 leading-relaxed text-sm">
                {item.desc}
              </p>

              {/* Decorative element */}
              <div
                className="absolute top-0 right-0 w-32 h-32
                 bg-gradient-to-br from-white/5 to-transparent 
                rounded-full blur-2xl opacity-0
                 group-hover:opacity-100 transition-opacity duration-500"
              ></div>
            </motion.div>
          ))}
        </div>

        {/* Video Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Advanced AI{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
              Capabilities
            </span>
          </h2>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Realistic AI-powered interview agents with natural conversation and
            professional demeanor
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 px-4 max-w-7xl mx-auto mb-24">
          {[
            {
              image: evalImg,
              icon: <BsBarChart size={20} />,
              title: "AI Answer Evaluation",
              desc: "Scores communication, technical accuracy and confidence.",
            },
            {
              image: resumeImg,
              icon: <BsFileEarmarkText size={20} />,
              title: "Resume Based Interview",
              desc: "Project specific questions based on uploaded resume.",
            },
            {
              image: pdfImg,
              icon: <BsFileEarmarkText size={22} />,
              title: "Downloadable PDF Report",
              desc: "Detailed strengths, weaknesses and improvement insights.",
            },
            {
              image: history,
              icon: <BsBarChart size={22} />,
              title: "History and Analytics",
              desc: "Track your progress with performance graphs and topic analysis.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="
        group relative overflow-hidden rounded-3xl
        border border-slate-200/80
        bg-gradient-to-br from-white/90 via-slate-50/90 to-slate-100/90
        backdrop-blur-sm
        shadow-xl shadow-slate-900/5
        transition-all duration-500
        hover:shadow-2xl hover:-translate-y-1
        h-full
        p-8
      "
            >
              {/* Glow */}
              <div className="absolute top-0 right-0 w-40 h-40
       bg-sky-200/30 blur-3xl rounded-full"></div>

              {/* Main Content */}
              <div className="relative z-10 flex items-center gap-8">

                {/* Image */}
                <div className="w-[48%] flex justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="
              w-full
              max-w-[360px]
              h-[240px]
              object-contain
              transition-transform duration-300
              group-hover:scale-105
            "
                  />
                </div>

                {/* Text */}
                <div className="w-[52%]">
                  <div
                    className="
              bg-emerald-100 text-emerald-600
              w-12 h-12 rounded-xl
              flex items-center justify-center
              mb-5 border border-emerald-200
            "
                  >
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed text-base">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Second Feature Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Smart AI{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
              Features
            </span>
          </h2>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Explore advanced AI interview capabilities with elegant analytics and
            personalized reporting.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 px-4 max-w-6xl mx-auto mb-24">

          {[
            {
              image: agentImg,
              icon: <BsRobot size={18} />,
              title: "AI HR Assistant",
              desc: "Conducts realistic HR rounds with adaptive AI questioning.",
            },
            {
              image: techImg,
              icon: <BsBarChart size={18} />,
              title: "Technical Mode",
              desc: "Practice coding and technical problem-solving interviews.",
            },
            {
              image: confidence,
              icon: <BsMic size={18} />,
              title: "Confidence Analysis",
              desc: "Analyze speaking confidence and communication quality.",
            },
            {
              image: creditImg,
              icon: <BsFileEarmarkText size={18} />,
              title: "Performance Credits",
              desc: "Track interview scores and unlock performance milestones.",
            },
          ].map((item, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ y: -4 }}
              className="
        group relative overflow-hidden rounded-3xl
        border border-slate-200/70
        bg-gradient-to-br from-white/95 via-slate-50/95 to-slate-100/95
        backdrop-blur-sm
        shadow-lg shadow-slate-900/5
        transition-all duration-500
        hover:shadow-2xl
        p-6
      "
            >

              {/* Soft Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/20 blur-3xl rounded-full"></div>

              {/* Main Content */}
              <div className="relative z-10 flex items-center gap-5">

                {/* Image */}
                <div className="w-[38%] flex justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="
              w-full
              max-w-[220px]
              h-[140px]
              object-contain
              transition-transform duration-300
              group-hover:scale-105
            "
                  />
                </div>

                {/* Content */}
                <div className="w-[62%]">

                  {/* Icon */}
                  <div
                    className="
              bg-emerald-100 text-emerald-600
              w-11 h-11 rounded-xl
              flex items-center justify-center
              mb-4 border border-emerald-200
            "
                  >
                    {item.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {item.desc}
                  </p>

                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {showAuthModel && (
          <AuthModel onClose={() => setShowAuthModel(false)} />
        )}


      </div>
      <Footer />
    </div>
  );
}

export default Home;