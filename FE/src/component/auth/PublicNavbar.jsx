import { useState } from "react";
import {useNavigate} from "react-router";

const PublicNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState("buyer"); // "buyer" or "farmer"
const navigate= useNavigate();
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Products", href: "/crops" },
    { label: "My Orders", href: "/orders" },
    { label: "Cart", href: "/cart" },
  ];

  return (
    <nav className="bg-[#2d6a4f] shadow-md">
      {/* Desktop PublicNavbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#52b788] rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="text-white text-lg font-semibold tracking-wide">
              FasalBazar
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4 ">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/80 hover:text-white hover:bg-white/10 text-sm px-4 py-2 rounded-md transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <button className="text-white/80 hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <div className="w-px h-5 bg-white/20" />

            {/* Role Badge */}
           
            <button onClick={()=>navigate("/login")} className="bg-white/10 hover:bg-white/20 border border-white/25 text-white text-sm px-4 py-1.5 rounded-md transition-all">
              Login
            </button>
            <button onClick={()=>navigate("/register")} className="bg-[#52b788] hover:bg-[#40916c] text-white text-sm font-medium px-4 py-1.5 rounded-md transition-all">
              Sign up
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1b4332] border-t border-white/10">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-white/80 hover:text-white hover:bg-white/10 text-sm px-3 py-2.5 rounded-md transition-all"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-white/10 flex gap-2">
            <button className="flex-1 bg-white/10 border border-white/25 text-white text-sm py-2 rounded-md hover:bg-white/20 transition-all">
              Login
            </button>
            <button className="flex-1 bg-[#52b788] text-white text-sm font-medium py-2 rounded-md hover:bg-[#40916c] transition-all">
              Sign up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
