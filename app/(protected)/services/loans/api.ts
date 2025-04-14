import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const fetchLoans = async (userId: string, status?: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all-loan-application`, {
    });

    return response.data; 
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const updateLoan = async (userId: string, data: object) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/loan-application/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteLoan = async (userId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/loan-application/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
