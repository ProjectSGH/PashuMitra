import { BrowserRouter as Router, Route, Routes,} from "react-router-dom"
import SignupForm from './pages/Signup'
import LoginForm from './pages/Login'
import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
