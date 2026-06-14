import React from 'react'
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { BsRobot, BsCoin } from "react-icons/bs"
import { FaUserAstronaut } from "react-icons/fa"
import { Link } from "react-router-dom"
import { HiOutlineLogout } from "react-icons/hi"
import axios from "axios"

import { ServerURL } from "../App"
import { setUserData } from '../redux/userSlice'

import AuthModel from './AuthModel.jsx'

function Navbar() {

  const { userData } = useSelector((state) => state.user)

  const dispatch = useDispatch()

  const [showCreditPopup, setShowCreditPopup] = React.useState(false)

  const [showUserPopup, setShowUserPopup] = React.useState(false)

  const [showAuthModel, setShowAuthModel] = React.useState(false)

  const handleLogout = async () => {

    try {

      await axios.get(ServerURL + "/api/auth/logout")

      dispatch(setUserData(null))

      localStorage.removeItem("token")

      setShowCreditPopup(false)

      setShowUserPopup(false)

      setShowAuthModel(false)

    } catch (error) {

      console.error("Logout failed:", error)

    }

  }

  return (

    <div className='w-full flex justify-center pt-2'>

      <motion.div

        initial={{ opacity: 0, y: -40 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.5, delay: 0.2 }}

        className='w-full max-w-7xl bg-emerald-500 rounded-full p-1.5 shadow-lg'
      >

        {/* WHITE NAVBAR */}

        <div className='w-full bg-white rounded-full px-6 py-3 flex items-center 
        shadow-[0_0_25px_rgba(16,185,129,0.15)]'>

          {/* LEFT SIDE */}

          <div className='flex items-center gap-3 cursor-pointer'>

            <div className='bg-black rounded-full w-5 h-5'></div>

            <BsRobot
              size={28}
              className='text-blue-500'
            />

            <h1 className='text-2xl font-bold text-gray-800'>
              AI Interview Agent
            </h1>

          </div>

          {/* RIGHT SIDE */}

          <div className='flex items-center gap-3 ml-auto relative'>

            {/* CREDIT BUTTON */}

            <button

              onClick={() => {

                if (!userData) {

                  setShowAuthModel(true)

                  return

                }

                setShowCreditPopup(!showCreditPopup)

                setShowUserPopup(false)

              }}

              className='flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full text-white
              hover:bg-red-500 transition-all duration-300'
            >

              <BsCoin size={22} />

              {userData?.credits || 0}

            </button>

            {/* CREDIT POPUP */}

            {showCreditPopup && (

              <div className='absolute top-16 right-20 bg-white p-4 rounded-2xl shadow-2xl w-56 z-50'>

                <h2 className='text-lg font-bold mb-2'>
                  Buy Credits
                </h2>

                <p className='text-gray-700 text-sm'>
                  You have {userData?.credits || 0} credits remaining.
                  Need more credits to continue interviews?
                </p>

                <Link
                  to="/pricing"
                  className='mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-black transition-all duration-300'
                >
                  Buy More Credits
                </Link>

              </div>

            )}

            {/* USER BUTTON */}

            <div className='relative'>

              <button

                onClick={() => {

                  if (userData) {

                    setShowUserPopup(!showUserPopup)

                    setShowCreditPopup(false)

                  } else {

                    setShowAuthModel(true)

                  }

                }}

                className='w-10 h-10 bg-black text-white rounded-full
                flex items-center justify-center font-semibold
                hover:scale-105 transition-all duration-300'
              >

                {userData
                  ? userData?.name?.slice(0, 1).toUpperCase()
                  : <FaUserAstronaut size={18} />
                }

              </button>

              {/* USER POPUP */}

              {showUserPopup && (

                <div className='absolute top-16 right-0 bg-white p-4 rounded-2xl shadow-2xl w-52 z-50'>

                  <h2 className='text-lg font-bold mb-3'>
                    {userData?.name}
                  </h2>

                  <Link
                    to="/profile"
                    className='block text-center bg-blue-600 text-white px-4 py-2 rounded-full
                    hover:bg-cyan-500 transition-all duration-300'
                  >
                    View Profile
                  </Link>

                  <button

                    onClick={handleLogout}

                    className='mt-4 w-full flex items-center justify-center
                    gap-2 bg-emerald-700 text-white px-4 py-2 rounded-full
                    hover:bg-red-500 transition-all duration-300'
                  >

                    <HiOutlineLogout size={18} />

                    Logout

                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </motion.div>

      {/* AUTH MODEL */}

      {!userData && showAuthModel && (

        <AuthModel
          onClose={() => setShowAuthModel(false)}
        />

      )}

    </div>

  )

}

export default Navbar