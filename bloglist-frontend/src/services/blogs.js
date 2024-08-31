import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const createBlog = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const updateBlog = async (updatedObject) => {
  const response = await axios.put(
    `${baseUrl}/${updatedObject.id}`,
    updatedObject
  )
  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/blogs${id}`, config)
  return response.data
}

const getComments = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}/comments`)
  console.log(response.data)
  return response.data
}

const postComments = async (id, comment) => {
  console.log(comment, id)
  const response = await axios.post(`${baseUrl}/${id}/comments`, comment)
  console.log(`${baseUrl}/${id}/comments`)
  return response.data
}

export default {
  getAll,
  createBlog,
  setToken,
  updateBlog,
  deleteBlog,
  getComments,
  postComments
}
