import axios from "axios";

const API_URL = "http://localhost:5095/api/Products";

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  unit: string;
  imageUrl: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string | null;
  category: {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
  };
};

export type ProductResponse = {
  items: Product[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export async function getProducts(params?: {
  search?: string;
  categoryId?: string;
  isAvailable?: boolean;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}) {
  const response = await axios.get<ProductResponse>(API_URL, {
    params,
  });

  return response.data;
}

export async function getProductById(id: string) {
  const response = await axios.get<Product>(`${API_URL}/${id}`);

  return response.data;
}


export type CreateProductRequest = {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  unit: string;
  imageUrl: string | null;
};

export async function createProduct(product: CreateProductRequest) {
  const response = await axios.post<Product>(API_URL, product);
  return response.data;
}


export type UpdateProductRequest = {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  unit: string;
  imageUrl: string | null;
  isAvailable: boolean;
};

export async function updateProduct(
  id: string,
  product: UpdateProductRequest
) {
  const response = await axios.put<Product>(
    `${API_URL}/${id}`,
    product
  );

  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await axios.delete(`${API_URL}/${id}`);
}


export async function uploadProductImage(
  image: File,
  token: string
): Promise<string> {
  const formData = new FormData();
  formData.append("image", image);

  const response = await axios.post<{ imageUrl: string }>(
    "http://localhost:5095/api/ProductImages/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.imageUrl;
}
