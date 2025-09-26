import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function JournalList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("journal")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error(error);
      else setArticles(data);
    };
    fetchArticles();
  }, []);

  return (
    <section className="w-full px-6 md:px-20 py-20 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
        All Articles
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-2xl transition duration-300 hover:-translate-y-1">
            {post.image_url && (
              <img src={post.image_url} alt={post.title} className="w-full h-40 object-cover rounded-lg mb-4" />
            )}
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{post.title}</h3>
            <p className="text-gray-700 leading-relaxed mb-4">{post.excerpt}</p>
            <Link to={`/journal/${post.id}`} className="text-green-700 font-semibold hover:underline">
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
