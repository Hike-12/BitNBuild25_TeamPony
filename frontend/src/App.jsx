import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/hello/`)
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
  }, [])

  return (
    <>
    <h1 className="text-3xl font-bold underline bg-red-200">
      message from backend: {message}
    </h1>
    </>
  )
}

export default App
