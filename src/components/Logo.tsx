
import React from 'react';

const Logo = ({ size = "large" }: { size?: "small" | "large" }) => {
  const logoSizes = {
    small: "w-40 h-40",
    large: "w-[32rem] h-[32rem]"
  };

  const textSizes = {
    small: "text-lg",
    large: "text-4xl"
  };

  return (
    <div className="flex flex-col items-center space-y-0">
      <div className={`${logoSizes[size]} relative`}>
        <img 
          src="/lovable-uploads/e2dbfbed-df11-4909-8abd-69c4e6d3fcd7.png" 
          alt="Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      {size === "large" && (
        <div className="text-center -mt-4">
          <p className={`${textSizes[size]} font-medium text-white leading-relaxed`}>
            <span className="text-primary">Automatize</span> com lógica.
            <br />
            <span className="text-accent">Organize</span> com clareza.
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
