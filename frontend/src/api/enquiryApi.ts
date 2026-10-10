
import axios from "axios";

const API_URL = "http://localhost:5095/api/Enquiries";

export type CreateEnquiryRequest = {
  productId: string | null;
  customerName: string;
  phone: string;
  email?: string;
  message: string;
};

export type Enquiry = {
  id: string;
  productId: string | null;
  productName: string | null;
  customerName: string;
  phone: string;
  email: string | null;
  message: string;
  status: "New" | "Contacted" | "Resolved";
  createdAt: string;
};

export async function createEnquiry(
  data: CreateEnquiryRequest
): Promise<Enquiry> {
  const response = await axios.post<Enquiry>(API_URL, data);
  return response.data;
}