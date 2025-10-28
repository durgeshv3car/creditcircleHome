import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const deleteDevice = async (id: string) => {
  try {
    const response = await fetch(`/api/deviceInfo?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error deleting device:", error);
    return { success: false };
  }
};



export const fetchDevices = async (filters: any = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/devices`, {
      params: filters,

      paramsSerializer: {
        serialize: (params) => {
          const query = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v) => query.append(key, v));
            } else if (value !== undefined && value !== null) {
              query.append(key, value);
            }
          });
          return query.toString();
        },
      },
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching devices:", error.response?.data || error.message);
    throw error;
  }
};
