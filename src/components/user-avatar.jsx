import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = ({ user, size = "w-10 h-10" }) => {
  const getAvatarUrl = (name) => {
    if (!name) return null;
    
    const style = "avataaars"; 
    const seed = name.toLowerCase().replace(/\s+/g, '');
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
  };

  return (
    <Avatar className={size}>
      <AvatarImage 
        src={getAvatarUrl(user?.user_metadata?.name)}
        alt={user?.user_metadata?.name || "User"}
      />
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
        {user?.user_metadata?.name?.charAt(0)?.toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
