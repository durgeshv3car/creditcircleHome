import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const deleteCategory = async (id: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/category/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false };
  }
};

export const updateCategory = async (id: string, title: string) => {
  try {
    await axios.put(
      `${API_BASE_URL}/category/${id}`,
      { title },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false };
  }
};


export const addCategory = async (title: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/category`,
      { title },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding category:", error);
    return { success: false };
  }
};


export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Fetched categories:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};