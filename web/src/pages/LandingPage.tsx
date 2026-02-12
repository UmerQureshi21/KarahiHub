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
      {windowWidth >= 800 ?(
      <TopFoodCarousel
        images={[
          "/paki-food.png",
          "/paki-food.png",
          "/paki-food.png",
          "/paki-food.png",
          "/paki-food.png",
          "/paki-food.png",
          "/paki-food.png",
          "/paki-food.png",
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
