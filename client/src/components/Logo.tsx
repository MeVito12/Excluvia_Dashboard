
import logoImage from "@assets/Design sem nome_1751285815327.png";
import sloganImage from "@assets/image_1751285887113.png";

const Logo = ({ size = "large" }: { size?: "small" | "large" }) => {
  const logoSizes = {
    small: "w-64 h-16",
    large: "w-96 h-24"
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`${logoSizes[size]} relative mb-4`}>
        <img 
          src={logoImage} 
          alt="excluv.ia Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      {size === "large" && (
        <div className="text-center">
          <img 
            src={sloganImage} 
            alt="Automatize com lógica. Organize com clareza." 
            className="w-80 h-auto object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Logo;
