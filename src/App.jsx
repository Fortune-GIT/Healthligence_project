
import React, { useState } from 'react'
import RegistrationForm from './components/RegistrationForm'
import SuccessScreen from './components/SuccessScreen'
import './index.css'


export default function App(){
  const [success, setSuccess] = useState(null)
  return success ? <SuccessScreen data={success} /> : <RegistrationForm onSuccess={setSuccess} />
}
