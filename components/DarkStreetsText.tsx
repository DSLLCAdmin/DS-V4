import React from 'react';

interface DarkStreetsTextProps {
  className?: string;
  streetsColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'gradient' | 'solid';
}

export const DarkStreetsText: React.FC<DarkStreetsTextProps> = ({
  className = '',
  streetsColor = 'text-white',
  size = 'md',
  variant = 'default'
}) => {
  // Black color for "Dark" - better contrast on most backgrounds
  const darkColor = 'text-black';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  // Variant classes for "Streets"
  const getStreetsClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-swatch103 to-swatch104 bg-clip-text text-transparent';
      case 'solid':
        return streetsColor;
      default:
        return streetsColor;
    }
  };

  return (
    <span className={`${sizeClasses[size]} ${className}`}>
      <span className={`${darkColor} font-bold`}>Dark</span>
      <span className={`${getStreetsClasses()} font-bold`}>Streets</span>
    </span>
  );
};

export default DarkStreetsText;
