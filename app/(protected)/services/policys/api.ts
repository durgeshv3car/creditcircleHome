export const deletepolicy = async (id: string) => {
  try {
    const response = await fetch(`/api/policys?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error deleting policy:", error);
    return { success: false };
  }
};

export const updatepolicy = async (id: string, title: string, description: string) => {
  try {
    const response = await fetch(`/api/policys?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error updating policy:", error);
    return { success: false };
  }
};

export const addpolicy = async (title: string, description: string) => {
  try {
    const response = await fetch(`/api/policys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error adding policy:", error);
    return { success: false };
  }
};

export const fetchpolicy = async () => {
  try {
    const response = await fetch(`/api/policys`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching policies:", error);
    return [];
  }
};