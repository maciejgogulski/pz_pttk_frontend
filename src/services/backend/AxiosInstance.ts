import axios from 'axios'

const axiosInstance = (token?: string) => {
  const options = {
    baseURL: process.env.BACKEND_URL,
    timeout: 20000,
    headers: {} as Record<string, string>,
  }

  if (token) {
    options.headers.Authorization = `Bearer ${token}`
  }

  return axios.create(options)
}

export default axiosInstance
