import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Tailwind Test Project
        </h1>
        <p className="text-gray-700 mb-4">
          Testing Tailwind CSS with Vite and React
        </p>
        <div className="text-center mb-4">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            count is {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
