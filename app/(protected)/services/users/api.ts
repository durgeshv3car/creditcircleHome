import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";


export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/otp/get-all-profile`, {
    });

    return response.data; 
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const updateUser = async (userId: string, data: object) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/otp/get-all-profile/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/otp/delete-profile/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
