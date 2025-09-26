import { motion } from "framer-motion";

export default function Preloader({ visible = true }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <motion.img
        src="/logo-new.png"
        alt="logo"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0, 1, 0.6, 1, 0], scale: [0.9, 1.05, 0.98, 1.02, 0.95] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="w-40 h-40 object-contain"
      />
    </div>
  );
}
