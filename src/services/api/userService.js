import axiosInstance from './axiosInstance'

const ENDPOINT = '/users'

export const getUsers = () =>
  axiosInstance.get(ENDPOINT).then(res => res.data)

export const getUserById = (id) =>
  axiosInstance.get(`${ENDPOINT}/${id}`).then(res => res.data)

export const createUser = (data) =>
  axiosInstance.post(ENDPOINT, data).then(res => res.data)

export const updateUser = (id, data) =>
  axiosInstance.put(`${ENDPOINT}/${id}`, data).then(res => res.data)

export const deleteUser = (id) =>
  axiosInstance.delete(`${ENDPOINT}/${id}`).then(res => res.data)
