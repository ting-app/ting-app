import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_API_SERVER_URL
axios.defaults.withCredentials = true

axios.interceptors.response.use((response) => {
  const data = response.data

  if (response.status === 200) {
    if (!data.error) {
      return data
    } else {
      return Promise.reject(new Error(data.error.message))
    }
  } else {
    const message = (data && data.error && data.error.message) ? data.error.message : 'Server error'

    return Promise.reject(new Error(message))
  }
}, (error) => {
  return Promise.reject(error)
})

export default axios
