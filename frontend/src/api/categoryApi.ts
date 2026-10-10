
import axios from "axios";

const API_URL = "http://localhost:5095/api/Categories";

export type Category = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
};

export type CategoryRequest = {
  name: string;
  description: string;
};

export async function getCategories(): Promise<Category[]> {
  const response = await axios.get<Category[]>(API_URL);
  return response.data;
}

export async function createCategory(
  data: CategoryRequest
): Promise<Category> {
  const response = await axios.post<Category>(API_URL, data);
  return response.data;
}

export async function updateCategory(
  id: string,
  data: CategoryRequest
): Promise<void> {
  await axios.put(`${API_URL}/${id}`, data);
}

export async function setCategoryStatus(
  id: string,
  isActive: boolean
): Promise<void> {
  await axios.patch(`${API_URL}/${id}/status`, { isActive });
}