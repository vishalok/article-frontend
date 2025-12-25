import { useEffect, useState } from "react";
import { getArticleById } from "../services/api";
import { useParams } from "react-router-dom";

export default function ArticleView() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    getArticleById(id).then(res => setArticle(res.data));
  }, [id]);

  if (!article) return <p>Loading...</p>;

  const isAiUpdated = article.type === "ai_updated";

  return (
    <div className="container">
      {/* ❌ Hide title & description for AI version */}
      {!isAiUpdated && (
        <>
          <h2>{article.title}</h2>
          <p>{article.description}</p>
        </>
      )}

      {/* ✅ Always show content */}
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
}
