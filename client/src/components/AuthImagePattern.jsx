import React from "react";

type Props = {
  title: string;
  subtitle: string;
};

function AuthImagePattern({ title, subtitle }: Props) {
  return (
    <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-black text-white relative overflow-hidden">
      
      {/* Animated Grid */}
      <div className="absolute inset-0 grid grid-cols-6 gap-2 p-6 opacity-30">
        {[...Array(36)].map((_, i) => (
          <div
            key={i}
            className="bg-blue-500/20 rounded-md animate-pulse"
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Content */}
      <div className="z-10 text-center px-10">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-gray-300">{subtitle}</p>
      </div>
    </div>
  );
}

export default AuthImagePattern;