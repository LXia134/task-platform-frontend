import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const fetchTasks = async (
    page = 1,
    limit = 5,
    sortBy = "createdAt",
    order = "DESC",
    status?: string,  
    searchQuery?: string 
  ) => {
    const response = await axios.get(`${API_URL}/tasks`, {
      params: { page, limit, sortBy, order, status, searchQuery }, 
    });
    return response.data;
  };

export const fetchTaskHistory = async (taskId: string) => {
    try {
      const response = await axios.get(`${API_URL}/tasks/${taskId}`);
      return response.data.history;
    } catch (error) {
      console.error("Error fetching task history:", error);
      return [];
    }
  };
  

export const createTask = async (task: { title: string; description?: string }) => {
  const response = await axios.post(`${API_URL}/tasks`, task);
  return response.data;
};

export const updateTask = async (id: string, updatedData: { title?: string; description?: string; status?: string }) => {
    try {
      const response = await axios.patch(`${API_URL}/tasks/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  

export const deleteTask = async (id: string) => {
  console.log(`Calling PATCH ${API_URL}/tasks/${id}/soft-delete`);
  const response = await axios.patch(`${API_URL}/tasks/${id}/soft-delete`);
  return response.data;
};

export const restoreTask = async (id: string) => {
  const response = await axios.patch(`${API_URL}/tasks/${id}/restore`);
  return response.data;
};
