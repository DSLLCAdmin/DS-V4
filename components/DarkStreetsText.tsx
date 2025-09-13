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
  // Cool grey color for "Dark" - using a lower middle cool grey tone
  const darkColor = 'text-gray-500';
  
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
