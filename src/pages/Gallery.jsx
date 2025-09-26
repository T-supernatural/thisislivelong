import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

function Gallery(params) {

  const [selectedImage, setSelectedImage] = useState(null);
  const [allPortfolioItems, setAllPortfolioItems] = useState([]);

  // Fetch all showcase items
  useEffect(() => {
    const fetchAllShowcase = async () => {
      const { data, error } = await supabase
        .from("showcase")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching all showcase items:", error);
      else setAllPortfolioItems(data);
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
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            My Work Showcase
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto"
          >
            Explore My Gallery.
          </motion.p>
        </header>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          variants={stagger}
        >
          {allPortfolioItems.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              <img
                src={item.image_url}
                alt={item.title}
                loading="lazy"
                className="object-cover w-full h-64 group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-white font-semibold text-lg tracking-wide">
                  {item.title}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
              loading="lazy"
            />
            <p className="text-center text-white mt-4 text-lg font-medium">
              {selectedImage.title}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;
