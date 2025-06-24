


export const fetchOffers = async () => {
  try {
    const response = await fetch("/api/offers");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch data");
    return data.offers || data || [];
  } catch (error) {
    console.error("Error fetching offers:", error);
    return [];
  }
};

export const updateOffer = async (
  id: string,
  type: string,
  dimensions: any,
  editedData: any,
  mobileFile?: File | null,
  webFile?: File | null,
  bannerFile?: File | null,
  brandLogoFile?: File | null,
  mobileUrl?: string | null,
  webUrl?: string | null,
  bannerUrl?: string | null,
  logoUrl?: string | null,
) => {
  if (!id) return { success: false, message: "ID is required" };

  try {
    const formDataSend = new FormData();
    formDataSend.append("id", id);
    formDataSend.append("type", type);
    formDataSend.append("dimensions", JSON.stringify(dimensions));
    if (!mobileUrl) formDataSend.append("mobileUrl", "empty");
    if (!webUrl) formDataSend.append("webUrl", "empty");
    if (!bannerUrl) formDataSend.append("bannerUrl", "empty");
    if (!logoUrl) formDataSend.append("logoUrl", "empty");

    if (editedData.title) formDataSend.append("title", editedData.title);
    if (editedData.buttonType) formDataSend.append("buttonType", editedData.buttonType);
    if (editedData.brandName) formDataSend.append("brandName", editedData.brandName);
    if (editedData.category) formDataSend.append("category", editedData.category);
    if (editedData.description) formDataSend.append("description", editedData.description);
    if (editedData.detailDescription) formDataSend.append("detailDescription", editedData.detailDescription);
    if (mobileFile) formDataSend.append("mobile", mobileFile);
    if (webFile) formDataSend.append("web", webFile);
    if (bannerFile) formDataSend.append("banner", bannerFile);
    if (brandLogoFile) formDataSend.append("brandLogo", brandLogoFile);
    if (editedData.redirectUrl) formDataSend.append("redirectUrl", editedData.redirectUrl);
    if (editedData.isActive !== undefined) formDataSend.append("isActive", String(editedData.isActive));
    if (editedData.isHome !== undefined) formDataSend.append("isHome", String(editedData.isHome ));

    const response = await fetch("/api/offers", {
      method: "PUT",
      body: formDataSend,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to update");
    return { success: true };
  } catch (error) {
    console.error("Error updating offer:", error);
    return { success: false, message: "Failed to update offer" };
  }
};

export const addOffer = async (
  type: string,
  dimensions: any,
  formData: any,
  mobileFile?: File,
  webFile?: File,
  bannerFile?: File,
  brandLogoFile?: File
) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("type", type);
    formDataSend.append("dimensions", JSON.stringify(dimensions));
    formDataSend.append("title", formData["Title"] || "");
    formDataSend.append("description", formData["Description"] || "");
    formDataSend.append("category", formData["Category Name"] || "");
    formDataSend.append("buttonType", formData["Button Name"] || "");
    formDataSend.append("detailDescription", formData.fieldDescription || "");
    formDataSend.append("brandName", formData["Brand Name"] || "");

    if (mobileFile) formDataSend.append("mobile", mobileFile);
    if (webFile) formDataSend.append("web", webFile);
    if (brandLogoFile) formDataSend.append("brandLogo", brandLogoFile);
    if (bannerFile) formDataSend.append("banner", bannerFile);
    
    formDataSend.append("redirectUrl", formData["Company URL"] || "");

    const response = await fetch("/api/offers", {
      method: "POST",
      body: formDataSend,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to add");
    return { success: true, data };
  } catch (error) {
    console.error("Error adding offer:", error);
    return { success: false };
  }
};


export const deleteOffer = async (id: string) => {
  try {
    const response = await fetch(`/api/offers?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to delete");
    return { success: true };
  } catch (error) {
    console.error("Error deleting offer:", error);
    return { success: false };
  }
};
