import { motion } from "framer-motion";

function Services() {
  const services = [
    {
      icon: "fa-solid fa-fish",
      title: "Fishery Insights",
      desc: "Guidance on sustainable fish farming — from pond to harvest, helping communities grow through agriculture.",
    },
    {
      icon: "fa-solid fa-pen-nib",
      title: "Journaling & Storytelling",
      desc: "Empowering people to capture their journey — turning personal experiences into stories that inspire growth.",
    },
    {
      icon: "fa-solid fa-seedling",
      title: "Growth & Mentorship",
      desc: "Sharing lessons in entrepreneurship, faith, and resilience — building visions that last across generations.",
    },
  ];

  return (
    <section
      id="services"
      className="w-full px-6 md:px-20 py-20 bg-white"
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
          What I Do
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-lg md:text-xl text-gray-600 leading-relaxed"
        >
          Blending{" "}
          <span className="text-green-600 font-semibold">agriculture</span>,{" "}
          <span className="text-green-600 font-semibold">storytelling</span>, and{" "}
          <span className="text-green-600 font-semibold">mentorship</span> to
          inspire and empower.
        </motion.p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {services.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.2 }}
            className="bg-gradient-to-b from-green-50 to-green-100 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
          >
            <div className="text-green-700 text-5xl mb-6">
              <i className={service.icon}></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {service.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">{service.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Services;
