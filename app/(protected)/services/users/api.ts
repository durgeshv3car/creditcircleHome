import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";


export const fetchUsers = async (userId: string, status?: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/otp/get-all-profile`, {
    });

    return response.data; 
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};
