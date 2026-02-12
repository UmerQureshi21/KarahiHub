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
      
      <div id="top-recipes" className="pt-[200px]">
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
