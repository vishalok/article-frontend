import { BrowserRouter, Routes, Route } from "react-router-dom";
import ArticleList from "./pages/ArticleList";
import ArticleForm from "./pages/ArticleForm";
import ArticleView from "./pages/ArticleView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticleList />} />
        <Route path="/create" element={<ArticleForm />} />
        <Route path="/edit/:id" element={<ArticleForm />} />
        <Route path="/view/:id" element={<ArticleView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
