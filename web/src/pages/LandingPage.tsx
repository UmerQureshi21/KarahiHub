import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import TopFoodCarousel from "../components/TopFoodCarousel";
import TopFoodDisplay from "../components/TopFoodDisplay";
import type { Recipe } from "../types";

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

      {/* About Section */}
      <div className="w-full px-[20px] md:px-[60px] lg:px-[120px] py-[80px] md:py-[120px]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="fred-bold text-[36px] md:text-[48px] lg:text-[56px] text-center text-[var(--primary)] mb-[20px]">
            Your One-Stop{" "}
            <span className="text-[var(--secondary)]">Pakistani Food</span> Hub
          </h2>
          <p className="fred-light text-[18px] md:text-[22px] lg:text-[24px] text-center text-gray-700 mb-[60px] max-w-[900px] mx-auto leading-relaxed">
            Discover authentic recipes, hidden gems, and culinary delights from
            the heart of Pakistan. Whether you're a seasoned chef or a curious
            foodie, Karahi Hub is your gateway to the rich flavors and vibrant
            culture of Pakistani cuisine.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] md:gap-[40px]">
            <div className="bg-white rounded-[20px] p-[30px] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-[48px] mb-[15px]">📖</div>
              <h3 className="fred-bold text-[24px] text-[var(--primary)] mb-[10px]">
                Authentic Recipes
              </h3>
              <p className="fred-light text-[16px] text-gray-600">
                Traditional Pakistani recipes passed down through generations,
                now at your fingertips.
              </p>
            </div>

            <div className="bg-white rounded-[20px] p-[30px] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-[48px] mb-[15px]">⭐</div>
              <h3 className="fred-bold text-[24px] text-[var(--primary)] mb-[10px]">
                Top Rated Dishes
              </h3>
              <p className="fred-light text-[16px] text-gray-600">
                Explore the most loved recipes from our community of food
                enthusiasts.
              </p>
            </div>

            <div className="bg-white rounded-[20px] p-[30px] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-[48px] mb-[15px]">🍽️</div>
              <h3 className="fred-bold text-[24px] text-[var(--primary)] mb-[10px]">
                Share & Discover
              </h3>
              <p className="fred-light text-[16px] text-gray-600">
                Share your family recipes and discover new culinary adventures
                every day.
              </p>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}
