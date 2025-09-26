import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";
import { useLocation } from "react-router-dom";

export default function Gallery() {
  const location = useLocation();
  const initialSelected = location.state?.selected || null; // <-- get selected from route state
  const [selectedImage, setSelectedImage] = useState(initialSelected);
  const [allPortfolioItems, setAllPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all showcase items
  useEffect(() => {
    const fetchAllShowcase = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("showcase")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching showcase items:", error);
      else setAllPortfolioItems(data || []);

      setLoading(false);
    };

    fetchAllShowcase();
  }, []);

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <section className="w-full px-6 md:px-20 py-20 bg-gradient-to-b from-white to-green-50 space-y-20">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <header className="my-14 text-center">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-gray-900">
            My Work Showcase
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
            Explore My Gallery.
          </motion.p>
        </header>

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading gallery...</p>
        ) : allPortfolioItems.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No items found.</p>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" variants={stagger}>
            {allPortfolioItems.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title || "Untitled"}
                    loading="lazy"
                    className="object-cover w-full h-64 group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">{item.title || "No image"}</p>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white font-semibold text-lg tracking-wide">{item.title || "Untitled"}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Modal for viewing full image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="relative max-w-3xl w-full mx-4 animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-white text-3xl hover:scale-110 transition-transform"
              onClick={() => setSelectedImage(null)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            {selectedImage.image_url ? (
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title || "Untitled"}
                className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-80 bg-gray-200 flex items-center justify-center rounded-xl shadow-2xl">
                <p className="text-gray-500">{selectedImage.title || "No image"}</p>
              </div>
            )}
            <p className="text-center text-white mt-4 text-lg font-medium">{selectedImage.title || "Untitled"}</p>
          </div>
        </div>
      )}
    </section>
  );
}
