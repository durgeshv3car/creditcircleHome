export const deleteUser = async (id: string, adminId: string) => {
  try {
    const response = await fetch(
      `/api/adminUsers?id=${id}&adminId=${adminId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false };
  }
};

export const createUser = async (user:any) => {
  try {
    const response = await fetch(`/api/adminUsers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false };
  }
}

export const updateUser = async (
  id: string,
  name?: string,
  email?: string,
  role?: string,
  permissions?: any
) => {
  try {
    const updatePayload: any = {};
    if (name !== undefined) updatePayload.name = name;
    if (email !== undefined) updatePayload.email = email;
    if (role !== undefined) updatePayload.role = role;
    if (permissions !== undefined) updatePayload.permissions = permissions;
    const response = await fetch(`/api/adminUsers?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false };
  }
};

export const fetchUsers = async () => {
  try {
    const response = await fetch(`/api/adminUsers`, {});
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
