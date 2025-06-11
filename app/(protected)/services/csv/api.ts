import { format } from 'date-fns';
// Removed axios import as it's no longer needed

/**
 * Uploads a CSV or XLSX file to the server
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} Response from the server
 */
export const addcsv = async (file: File ) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch("/api/csv", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error("Error uploading file:", error);
      return { success: false, error: (error as any).message };
    }
};