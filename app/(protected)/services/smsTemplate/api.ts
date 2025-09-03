export const deleteSms = async (id: string) => {
  try {
    const response = await fetch(`/api/smsTemplate?id=${id}`, {
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

export const updateSms = async (id: string, name?: string, isActive?: boolean) => {
  try {
    const updatePayload: any = {};
    if (name !== undefined) updatePayload.name = name;
    if (isActive !== undefined) updatePayload.isActive = isActive;
    const response = await fetch(`/api/smsTemplate?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error updating API:", error);
    return { success: false };
  }
};

export const addSms = async (name: string) => {
  try {
    const response = await fetch(`/api/smsTemplate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error adding API:", error);
    return { success: false };
  }
};

export const fetchSms = async () => {
  try {
    const response = await fetch(`/api/smsTemplate`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching APIs:", error);
    return [];
  }
};