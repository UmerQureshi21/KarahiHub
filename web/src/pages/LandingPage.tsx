import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import TopFoodCarousel from "../components/TopFoodCarousel";
import TopFoodDisplay from "../components/TopFoodDisplay";

export default function LandingPage() {
  let [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

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
          recipes={[
            { name: "Biryani", imageUrl: "/test-1", rating: 4.5 },
            { name: "Nihari", imageUrl: "/test-2", rating: 4.7 },
            { name: "Kebabs", imageUrl: "/paki-food.png", rating: 4.6 },
            { name: "Biryani", imageUrl: "/paki-food.png", rating: 4.5 },
            { name: "Nihari", imageUrl: "/paki-food.png", rating: 4.7 },
            { name: "Kebabs", imageUrl: "/paki-food.png", rating: 4.6 },
            { name: "Biryani", imageUrl: "/paki-food.png", rating: 4.5 },
            { name: "Nihari", imageUrl: "/paki-food.png", rating: 4.7 },
            { name: "Kebabs", imageUrl: "/paki-food.png", rating: 4.6 },
            { name: "Biryani", imageUrl: "/paki-food.png", rating: 4.5 },
          ]}
          flowSpeed={60}
          carouselHeight={300}
          width={"250px"}
          height={250}
          text={[]}
          isImages={true}
        />
      ) : (
        <TopFoodDisplay />
      )}
      <div>
        <img src="/paki-graphic.png" alt="" />
      </div>
    </div>
  );
}
