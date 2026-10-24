import { useEffect, useState } from "react";
import TopRecipe from "./TopRecipe";
import type { Recipe } from "../types";

interface Props {
  recipes: Recipe[];
}

const IMAGE_GAP = 20;
const CARD_SIZE = 250;
// How many copies of the strip to add when the user nears either end
const COPIES_PER_SIDE = 7;

// Small-screen version of the top recipes: one strip of cards, slid left/right
// with arrow buttons. Extra copies of the strip are added to whichever side the
// user is approaching, so it never runs out.
export default function TopFoodDisplay({ recipes }: Props) {
  const [leftCopies, setLeftCopies] = useState<number[]>([1]); // descending, like 3,2,1
  const [rightCopies, setRightCopies] = useState<number[]>([1]); // ascending, like 1,2,3
  const [currentCard, setCurrentCard] = useState(3);
  const [offset, setOffset] = useState(0); // how many cards the strip has slid
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const stripWidth =
    CARD_SIZE * recipes.length + IMAGE_GAP * (recipes.length - 1);
  // shifts the strip so its middle lines up with the middle of the screen
  const centerShift = stripWidth / 2 - windowWidth / 2;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Moving one card left/right; grows the strip before the user reaches an edge
  function move(direction: -1 | 1) {
    const next = currentCard + direction;
    setCurrentCard(next);
    setOffset((prev) => prev - direction);

    if (next === 1 - COPIES_PER_SIDE * (leftCopies.length - 1)) {
      setLeftCopies([leftCopies[0] + 1, ...leftCopies]);
    } else if (
      next ===
      recipes.length - 2 + COPIES_PER_SIDE * (rightCopies.length - 1)
    ) {
      setRightCopies([...rightCopies, rightCopies[rightCopies.length - 1] + 1]);
    }
  }

  // One full copy of the recipe strip at a given left position
  const strip = (key: string, left: number) => (
    <div
      key={key}
      className="absolute top-0 flex transition duration-250 ease"
      style={{ width: `${stripWidth}px`, left: `${left}px`, gap: `${IMAGE_GAP}px` }}
    >
      {recipes.map((recipe, index) => (
        <div
          key={index}
          style={{ height: `${CARD_SIZE}px`, width: `${CARD_SIZE}px` }}
        >
          <TopRecipe recipe={recipe} />
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="relative pt-[100px] bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/paki-graphic.png')" }}
    >
      <div className="w-full flex flex-col">
        <div
          className="relative transition duration-250 ease"
          style={{
            transform: `translateX(${offset * (CARD_SIZE + IMAGE_GAP)}px)`,
            height: `${CARD_SIZE}px`,
          }}
        >
          {leftCopies.map((count) =>
            strip(
              `left-${count}`,
              -(count * (stripWidth + IMAGE_GAP) + centerShift),
            ),
          )}
          {strip("center", -centerShift)}
          {rightCopies.map((count) =>
            strip(
              `right-${count}`,
              count * (stripWidth + IMAGE_GAP) - centerShift,
            ),
          )}
        </div>
        <div className="w-full flex justify-center mt-[25px]">
          <div className="w-[30%] flex justify-between mb-[25px]">
            <button
              type="button"
              aria-label="Previous recipe"
              className="bg-gray-200 p-[10px] rounded-[40px] w-[40px] h-[40px]"
              onClick={() => move(-1)}
            >
              <img src="/left-arrow-head.png" alt="" />
            </button>
            <button
              type="button"
              aria-label="Next recipe"
              className="bg-gray-200 p-[10px] rounded-[40px] w-[40px] h-[40px]"
              onClick={() => move(1)}
            >
              <img src="/right-arrow-head.png" alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
