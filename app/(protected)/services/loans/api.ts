export const fetchLoans = async () => {
  try {
    const response = await fetch(`/api/loans`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching loans:", error);
    throw error;
  }
};

export const updateLoan = async (userId: string, data: object) => {
  try {
    const response = await fetch(`/api/loans?id=${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating loan:", error);
    throw error;
  }
};

export const deleteLoan = async (userId: string) => {
  try {
    const response = await fetch(`/api/loans?id=${userId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting loan:", error);
    throw error;
  }
};
