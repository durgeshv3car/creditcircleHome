import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const addcsv = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/csv", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: (error as any).message };
  }
};

// Fetch all users directly from backend
export const VerifyOtp = async (otp: any) => {
  try {
    const res = await axios.post(`${BASE_URL}/data/verify/otp`, {otp:otp}, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Error fetching users:", error.message || error);
    return [];
  }
};

// Create a new user
export const createOtp = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/data/send/otp`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      success: res.status === 200 || res.status === 201,
      data: res.data,
    };
  } catch (error: any) {
    console.error("Error creating user:", error.message || error);
    return { success: false };
  }
};
