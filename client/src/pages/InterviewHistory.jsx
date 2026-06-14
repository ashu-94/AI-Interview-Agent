import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaArrowLeft } from 'react-icons/fa'
import { ServerURL } from "../App";

function InterviewHistory() {
  const [interview, setInterview] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const getMyInterview = async () => {
      try {
        const result = await axios.get(
          `${ServerURL}/api/interview/get-interview`,
          { withCredentials: true }
        )
        setInterview(result.data)
      } catch (error) {
        console.log(error)
      }
    }

    getMyInterview()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 to-black-300 py-10">
      <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto pt-8 '>

        <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>
          <button onClick={() => navigate("/")}

            className='mt-1 p-2.5 rounded-full bg-white shadow 
                hover:shadow-md transition mr-0.5'><FaArrowLeft className='text-black' /></button>


          <div>
            <h1 className='text-4xl font-bold text-black gap-2 flex-nowrap'>

              Interview History
            </h1>
            <p className='text-black font-semibold mt-3'>
              Track your past interview and performance reports.
            </p>
          </div>
        </div>

        {interview.length === 0 ?
          <div className='bg-white p-10 rounded-2xl shadow text-center'>

            <p className='text-black text-xl'>
              No interview found. Start your first Interview
            </p>
          </div>
          :
          <div className='grid gap-6'>
            {interview.map((item, index) => (
              <div key={index}
                onClick={() => navigate(`/report/${item._id}`)}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl
    transition-all duration-300 cursor-pointer border
    border-gray-100">

                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>

                  <div>
                    <h3 className='text-lg font-semibold text-gray-800'>
                      {item.role}

                    </h3>
                    <p className='text-black text-sm mt-1' >
                      {item.experience}.{item.mode}

                    </p>
                    <p className='text-xs text-white mt-2'>
                      {new Date(item.createdAt).toLocaleDateString()}

                    </p>

                  </div>

                  <div className='flex items-center gap-6'>

                    {/* Score */}

                    <div className='text-right'>
                      <p className='text-xl font-bold text-emerald-600'>
                        {item.finalScore || 0}/10
                      </p>
                      <p className='text-xs text-black'>
                        Overall Score
                      </p>
                    </div>

                    {/* STATUS BADGE */}
                    <span
                      className={`px-4 py-1 rounded-full text-lg font-medium $
           {item.status === "completed"
                       ? " bg-emerald-100 text-emerald-700 "
                       : " bg-yellow-100 text-red-800 "
                       }`} >
                      {item.status}
                    </span>


                  </div>

                </div>

              </div>
            ))
            }
          </div>
        }


      </div>


    </div>


  )
}

export default InterviewHistory