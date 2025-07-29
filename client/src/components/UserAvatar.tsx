import { User } from "lucide-react";

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

  const iconSizes = {
    small: "w-4 h-4",
    medium: "w-6 h-6"
  };

  // Generate initials from username
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${avatarSizes[size]} rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 modern-card-hover`}>
        <span className="text-white font-semibold text-sm">
          {getInitials(username)}
        </span>
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