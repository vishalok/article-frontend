import axios from "axios";

const api = axios.create({
  baseURL: "https://articles-ai.free.nf/api",
  headers: {
    "Content-Type": "application/json",
  },

});

export const getArticles = () => api.get("/articles");
export const getArticleById = (id) => api.get(`/articles/${id}`);
export const getLatestArticles = () => api.get("/articles-latest");

export const createArticle = (data) => api.post("/articles", data);
export const updateArticle = (id, data) => api.put(`/articles/${id}`, data);
export const deleteArticle = (id) => api.delete(`/articles/${id}`);

export const generateAiVersion = (id) =>
  api.post(`/articles/${id}/ai-version`);
