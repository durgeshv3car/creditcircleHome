import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const fetchUsers = async (params:any) => {
  try {
     const response = await axios.get(`${BASE_URL}/otp/get-all-profile`, {
      params, 
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchUserFilters = async (params:any) => {
  try {
    const response = await axios.get(`${BASE_URL}/otp/filters`, {
      params, // ✅ THIS sends ?state=Haryana&city=Gurgaon...
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};




export const fetchUsersLength = async (startdate: string, enddate: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/otp/get-all-profile-length?startdate=${startdate}&enddate=${enddate}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching users:", error.message || error);
    throw error;
  }
};

export const updateUser = async (id: string, data: object) => {
  try {
    const response = await fetch(`/api/users?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await fetch(`/api/users?id=${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const pauseServices = async (id: string, pauseData: any) => {
  try {
    const response = await fetch(`/api/users?id=${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( pauseData ), 
    });

    const data = await response.json();
    console.log(data)

    return { success: response.ok, data };
  } catch (error) {
    console.error("❌ Error scheduling delete:", error);
    return { success: false };
  }
};

