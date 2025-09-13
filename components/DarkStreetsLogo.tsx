import React from 'react';
import Image from 'next/image';

interface DarkStreetsLogoProps {
  size?: string;
  className?: string;
  alt?: string;
}

export const DarkStreetsLogo: React.FC<DarkStreetsLogoProps> = ({
  size = '1.5rem',
  className = '',
  alt = 'DarkStreets'
}) => {
  return (
    <Image
      src="/DS-Logo-Bichrome.svg?v=3"
      alt={alt}
      width={400} // Base width for SVG
      height={80}  // Base height for SVG (5:1 ratio)
      className={`inline-block align-middle ${className}`}
      style={{
        width: size,
        height: 'auto', // Maintain aspect ratio
        minWidth: '120px', // Force minimum size
        minHeight: '24px', // Force minimum size
      }}
    />
  );
};

export default DarkStreetsLogo;
