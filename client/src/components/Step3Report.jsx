import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function Step3Report({ report }) {

  if (!report) {
    return (
      <div className='min-h-screen flex items-center justify-center'>

        <p className='text-gray-700 text-lg '>Loading Report...</p>
      </div>
    );
  }
  const navigate = useNavigate()
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;


  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0
  }))

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },


  ];
  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities..";
    shortTagline = "Excellent clarity and structured responses.";
  }
  else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.",
      shortTagline = "Good foundation , refine articulation.";
  }
  else {
    performanceText = "Significant improvement required.",
      shortTagline = "Work on clarity and confidence.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let currentY = 25;

    //=========Title===========
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 5;

    //underline
    doc.setDrawColor(34, 197, 94);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    currentY += 15;

    //==============Final Score Box======================

    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");


    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Final Score: ${finalScore}/10`,
      pageWidth / 2,
      currentY + 12,
      { align: "center" }
    );


    currentY += 30;

    //=======SKILLS BOX======

    doc.setFillColor(249, 250, 251)
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");

    doc.setFontSize(12);
    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

    currentY += 45;

    //=======ADVICE=========

    let advice = ""

    if (finalScore >= 8) {

      advice =
        "Excellent performance. Maintain confidence and structure.Continue refining clarity and supporting answers with strong real-world examples.";
    }

    else if (finalScore >= 5) {
      advice =
        "Good foundation shown.Improve clarity and structure.Practice delivering concise, confident answers with stronger supporting examples.";

    }
    else {
      advice =
        "Significant improvement required.Focus on structured thinkinng clarity,and confident delivery.Practice answering aloud regularly";
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);

    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, currentY + 10)


    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);

    currentY += 50;

    //=================Question Table==================

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question || "N/A",
        `${q.score}/10`,
        q.feedback || "No feedback",

      ]),
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "top",
      },
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },//index
        1: { cellWidth: 55 },//question
        2: { cellWidth: 20, halign: "center" },//score
        3: { cellWidth: "auto" },//feedback
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },

    });
    doc.save("AI_Interview_Report.pdf");
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-white to-teal-400100 px-4
    sm:px-6 lg:px-10 py-8'>
      <div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>

        <div className='md:mb-10 w-full flex items-start gap-4 '>
          <button onClick={() => navigate("/history")}

            className='mt-1 p-2.5 rounded-full bg-white shadow 
                        hover:shadow-md transition mr-0.5'><FaArrowLeft className='text-black' /></button>


          <div>
            <h1 className='text-4xl font-bold text-black gap-2 flex-nowrap'>

              Interview Report Analytics Dashboard
            </h1>
            <p className='text-teal-800 font-semibold mt-3'>
              AI Powered Performance Insights
            </p>
          </div>
        </div>

        <button onClick={downloadPDF}
          className='bg-red-700 hover:bg-black text-white px-6 py-3
        rounded-xl shadow-md transition-all duration-300 font-semibold
        text-sm sm:text-base text-nowrap'>
          Download PDf
        </button>


      </div>

      <div className=' grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8'>

        <div className='space-y-6'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6
          sm:p-8 text-center'>

            <h3 className='text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base'>
              Overall Performance
            </h3>

            <div className="relative w-22 h-22 sm:w-26 sm:h-26 mx-auto">

              <CircularProgressbar
                value={percentage}
                text={`${score}/10 `}
                styles={buildStyles({
                  textSize: "20px",
                  pathColor: "#10b981",
                  textColor: "#ef4444",
                  trailColor: "#e5e7eb",
                })}
              />
            </div>

            <p className='text-black mt-3 text-xs sm:text-sm'>
              Out of 10
            </p>
            <div className='mt-4'>
              <p className='font-semibold text-gray-800 text-sm sm:text-base'>
                {performanceText}
              </p>
              <p className='text-black text-xs sm:text-sm mt-1'>
                {shortTagline}
              </p>

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}

            className='bg-blue-400 rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8'>
            <h3 className='text-base sm:text-lg font-bold text-gray-900 mb-6'>
              Skill Evaluation
            </h3>

            <div className='space-y-5'>
              {
                skills.map((s, i) => (

                  <div key={i}>

                    <div className='flex justify-between mb-2 text-sm sm:text--base'>

                      <span>{s.label} </span>
                      <span className='font-semibold text-mauve-900'>{s.value}</span>
                    </div>

                    <div className='bg-gray-300 h-2 sm:h-3 rounded-full'>

                      <div className='bg-amber-600 h-full rounded-full'
                        style={{ width: `${s.value * 10}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              }
            </div>

          </motion.div>

        </div>

        <div className='lg:col-span-2 space-y-6'>
          <motion.div

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-mist-200 rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8'>

            <h3 className='text-base sm:text-xl font-semibold text-black mb-4 sm:mb-6'>
              Performance Trend
            </h3>

            <div className='h-64 sm:h-72'>


              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={questionScoreData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 10,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    stroke="#64748b"
                    strokeDasharray="5 5"
                    opacity={0.6}
                  />

                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#111827", fontSize: 14, fontWeight: 600 }}
                    axisLine={{ stroke: "#374151" }}
                    tickLine={{ stroke: "#374151" }}
                  />

                  <YAxis
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                    tick={{ fill: "#111827", fontSize: 14, fontWeight: 600 }}
                    axisLine={{ stroke: "#374151" }}
                    tickLine={{ stroke: "#374151" }}
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#000"
                    strokeWidth={4}
                    fill="#14b8a6"
                    fillOpacity={0.55}
                  />
                </AreaChart>
              </ResponsiveContainer>






            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}

            className="bg-taupe-500 rounded-2xl sm:rounded-3xl shadow-lg p-5
          sm:p-8">

            <h3 className='text-base sm:text-lg font-semibold text-gray-800 mb-6'>
              Question Breakdown
            </h3>
            <div className='space-y-6'>
              {questionWiseScore.map((q, i) => (
                <div key={i} className='bg-gray-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-300'>

                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3
                    mb-4'>

                    <div>
                      <p className='text-sm text-gray-400'>
                        Question {i + 1}
                      </p>

                      <p className='font-semibold text-gray-700 text-sm sm:text-base leading-relaxed'>

                        {q.question || "Question not available"}
                      </p>
                    </div>

                    <div className='bg-green-200 text-gray-700 px-3 py-1 rounded-full font-bold
                      text-sm sm:text-sm w-fit'>
                      {q.score ?? 0}/10
                    </div>
                  </div>

                  <div className='bg-red-100 border border-mist-700 p-4 rounded-lg'>
                    <p className=' text-sm text-gray-800 leading-relaxed'>
                      {q.feedback && q.feedback.trim() !== ""
                        ? q.feedback
                        : "No feedback available for this question."}
                    </p>
                    <p></p>
                  </div>
                </div>


              ))}
            </div>


          </motion.div>


        </div>
      </div>


    </div>
  )
}

export default Step3Report
