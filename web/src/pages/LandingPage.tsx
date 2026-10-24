import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import TopFoodCarousel from "../components/TopFoodCarousel";
import TopFoodDisplay from "../components/TopFoodDisplay";
import About from "../components/About";
import StatCard from "../components/StatCard";
import TestimonialCard from "../components/TestimonialCard";
import { TOP_RECIPES } from "../data/mockRecipes";

const CAROUSEL_HEIGHT = 500;

// What each stat counts up to once it scrolls into view
const STAT_TARGETS = [100, 50, 150];

// Footer links sit on the dark --primary background, so hover lightens + underlines
const footerLinkClass =
  "text-gray-200 hover:text-white hover:underline transition-colors duration-200";

const stats = [
  { label: "Recipes Shared", color: "var(--primary)", delay: "0s" },
  {
    label: "Active Food Enthusiasts",
    color: "var(--secondary)",
    delay: "0.1s",
  },
  { label: "Ratings Given", color: "var(--primary)", delay: "0.2s" },
];

const testimonials = [
  {
    initial: "A",
    name: "Ayesha Khan",
    role: "Home Chef",
    quote:
      "Finally found a platform where I can share my grandmother's Nihari recipe! The community feedback has been incredible.",
    delay: "0s",
  },
  {
    initial: "Z",
    name: "Zain Ahmed",
    role: "Food Enthusiast",
    quote:
      "I've tried over 50 recipes from Karahi Hub. Every single dish turned out authentic and delicious!",
    delay: "0.1s",
  },
];

export default function LandingPage() {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
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

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

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
      window.removeEventListener("resize", handleResize);
      statsObserver.disconnect();
      testimonialObserver.disconnect();
    };
  }, []);

  // Count each visible stat up to its target in ~20 steps.
  // Once a count reaches its target the update returns the same array, so nothing re-renders.
  useEffect(() => {
    const intervals: ReturnType<typeof setInterval>[] = [];
    visibleStats.forEach((isVisible, index) => {
      if (!isVisible) return;
      const interval = setInterval(() => {
        setStatCounts((prev) => {
          if (prev[index] >= STAT_TARGETS[index]) return prev;
          const newCounts = [...prev];
          const increment = Math.ceil(STAT_TARGETS[index] / 20);
          newCounts[index] = Math.min(
            prev[index] + increment,
            STAT_TARGETS[index],
          );
          return newCounts;
        });
      }, 60);
      intervals.push(interval);
    });
    return () => intervals.forEach(clearInterval);
  }, [visibleStats]);

  return (
    <div id="top" className="bg-[#F5F0E9]">
      <Hero />
      <About />
      {/* id is the target of the hero's "View the Top Recipes" button and the footer link */}
      <h2
        id="top-recipes"
        className="fred-bold text-[40px] md:text-[56px] lg:text-[80px] text-center text-[var(--primary)] mb-[50px] md:mb-[100px] px-[20px] scroll-mt-[20px]"
      >
        View the <span className="text-[var(--secondary)]">Top</span> Recipes
      </h2>
      {/* Auto-scrolling carousel on wide screens, swipe-style display on small ones */}
      {windowWidth >= 800 ? (
        <TopFoodCarousel
          recipes={TOP_RECIPES}
          flowSpeed={60}
          carouselHeight={CAROUSEL_HEIGHT}
          width={`${CAROUSEL_HEIGHT - 50}px`}
          height={CAROUSEL_HEIGHT - 50}
        />
      ) : (
        <TopFoodDisplay recipes={TOP_RECIPES} />
      )}

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
                ref={(el) => {
                  statsRefs.current[i] = el;
                }}
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
                ref={(el) => {
                  testimonialRefs.current[i] = el;
                }}
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
          <div className="flex justify-center mt-[50px]">
            <Link
              to="/auth"
              className="bg-[var(--primary)] text-[var(--surface)] px-[32px] py-[14px] rounded-[12px] fred-bold text-[18px] hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)] transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Join the Community →
            </Link>
          </div>
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

            {/* In-page anchors scroll to sections; the rest are real routes */}
            <div>
              <h4 className="fred-bold text-[18px] mb-[15px]">Quick Links</h4>
              <ul className="space-y-[10px] fred-light text-[14px]">
                <li>
                  <a href="#top" className={footerLinkClass}>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className={footerLinkClass}>
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#top-recipes" className={footerLinkClass}>
                    Top Recipes
                  </a>
                </li>
                <li>
                  <Link to="/auth" className={footerLinkClass}>
                    Sign Up / Sign In
                  </Link>
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
              <Link to="/auth" className={footerLinkClass}>
                Create a free account →
              </Link>
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
