import api from "./client";

export async function createProposal(data) {
  const response = await api.post("/proposals", data);
  return response.data;
}

export async function listUserProposals() {
  const response = await api.get("/proposals/my");
  return response.data;
}

export async function reviewProposal(id, data) {
  const response = await api.put(`/proposals/${id}/review`, data);
  return response.data;
}
