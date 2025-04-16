import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const deletefaq = async (id: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/faq/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting faq:", error);
    return { success: false };
  }
};

export const updatefaq = async (id: string, title: string,description:string) => {
  try {
    await axios.put(
      `${API_BASE_URL}/faq/${id}`,
      { title,description },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating faq:", error);
    return { success: false };
  }
};


export const addfaq = async (title: string,description:string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/faq`,
      { title,description },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding faq:", error);
    return { success: false };
  }
};


export const fetchfaq = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/faq`, {
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