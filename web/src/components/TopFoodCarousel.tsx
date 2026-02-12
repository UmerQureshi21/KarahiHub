import { useEffect, useRef, useState } from "react";
import type { Recipe } from "../types";
import TopRecipe from "./TopRecipe";

type CarouselProps = {
  recipes: Recipe[];
  flowSpeed: number; // px per second
  carouselHeight: number;
  height: number;
  width: string;
  text: string[];
  isImages: boolean;
};

export default function TopFoodCarousel({
  recipes,
  flowSpeed,
  height,
  carouselHeight,
  width,
  text,
  isImages,
}: CarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ourPartnersRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<HTMLDivElement[]>([]);
  const requestRef = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const [speed, setSpeed] = useState(flowSpeed);
  const [isPaused, setIsPaused] = useState(false);
  let recipes2: Recipe[] = recipes; // recipes2 is the array that gets updated when you press left or right

  // Adjust speed for first render of text carousel
  setTimeout(() => {
    if (!isImages) {
      setSpeed(60);
    }
  }, 500);

  useEffect(() => {
    const step = (time: number) => {
      if (isPaused) {
        // Reset lastTime when paused to avoid large delta on resume
        lastTime.current = time;
        requestRef.current = requestAnimationFrame(step); // tells browaser that you wish to perform an animation, browser calls a callback supplied by user, in this case step
        return;
      }

      if (!lastTime.current) lastTime.current = time; // sets lastTime to current time if it's not set yet
      const delta = time - lastTime.current; // time since last frame
      lastTime.current = time;

      const moveBy = (speed * delta) / 1000;

      for (let slide of slideRefs.current) {
        const currentLeft = parseFloat(slide.style.left || "0");
        const newLeft = currentLeft - moveBy;
        slide.style.left = `${newLeft}px`;
      }

      // Recycle any slide that has exited left edge
      for (let slide of slideRefs.current) {
        const left = parseFloat(slide.style.left || "0");
        const width = slide.offsetWidth;

        if (left + width < 0) {
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
  }, [speed, recipes2, isPaused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => {
      setIsPaused(true);
      ourPartnersRef.current?.classList.remove("invisible");
    };
    const handleMouseLeave = () => {
      setIsPaused(false);
      ourPartnersRef.current?.classList.add("invisible");
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
  }, []);

  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat py-[150px]"
      style={{ backgroundImage: "url('/paki-graphic.png')" }}
    >
      <div
        ref={ourPartnersRef}
        style={{ height: `${height + 10}px` }}
        className="w-full invisible pointer-events-none z-[20] transition duration-100 ease absolute  flex items-center justify-center top-[15px]"
      ></div>

      <div className="absolute flex items-center justify-center gap-[20px] top-[100px] h-[90px] w-[100px] right-[3%] top-[350px]"></div>

      <div
        ref={containerRef}
        className=" 
          relative overflow-hidden w-full flex
          "
        style={{ height: `${carouselHeight}px` }}
      >
        {recipes2.map((recipe, idx) => (
          <div
            key={idx}
            ref={(el) => {
              if (el) slideRefs.current[idx] = el;
            }}
            className="
              absolute top-0 rounded overflow-visible
              flex-shrink-0 transform transition duration-100 ease
              "
            style={{
              left: `${idx * (height + 10)}px`,
              width,
              height: `${height}px`,
              transform: `translateX(-${0 * height}px)`, // if you go more than 3 like the divs dont load in propely, so i think
              // i have to make it so that for each time you preess left or rihgt, the array gets updated so that the new one is the first element
            }}
          >
            <TopRecipe key={idx} recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
}
