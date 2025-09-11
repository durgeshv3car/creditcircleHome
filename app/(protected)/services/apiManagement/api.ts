export const deleteAPi = async (id: string) => {
  try {
    const response = await fetch(`/api/apiManagement?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error deleting API:", error);
    return { success: false };
  }
};

export const updateApi = async (
  id: string,
  dimensions: any,
  name?: string,
  isActive?: boolean,
  imageFile?: File | null,
  currentImageUrl?: string | null
) => {
  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("type", "api");
    formData.append("dimensions", JSON.stringify(dimensions));

    if (name !== undefined) formData.append("name", name);
    if (isActive !== undefined) formData.append("isActive", String(isActive));
    if (imageFile) {
      formData.append("mobile", imageFile);
    }
    if (!currentImageUrl) formData.append("mobileUrl", "empty");

    const response = await fetch(`/api/apiManagement?id=${id}`, {
      method: "PUT",
      body: formData,
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error updating API:", error);
    return { success: false };
  }
};

export const addApi = async (
  name: string,
  dimensions: any,
  imageFile?: File | null
) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", "api");
    formData.append("dimensions", JSON.stringify(dimensions));

    if (imageFile) {
      formData.append("mobile", imageFile);
    }

    const response = await fetch(`/api/apiManagement`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error adding API:", error);
    return { success: false };
  }
};

export const fetchApis = async () => {
  try {
    const response = await fetch(`/api/apiManagement`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching APIs:", error);
    return [];
  }
};

export const fetchApiFilter = async (
  name: string,
  startDate: string,
  endDate: string
) => {
  try {
    const response = await fetch(`/api/apiManagement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, startdate: startDate, enddate: endDate }),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error fetching APIs:", error);
    return { error: "Failed to fetch APIs" };
  }
};
