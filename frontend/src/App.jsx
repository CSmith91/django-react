import react from "react"
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"

function Logout(){
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear() // we need to make sure when furst registering we have clear local storage so we don't get an error from old access tokens
  return <Register />
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/"
          // you can't access 'Home' unless you have the access token and it is valid
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} 
        // this page is not protected, you should be able to access it without authentication
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
