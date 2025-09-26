import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

function JournalPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from("journal")
        .select("title, content, created_at")
        .eq("id", id)
        .single();

      if (!error) setArticle(data);
    };

    fetchArticle();
  }, [id]);

  if (!article) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading article...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link to="/" className="text-green-700 font-semibold hover:underline">
        ← Back to Journal
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-6">
        {article.title}
      </h1>
      <p className="text-sm text-gray-500 mt-2">
        {new Date(article.created_at).toLocaleDateString()}
      </p>
      <div className="prose lg:prose-lg mt-8 text-gray-800">
        <p>{article.content}</p>
      </div>
    </div>
  );
}

export default JournalPage;
