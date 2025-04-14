import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";



  export const uploadLogoImage = async (formData: {
    type: string;
    title?: string;
    mobileFile?: File | null;
    webFile?: File | null;
    companyUrl: string;
  }) => {
    try {
      const formDataSend = new FormData();
      formDataSend.append("type", formData.type);
      formDataSend.append("title", formData.title || "");
  
      if (formData.mobileFile) {
        formDataSend.append("mobile", formData.mobileFile);
      }
  
      if (formData.webFile) {
        formDataSend.append("web", formData.webFile);
      }
  
      formDataSend.append("companyUrl", formData.companyUrl);
  
      const response = await axios.post(`${API_BASE_URL}/banner/upload`, formDataSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error uploading image:", error);
      return { success: false };
    }
  };

export const fetchLogoImages = async (type: string) => {
  try {
    if (!type) {
      console.warn("Type is undefined, skipping fetch");
      return [];
    }

    const response = await axios.get(`${API_BASE_URL}/banner/images/${type}`);

    return response.data.images || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return [];
  }
};

export const deleteLogoImage = async (id: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/banner/image`, {
      data: { id },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting Logo image:", error);
    return { success: false };
  }
};

export const updateLogoImage = async (
    id: string,
    type: string,
    editedData: { title?: string; companyUrl?: string; active?: boolean },
    mobileFile?: File | null,
    webFile?: File | null
  ) => {
    try {
      const formDataSend = new FormData();
      formDataSend.append("id", id);
      formDataSend.append("type", type);
  
      if (editedData.title) formDataSend.append("title", editedData.title);
      if (mobileFile) formDataSend.append("mobile", mobileFile);
      if (webFile) formDataSend.append("web", webFile);
      if (editedData.companyUrl) formDataSend.append("companyUrl", editedData.companyUrl);
      if (editedData.active !== undefined) formDataSend.append("active", String(editedData.active));
  
      await axios.put(`${API_BASE_URL}/banner/image`, formDataSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      return { success: true };
    } catch (error) {
      console.error("Error updating Logo image:", error);
      return { success: false };
    }
  };

  
export const scheduleDeleteLogoImage = async (id: string, type: string, deletionDate: Date) => {
    try {
      const formDataSend = new FormData();
      formDataSend.append("id", id);
      formDataSend.append("type", type);
      formDataSend.append("deletionDate", deletionDate.toISOString());
  
      const response = await axios.put(`${API_BASE_URL}/banner/image`, formDataSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("✅ Scheduled Delete Response:", response.data);
      return { success: true };
    } catch (error) {
      console.error("⚠️ Error scheduling delete:", error);
      return { success: false };
    }
  };

  export const toggleLogoImageStatus = async (id: string, isActive: boolean) => {
    try {
      const formDataSend = new FormData();
      formDataSend.append("id", id);
      formDataSend.append("type", "Logo");
      formDataSend.append("active", String(isActive));
  
      await axios.put(`${API_BASE_URL}/banner/image`, formDataSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      return { success: true };
    } catch (error) {
      console.error("Error toggling Logo status:", error);
      return { success: false };
    }
  };
  
