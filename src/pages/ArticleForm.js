import { useEffect, useState } from "react";
import {
  createArticle,
  updateArticle,
  getArticleById
} from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function ArticleForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState(""); // comma-separated
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [categoriesJson, setCategoriesJson] = useState("[]"); // JSON string
  const [parentArticleId, setParentArticleId] = useState("");
  const [type, setType] = useState("original"); // 'original' or 'ai_updated'
  const [references, setReferences] = useState(""); // comma-separated URLs
const [htmlError, setHtmlError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
// Initialize state with current timestamp in ISO format (without seconds is fine too)
const [publishedAt, setPublishedAt] = useState(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`; // ISO format compatible with timestamp
});

  useEffect(() => {
    if (id) {
      getArticleById(id).then(res => {
        const data = res.data;
        setTitle(data.title || "");
        setDescription(data.description || "");
        setContent(data.content || "");
        setUrl(data.url || "");
        setTags(data.tags?.join(",") || "");
        setAuthor(data.author || "");
        setImage(data.image || "");
        setCategoriesJson(JSON.stringify(data.categoriesJson || []));
        setPublishedAt(data.published_at || "");
        setParentArticleId(data.parent_article_id || "");
        setType(data.type || "original");
        setReferences(data.references?.join(",") || "");
      });
    }
  }, [id]);
function isValidHTML(html) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Detect parser errors
    const parserErrors = doc.querySelector("parsererror");
    if (parserErrors) return false;

    // Must contain at least one HTML element
    const hasElement = doc.body.children.length > 0;
    return hasElement;
  } catch {
    return false;
  }
}
function hasUnclosedTags(html) {
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  const selfClosing = new Set([
    "br","hr","img","input","meta","link","area","base",
    "col","embed","param","source","track","wbr"
  ]);

  const stack = [];
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();

    if (selfClosing.has(tagName)) continue;

    if (fullTag.startsWith("</")) {
      if (stack.pop() !== tagName) return true;
    } else {
      stack.push(tagName);
    }
  }

  return stack.length > 0;
}

function isStrictValidHTML(html) {
  if (!html.trim()) return false;

  // Must contain at least one tag
  if (!/<[a-z][\s\S]*>/i.test(html)) return false;

  // Must not contain unclosed tags
  if (hasUnclosedTags(html)) return false;

  return true;
}

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      content,
      url,
      tags: tags.split(",").map(tag => tag.trim()),
      author,
      image,
      categoriesJson: JSON.parse(categoriesJson),
      published_at: publishedAt,
      parent_article_id: parentArticleId || null,
      type: "original",  
      references: references.split(",").map(ref => ref.trim())
    };
  if (!isStrictValidHTML(content)) {
    setHtmlError("Invalid HTML. Fix content before saving.");
    return;
  }

    if (id) {
      await updateArticle(id, payload);
    } else {
      await createArticle(payload);
    }

    navigate("/");
  };

  return (
    <form className="form max-w-2xl mx-auto p-4 space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold">{id ? "Edit" : "Create"} Article</h2>

      <div>
        <label className="block font-medium">
          Title <span className="text-red">*</span>
        </label>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

     {/* <div>
        <label className="block font-medium">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows="6"
          required
          className="w-full border p-2 rounded mt-1"
        />
      </div> */}
  <div>
  <label className="block font-medium">
    Content <span className="text-red">*</span>
  </label>

  <textarea
  value={content}
  placeholder="Enter HTML content"
  onChange={e => setContent(e.target.value)}
  onBlur={() => {
    if (!isStrictValidHTML(content)) {
      setHtmlError("Invalid HTML. Close all tags properly.");
    } else {
      setHtmlError("");
    }
  }}
  rows="6"
  required
  className={`textarea-base ${htmlError ? "textarea-error" : ""}`}
/>


  {htmlError && (
    <p className="error-text">{htmlError}</p>
  )}
</div>




      <div>
        <label className="block font-medium">URL</label>
        <input
          placeholder="URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="block font-medium">Tags (comma separated)</label>
        <input
          placeholder="Tags"
          value={tags}
          onChange={e => setTags(e.target.value)}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="block font-medium">Author</label>
        <input
          placeholder="Author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="block font-medium">Image URL</label>
        <input
          placeholder="Image URL"
          value={image}
          onChange={e => setImage(e.target.value)}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="block font-medium">Categories JSON</label>
        <textarea
          placeholder='e.g. ["tech","ai"]'
          value={categoriesJson}
          onChange={e => setCategoriesJson(e.target.value)}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

     

      {/* <div>
        <label className="block font-medium">Parent Article ID</label>
        <input
          placeholder="Parent Article ID"
          value={parentArticleId}
          onChange={e => setParentArticleId(e.target.value)}
          className="w-full border p-2 rounded mt-1"
        />
      </div> */}

      {/* <div>
        <label className="block font-medium">Type</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full border p-2 rounded mt-1"
        >
          <option value="original">Original</option>
          <option value="ai_updated">AI Updated</option>
        </select>
      </div> */}

      {/* <div>
        <label className="block font-medium">References (comma separated URLs)</label>
        <input
          placeholder="References"
          value={references}
          onChange={e => setReferences(e.target.value)}
          className="w-full border p-2 rounded mt-1"
        />
      </div> */}

      <button
        type="submit"
        className="btn-primary"
      >
        Save
      </button>
    </form>
  );
}
