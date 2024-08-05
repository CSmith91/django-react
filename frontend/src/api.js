import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const apiUrl = "/choreo-apis/djangoreact/backend-fe/v1"

const api = axios.create({
    // when we start using this api, we have setup the base url here, linked from the .env OR we can import the backend choreo link if it exists!
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(token) {
            config.headers.Authorization = `Bearer ${token}` // we create an autorization header which can be automatcally handle for us by axoios. It beeds to start with bearer, a space, and an actual token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
);

// Response interceptor to handle 401 errors or other response errors
api.interceptors.response.use(
    (response) => {
        return response; // Return the response if it's successful
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized errors (e.g., redirect to login)
            console.error("Unauthorized! Redirecting to login.");
            // Example: Redirect to login page
            window.location.href = '/login';
        }
        return Promise.reject(error); // Handle other errors
    }
);

export default api