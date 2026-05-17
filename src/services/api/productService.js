import axiosInstance from './axiosInstance'

const ENDPOINT = '/products'

export const getProducts = () =>
  axiosInstance.get(ENDPOINT).then(res => res.data)

export const getProductById = (id) =>
  axiosInstance.get(`${ENDPOINT}/${id}`).then(res => res.data)

export const createProduct = (data) =>
  axiosInstance.post(ENDPOINT, data).then(res => res.data)

export const updateProduct = (id, data) =>
  axiosInstance.put(`${ENDPOINT}/${id}`, data).then(res => res.data)

export const deleteProduct = (id) =>
  axiosInstance.delete(`${ENDPOINT}/${id}`).then(res => res.data)
