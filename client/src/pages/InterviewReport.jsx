import React, {use, useEffect,useState} from 'react'
import axios from  "axios"
import { useParams } from 'react-router-dom'
import Step3Report from '../components/Step3Report';

function InterviewReport() {

  const {id} = useParams() 
  const[report,setReport] = useState(null);

  useEffect(()=> {
    const fetchReport =async() =>{
      try{

        const result = await axios.get(
          "http://localhost:8000/api/interview/report/" + id,
          { withCredentials: true })

          console.log(result.data)
          setReport(result.data)
        }catch(error){
        console.log(error)
      }
    }

    fetchReport()

  },[])

  if(!report){
    return(
      <div className='min-h-screen flex items-center justify-center'>

        <p className='text-white font-bold'>
          Loading Report....
        </p>
      </div>
    )
  }


   return <Step3Report report={report}/>
   
  
}

export default InterviewReport
