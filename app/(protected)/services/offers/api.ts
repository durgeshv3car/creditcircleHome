import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const fetchOffers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/offer/offer`, {
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

export const updateOffer = async (
  id: string,
  type: string,
  editedData: any,
  mobileFile?: File,
  webFile?: File,
  brandLogoImage?: File,
) => {
  if (!id) return { success: false, message: "ID is required" };

  try {
    const formDataSend = new FormData();
    formDataSend.append("id", id);
    formDataSend.append("type", type);

    if (editedData.title) formDataSend.append("title", editedData.title);
    if (editedData.description)
      formDataSend.append("description", editedData.description);
    if (editedData.detailDescription) formDataSend.append("detailDescription", editedData.detailDescription);
    if (mobileFile) formDataSend.append("mobile", mobileFile);
    if (webFile) formDataSend.append("web", webFile);
    if (brandLogoImage) formDataSend.append("brandLogo", brandLogoImage);
   
    if (editedData.companyUrl)
      formDataSend.append("companyUrl", editedData.companyUrl);
    if (editedData.active !== undefined)
      formDataSend.append("active", editedData.active);

    await axios.put(`${API_BASE_URL}/offers`, formDataSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { success: true, message: "Offer updated successfully" };
  } catch (error) {
    console.error("Error updating offer:", error);
    return { success: false, message: "Failed to update offer" };
  }
};

export const addOffer = async (
  type: string,
  formData: any,
  mobileFile?: File,
  webFile?: File,
  brandLogoImage?: File,
) => {
  try {
    
    const formDataSend = new FormData();
    formDataSend.append("type", type);
    formDataSend.append("title", formData["Title"] || "");
    formDataSend.append("description", formData["Description"] || "");
    formDataSend.append("category", formData["Category Name"] || "");
    formDataSend.append("buttonType", formData["Button Name"] || "");
    formDataSend.append("detailDescription", formData.fieldDescription || "");
    formDataSend.append("brandName", formData["Brand Name"] || "");

    if (mobileFile) formDataSend.append("mobile", mobileFile);
    if (webFile) formDataSend.append("web", webFile);
    if (brandLogoImage) formDataSend.append("brandLogo", brandLogoImage);
   

    formDataSend.append("redirectUrl", formData["Company URL"] || "");

    const response = await axios.post(`${API_BASE_URL}/offers`, formDataSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return {
      success: true,
      message: "Recommended image added",
      data: response.data,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, message: "Recommended image not added" };
  }
};

export const toggleOfferStatus = async (id: string, value: boolean) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("id", id);
    formDataSend.append("type", "offer");
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
export const toggleHomeStatus = async (id: string, value: boolean) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("id", id);
    formDataSend.append("type", "offer");
    formDataSend.append("isHome", String(value));

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


export const deleteOffer = async (id: string) => {
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
