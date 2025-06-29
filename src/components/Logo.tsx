
import React from 'react';

const Logo = ({ size = "large" }: { size?: "small" | "large" }) => {
  const logoSizes = {
    small: "w-12 h-12",
    large: "w-24 h-24"
  };

  const textSizes = {
    small: "text-sm",
    large: "text-xl"
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className={`${logoSizes[size]} relative`}>
        <img 
          src="/lovable-uploads/536fd3ea-92ba-43c3-ad50-37fed110966b.png" 
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
