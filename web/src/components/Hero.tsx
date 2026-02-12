export default function Hero() {
  return (
    <div className="fred-light w-full">
      <div className="w-full flex justify-between px-[20px] pt-[20px]">
        <div className="w-[20%] flex items-center gap-[5px]">
          <img src="/logo.png" alt="" className="w-[20%]" />
          <h1 className="text-[30px] text-[var(--primary)]">Karahi Hub</h1>
        </div>
        <button className="w-[10%] bg-[var(--secondary)] text-white rounded-[70px] fred-normal h-[50px]">
          Sign up
        </button>
      </div>
      <div className="w-full flex items-center justify-center gap-[80px]">
        <div className="flex flex-col w-[30%]">
          <h1 className="text-[80px] fred-bold text-[var(--primary)] leading-[75px]">
            Preserving{" "}
            <span className="text-[var(--secondary)]">Pakistani</span> Flavours
          </h1>
          <h1 className="text-[30px]">
            Cook Authentic recipes with confidence{" "}
          </h1>
        </div>
        <img
          src="/paki-food.png"
          alt=""
          className="w-[40%] drop-shadow-[0_20px_35px_rgba(0,0,0,1)]"
        />
      </div>
    </div>
  );
}
