import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = ({ user, size = "w-10 h-10" }) => {
  return (
    <div className={`${size} rounded-full overflow-hidden bg-transparent flex items-center justify-center`}>
      <img 
        src="/avatar.png"
        alt={user?.user_metadata?.name || "User"}
        className="w-full h-full object-cover rounded-full"
        onError={(e) => {
          // Hide image and show fallback if loading fails
          e.target.style.display = 'none';
          e.target.nextElementSibling.style.display = 'flex';
        }}
      />
      <div 
        className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm hidden"
        style={{ display: 'none' }}
      >
        {user?.user_metadata?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>
    </div>
  );
};

export default UserAvatar;
