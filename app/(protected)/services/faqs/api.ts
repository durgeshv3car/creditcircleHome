export const deletefaq = async (id: string) => {
  try {
    const response = await fetch(`/api/faqs?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error deleting faq:", error);
    return { success: false };
  }
};

export const updatefaq = async (id: string, title: string, description: string) => {
  try {
    const response = await fetch(`/api/faqs?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error updating faq:", error);
    return { success: false };
  }
};

export const addfaq = async (title: string, description: string) => {
  try {
    const response = await fetch(`/api/faqs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error adding faq:", error);
    return { success: false };
  }
};

export const fetchfaq = async () => {
  try {
    const response = await fetch(`/api/faqs`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching faqs:", error);
    return [];
  }
};