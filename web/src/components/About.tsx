'use client';

import { useEffect, useRef, useState } from 'react';

export default function About() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1 && entry.isIntersecting) {
            setVisibleCards((prev) => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
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
          <div
            ref={(el) => {
              cardRefs.current[0] = el;
            }}
            className={`bg-[var(--surface)] rounded-[20px] p-[30px] shadow-lg hover:shadow-xl transition-shadow duration-300 bounce-card-initial ${
              visibleCards[0] ? 'bounce-card' : ''
            }`}
            style={{ animationDelay: '0s' }}
          >
            <div className="w-[48px] h-[48px] mb-[15px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                fill="var(--primary)"
              >
                <path d="M480 576L192 576C139 576 96 533 96 480L96 160C96 107 139 64 192 64L496 64C522.5 64 544 85.5 544 112L544 400C544 420.9 530.6 438.7 512 445.3L512 512C529.7 512 544 526.3 544 544C544 561.7 529.7 576 512 576L480 576zM192 448C174.3 448 160 462.3 160 480C160 497.7 174.3 512 192 512L448 512L448 448L192 448zM224 216C224 229.3 234.7 240 248 240L424 240C437.3 240 448 229.3 448 216C448 202.7 437.3 192 424 192L248 192C234.7 192 224 202.7 224 216zM248 288C234.7 288 224 298.7 224 312C224 325.3 234.7 336 248 336L424 336C437.3 336 448 325.3 448 312C448 298.7 437.3 288 424 288L248 288z" />
              </svg>
            </div>
            <h3 className="fred-bold text-[24px] text-[var(--primary)] mb-[10px]">
              Authentic Recipes
            </h3>
            <p className="fred-light text-[16px] text-gray-600">
              Traditional Pakistani recipes passed down through generations, now
              at your fingertips.
            </p>
          </div>

          <div
            ref={(el) => {
              cardRefs.current[1] = el;
            }}
            className={`bg-[var(--surface)] rounded-[20px] p-[30px] shadow-lg hover:shadow-xl transition-shadow duration-300 bounce-card-initial ${
              visibleCards[1] ? 'bounce-card' : ''
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            <div className="w-[48px] h-[48px] mb-[15px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                fill="var(--secondary)"
              >
                <path d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z" />
              </svg>
            </div>
            <h3 className="fred-bold text-[24px] text-[var(--primary)] mb-[10px]">
              Top Rated Dishes
            </h3>
            <p className="fred-light text-[16px] text-gray-600">
              Explore the most loved recipes from our community of food
              enthusiasts.
            </p>
          </div>

          <div
            ref={(el) => {
              cardRefs.current[2] = el;
            }}
            className={`bg-[var(--surface)] rounded-[20px] p-[30px] shadow-lg hover:shadow-xl transition-shadow duration-300 bounce-card-initial ${
              visibleCards[2] ? 'bounce-card' : ''
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            <div className="w-[48px] h-[48px] mb-[15px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                fill="var(--primary)"
              >
                <path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" />
              </svg>
            </div>
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
  );
}
