import { useEffect, useRef, useState } from "react";
import type { Recipe } from "../types";
import TopRecipe from "./TopRecipe";

type CarouselProps = {
  recipes: Recipe[];
  flowSpeed: number; // px per second
  carouselHeight: number;
  height: number;
  width: string;
};

// Endless left-scrolling strip of recipe cards. Each frame moves every slide left;
// a slide that leaves the left edge is moved to the end of the line. Hover pauses it.
export default function TopFoodCarousel({
  recipes,
  flowSpeed,
  height,
  carouselHeight,
  width,
}: CarouselProps) {
  const slideRefs = useRef<HTMLDivElement[]>([]);
  const requestRef = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const step = (time: number) => {
      if (isPaused) {
        // Reset lastTime when paused to avoid large delta on resume
        lastTime.current = time;
        requestRef.current = requestAnimationFrame(step); // ask the browser to call step again next frame
        return;
      }

      if (!lastTime.current) lastTime.current = time; // sets lastTime to current time if it's not set yet
      const delta = time - lastTime.current; // time since last frame
      lastTime.current = time;

      const moveBy = (flowSpeed * delta) / 1000;

      for (const slide of slideRefs.current) {
        const currentLeft = parseFloat(slide.style.left || "0");
        slide.style.left = `${currentLeft - moveBy}px`;
      }

      // Recycle any slide that has exited left edge
      for (const slide of slideRefs.current) {
        const left = parseFloat(slide.style.left || "0");

        if (left + slide.offsetWidth < 0) {
          const maxRight = Math.max(
            ...slideRefs.current.map(
              (s) => parseFloat(s.style.left || "0") + s.offsetWidth,
            ),
          );
          slide.style.left = `${maxRight + 16}px`;
        }
      }

      requestRef.current = requestAnimationFrame(step);
    };

    requestRef.current = requestAnimationFrame(step);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [flowSpeed, recipes, isPaused]);

  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat py-[210px]"
      style={{ backgroundImage: "url('/paki-graphic.png')" }}
    >
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative overflow-hidden w-full flex"
        style={{ height: `${carouselHeight}px` }}
      >
        {recipes.map((recipe, idx) => (
          <div
            key={idx}
            ref={(el) => {
              if (el) slideRefs.current[idx] = el;
            }}
            className="absolute top-0 rounded overflow-visible flex-shrink-0"
            style={{
              // starting position; the animation loop moves it from here
              left: `${idx * (height + 10)}px`,
              width,
              height: `${height}px`,
            }}
          >
            <TopRecipe recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
}
