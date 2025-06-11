

export const deleteDevice = async (id: string) => {
  try {
    const response = await fetch(`/api/deviceInfo?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error deleting device:", error);
    return { success: false };
  }
};

export const fetchDevices = async () => {

  try {
    
    const response = await fetch(`/api/deviceInfo`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching devices:", error);
    return [];
  }
};