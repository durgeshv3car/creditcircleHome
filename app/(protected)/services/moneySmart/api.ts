import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const fetchMoney = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/offer/money`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.offers || [];
  } catch (error) {
    console.error("Error fetching offers:", error);
    return [];
  }
};

export const updateMoney = async (id: string, type: string, editedData: any, mobileFile?: File, webFile?: File, mobileUrl?: string | null,
  webUrl?: string | null) => {
  if (!id) return;

  try {
    const formDataSend = new FormData();
    formDataSend.append("id", id);
    formDataSend.append("type", type);
    if (!mobileUrl) formDataSend.append("mobileUrl", "empty");
    if (!webUrl) formDataSend.append("webUrl","empty");

    

    if (editedData.title) formDataSend.append("title", editedData.title);
    if (editedData.description) formDataSend.append("description", editedData.description);
    if (editedData.detailDescription) formDataSend.append("detailDescription", editedData.detailDescription);
    if (mobileFile) formDataSend.append("mobile", mobileFile);
    if (webFile) formDataSend.append("web", webFile);
    if (editedData.companyUrl) formDataSend.append("companyUrl", editedData.companyUrl);
    if (editedData.active !== undefined) formDataSend.append("active", editedData.active);

    await axios.put(`${API_BASE_URL}/offers`, formDataSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { success: true, message: "Offer updated successfully" };
  } catch (error) {
    console.error("Error updating offer:", error);
    return { success: false, message: "Failed to update offer" };
  }
};


export const addMoney = async (type: string, formData: any, mobileFile?: File, webFile?: File) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("type", type);
    formDataSend.append("title", formData["Title"] || "");
    formDataSend.append("description", formData["Description"] || "");
    formDataSend.append("category", formData["Category Name"] || "");
    formDataSend.append("detailDescription", formData.fieldDescription || "");
    console.log()

    if (mobileFile) formDataSend.append("mobile", mobileFile);
    if (webFile) formDataSend.append("web", webFile);
    
    formDataSend.append("redirectUrl", formData["Company URL"] || "");

    const response = await axios.post(`${API_BASE_URL}/offers`, formDataSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { success: true, message: "Recommended image added", data: response.data };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, message: "Recommended image not added" };
  }
};


export const toggleMoneyStatus = async (id: string, value: boolean) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("id", id);
    formDataSend.append("type", "money");
    formDataSend.append("isActive", String(value));

    await axios.put(`${API_BASE_URL}/offers`, formDataSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return {
      success: true,
      message: `Recommend ${value ? "activated" : "deactivated"} successfully`,
    };
  } catch (error) {
    console.error("Error updating isActive:", error);
    return { success: false, message: "Failed to update status" };
  }
};


export const deleteMoney = async (id: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/offers/${id}`, {
      headers: { "Content-Type": "application/json" },
    });

    return { success: true, message: "Recommended data deleted" };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, message: "Recommended data not deleted" };
  }
};