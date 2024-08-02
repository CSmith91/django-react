import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect } from "react"

function ProtectedRoute({children}){
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        auth().catch(() => isAuthorized(false))
    }, [])
    
    const refreshToken = async() => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN) // we get the refresh token
        try { // and then we're going to try and send a response with the below route, which should give us a new access token
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken
            });
            if (res.status === 200){
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            }
            else{
                setIsAuthorized(false)
            }
        } catch (error){
            console.log(error)
            setIsAuthorized(false)
        }
        
    }

    const auth = async () => { // look for our auth token to see if we have one. If we do, check if its expired or not
        // if its expired, we want to automatically refresh the token so that the user doesnt have to worry about anything
        // if we can't refresh the token or its expired, we let the user know
        const token = localStorage.getItem(ACCESS_TOKEN)
        if(!token){
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if (tokenExpiration < now) {
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }

    }

    if (isAuthorized === null){
        return <div>Loading...</div>
    }

    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute