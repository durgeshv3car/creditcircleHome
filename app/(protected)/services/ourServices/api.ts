import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const fetchServices = async (type:string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/service/${type}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.services || [];
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export const updateService = async (
  id: string,
  type: string,
  editedData: any,
  mobileFile?: File,
  webFile?: File,
) => {
  if (!id) return { success: false, message: "ID is required" };

  try {
    const formDataSend = new FormData();
    formDataSend.append("id", id);
    formDataSend.append("type", type);

    if (editedData.title) formDataSend.append("title", editedData.title);
    if (editedData.fieldDescription)
      formDataSend.append("description", editedData.fieldDescription );
    if (mobileFile) formDataSend.append("mobile", mobileFile);
    if (webFile) formDataSend.append("web", webFile);
    if (editedData.companyUrl)
      formDataSend.append("companyUrl", editedData.companyUrl);
    if (editedData.annualFee)
      formDataSend.append("annualFee", editedData.annualFee);
    if (editedData.active !== undefined)
      formDataSend.append("active", editedData.active);

    await axios.put(`${API_BASE_URL}/service`, formDataSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { success: true, message: "service updated successfully" };
  } catch (error) {
    console.error("Error updating service:", error);
    return { success: false, message: "Failed to update service" };
  }
};

export const addService = async (
  type: string,
  formData: any,
  mobileFile?: File,
  webFile?: File,

) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("type", type);
    formDataSend.append("title", formData["Title"] || "");
    formDataSend.append("description", formData.fieldDescription || "");
    formDataSend.append("buttonType", formData["Button Name"] || "");

    if (mobileFile) formDataSend.append("mobile", mobileFile);
    if (webFile) formDataSend.append("web", webFile);

    formDataSend.append("companyUrl", formData["Company URL"] || "");
    formDataSend.append("annualFee", formData["Annual Fee"] || "");

    const response = await axios.post(`${API_BASE_URL}/service`, formDataSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return {
      success: true,
      message: "service added",
      data: response.data,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, message: "service not added" };
  }
};

export const toggleServiceStatus = async (id: string, type: string, value: boolean) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("id", id);
    formDataSend.append("type", type);
    formDataSend.append("active", String(value));

    const response = await axios.put(`${API_BASE_URL}/service`, formDataSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return {
      success: response.status === 200,
      message: `Recommend ${value ? "activated" : "deactivated"} successfully`,
    };
  } catch (error) {
    console.error("Error updating isActive:", error);
    return { success: false, message: "Failed to update status" };
  }
};

export const deleteService = async (id: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/service/${id}`, {
      headers: { "Content-Type": "application/json" },
    });

    return { success: true, message: "Service data deleted" };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, message: "Service data not deleted" };
  }
};
