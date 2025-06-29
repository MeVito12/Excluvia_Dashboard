
import React from 'react';

const Logo = ({ size = "large" }: { size?: "small" | "large" }) => {
  const logoSizes = {
    small: "w-16 h-16",
    large: "w-32 h-32"
  };

  const textSizes = {
    small: "text-sm",
    large: "text-2xl"
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className={`${logoSizes[size]} relative`}>
        <img 
          src="/lovable-uploads/8928f70c-40df-4a62-9951-4de2ec819de0.png" 
          alt="Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      {size === "large" && (
        <div className="text-center">
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
