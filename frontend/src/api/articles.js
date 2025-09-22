import api from "./client";

export async function listArticles({ q, categoryId, tag, authorId } = {}) {
  const { data } = await api.get("/articles", {
    params: { q, categoryId, tag, authorId },
  });
  return data;
}

export async function getArticleBySlug(slug) {
  const { data } = await api.get(`/articles/${slug}`);
  return data;
}

export async function listUserArticles(userId) {
  const { data } = await api.get("/articles", {
    params: { authorId: userId },
  });
  return data;
}

// Réservé MOD/ADMIN :
export async function createArticle({
  title,
  summary,
  content,
  categoryId,
  tagIds = [],
}) {
  const { data } = await api.post("/articles", {
    title,
    summary,
    content,
    categoryId,
    tagIds,
  });
  return data;
}
