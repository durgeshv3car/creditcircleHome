export const deletecompanyUrl = async (id: string) => {
  try {
    const response = await fetch(`/api/companyUrl?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error deleting companyUrl:", error);
    return { success: false };
  }
};

export const updatecompanyUrl = async (id: string, companyUrl: string) => {
  try {
    const response = await fetch(`/api/companyUrl?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyUrl }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error updating companyUrl:", error);
    return { success: false };
  }
};

export const addcompanyUrl = async (companyUrl: string) => {
  try {
    const response = await fetch(`/api/companyUrl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyUrl }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error adding companyUrl:", error);
    return { success: false };
  }
};

export const fetchcompanyUrl = async () => {
  try {
    const response = await fetch(`/api/companyUrl`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching companyUrl:", error);
    return [];
  }
};