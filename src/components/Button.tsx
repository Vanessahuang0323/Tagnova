import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-md
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-colors
  `;

  const variantStyles = {
    primary: `
      bg-blue-600 text-white
      hover:bg-blue-700
      focus:ring-blue-500
      disabled:bg-blue-300
    `,
    secondary: `
      bg-gray-100 text-gray-700
      hover:bg-gray-200
      focus:ring-gray-500
      disabled:bg-gray-50 disabled:text-gray-400
    `,
    success: `
      bg-green-600 text-white
      hover:bg-green-700
      focus:ring-green-500
      disabled:bg-green-300
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700
      focus:ring-red-500
      disabled:bg-red-300
    `,
    warning: `
      bg-yellow-600 text-white
      hover:bg-yellow-700
      focus:ring-yellow-500
      disabled:bg-yellow-300
    `,
    info: `
      bg-indigo-600 text-white
      hover:bg-indigo-700
      focus:ring-indigo-500
      disabled:bg-indigo-300
    `,
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  const loadingStyles = isLoading ? 'cursor-wait' : '';

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyles}
        ${loadingStyles}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          加载中...
        </>
      ) : (
        children
      )}
    </button>
  );
};