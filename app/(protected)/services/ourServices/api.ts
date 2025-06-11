export const fetchServices = async (type:string) => {
  try {
    const response = await fetch(`/api/ourServices?type=${type}`);
    const data = await response.json();
    return data.services || data || [];
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export const updateService = async (
  id: string,
  type: string,
  dimension: any,
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
    formDataSend.append("dimensions", JSON.stringify(dimension));

    if (!mobileUrl) formDataSend.append("mobileUrl", "empty");
    if (!webUrl) formDataSend.append("webUrl","empty");

    if (editedData.title) formDataSend.append("title", editedData.title);
    if (editedData.description)
      formDataSend.append("description", editedData.description );
    if (mobileFile) formDataSend.append("mobile", mobileFile);
    if (editedData.buttonType) formDataSend.append("buttonType", editedData.buttonType);
    if (webFile) formDataSend.append("web", webFile);
    if (editedData.companyUrl)
      formDataSend.append("companyUrl", editedData.companyUrl);
    if (editedData.annualFee)
      formDataSend.append("annualFee", editedData.annualFee);
    if (editedData.joiningFee)
      formDataSend.append("joiningFee", editedData.joiningFee);
    if (editedData.active !== undefined)
      formDataSend.append("active", editedData.active);

    const response = await fetch("/api/ourServices", {
      method: "PUT",
      body: formDataSend,
    });
    const data = await response.json();
    return { success: response.ok, message: data.message || "service updated successfully" };
  } catch (error) {
    console.error("Error updating service:", error);
    return { success: false, message: "Failed to update service" };
  }
};

export const addService = async (
  type: string,
  dimensions: any,
  formData: any,
  mobileFile?: File | null,
  webFile?: File | null,
) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("type", type);
    formDataSend.append("dimensions", JSON.stringify(dimensions));
    formDataSend.append("title", formData["Title"] || "");
    formDataSend.append("description", formData.fieldDescription || "");
    formDataSend.append("buttonType", formData["Button Name"] || "");

    if (mobileFile) formDataSend.append("mobile", mobileFile);
    if (webFile) formDataSend.append("web", webFile);

    formDataSend.append("companyUrl", formData["Company URL"] || "");
    formDataSend.append("joiningFee", formData["Joining Fee"] || "");
    formDataSend.append("annualFee", formData["Annual Fee"] || "");

    const response = await fetch("/api/ourServices", {
      method: "POST",
      body: formDataSend,
    });
    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || "service added",
      data,
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

    const response = await fetch("/api/ourServices", {
      method: "PUT",
      body: formDataSend,
    });
    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || `Recommend ${value ? "activated" : "deactivated"} successfully`,
    };
  } catch (error) {
    console.error("Error updating isActive:", error);
    return { success: false, message: "Failed to update status" };
  }
};

export const deleteService = async (id: string) => {
  try {
    const response = await fetch(`/api/ourServices?id=${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return { success: response.ok, message: data.message || "Service data deleted" };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, message: "Service data not deleted" };
  }
};
