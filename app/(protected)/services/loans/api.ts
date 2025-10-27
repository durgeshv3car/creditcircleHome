import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const fetchLoans = async (params: any) => {
  try {
    const response = await axios.get(`${BASE_URL}/all-loan-application`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching loans:", error);
    throw error;
  }
};

export const fetchLoansLength = async (
  startdate: string,
  enddate: string,
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/all-loan-application-length?startdate=${startdate}&enddate=${enddate}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching loans:", error.message || error);
    throw error;
  }
};


export const singleLoans=async(phoneNumber:string)=>{
   try {
    const response = await fetch(`/api/loans?id=${phoneNumber}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching loans:", error);
    throw error;
  }

}

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
