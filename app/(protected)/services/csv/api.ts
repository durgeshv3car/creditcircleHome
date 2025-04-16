import { format } from 'date-fns';
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

/**
 * Uploads a CSV or XLSX file to the server
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} Response from the server
 */
export const addcsv = async (file) => {
    try {
      // Create a FormData object to properly send the file
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        `${API_BASE_URL}/csv`,
        formData,
        {
          headers: {
            // Don't set Content-Type when using FormData - axios will set it automatically
            // with the correct boundary for multipart/form-data
          },
        }
      );
  
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error uploading file:", error);
      return { success: false, error: error.message };
    }
};