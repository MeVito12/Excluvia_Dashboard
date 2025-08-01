import avatarImage from "@assets/2-_1751286302473_1752877604587.png";

interface UserAvatarProps {
  username: string;
  size?: "small" | "medium";
}

const UserAvatar = ({ username, size = "medium" }: UserAvatarProps) => {
  const avatarSizes = {
    small: "w-8 h-8",
    medium: "w-12 h-12"
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-base"
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${avatarSizes[size]} rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 modern-card-hover`}>
        <img 
          src={avatarImage} 
          alt={`Avatar de ${username}`} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <span className={`${textSizes[size]} font-semibold text-white`}>
          {username}
        </span>
        <span className="text-xs text-blue-200">
          Usuário Logado
        </span>
      </div>
    </div>
  );
};

export default UserAvatar;