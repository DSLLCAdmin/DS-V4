import React from 'react';
import Image from 'next/image';

interface DarkStreetsLogoProps {
  size?: number;
  className?: string;
  alt?: string;
}

export const DarkStreetsLogo: React.FC<DarkStreetsLogoProps> = ({
  size = 24,
  className = '',
  alt = 'DarkStreets'
}) => {
  return (
    <Image
      src="/DS-Logo-Bichrome.svg"
      alt={alt}
      width={size}
      height={size * 0.4} // Maintain aspect ratio (200:40 = 5:1)
      className={`inline-block align-middle ${className}`}
    />
  );
};

export default DarkStreetsLogo;
