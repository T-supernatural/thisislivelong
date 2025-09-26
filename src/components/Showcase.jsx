import { useState } from "react";
import { motion } from "framer-motion";

function Showcase() {
  const [selectedImage, setSelectedImage] = useState(null);

  const portfolioItems = [
    { img: "https://via.placeholder.com/800x600", title: "Fish Farm Setup" },
    { img: "https://via.placeholder.com/800x600", title: "Harvest Day" },
    { img: "https://via.placeholder.com/800x600", title: "Journaling Moments" },
    { img: "https://via.placeholder.com/800x600", title: "Community Training" },
  ];

  const blogPosts = [
    {
      title: "Lessons from the Pond",
      excerpt:
        "Fishery is more than farming — it’s patience, vision, and resilience...",
    },
    {
      title: "Why Journaling Matters",
      excerpt:
        "The best gospel to preach is yourself — here’s how journaling sharpens growth...",
    },
    {
      title: "Faith in Entrepreneurship",
      excerpt:
        "Blending business with belief creates something far stronger than profit alone...",
    },
  ];

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
    <section className="w-full px-6 md:px-20 py-20 bg-gradient-to-b from-white to-green-50 space-y-28">
      {/* Portfolio Section */}
      <motion.div
        id="works"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <header className="mb-14 text-center">
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            Our Works
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto"
          >
            A glimpse into the heart of what we build — where vision meets
            impact.
          </motion.p>
        </header>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          variants={stagger}
        >
          {portfolioItems.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              <img
                src={item.img}
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

      {/* Modal for Portfolio */}
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
              src={selectedImage.img}
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

      {/* Blog Section */}
      <motion.div
        id="journal"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <header className="mb-14 text-center">
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            Journal
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto"
          >
            Thoughts, reflections, and lessons from the journey.
          </motion.p>
        </header>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
          variants={stagger}
        >
          {blogPosts.map((post, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-2xl transition duration-300 hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {post.title}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {post.excerpt}
              </p>
              <button className="text-green-700 font-semibold hover:underline">
                Read More →
              </button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Showcase;
