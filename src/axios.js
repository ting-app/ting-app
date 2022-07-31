import axios from 'axios'
import UnauthorizedError from './error/unauthorized-error'

axios.defaults.baseURL = process.env.VUE_APP_API_SERVER_URL
axios.defaults.withCredentials = true

axios.interceptors.response.use((response) => {
  const data = response.data

  return data
}, (error) => {
  const response = error.response
  const data = response.data
  const message = (data && data.error && data.error.message) ? data.error.message : 'Internal server error'

  if (response.status === 401) {
    return Promise.reject(new UnauthorizedError('Unauthorized'))
  }

  return Promise.reject(new Error(message))
})

export default axios
