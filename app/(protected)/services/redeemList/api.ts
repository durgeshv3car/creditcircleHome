export const uploadRedeemItem = async (formData: {
  type:string;
  dimensions:any  ;
  title: string;
  mobileFile: File | null;
  webFile:File |null;
  points:string;
}) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("type",formData.type)
    formDataSend.append("title", formData.title);
    formDataSend.append("dimensions",JSON.stringify(formData.dimensions))
    if (formData.mobileFile) {
      formDataSend.append("mobile", formData.mobileFile);
    }
    if (formData.webFile) {
      formDataSend.append("web", formData.webFile);
    }
    formDataSend.append("points", formData.points);
    
    const response = await fetch("/api/redeemList", {
      method: "POST",
      body: formDataSend,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to upload redeem item");
    return { success: true, data };
  } catch (error) {
    console.error("Error uploading redeem item:", error);
    return { success: false };
  }
};

export const fetchRedeemItems = async () => {
  try {
    const response = await fetch("/api/redeemList");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch redeem items");
    return data.data;
  } catch (error) {
    console.error("Error fetching redeem items:", error);
    return [];
  }
};


export const deleteRedeemItem = async (id: string) => {
  try {
    const response = await fetch(`/api/redeemList?id=${id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to delete redeem item");
    return { success: true };
  } catch (error) {
    console.error("Error deleting redeem item:", error);
    return { success: false };
  }
};

export const updateRedeemItem = async (
  id: string,
  type: string,
  dimensions: any,
  editedData: { title?: string; points?: string; active?: boolean },
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
    if (editedData.points) formDataSend.append("points", editedData.points);
    if (editedData.active !== undefined) formDataSend.append("active", String(editedData.active));
    

    const response = await fetch("/api/redeemList", {
      method: "PUT",
      body: formDataSend,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to update redeem item");
    return { success: true };
  } catch (error) {
    console.error("Error updating redeem item:", error);
    return { success: false };
  }
};
