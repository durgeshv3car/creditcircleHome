import axios from "axios";
const Api_url = process.env.NEXT_PUBLIC_API_BASE_URL;

export const customerStatus = async (id:string, phoneNumber:number) => {
  try {
    const response = await axios.post(`${Api_url}/customer-status`, {
      createToken: {
        id,
        phoneNumber,
      },
    });
    return response?.data;
  } catch (error) {
    console.error("Error in customerStatus:", error);
    throw error;
  }
};
