export const deleteEmail = async (id: string) => {
  try {
    const response = await fetch(`/api/emailTemplate?id=${id}`, {
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

export const updateEmail = async (id: string, name?: string, isActive?: boolean) => {
  try {
    const updatePayload: any = {};
    if (name !== undefined) updatePayload.name = name;
    if (isActive !== undefined) updatePayload.isActive = isActive;
    const response = await fetch(`/api/emailTemplate?id=${id}`, {
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

export const addEmail = async (name: string) => {
  try {
    const response = await fetch(`/api/emailTemplate`, {
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

export const fetchEmail = async () => {
  try {
    const response = await fetch(`/api/emailTemplate`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching APIs:", error);
    return [];
  }
};