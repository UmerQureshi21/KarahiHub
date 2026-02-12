import { useEffect, useState } from "react";
import TopRecipe from "./TopRecipe";
import type { Recipe } from "../types";

interface Props {
  recipes: Recipe[];
}

export default function TopFoodDisplay({ recipes }: Props) {
  // STILL NEED TO ADD LINKS SO CLICKING ON EACH IMAGE WILL SEDN TO WEBSTIE

  const IMAGE_GAP = 20;
  const [resizePush, setResizePush] = useState<number>(1000);
  let [leftPartners, setLeftPartners] = useState<number[]>([1]); // should be descending, like 3,2,1
  let [rightPartners, setRightPartners] = useState<number[]>([1]); // should be ascending, like 1,2,3
  let [imageDimension, setImageDimension] = useState<number>(250);
  const partners: Recipe[] = recipes;
  let partnerLinks: any = [];
  let [partnersWidth, setPartnersWidth] = useState<number>(
    imageDimension * partners.length + IMAGE_GAP * (partners.length - 1),
  );
  let [currPartner, setCurrPartner] = useState<number>(3);
  let [clickCount, setClickCount] = useState<number>(0);
  let [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    if (currPartner == 1 - 7 * (leftPartners.length - 1)) {
      let newLeft = [leftPartners[0] + 1].concat(leftPartners);
      setLeftPartners(newLeft);
    } else if (
      currPartner ==
      partners.length - 2 + 7 * (rightPartners.length - 1)
    ) {
      let newRight = rightPartners.concat([
        rightPartners[rightPartners.length - 1] + 1,
      ]);
      setRightPartners(newRight);
    }
  }, [currPartner]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize(); // initialize
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 650) {
      setImageDimension(250);
    } else {
      setImageDimension(250);
    }
  }, [windowWidth]);

  useEffect(() => {
    setPartnersWidth(
      imageDimension * partners.length + IMAGE_GAP * (partners.length - 1),
    );
  }, [imageDimension]);

  useEffect(() => {
    setResizePush(partnersWidth / 2 - windowWidth / 2);
  }, [partnersWidth, windowWidth]);

  return (
    <div
      id="big-container"
      className="relative pt-[100px] relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/paki-graphic.png')" }}
    >
      <style>{`
        #big-container::before {
          position: absolute;
          content: "";
          left: ${
            (windowWidth >= 650
              ? windowWidth -
                (windowWidth - (imageDimension + 2 * IMAGE_GAP)) / 2
              : windowWidth - (windowWidth - (250 + 2 * IMAGE_GAP)) / 2) -
            IMAGE_GAP
          }px;
          top: 0;
          height: ${windowWidth >= 650 ? imageDimension : 250}px;
          width: 100%;
          background-color: ${windowWidth >= 650 ? "transparent" : "transparent"};
          z-index: 52;
        }
      `}</style>
      <style>{`
        #big-container::after {
          position: absolute;
          content: "";
          right: ${
            (windowWidth >= 650
              ? windowWidth -
                (windowWidth - (imageDimension + 2 * IMAGE_GAP)) / 2
              : windowWidth - (windowWidth - (250 + 2 * IMAGE_GAP)) / 2) -
            IMAGE_GAP
          }px;
          top: 0;
          height: ${windowWidth >= 650 ? imageDimension : 250}px;
          width: 100%;
          background-color: ${windowWidth >= 650 ? "transparent" : "transparent"};
          z-index: 52;
        }
      `}</style>

      <div className="w-full flex flex-col">
        <div
          id="image-div-container"
          className="relative transition duration-250 ease"
          style={{
            transform: `translateX(${
              clickCount * (imageDimension + IMAGE_GAP)
            }px)`,
            height: `${imageDimension}px`,
          }}
        >
          {leftPartners.map((count, index) => (
            <div
              key={`left partners ${index + 1}`}
              className="absolute top-0  flex  transition duration-250 ease"
              style={{
                width: `${partnersWidth}px`,
                left: `-${
                  count * partnersWidth + count * IMAGE_GAP - -resizePush
                }px`,
                gap: `${IMAGE_GAP}px`,
              }}
            >
              {partners.map((recipe, index) => (
                <div
                  key={`image small left ${index}`}
                  onClick={() => {
                    window.location.href = partnerLinks[index];
                  }}
                  style={{
                    height: `${imageDimension}px`,
                    width: `${imageDimension}px`,
                  }}
                >
                  <TopRecipe recipe={recipe} />
                </div>
              ))}
            </div>
          ))}
          <div
            className="absolute top-0 flex items-center justify-center transition duration-250 ease"
            style={{
              width: `${partnersWidth}px`,
              gap: `${IMAGE_GAP}px`,
              left: `${0 - resizePush}px`,
            }}
          >
            {partners.map((recipe, index) => (
              <div
                key={`image small ${index}`}
                onClick={() => {
                  window.location.href = partnerLinks[index];
                }}
                style={{
                  height: `${imageDimension}px`,
                  width: `${imageDimension}px`,
                }}
              >
                <TopRecipe recipe={recipe} />
              </div>
            ))}
          </div>
          {rightPartners.map((count, index) => (
            <div
              key={`right partners ${index + 1}`}
              className="absolute top-0  flex transition duration-250 ease"
              style={{
                width: `${partnersWidth}px`,
                left: `${
                  count * partnersWidth + count * IMAGE_GAP - resizePush
                }px`,
                gap: `${IMAGE_GAP}px`,
              }}
            >
              {partners.map((recipe, index) => (
                <div
                  key={`image small right ${index}`}
                  onClick={() => {
                    window.location.href = partnerLinks[index];
                  }}
                  style={{
                    height: `${imageDimension}px`,
                    width: `${imageDimension}px`,
                  }}
                >
                  <TopRecipe recipe={recipe} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="w-full flex justify-center mt-[25px]">
          <div className="w-[30%] flex justify-between mb-[25px]">
            <button
              className="bg-gray-200 p-[10px] rounded-[40px] w-[40px] h-[40px]"
              onClick={() => {
                setCurrPartner(--currPartner);
                setClickCount(++clickCount);
              }}
            >
              <img src="/left-arrow-head.png" alt="" />
            </button>
            <button
              className="bg-gray-200 p-[10px] rounded-[40px] w-[40px] h-[40px]"
              onClick={() => {
                setCurrPartner(++currPartner);
                setClickCount(--clickCount);
              }}
            >
              <img src="/right-arrow-head.png" alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
