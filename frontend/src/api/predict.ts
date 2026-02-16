import api from "./client";
import type { BatchResponse } from "@/types/prediction";

export async function predictBatch(file: File): Promise<BatchResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<BatchResponse>("/predict/batch", formData);
  return response.data;
}

export async function fetchSample(): Promise<BatchResponse> {
  const response = await api.get<BatchResponse>("/sample");
  return response.data;
}
