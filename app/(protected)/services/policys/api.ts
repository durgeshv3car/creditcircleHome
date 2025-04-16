import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const deletepolicy = async (id: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/policy/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting policy:", error);
    return { success: false };
  }
};

export const updatepolicy = async (id: string, title: string,description: string) => {
  try {
    await axios.put(
      `${API_BASE_URL}/policy/${id}`,
      { title ,description},
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating policy:", error);
    return { success: false };
  }
};


export const addpolicy = async (title: string,description:string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/policy`,
      { title,description },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding policy:", error);
    return { success: false };
  }
};


export const fetchpolicy = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/policy`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Fetched categories:", response.data);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};