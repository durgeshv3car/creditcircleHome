export const fetchNotifications = async () => {
  try {
    const response = await fetch(`/api/notifications/app`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const createNotifications = async (payload: any) => {
  try {
    const response = await fetch(`/api/notifications/app`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

