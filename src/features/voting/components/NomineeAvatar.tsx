import { useState } from 'react';
import { resolveImageUrl } from '@/lib/resolve-image-url';

interface NomineeAvatarProps {
  name: string;
  profileImageUrl?: string;
  size?: number;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? '';
  const second = words[1]?.[0] ?? '';
  return (first + second).toUpperCase();
}

export function NomineeAvatar({ name, profileImageUrl, size = 28 }: NomineeAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const resolvedUrl = resolveImageUrl(profileImageUrl);
  const showImage = resolvedUrl && !imgError;

  const containerStyle = { width: size, height: size };

  if (showImage) {
    return (
      <img
        src={resolvedUrl}
        alt={name}
        onError={() => setImgError(true)}
        className="rounded-full border border-gray-200 object-cover shrink-0"
        style={containerStyle}
      />
    );
  }

  return (
    <div
      className="rounded-full border border-gray-200 bg-gray-200 flex items-center justify-center shrink-0"
      style={containerStyle}
    >
      <span className="text-gray-600 text-[10px] font-semibold leading-none">
        {getInitials(name)}
      </span>
    </div>
  );
}
