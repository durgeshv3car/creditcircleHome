import axios from "axios";

export const fetchMoney = async () => {
  try {
    const response = await fetch(`/api/moneySmart`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch data");
    return data.offers || data || [];
  } catch (error) {
    console.error("Error fetching money data:", error);
    return [];
  }
};

export const updateMoney = async (
  id: string,
  type: string,
  dimensions: any,
  editedData: any,
  mobileFile?: File | null,
  webFile?: File | null,
  mobileUrl?: string | null,
  webUrl?: string | null
) => {
  if (!id) return { success: false, message: "ID is required" };

  try {
    const formDataSend = new FormData();
    formDataSend.append("id", id);
    formDataSend.append("type", type);
    formDataSend.append("dimensions", JSON.stringify(dimensions));
    if (!mobileUrl) formDataSend.append("mobileUrl", "empty");
    if (!webUrl) formDataSend.append("webUrl", "empty");
    
    if (editedData.title) formDataSend.append("title", editedData.title);
    if (editedData.description) formDataSend.append("description", editedData.description);
    if (editedData.detailDescription) formDataSend.append("detailDescription", editedData.detailDescription);
    if (mobileFile) formDataSend.append("mobile", mobileFile);
    if (webFile) formDataSend.append("web", webFile);
    if (editedData.companyUrl) formDataSend.append("companyUrl", editedData.companyUrl);
    if (editedData.active !== undefined) formDataSend.append("isActive", String(editedData.active));

    const response = await fetch("/api/moneySmart", {
      method: "PUT",
      body: formDataSend,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to update");
    return { success: true };
  } catch (error) {
    console.error("Error updating money:", error);
    return { success: false, message: "Failed to update" };
  }
};

export const addMoney = async (
  type: string,
  dimensions: any,
  formData: any,
  mobileFile?: File,
  webFile?: File
) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("type", type);
    formDataSend.append("dimensions", JSON.stringify(dimensions));
    formDataSend.append("title", formData["Title"] || "");
    formDataSend.append("description", formData["Description"] || "");
    formDataSend.append("category", formData["Category Name"] || "");
    formDataSend.append("detailDescription", formData.fieldDescription || "");

    if (mobileFile) formDataSend.append("mobile", mobileFile);
    if (webFile) formDataSend.append("web", webFile);
    
    formDataSend.append("redirectUrl", formData["Company URL"] || "");

    const response = await fetch("/api/moneySmart", {
      method: "POST",
      body: formDataSend,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to add");
    return { success: true, data };
  } catch (error) {
    console.error("Error adding money:", error);
    return { success: false };
  }
};


export const deleteMoney = async (id: string) => {
  try {
    const response = await fetch(`/api/moneySmart?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to delete");
    return { success: true };
  } catch (error) {
    console.error("Error deleting money:", error);
    return { success: false };
  }
};