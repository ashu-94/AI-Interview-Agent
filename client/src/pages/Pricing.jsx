import { Feature } from 'framer-motion'
import axios from "axios"
import React, { useState } from 'react'
import { FaArrowLeft, FaIdBadge } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"
import { FaCheckCircle } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { ServerURL } from "../App";

function Pricing() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("free");
  const[loadingPLan,setLoadingPlan] = useState(null);
  const dispatch = useDispatch()

  const plans = [
    {

      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting  interview prepration.",
      features: [
        "100 AI Inteerview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking"
      ],
      default: true
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History"
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job prepration.",
      features: [

        "650 AI Interview Credits",
        "Advance AI Feedback",
        "Skills Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },

  ];



  const handelPayment = async(plan) =>{
    try{ 
      setLoadingPlan(plan.id)

      const amount =
      plan.id === "basic" ? 100:
      plan.id === "pro" ? 500: 0;

      const result = await axios.post(`${ServerURL}/api/payment/order` ,
        {
        planId : plan.id,
        amount: amount,
        credits: plan.credits,
      },
          {
            withCredentials: true

          });
          console.log(result.data)

          const options = {
            key:import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount:result.data.amount,
            currency:"INR",
            name:"InterviewIQ.AI",
            description: `${plan.name} - ${plan.credits}Credits`,
            order_id : result.data.id,


          handler : async function (response) {
            console.log("Payment Success",response)
            const verifypay =await axios.post(`${ServerURL}/api/payment/verify`,
              response, {withCredentials:true})
              dispatch(setUserData(verifypay.data.user))
              alert("Payment Successful Credits Added!");
              navigate("/")
          },
          theme:{
            color:"#10b981",

          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()

        setLoadingPlan(null);

    }catch(error){
      console.log(error)
      setLoadingPlan(null)
      
    }

  }
  return (
    <div className='min-h-screen bg-gradient-to-br from gray-50 to-sky-300 py-16 px-6'>

      <div className='max-w-6xl mx-auto mb-14 flex items-start gap-4'>

        <button onClick={() => navigate("/")}
          className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
          <FaArrowLeft className='text-gray-800' />
        </button>
        <div className='text-center w-full'>
          <h1 className='text-4xl font-bold text-mist-900'>
            Choose Your Plan
          </h1>
          <p className='text-black mt-3 text-lg'>
            Flexible pricing to match your interview prepration goals.
          </p>
        </div>
      </div>


      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w--6xl mx-auto'>

        {plans.map((plan) => {

          const isSelected = selectedPlan === plan.id
          return (
            <motion.div key={plan.id}
              whileHover={!plan.default && { scale: 1.05 }}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}

              className={`relative rounded-3xl p-8 transition-all duration-300 border
                ${isSelected
                  ? "border-emerald-700 shadow-2xl bg-white "
                  : "border-gray-300 bg-white shadow-md "
                }
                 
                ${plan.default ? "cursor-default" : "cursor-pointer"}
                `}
            >

              {/* Badge */}
              {plan.badge && (
                <div className='absolute top-6 right-6 bg-emerald-600 text-white text-xs px-4 py-1 rounded-full shadow'>
                  {plan.badge}
                </div>
              )}

              {/* Default Tag */}
              {plan.default && (
                <div className='absolute top-6 right-6 bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full'>
                  Default
                </div>
              )}

              {/* Plan Name */}
              <h3 className='text-xl font-semibold text-gray-800'>
                {plan.name}
              </h3>

              {/*Price */}
              <div className='mt-4'>
                <span className='text-3xl font-bold text-emerald-600'>
                  {plan.price}
                </span>
                <p className='text-gray-600 mt-1'>
                  {plan.credits}Credits
                </p>
              </div>

              {/* Description */}

              <p className='text-gray-700 mt-4 text-sm leading-relaxed'>
                {plan.description}
              </p>


              {/* Features */}

              <div className='mt-6 space-y-3 text-left'>
                {plan.features.map((feature, i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <FaCheckCircle className="text-black text-sm" />
                    <span className='text-gray-600 text-sm'>
                      {feature}
                    </span>
                  </div>
                ))}

              </div>


              {!plan.default &&
              <button
              disabled = {loadingPLan === plan.id}
                onClick={(e)=>{e.stopPropagation();
                  if(!isSelected){
                    setSelectedPlan(plan.id)
                  }else{
                    handelPayment(plan)
                  }
                  }}className={`w-full mt-8 py-3 rounded-xl font-semibold transition
                 ${isSelected
                    ? "bg-emerald-600 text-white hover:opacity-90"
                    : "bg-gray-300 text-gray-800 hover:bg-emerald-50ss"
                  }`}>

                    {loadingPLan === plan.id

                    ? "Processing..."
                    : isSelected
                    ? "Proceed to Pay" 
                     : "Select Plan" }

                </button>
              }

            </motion.div>
          )
        })}
      </div>

    </div>
  )
}

export default Pricing
