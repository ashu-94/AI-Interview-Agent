import React, { useState } from 'react'
import { RiRobot3Fill } from "react-icons/ri";
import { motion } from "framer-motion"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utlis/firebase';
import axios from 'axios'
import { ServerURL } from '../App';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/userSlice"

function Auth({ isModel = false }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLogin, setIsLogin] = useState(true)

  const handelGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      console.log("Google Sign-In Response:", response);
      let User = response.user
      let name = User.displayName
      let email = User.email
      const result = await axios.post(`${ServerURL}/api/auth/google`, {
        name,
        email
      })

      localStorage.setItem("token", result.data.token)

      dispatch(setUserData(result.data.user))



      console.log("Server Response:", result.data);

      // GET FIREBASE TOKEN
      // REDIRECT
      window.location.href = "/home";


      //let profilePic = User.photoURL
      //localStorage.setItem("name", name)
      // localStorage.setItem("email", email) 
      //localStorage.setItem("profilePic", profilePic)
      // window.location.href = "/home"// 

    } catch (error) {
      console.error("Google Sign-In Error:", error);
      dispatch(setUserData(null))
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(
        ServerURL + "/api/auth/register",
        { name, email, password }
      );

      console.log("Register Success:", result.data);

      alert("Registration Successful!");

      setIsLogin(true);

      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Registration Failed"
      );
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(
        ServerURL + "/api/auth/login",
        { email, password }
      );

      console.log("Login Result:", result.data);

      localStorage.setItem("token", result.data.token)

      dispatch(setUserData(result.data.user));

      alert("Login Successful!");

      navigate("/home");

    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Login Failed"
      );
    }
  };
  return (
    <div className={`
      w-full
      ${isModel ? "py-5" : "min-h-screen"} flex 
    items-center justify-center px-6 py-20`}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`
        w-full
        ${isModel ? "max-w-md rounded-3xl" : "max-w-2xl p-12 rounded-5xl"}
           bg-white p-8 rounded-lg shadow-2xl border-2 border-gray-300`}>
        <div className='flex items-center justify-center mb-6'>
          <RiRobot3Fill size={45} />
        </div>
        <h2 className='text-2xl font-bold text-center mb-6'>
          {isLogin ? "Sign In" : "Register"}

        </h2>
        <p className='text-mauve-800 text-center text-md md:text-base
        leading-relaxed mb-8'>
          Sign in to start AI-Powered mock interviews,track your progress and
          get personalized feedback to ace your next job interview!
        </p>

        <form onSubmit={isLogin ? handleLogin : handleRegister}>

          {!isLogin && (
            <div className='mb-4'>
              <label
                htmlFor='name'
                className='block text-gray-700 font-medium mb-2'
              >
                Name
              </label>

              <input
                type='text'
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your name'
              />
            </div>
          )}
          <div className='mb-4'>
            <label htmlFor='email' className='block text-gray-700 font-medium mb-2'>
              Email
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter your email'
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block text-gray-700 font-medium mb-2'>
              Password
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter your password'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {isLogin ? "Sign In" : "Register"}
          </button>
        </form>
        <div className='text-center mt-4'>
          <button
            type='button'
            onClick={() => setIsLogin(!isLogin)}
            className='text-blue-600 hover:underline'
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Sign In"}
          </button>
        </div>
        <motion.button
          onClick={handelGoogleAuth}
          whileHover={{ opacity: 0.9, scale: 1.10 }}
          whileTap={{ opacity: 1, scale: 1 }}
          className='w-full flex items-center justify-center
        gap-5 py-3 bg-black text-white rounded-full shadow-md mt-5'>
          <FcGoogle size={25} />
          Sign in with Google

        </motion.button>
      </motion.div>

    </div>
  )
}

export default Auth
