import { motion } from "framer-motion";

function About() {
  const sections = [
    {
      title: "Rooted in Agriculture",
      text: "Agriculture is more than business — it’s life. From fish farming to sustainable practices, I document and share the journey. Every pond, every journal entry, every story reflects passion for growth.",
      img: "/fishery.png",
      alt: "Fishery",
      reverse: false,
    },
    {
      title: "Journaling the Journey",
      text: "The best gospel to preach is yourself. Through journaling, I capture lessons from agriculture, entrepreneurship, and life. It’s not just notes — it’s a blueprint of growth.",
      img: "/journal.png",
      alt: "Journal writing",
      reverse: true,
    },
    {
      title: "Faith & Vision",
      text: "My brand blends agriculture, storytelling, and faith — a reminder that growth is both physical and spiritual. It’s about building something that lasts, one harvest and one story at a time.",
      img: "/vision.png",
      alt: "Vision",
      reverse: false,
    },
  ];

  return (
    <section
      id="about"
      className="w-full px-6 md:px-20 py-20 bg-gradient-to-b from-green-50 via-white to-green-100"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900"
        >
          About Me
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-lg md:text-xl text-gray-700 leading-relaxed"
        >
          A journey of <span className="text-green-600 font-semibold">faith</span>,{" "}
          <span className="text-green-600 font-semibold">agriculture</span>, and{" "}
          <span className="text-green-600 font-semibold">storytelling</span>.
        </motion.p>
      </div>

      {/* Layers */}
      <div className="space-y-28 max-w-7xl mx-auto">
        {sections.map((sec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`flex flex-col ${
              sec.reverse ? "md:flex-row-reverse" : "md:flex-row"
            } items-center gap-10`}
          >
            {/* Text */}
            <div className="flex-1 space-y-6 max-w-xl text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {sec.title}
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {sec.text}
              </p>
            </div>

            {/* Image */}
            <motion.figure
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex-1 w-full"
            >
              <img
                src={sec.img}
                alt={sec.alt}
                loading="lazy"
                className="rounded-2xl shadow-lg object-cover w-full h-auto max-h-[500px] mx-auto"
              />
            </motion.figure>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default About;
