import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  fallback?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'medium',
  className = '',
  fallback,
}) => {
  const sizeStyles = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-base',
    large: 'w-12 h-12 text-lg',
  };

  const baseStyles = `
    inline-flex items-center justify-center
    rounded-full bg-gray-200
    overflow-hidden
    ${sizeStyles[size]}
    ${className}
  `;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={baseStyles}
      />
    );
  }

  return (
    <div className={baseStyles}>
      {fallback ? (
        <span className="font-medium text-gray-600">
          {getInitials(fallback)}
        </span>
      ) : (
        <svg
          className="w-full h-full text-gray-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </div>
  );
}; 