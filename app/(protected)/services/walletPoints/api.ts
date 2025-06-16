export const deleteWallet = async (id: string) => {
  try {
    const response = await fetch(`/api/walletPoints?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error deleting wallet:", error);
    return { success: false };
  }
};

export const updateWallet = async (id: string, title: string) => {
  try {
    const response = await fetch(`/api/walletPoints?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error updating wallet:", error);
    return { success: false };
  }
};

export const addWallet = async (title: string) => {
  try {
    const response = await fetch(`/api/walletPoints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error adding wallet:", error);
    return { success: false };
  }
};

export const fetchWallet = async () => {
  try {
    const response = await fetch(`/api/walletPoints`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return [];
  }
};