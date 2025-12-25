import { useNavigate } from "react-router-dom";

export default function ArticleCard({ article, onDelete }) {
  const navigate = useNavigate();

  const isAiArticle = article.type === "ai_updated";

  return (
    <div className={`card ${isAiArticle ? "ai-card" : ""}`}>
      <h3>{article.title}</h3>
      <p>{article.description}</p>

      {/* ✅ Show parent title for AI article */}
      {isAiArticle && article.parent_title && (
        <small className="parent">
          Parent Article: <b>{article.parent_title}</b> <br />
        </small>
      )}

      <small>
        Type: <b>{article.type}</b>
      </small>

      <div className="actions">
        {/* 👁 View always allowed */}
        <button onClick={() => navigate(`/view/${article.id}`)}>
          👁 View
        </button>

        {/* 🤖 AI Version (READ-ONLY) */}
        {isAiArticle && (
          <button className="ai-btn" disabled>
            🤖 AI Version
          </button>
        )}

        {/* ✏️🗑 Only for original articles */}
        {!isAiArticle && (
          <>
            <button onClick={() => navigate(`/edit/${article.id}`)}>
              ✏️ Edit
            </button>

            <button onClick={() => onDelete(article.id)}>
              🗑 Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
