import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="h-screen flex flex-col md:flex-row items-center justify-center text-center md:text-left bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden px-6 md:px-20"
    >
      {/* Animated Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.9, 1.1, 0.9], opacity: 0.3 }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="w-72 h-72 bg-green-200 rounded-full blur-3xl absolute -top-10 -left-10"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1.1, 0.9, 1.1], opacity: 0.3 }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="w-96 h-96 bg-blue-200 rounded-full blur-3xl absolute bottom-0 right-0"
        />
      </div>

      {/* Left Column - Text */}
      <div className="flex-1 relative z-10">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl md:text-6xl mt-30 md:mt-5 font-extrabold text-gray-900 mb-6 leading-snug"
        >
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
            <Typewriter
              words={[
                "Rooted in Truth, Growing Through Story",
                "My Life, My Work, My Witness",
                "The Best Gospel I Preach Is Myself",
              ]}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={40}
              delaySpeed={3000}
            />
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="max-w-xl text-sm md:text-lg text-blue-900 mb-10"
        >
          Welcome to{" "}
          <span className="font-semibold text-green-700">ThisIsLiveLong</span> —
          where purpose meets peace. I'm Robert David, also known as Livelong – a
          communicator, writer, and deep thinker on a journey of self-discovery, death
          awareness, and mental freedom. This platform is for raw reflections, spoken-word,
          poems, solitude meditations, life stories, and soul talks. I believe in living intentionally,
          investing in yourself, and letting your voice echo through time. If you are seeking
          truth, growth, and connection - <em>Welcome Home</em>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex flex-wrap gap-4 justify-center md:justify-start"
        >
          <a
            href="#services"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-green-600 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:shadow-green-400/50 hover:scale-105 transition duration-300"
          >
            Work With Me
          </a>
          <a
            href="#about"
            className="px-8 py-3 rounded-full border-2 border-green-600 text-green-700 font-semibold hover:bg-green-600 hover:text-white hover:shadow-md transition duration-300"
          >
            Learn More
          </a>
        </motion.div>
      </div>

      {/* Right Column - Images Placeholder */}
      <div>
      </div>
    </section>
  );
}
