import { SelectedValues } from './../../../Tools/messageCenter/sms/page';
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import qs from "qs"

export const fetchNotifications = async (params?: any) => {
  try {
     const response = await axios.get(`${BASE_URL}/getallnotifications`, {
      params, 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};
export const fetchNotificationsCount = async (params?: any) => {
  try {
     const response = await axios.get(`${BASE_URL}/getallnotificationscount`, {
      params, 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const fetchNotificationsFilters = async (type:string) => {
  try {
     const response = await axios.get(`${BASE_URL}/getnotificationfilters`, {
      params: { type },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};




export const createNotifications = async (payload: any) => {
  try {
    

    const response = await axios.post(
      `${BASE_URL}/notifications`,
      payload,
      {
        params: payload.selectedValues, 
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("❌ Error creating notification:", error);
    throw error.response?.data || error.message;
  }
};

