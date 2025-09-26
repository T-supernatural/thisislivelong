import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient"; // make sure you created supabaseClient.js

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const { error } = await supabase.from("messages").insert([formData]);

    if (error) {
      console.error(error);
      setStatus("❌ Failed to send message. Try again.");
    } else {
      setStatus("✅ Message sent successfully!");
      setFormData({ name: "", email: "", message: "" }); // reset form
    }

    setLoading(false);
  };

  return (
    <section
      id="contact"
      className="w-full px-6 md:px-20 py-20 bg-gradient-to-b from-blue-50 to-green-50"
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        Get In Touch
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          variants={fadeUp}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows="5"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {status && <p className="text-center mt-2">{status}</p>}
        </motion.form>

        {/* Contact Info / Socials */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col justify-center space-y-6 text-center md:text-left"
        >
          <p className="text-lg text-gray-700">
            Got questions, opportunities, or just want to connect?  
            Drop me a message, and I’ll get back to you soon.
          </p>

          <div className="space-y-2">
            <p className="text-gray-800 font-semibold">
              Email:{" "}
              <span className="font-normal">thisislivelong@gmail.com</span>
            </p>
            <p className="text-gray-800 font-semibold">
              Phone: <span className="font-normal">+234 705 8898 630</span>
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center md:justify-start gap-6 text-2xl text-green-700">
            <a
              href="https://www.instagram.com/thisislivelong?igsh=MWNzNHNvbXBtZWZleQ=="
              className="hover:text-blue-600 transition-colors" title="Instagram"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a
              href="https://youtube.com/@cosigatyou?si=7M8vBGAg7HcCt73A"
              className="hover:text-red-600 transition-colors" title="Youtube"
            >
              <i className="fa-brands fa-youtube"></i>
            </a>
            <a
              href="https://medium.com/@robertnewman346"
              className="hover:text-gray-900 transition-colors" title="Medium"
            >
              <i className="fa-brands fa-medium"></i>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
