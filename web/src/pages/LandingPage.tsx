"use client";

import { useEffect, useState, useRef } from "react";
import Hero from "../components/Hero";
import TopFoodCarousel from "../components/TopFoodCarousel";
import TopFoodDisplay from "../components/TopFoodDisplay";
import type { Recipe } from "../types";
import About from "../components/About";
import StatCard from "../components/StatCard";
import TestimonialCard from "../components/TestimonialCard";
import { NavLink } from "react-router-dom";

const stats = [
  { label: "Recipes Shared", color: "var(--primary)", delay: "0s" },
  { label: "Active Food Enthusiasts", color: "var(--secondary)", delay: "0.1s" },
  { label: "Ratings Given", color: "var(--primary)", delay: "0.2s" },
];

const testimonials = [
  {
    initial: "A",
    name: "Ayesha Khan",
    role: "Home Chef",
    quote: "Finally found a platform where I can share my grandmother's Nihari recipe! The community feedback has been incredible.",
    delay: "0s",
  },
  {
    initial: "Z",
    name: "Zain Ahmed",
    role: "Food Enthusiast",
    quote: "I've tried over 50 recipes from Karahi Hub. Every single dish turned out authentic and delicious!",
    delay: "0.1s",
  },
];

export default function LandingPage() {
  let [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [visibleStats, setVisibleStats] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [visibleTestimonials, setVisibleTestimonials] = useState<boolean[]>([
    false,
    false,
  ]);
  const [statCounts, setStatCounts] = useState<number[]>([0, 0, 0]);
  const statsRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const testimonialRefs = useRef<(HTMLDivElement | null)[]>([null, null]);
  const carouselHeight = 500;

  const statTargets = [100, 50, 150];

  const recipes: Recipe[] = [
    {
      name: "Fire Lassi",
      imageUrl: "/mango-lassi.jpg",
      rating: 5.0,
      username: "Ayesha Khan",
      description: "Refreshing yogurt drink",
      instructions: ["Blend", "Serve cold"],
      prepTime: 5,
      cookTime: 0,
      servingCount: 4,
      categories: ["Beverage", "Refreshing"],
      ingredients: [],
    },
    {
      name: "Nihari Goated",
      imageUrl: "/nihari.jpg",
      rating: 4.9,
      username: "Zain Ahmed",
      description: "Slow cooked meat delicacy",
      instructions: ["Cook", "Simmer"],
      prepTime: 20,
      cookTime: 90,
      servingCount: 6,
      categories: ["Dinner", "Main Course"],
      ingredients: [],
    },
    {
      name: "Biryani",
      imageUrl: "/biryani.jpg",
      rating: 4.8,
      username: "Fatima Ali",
      description: "Fragrant rice dish",
      instructions: ["Marinate", "Layer", "Cook"],
      prepTime: 30,
      cookTime: 45,
      servingCount: 8,
      categories: ["Dinner", "Rice Dish"],
      ingredients: [],
    },
    {
      name: "Raita",
      imageUrl: "/raita.jpg",
      rating: 4.7,
      username: "Omar Hassan",
      description: "Yogurt side dish",
      instructions: ["Mix", "Chill"],
      prepTime: 10,
      cookTime: 0,
      servingCount: 4,
      categories: ["Side Dish", "Yogurt"],
      ingredients: [],
    },
    {
      name: "Charga",
      imageUrl: "/charga.jpg",
      rating: 4.6,
      username: "Sara Malik",
      description: "Fried crispy poultry",
      instructions: ["Marinate", "Fry"],
      prepTime: 15,
      cookTime: 30,
      servingCount: 4,
      categories: ["Main Course", "Fried"],
      ingredients: [],
    },
    {
      name: "Jalebi",
      imageUrl: "/jalebi.jpg",
      rating: 4.5,
      username: "Ahmed Raza",
      description: "Sweet spiral dessert",
      instructions: ["Mix", "Fry", "Soak"],
      prepTime: 20,
      cookTime: 25,
      servingCount: 6,
      categories: ["Dessert", "Sweet"],
      ingredients: [],
    },
    {
      name: "Palak Gosht",
      imageUrl: "/palak-gosht.jpg",
      rating: 4.4,
      username: "Nadia Siddiqui",
      description: "Spinach and meat curry",
      instructions: ["Sauté", "Simmer"],
      prepTime: 15,
      cookTime: 60,
      servingCount: 5,
      categories: ["Curry", "Main Course"],
      ingredients: [],
    },
  ];

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = statsRefs.current.indexOf(
            entry.target as HTMLDivElement,
          );
          if (index !== -1 && entry.isIntersecting) {
            setVisibleStats((prev) => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    const testimonialObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = testimonialRefs.current.indexOf(
            entry.target as HTMLDivElement,
          );
          if (index !== -1 && entry.isIntersecting) {
            setVisibleTestimonials((prev) => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
            testimonialObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    statsRefs.current.forEach((ref) => {
      if (ref) statsObserver.observe(ref);
    });

    testimonialRefs.current.forEach((ref) => {
      if (ref) testimonialObserver.observe(ref);
    });

    return () => {
      statsObserver.disconnect();
      testimonialObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    visibleStats.forEach((isVisible, index) => {
      if (isVisible && statCounts[index] < statTargets[index]) {
        const interval = setInterval(() => {
          setStatCounts((prev) => {
            const newCounts = [...prev];
            const increment = Math.ceil(statTargets[index] / 20);
            newCounts[index] = Math.min(
              newCounts[index] + increment,
              statTargets[index],
            );
            return newCounts;
          });
        }, 60);

        return () => clearInterval(interval);
      }
    });
  }, [visibleStats]);

  return (
    <div>
      <Hero />
      <About />
      <h1 className="fred-bold text-[80px] text-center text-[var(--primary)] mb-[100px]">
        View the <span className="text-[var(--secondary)]">Top</span> Recipes
      </h1>
      <div id="top-recipes">
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

      {/* Community Stats Section */}
      <div className="w-full px-[20px] md:px-[60px] lg:px-[120px] py-[80px] md:py-[120px]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="fred-bold text-[36px] md:text-[48px] lg:text-[56px] text-center text-[var(--primary)] mb-[20px]">
            Join Our Thriving{" "}
            <span className="text-[var(--secondary)]">Community</span>
          </h2>
          <p className="fred-light text-[18px] md:text-[20px] text-center text-gray-600 mb-[60px] max-w-[700px] mx-auto">
            Thousands of home cooks sharing authentic Pakistani recipes every
            day
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] md:gap-[30px] mb-[60px]">
            {stats.map((stat, i) => (
              <StatCard
                key={stat.label}
                ref={(el) => { statsRefs.current[i] = el; }}
                count={statCounts[i]}
                label={stat.label}
                color={stat.color}
                visible={visibleStats[i]}
                delay={stat.delay}
              />
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
            {testimonials.map((t, i) => (
              <TestimonialCard
                key={t.name}
                ref={(el) => { testimonialRefs.current[i] = el; }}
                initial={t.initial}
                name={t.name}
                role={t.role}
                quote={t.quote}
                visible={visibleTestimonials[i]}
                delay={t.delay}
              />
            ))}
          </div>

          {/* CTA Button */}
          <NavLink to="/auth" className="flex justify-center mt-[50px]">
            <button className="bg-[var(--primary)] text-[var(--surface)] px-[32px] py-[14px] rounded-[12px] fred-bold text-[18px] hover:bg-[var(--secondary)] hover:text-[var(--primary)] transition-all duration-300 hover:scale-105 shadow-lg">
              Join the Community →
            </button>
          </NavLink>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[var(--primary)] text-[var(--surface)] py-[40px] px-[20px] md:px-[60px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] md:gap-[40px]">
            <div>
              <div className="flex items-center gap-[8px] mb-[15px]">
                <img
                  src="/logo.png"
                  alt="Karahi Hub Logo"
                  className="w-[40px]"
                />
                <h3 className="fred-bold text-[24px]">Karahi Hub</h3>
              </div>
              <p className="fred-light text-[14px] text-gray-200">
                Preserving Pakistani flavors, one recipe at a time.
              </p>
            </div>

            <div>
              <h4 className="fred-bold text-[18px] mb-[15px]">Quick Links</h4>
              <ul className="space-y-[10px] fred-light text-[14px]">
                <li>
                  <a
                    href="/"
                    className="hover:text-[var(--secondary)] transition-colors duration-200"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/recipes"
                    className="hover:text-[var(--secondary)] transition-colors duration-200"
                  >
                    Recipes
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="hover:text-[var(--secondary)] transition-colors duration-200"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-[var(--secondary)] transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="fred-bold text-[18px] mb-[15px]">
                Connect With Us
              </h4>
              <p className="fred-light text-[14px] text-gray-200 mb-[15px]">
                Join our community and share your love for Pakistani cuisine.
              </p>
              <div className="flex gap-[15px]">
                <a
                  href="#"
                  className="w-[35px] h-[35px] bg-[var(--surface)]/10 hover:bg-[var(--secondary)] rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <span className="text-[18px]">📧</span>
                </a>
                <a
                  href="#"
                  className="w-[35px] h-[35px] bg-[var(--surface)]/10 hover:bg-[var(--secondary)] rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <span className="text-[18px]">🌐</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--surface)]/20 mt-[30px] pt-[20px] text-center">
            <p className="fred-light text-[14px] text-gray-200">
              © {new Date().getFullYear()} Karahi Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
