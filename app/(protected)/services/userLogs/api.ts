import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchLogs = async (
  page: number = 1,
  limit: number = 10,
  startDate?: string,
  endDate?: string,
  token?: string
) => {
  try {
    console.log(startDate,endDate)
    const response = await axios.get(`${BASE_URL}/logs?page=${page}&limit=${limit}&startdate=${startDate}&enddate=${endDate}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
 
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching user logs:",
      error.response?.data || error.message
    );
    return { data: [], totalRecords: 0 };
  }
};
export const fetchLogsWithDate = async (
  page: number = 1,
  limit: number = 10,
  startdate?: string,
  enddate?: string,
  token?: string
) => {
  try {
    const response = await axios.get(`${BASE_URL}/logs?page=${page}&limit=${limit}&startdate=${startdate}&enddate=${enddate}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
 
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching user logs:",
      error.response?.data || error.message
    );
    return { data: [], totalRecords: 0 };
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
