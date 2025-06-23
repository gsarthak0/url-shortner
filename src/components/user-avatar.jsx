import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatarImage from "/avatar.png";

const UserAvatar = ({ user, size = "w-10 h-10" }) => {
  const getAvatarUrl = (name) => {
    if (!name) return null;
    
    const variant = "beam"; // Options: marble, beam, pixel, sunset, ring, bauhaus
    const seed = encodeURIComponent(name);
    return `https://source.boringavatars.com/${variant}/120/${seed}`;
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
