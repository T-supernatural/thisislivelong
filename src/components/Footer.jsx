import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 px-6 md:px-20 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
            <img src="/logo-new.png" alt="ThisIsLiveLong logo" className="h-16" />
            <p className="text-3xl md:text-4xl nanum-pen-script-regular">
              ThisIsLiveLong.
            </p>
          </div>

        {/* Copyright */}
        <div className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} ThisIsLiveLong. All Rights Reserved.
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 text-2xl">
          <a
            href="https://www.instagram.com/thisislivelong?igsh=MWNzNHNvbXBtZWZleQ=="
            className="hover:text-blue-600" title="Instagram"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a
            href="https://youtube.com/@cosigatyou?si=7M8vBGAg7HcCt73A"
            className="hover:text-red-600" title="Youtube"
          >
            <i className="fa-brands fa-youtube"></i>
          </a>
          <a
            href="https://medium.com/@robertnewman346"
            className="hover:text-gray-900" title="Medium"
          >
            <i className="fa-brands fa-medium"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
