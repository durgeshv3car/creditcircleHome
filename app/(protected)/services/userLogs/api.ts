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


export const createLogs = async (action: string) => {
  try {
    const response = await fetch("/api/userLogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action }), 
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to create log");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating log:", error);
    return null;
  }
};
