import { useState, useEffect } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Transparent → Solid navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const links = [
    { name: "About Me", href: "#about" },
    { name: "My Works", href: "#works" },
    { name: "Journal", href: "#journal" },
    { name: "Contact Me", href: "#contact" },
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-xs" : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-20 py-4">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2">
            <img src="/logo-new.png" alt="ThisIsLiveLong logo" className="h-16" />
            <p className="text-3xl md:text-4xl nanum-pen-script-regular">
              ThisIsLiveLong.
            </p>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-20 items-center">
            <ul className="flex gap-8 font-semibold text-lg">
              {links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-green-600 cursor-pointer transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Icons */}
            <ul className="flex gap-6 text-xl">
              <li>
                <a
                  href="https://www.instagram.com/thisislivelong?igsh=MWNzNHNvbXBtZWZleQ=="
                  className="hover:text-green-600 focus:outline-none"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/@cosigatyou?si=7M8vBGAg7HcCt73A"
                  className="hover:text-green-600 focus:outline-none"
                >
                  <i className="fa-brands fa-youtube"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://medium.com/@robertnewman346"
                  className="hover:text-green-600 focus:outline-none"
                >
                  <i className="fa-brands fa-medium"></i>
                </a>
              </li>
            </ul>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-2xl focus:outline-none"
            aria-label="Open menu"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Off-canvas */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <div className="flex items-center justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="text-2xl p-1 rounded focus:outline-none"
            type="button"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col h-full p-6">
          <ul className="flex flex-col gap-6 text-lg font-semibold mt-6">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-green-600 cursor-pointer transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Socials pinned bottom */}
          <div className="mt-auto flex gap-6 text-2xl">
            <a
              href="https://www.instagram.com/thisislivelong?igsh=MWNzNHNvbXBtZWZleQ=="
              className="hover:text-green-600"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a
              href="https://youtube.com/@cosigatyou?si=7M8vBGAg7HcCt73A"
              className="hover:text-green-600"
            >
              <i className="fa-brands fa-youtube"></i>
            </a>
            <a
              href="https://medium.com/@robertnewman346"
              className="hover:text-green-600"
            >
              <i className="fa-brands fa-medium"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
