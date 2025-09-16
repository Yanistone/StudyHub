import api from "./client";

export async function listArticles({ q, categoryId, tag } = {}) {
  const { data } = await api.get("/articles", {
    params: { q, categoryId, tag },
  });
  return data;
}

export async function getArticleBySlug(slug) {
  const { data } = await api.get(`/articles/${slug}`);
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
