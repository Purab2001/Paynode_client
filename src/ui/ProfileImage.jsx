import React, { useState } from "react";

const ProfileImage = ({ user, size = 40 }) => {
  const [imgError, setImgError] = useState(false);
  
  // Handle null user case
  if (!user) {
    const fallback = `https://ui-avatars.com/api/?name=User&background=3B82F6&color=fff&size=${size}`;
    return (
      <img
        src={fallback}
        alt="User"
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }
  
  const name = user.displayName || user.email || "User";
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=3B82F6&color=fff&size=${size}`;
  let src = fallback;
  if (user.photoURL && !imgError) src = user.photoURL;
  
  return (
    <img
      src={src}
      alt={name}
      className="w-full h-full object-cover"
      onError={() => setImgError(true)}
      referrerPolicy="no-referrer"
    />
  );
};

export default ProfileImage;
