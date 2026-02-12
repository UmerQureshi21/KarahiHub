import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import TopFoodCarousel from "../components/TopFoodCarousel";
import TopFoodDisplay from "../components/TopFoodDisplay";

export default function LandingPage() {
  let [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const carouselHeight = 300;

  const recipes: Recipe[] = [
    { name: "Biryani", imageUrl: "/test-1", rating: 5.0 },
    { name: "Nihari", imageUrl: "/test-2", rating: 4.9 },
    { name: "Biryani", imageUrl: "/test-1", rating: 4.8 },
    { name: "Nihari", imageUrl: "/test-2", rating: 4.7 },
    { name: "Biryani", imageUrl: "/test-1", rating: 4.6 },
    { name: "Nihari", imageUrl: "/test-2", rating: 4.5 },
    { name: "Biryani", imageUrl: "/test-1", rating: 4.4 },
  ];

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <div>
      <Hero />
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
        <TopFoodDisplay recipes={recipes} />
      )}
      <div>
        <img src="/paki-graphic.png" alt="" />
      </div>
    </div>
  );
}
