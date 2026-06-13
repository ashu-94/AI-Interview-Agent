import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home";
import Auth from './pages/Auth'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from "./redux/userSlice"
import InterviewPage from "./pages/InterviewPage";
import InterviewHistory from './pages/InterviewHistory'
import Pricing from './pages/Pricing'
import InterviewReport from './pages/InterviewReport'

export const ServerURL = 'https://ai-interview-agent-lr4m.onrender.com'

function App() {

  const dispatch = useDispatch()
  useEffect(() =>{
    const token = localStorage.getItem("token")
    if(!token){
      // If no token is found, you might want to redirect the user to the login page
      // window.location.href = "/auth"
      dispatch(setUserData(null))
      return
    }
    const getUser = async()=>{
      try{
        const response = await axios.get(
          ServerURL + "/api/user/current-user", 
          { withCredentials:true})
          dispatch(setUserData(response.data.user))
        } catch (error) {
        console.error("Error fetching user data:", error)
        console.error("Error during authentication check:", error)
        localStorage.removeItem("token")
        dispatch(setUserData(null))
    }
      
  }
  getUser()
}, [dispatch])
    return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/home" element={<Home />}/>
      <Route path="/auth" element={<Auth />}/>
      <Route path="/interview" element={<InterviewPage/>}/>
      <Route path="/history" element={<InterviewHistory/>}/>
      <Route path="/pricing" element={<Pricing/>}/>
      <Route path="/report/:id" element={<InterviewReport/>}/>
    </Routes>
  )
}

export default App
  
    
