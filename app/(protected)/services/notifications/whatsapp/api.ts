export const fetchNotifications = async () => {
  try {
    const response = await fetch(`/api/notifications/whatsapp`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};
