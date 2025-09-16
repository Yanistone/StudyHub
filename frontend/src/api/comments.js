import api from "./client";

export async function listCommentsByArticle(articleId) {
  const { data } = await api.get(`/comments/article/${articleId}`);
  return data;
}

export async function addComment(articleId, content) {
  const { data } = await api.post(`/comments/article/${articleId}`, {
    content,
  });
  return data;
}
