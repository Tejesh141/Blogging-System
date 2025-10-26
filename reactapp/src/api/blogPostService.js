import axios from 'axios';

const API_BASE_URL = "https://8080-acfaaadceacfaafaeaafcdcbadecfcedbcbea.premiumproject.examly.io/api/posts";

const handleError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.message || 'Server error');
  } else if (error.request) {
    throw new Error('Network error - Backend not available');
  } else {
    throw new Error('Request error');
  }
};

export const getAllPosts = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getPostById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createPost = async (post) => {
  try {
    const response = await axios.post(API_BASE_URL, post);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updatePost = async (id, post) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, post);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deletePost = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};