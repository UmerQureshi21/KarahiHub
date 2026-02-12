import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import TopFoodCarousel from "../components/TopFoodCarousel";
import TopFoodDisplay from "../components/TopFoodDisplay";
import type { Recipe } from "../types";
import About from "../components/About";
import { NavLink } from "react-router-dom";

export default function LandingPage() {
  let [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const carouselHeight = 500;

  const recipes: Recipe[] = [
    { name: "Fire Lassi", imageUrl: "/mango-lassi.jpg", rating: 5.0 },
    { name: "Nihari Goated", imageUrl: "/nihari.jpg", rating: 4.9 },
    { name: "Biryani", imageUrl: "/biryani.jpg", rating: 4.8 },
    { name: "Raita", imageUrl: "/raita.jpg", rating: 4.7 },
    { name: "Charga", imageUrl: "/charga.jpg", rating: 4.6 },
    { name: "Jalebi", imageUrl: "/jalebi.jpg", rating: 4.5 },
    { name: "Palak Gosht", imageUrl: "/palak-gosht.jpg", rating: 4.4 },
  ];

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <div>
      <Hero />
      <About />
      <div id="top-recipes" className="pt-[80px] md:pt-[120px]">
        <h1 className="fred-bold text-[50px] text-center text-[var(--primary)]">
          View the <span className="text-[var(--secondary)]">Top</span> Recipes
        </h1>
        {windowWidth >= 800 ? (
          <TopFoodCarousel
            recipes={recipes}
            flowSpeed={60}
            carouselHeight={carouselHeight}
            width={`${carouselHeight - 50}px`}
            height={carouselHeight - 50}
            text={[]}
            isImages={true}
          />
        ) : (
          <div
            className="relative bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/paki-graphic.png')" }}
          >
            <TopFoodDisplay recipes={recipes} />
          </div>
        )}
      </div>

      {/* Community Stats Section */}
      <div className="w-full px-[20px] md:px-[60px] lg:px-[120px] py-[80px] md:py-[120px]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="fred-bold text-[36px] md:text-[48px] lg:text-[56px] text-center text-[var(--primary)] mb-[20px]">
            Join Our Thriving{" "}
            <span className="text-[var(--secondary)]">Community</span>
          </h2>
          <p className="fred-light text-[18px] md:text-[20px] text-center text-gray-600 mb-[60px] max-w-[700px] mx-auto">
            Thousands of home cooks sharing authentic Pakistani recipes every
            day
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] md:gap-[30px] mb-[60px]">
            {/* Stat 1 */}
            <div className="bg-white rounded-[20px] p-[30px] shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="fred-bold text-[40px] md:text-[48px] text-[var(--primary)] mb-[8px]">
                100+
              </div>
              <p className="fred-medium text-[16px] md:text-[18px] text-gray-600">
                Recipes Shared
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white rounded-[20px] p-[30px] shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="fred-bold text-[40px] md:text-[48px] text-[var(--secondary)] mb-[8px]">
                50+
              </div>
              <p className="fred-medium text-[16px] md:text-[18px] text-gray-600">
                Active Food Enthusiasts
              </p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white rounded-[20px] p-[30px] shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="fred-bold text-[40px] md:text-[48px] text-[var(--primary)] mb-[8px]">
                150+
              </div>
              <p className="fred-medium text-[16px] md:text-[18px] text-gray-600">
                Ratings Given
              </p>
            </div>

            {/* Stat 4 */}
            {/* <div className="bg-white rounded-[20px] p-[30px] shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="fred-bold text-[40px] md:text-[48px] text-[var(--secondary)] mb-[8px]">
                2.5K+
              </div>
              <p className="fred-medium text-[16px] md:text-[18px] text-gray-600">
                Daily Visitors
              </p>
            </div> */}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
            <div className="bg-white rounded-[20px] p-[30px] shadow-lg">
              <div className="flex items-center gap-[12px] mb-[15px]">
                <div className="w-[50px] h-[50px] bg-[var(--secondary)] rounded-full flex items-center justify-center fred-bold text-[20px] text-[var(--primary)]">
                  A
                </div>
                <div>
                  <h4 className="fred-bold text-[18px] text-[var(--primary)]">
                    Ayesha Khan
                  </h4>
                  <p className="fred-light text-[14px] text-gray-500">
                    Home Chef
                  </p>
                </div>
              </div>
              <p className="fred-light text-[16px] text-gray-700 italic">
                "Finally found a platform where I can share my grandmother's
                Nihari recipe! The community feedback has been incredible."
              </p>
            </div>

            <div className="bg-white rounded-[20px] p-[30px] shadow-lg">
              <div className="flex items-center gap-[12px] mb-[15px]">
                <div className="w-[50px] h-[50px] bg-[var(--secondary)] rounded-full flex items-center justify-center fred-bold text-[20px] text-[var(--primary)]">
                  Z
                </div>
                <div>
                  <h4 className="fred-bold text-[18px] text-[var(--primary)]">
                    Zain Ahmed
                  </h4>
                  <p className="fred-light text-[14px] text-gray-500">
                    Food Enthusiast
                  </p>
                </div>
              </div>
              <p className="fred-light text-[16px] text-gray-700 italic">
                "I've tried over 50 recipes from Karahi Hub. Every single dish
                turned out authentic and delicious!"
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <NavLink to="/auth" className="flex justify-center mt-[50px]">
            <button className="bg-[var(--primary)] text-white px-[32px] py-[14px] rounded-[12px] fred-bold text-[18px] hover:bg-[var(--secondary)] hover:text-[var(--primary)] transition-all duration-300 hover:scale-105 shadow-lg">
              Join the Community →
            </button>
          </NavLink>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[var(--primary)] text-white py-[40px] px-[20px] md:px-[60px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] md:gap-[40px]">
            <div>
              <div className="flex items-center gap-[8px] mb-[15px]">
                <img
                  src="/logo.png"
                  alt="Karahi Hub Logo"
                  className="w-[40px]"
                />
                <h3 className="fred-bold text-[24px]">Karahi Hub</h3>
              </div>
              <p className="fred-light text-[14px] text-gray-200">
                Preserving Pakistani flavors, one recipe at a time.
              </p>
            </div>

            <div>
              <h4 className="fred-bold text-[18px] mb-[15px]">Quick Links</h4>
              <ul className="space-y-[10px] fred-light text-[14px]">
                <li>
                  <a
                    href="/"
                    className="hover:text-[var(--secondary)] transition-colors duration-200"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/recipes"
                    className="hover:text-[var(--secondary)] transition-colors duration-200"
                  >
                    Recipes
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="hover:text-[var(--secondary)] transition-colors duration-200"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-[var(--secondary)] transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="fred-bold text-[18px] mb-[15px]">
                Connect With Us
              </h4>
              <p className="fred-light text-[14px] text-gray-200 mb-[15px]">
                Join our community and share your love for Pakistani cuisine.
              </p>
              <div className="flex gap-[15px]">
                <a
                  href="#"
                  className="w-[35px] h-[35px] bg-white/10 hover:bg-[var(--secondary)] rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <span className="text-[18px]">📧</span>
                </a>
                <a
                  href="#"
                  className="w-[35px] h-[35px] bg-white/10 hover:bg-[var(--secondary)] rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <span className="text-[18px]">🌐</span>
                </a>
              </div>
            </div>
          </div>

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
