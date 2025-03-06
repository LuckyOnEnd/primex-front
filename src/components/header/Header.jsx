import React from "react";

function Header() {
  return (
    <>
      <h2 className="text-center text-lg font-bold text-[#B4B8BB] uppercase tracking-wider animate-pulse">
        TradingView Bot
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-center text-3xl font-extrabold text-white drop-shadow-lg sm:text-4xl">
        PrimeX<span className="text-black"> -- </span>Algo
      </p>
      <div className="mt-3 flex justify-center">
        <div className="h-1 w-28 bg-gradient-to-r from-[#B4B8BB] via-[white] to-[#B4B8BB] rounded-full animate-bounce"></div>
      </div>
    </>
  );
}

export default Header;
