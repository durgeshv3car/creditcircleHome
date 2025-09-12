




  export const uploadSliderImage = async (formData: {
    type: string;
    dimensions: any,
    title?: string;
    mobileFile?: File | null;
    webFile?: File | null;
    companyUrl: string;
  }) => {
    try {
      const formDataSend = new FormData();
      formDataSend.append("type", formData.type);
      formDataSend.append("dimensions", JSON.stringify(formData.dimensions));
      formDataSend.append("title", formData.title || "");
  
      if (formData.mobileFile) {
        formDataSend.append("mobile", formData.mobileFile);
      }
  
      if (formData.webFile) {
        formDataSend.append("web", formData.webFile);
      }
  
      formDataSend.append("companyUrl", formData.companyUrl);
  
      const response = await fetch("/api/sliders", {
        method: "POST",
        body: formDataSend,
      });
      const data = await response.json();
  
      return { success: response.ok, data };
    } catch (error) {
      console.error("Error uploading image:", error);
      return { success: false };
    }
  };

export const fetchSliderImages = async (type: string) => {
  try {
    const response = await fetch(`/api/sliders?type=${type}`);
    const data = await response.json();
  
    return data.images || data || [];
  } catch (error) {
    console.error("Error fetching slider images:", error);
    return [];
  }
};

export const deleteSliderImage = async (id: string) => {
  try {
    const response = await fetch(`/api/sliders?id=${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
  
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error deleting slider image:", error);
    return { success: false };
  }
};

export const updateSliderImage = async (
    id: string,
    type: string,
    dimensions:any,
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
      if (!webUrl) formDataSend.append("webUrl","empty");
  
      if (editedData.title) formDataSend.append("title", editedData.title);
      if (mobileFile) formDataSend.append("mobile", mobileFile);
      if (webFile) formDataSend.append("web", webFile);
      if (editedData.companyUrl) formDataSend.append("companyUrl", editedData.companyUrl);
      if (editedData.active !== undefined) formDataSend.append("active", String(editedData.active));
  
      const response = await fetch("/api/sliders", {
        method: "PUT",
        body: formDataSend,
      });
      const data = await response.json();
  
      return { success: response.ok, data };
    } catch (error) {
      console.error("Error updating slider image:", error);
      return { success: false };
    }
  };

export const scheduleExpireSliderImage = async (id: string, expireDate: Date) => {
  try {
    const response = await fetch(`/api/sliders?id=${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expireDate }), 
    });

    const data = await response.json();
    console.log(data)

    return { success: response.ok, data };
  } catch (error) {
    console.error("❌ Error scheduling delete:", error);
    return { success: false };
  }
};


