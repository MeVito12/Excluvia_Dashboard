import { X } from 'lucide-react';

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

  return (
    <div className="flex items-center gap-3">
      <div className={`${avatarSizes[size]} rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 modern-card-hover flex items-center justify-center`}
           style={{ 
             background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)' 
           }}>
        <X 
          className={`${iconSizes[size]} text-purple-600`}
          strokeWidth={3}
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