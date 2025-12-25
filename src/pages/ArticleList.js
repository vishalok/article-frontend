import { useEffect, useState } from "react";
import { getArticles, deleteArticle } from "../services/api";
import { useNavigate } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getArticles().then(res => {
      const flattened = [];

      res.data.forEach(original => {
        // push original article
        flattened.push(original);

        // push ai_updated versions as separate cards
        if (Array.isArray(original.versions)) {
          original.versions.forEach(ai => {
            flattened.push({
              ...ai,
              parent_article_id: original.id,
              parent_title: original.title, // 👈 for display
            });
          });
        }
      });

      setArticles(flattened);
    });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article?")) return;

    await deleteArticle(id);
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="container">
      <button class="add-btn" onClick={() => navigate("/create")}>
        ➕ New Article
      </button>

      {articles.map(article => (
        <ArticleCard
          key={`${article.type}-${article.id}`}
          article={article}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
