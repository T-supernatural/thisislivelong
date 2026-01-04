import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";
import { useLocation } from "react-router-dom";

export default function Gallery() {
  let location = null;
  try {
    location = useLocation();
  } catch (err) {
    console.warn("useLocation not available:", err);
  }

  const initialSelected = location?.state?.selected || null;
  const [selectedImage, setSelectedImage] = useState(initialSelected);
  const [allPortfolioItems, setAllPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Cache of resolved, working image URLs by item id
  const [resolvedUrls, setResolvedUrls] = useState({});

  // Fetch all showcase items
  useEffect(() => {
    const fetchAllShowcase = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("showcase")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!data) throw new Error("No data returned from Supabase");

        console.log("Fetched showcase items:", data);
        setAllPortfolioItems(data);
      } catch (err) {
        console.error("Error fetching showcase items:", err);
        setError("Failed to load gallery.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllShowcase();
  }, []);

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };
  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.2 } } };

  // Derive usable image src from DB fields (prefers resolvedUrls cache, falls back)
  const getImageSrc = (item) => {
    if (!item) return null;

    // Prefer a previously-resolved working URL
    if (resolvedUrls[item.id]) return resolvedUrls[item.id];

    // If the DB contains a file_path (recommended), build a public URL
    if (item.file_path) {
      const { data } = supabase.storage.from("showcase-images").getPublicUrl(item.file_path);
      return data?.publicUrl || null;
    }

    // If we already have an absolute URL, return it (it may 404 but resolver will attempt to fix)
    if (item.image_url && item.image_url.startsWith("http")) return item.image_url;

    // If image_url contains a storage path like 'showcase-images/<file>', try building a public URL
    if (item.image_url) {
      const m = item.image_url.match(/showcase-images\/(.+)$/);
      if (m && m[1]) {
        const { data } = supabase.storage.from("showcase-images").getPublicUrl(m[1]);
        return data?.publicUrl || item.image_url;
      }
    }

    return item.image_url || null;
  };

  // Resolve and cache working URLs for items (tries original bucket and 'showcase-images')
  useEffect(() => {
    if (!allPortfolioItems || allPortfolioItems.length === 0) return;
    let mounted = true;

    const probeUrl = async (url) => {
      try {
        // Use GET because some storage endpoints return 400 for HEAD requests
        const res = await fetch(url, { method: "GET", cache: "no-cache" });
        return res && res.ok;
      } catch (err) {
        return false;
      }
    };

    const resolveAll = async () => {
      const map = {};

      for (const item of allPortfolioItems) {
        let final = null;

        // 1) If a file_path exists, try that first (showcase-images)
        if (item.file_path) {
          try {
            const pub = supabase.storage.from("showcase-images").getPublicUrl(item.file_path)?.data?.publicUrl;
            if (pub && (await probeUrl(pub))) {
              final = pub;
              console.log("Resolved working URL for item", item.id, pub);
            }
          } catch (err) {
            // continue
          }
        }

        // 2) If image_url looks like a storage URL, extract bucket + path and try candidates
        if (!final && item.image_url && item.image_url.startsWith("http")) {
          const parts = item.image_url.split("/object/public/");
          if (parts[1]) {
            const [bucket, ...rest] = parts[1].split("/");
            const filePath = rest.join("/");
            const candidates = [bucket, "showcase-images"];

            for (const b of candidates) {
              try {
                const pub = supabase.storage.from(b).getPublicUrl(filePath)?.data?.publicUrl;
                if (pub && (await probeUrl(pub))) {
                  final = pub;
                  break;
                }
              } catch (err) {
                // ignore
              }
            }
          }

          // 3) fallback: test original URL
          if (!final) {
            if (await probeUrl(item.image_url)) {
              final = item.image_url;
              console.log("Original URL works for item", item.id, item.image_url);
            }
          }
        }

        // 4) last ditch: if image_url looks like a path, try showcase-images getPublicUrl
        if (!final && item.image_url && !item.image_url.startsWith("http")) {
          try {
            const pub = supabase.storage.from("showcase-images").getPublicUrl(item.image_url)?.data?.publicUrl;
            if (pub && (await probeUrl(pub))) final = pub;
          } catch (err) {
            // ignore
          }
        }

        if (!final) console.warn("Could not resolve URL for item", item.id, item.image_url, item.file_path);
        map[item.id] = final;
      }

      if (mounted) setResolvedUrls(map);
    };

    resolveAll();
    return () => {
      mounted = false;
    };
  }, [allPortfolioItems]);

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
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
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
                {getImageSrc(item) ? (
                  <img
                    src={getImageSrc(item)}
                    alt={item.title || "Untitled"}
                    loading="lazy"
                    onError={(e) => {
                      console.error("Image failed to load for item", item.id, getImageSrc(item));
                      e.currentTarget.classList.add("hidden");
                    }}
                    className="object-cover w-full h-64 group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">{item.title || "No image"}</p>
                  </div>
                )}

                <div className="mt-2 px-2">
                  <a
                    href={getImageSrc(item) || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-gray-400 break-words"
                  >
                    {getImageSrc(item) || "no url"}
                  </a>
                </div> 

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
            {getImageSrc(selectedImage) ? (
              <img
                src={getImageSrc(selectedImage)}
                alt={selectedImage.title || "Untitled"}
                className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                loading="lazy"
                onError={(e) => {
                  console.error("Modal image failed to load for", selectedImage.id, getImageSrc(selectedImage));
                  e.currentTarget.classList.add("hidden");
                }}
              />
            ) : (
              <div className="w-full h-80 bg-gray-200 flex items-center justify-center rounded-xl shadow-2xl">
                <p className="text-gray-500">{selectedImage.title || "No image"}</p>
              </div>
            )}

            <div className="text-center mt-2">
              <a href={getImageSrc(selectedImage) || "#"} target="_blank" rel="noreferrer" className="text-sm text-gray-200 break-words">
                {getImageSrc(selectedImage) || "no url"}
              </a>
            </div>
            <p className="text-center text-white mt-4 text-lg font-medium">{selectedImage.title || "Untitled"}</p>
          </div>
        </div>
      )}
    </section>
  );
}
