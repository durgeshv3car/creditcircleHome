// Use the Next.js API proxy endpoints instead of direct backend URLs
export const uploadLogoImage = async (formData: {
  type: string;
  dimensions: any;
  title?: string;
  mobileFile?: File | null;
  webFile?: File | null;
  companyUrl: string;
}) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("type", formData.type);
    formDataSend.append("title", formData.title || "");
    formDataSend.append("dimensions", JSON.stringify(formData.dimensions));
    if (formData.mobileFile) {
      formDataSend.append("mobile", formData.mobileFile);
    }
    if (formData.webFile) {
      formDataSend.append("web", formData.webFile);
    }
    formDataSend.append("companyUrl", formData.companyUrl);
    const response = await fetch("/api/logos", {
      method: "POST",
      body: formDataSend,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to upload");
    return { success: true, data };
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
    const response = await fetch(`/api/logos?type=${encodeURIComponent(type)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch");
    return data.images || data || [];
  } catch (error) {
    console.error("Error fetching Logo images:", error);
    return [];
  }
};

export const deleteLogoImage = async (id: string) => {
  try {
    const response = await fetch(`/api/logos?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to delete");
    return { success: true };
  } catch (error) {
    console.error("Error deleting Logo image:", error);
    return { success: false };
  }
};

export const updateLogoImage = async (
  id: string,
  type: string,
  dimensions: any,
  editedData: { title?: string; companyUrl?: string; active?: boolean },
  mobileFile?: File | null,
  webFile?: File | null,
  mobileUrl?: string | null,
  webUrl?: string | null
) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("id", id);
    formDataSend.append("type", type);
    formDataSend.append("dimensions", JSON.stringify(dimensions));
    if (!mobileUrl) formDataSend.append("mobileUrl", "empty");
    if (!webUrl) formDataSend.append("webUrl", "empty");
    if (editedData.title) formDataSend.append("title", editedData.title);
    if (mobileFile) formDataSend.append("mobile", mobileFile);
    if (webFile) formDataSend.append("web", webFile);
    if (editedData.companyUrl) formDataSend.append("companyUrl", editedData.companyUrl);
    if (editedData.active !== undefined) formDataSend.append("active", String(editedData.active));
    const response = await fetch("/api/logos", {
      method: "PUT",
      body: formDataSend,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to update");
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
    const response = await fetch("/api/logos", {
      method: "PUT",
      body: formDataSend,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to schedule delete");
    return { success: true };
  } catch (error) {
    console.error("Error scheduling delete:", error);
    return { success: false };
  }
};



