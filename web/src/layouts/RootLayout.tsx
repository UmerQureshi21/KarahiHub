import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="bg-[var(--accent)] min-h-screen">
      <Outlet />
      
      {/* Footer */}
      <footer className="bg-[var(--primary)] text-white py-[40px] px-[20px] md:px-[60px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] md:gap-[40px]">
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-[8px] mb-[15px]">
                <img src="/logo.png" alt="Karahi Hub Logo" className="w-[40px]" />
                <h3 className="fred-bold text-[24px]">Karahi Hub</h3>
              </div>
              <p className="fred-light text-[14px] text-gray-200">
                Preserving Pakistani flavors, one recipe at a time.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="fred-bold text-[18px] mb-[15px]">Quick Links</h4>
              <ul className="space-y-[10px] fred-light text-[14px]">
                <li>
                  <a href="/" className="hover:text-[var(--secondary)] transition-colors duration-200">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/recipes" className="hover:text-[var(--secondary)] transition-colors duration-200">
                    Recipes
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-[var(--secondary)] transition-colors duration-200">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-[var(--secondary)] transition-colors duration-200">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Social & Contact */}
            <div>
              <h4 className="fred-bold text-[18px] mb-[15px]">Connect With Us</h4>
              <p className="fred-light text-[14px] text-gray-200 mb-[15px]">
                Join our community and share your love for Pakistani cuisine.
              </p>
              <div className="flex gap-[15px]">
                <a href="#" className="w-[35px] h-[35px] bg-white/10 hover:bg-[var(--secondary)] rounded-full flex items-center justify-center transition-all duration-300">
                  <span className="text-[18px]">📧</span>
                </a>
                <a href="#" className="w-[35px] h-[35px] bg-white/10 hover:bg-[var(--secondary)] rounded-full flex items-center justify-center transition-all duration-300">
                  <span className="text-[18px]">🌐</span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 mt-[30px] pt-[20px] text-center">
            <p className="fred-light text-[14px] text-gray-200">
              © {new Date().getFullYear()} Karahi Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
