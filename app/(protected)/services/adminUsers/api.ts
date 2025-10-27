import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch all users directly from backend
export const fetchUsers = async (token: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Error fetching users:", error.message || error);
    return [];
  }
};

// Create a new user
export const createUser = async (user: any, token: string) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, user, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: res.status === 200 || res.status === 201, data: res.data };
  } catch (error: any) {
    console.error("Error creating user:", error.message || error);
    return { success: false };
  }
};

// Update a user
export const updateUser = async (
  id: string,
  name?: string,
  email?: string,
  role?: string,
  permissions?: any,
  token?: string,
) => {
  try {
    const updatePayload: any = {};
    if (name !== undefined) updatePayload.name = name;
    if (email !== undefined) updatePayload.email = email;
    if (role !== undefined) updatePayload.role = role;
    if (permissions !== undefined) updatePayload.permissions = permissions;
    const res = await axios.put(`${BASE_URL}/auth/update/${id}`, updatePayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: res.status === 200, data: res.data };
  } catch (error: any) {
    console.error("Error updating user:", error.message || error);
    return { success: false };
  }
};

// Delete a user
export const deleteUser = async (id: string, adminId: string, token: string) => {
  try {
    const res = await axios.delete(`${BASE_URL}/auth/user/${adminId}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: res.status === 200, data: res.data };
  } catch (error: any) {
    console.error("Error deleting user:", error.message || error);
    return { success: false };
  }
};

