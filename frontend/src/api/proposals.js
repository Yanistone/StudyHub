import api from "./client";

export async function createProposal({ type, targetArticleId, payloadJson }) {
  const payload =
    typeof payloadJson === "string" ? payloadJson : JSON.stringify(payloadJson);
  const { data } = await api.post("/proposals", {
    type,
    targetArticleId,
    payloadJson: payload,
  });
  return data;
}
