import SignUpButton from "./SignUpButton";

export default function Hero() {
  const words = ['Preserving', 'Pakistani', 'Flavours'];

  return (
    <div className="fred-light w-full">
      <div className="w-full flex justify-between items-center px-[20px] pt-[20px]">
        <div className="flex items-center gap-[5px] md:w-auto lg:w-[20%]">
          <img src="/logo.png" alt="" className="w-[40px] md:w-[50px] lg:w-[60px]" />
          <h1 className="text-[20px] md:text-[24px] lg:text-[30px] text-[var(--primary)]">Karahi Hub</h1>
        </div>
        <SignUpButton />
      </div>
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-[40px] md:gap-[50px] lg:gap-[80px] px-[20px] mt-[40px] md:mt-[20px] lg:mt-0">
        <div className="flex flex-col w-full md:w-[45%] lg:w-[30%]">
          <h1 className="text-[40px] md:text-[56px] lg:text-[80px] fred-bold text-[var(--primary)] leading-tight md:leading-[60px] lg:leading-[75px]">
            {words.map((word, index) => (
              <span
                key={index}
                className="text-reveal inline-block mr-[10px]"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {word === 'Pakistani' ? (
                  <span className="text-[var(--secondary)]">{word}</span>
                ) : (
                  word
                )}
              </span>
            ))}
          </h1>
          <h1 className="text-[18px] md:text-[22px] lg:text-[30px]">
            Cook Authentic recipes with confidence{" "}
          </h1>
          <button
            onClick={() => {
              document.getElementById('top-recipes')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-[20px] bg-[var(--primary)] text-[var(--surface)] px-[24px] py-[12px] rounded-full fred-medium text-[16px] md:text-[18px] hover:bg-[var(--secondary)] hover:text-[var(--surface)] transition-all duration-300 hover:scale-105"
          >
            View the Top Recipes ↓
          </button>
        </div>
        <img
          src="/paki-food.png"
          alt=""
          className="w-[80%] md:w-[45%] lg:w-[40%] drop-shadow-[0_20px_35px_rgba(0,0,0,1)] rotate-infinite"
        />
      </div>
    </div>
  );
}
