export const fetchLogs = async () => {
  try {
    const response = await fetch(`/api/userLogs`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user logs:", error);
    return [];
  }
};