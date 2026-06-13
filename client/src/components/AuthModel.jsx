import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaTimes } from 'react-icons/fa'
import Auth from "../pages/Auth"

function AuthModel({onClose}) {
    const{userData}= useSelector((state)=>state.user)

    useEffect(()=>{
        if(userData){
            onClose()
            //window.location.replace("/")
        }
    },[userData,onClose])
    return (
    <div className='fixed inset-0 z-[999] flex items-center justify-center
        bg-black/50 backdrop-blur-sm transition-all duration-300 px-4'>

      <div className='relative w-full max-w-md bg-white rounded-3xl 
      overflow-hidden shadow-2xl'></div>

      {/* CLOSE BUTTON */}
        <button
        onClick={onClose}
        className='absolute top-4 right-4 text-white bg-red-500
         hover:bg-red-600 transition-all duration-300 
         rounded-full p-2 shadow-lg'>
            <FaTimes size={20} />
        </button>

      {/* AUTH PAGE */}
      <Auth isModel={true} />
      </div>
)
}

export default AuthModel
