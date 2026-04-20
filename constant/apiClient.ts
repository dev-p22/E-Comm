import axios from "axios"
import { BASE_URL } from "./baseApi"


const axiosClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, 
})
export default axiosClient;