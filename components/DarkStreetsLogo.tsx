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
      src="/DS-Logo-Bichrome.svg?v=5"
      alt={alt}
      width={400} // Base width for SVG
      height={80}  // Base height for SVG (5:1 ratio)
      className={`inline-block align-text-bottom ${className}`}
      style={{
        width: size,
        height: 'auto', // Maintain aspect ratio
        verticalAlign: 'text-bottom', // Align with text baseline
        marginLeft: '0.1em', // Small left margin for spacing
        marginRight: '0.1em', // Small right margin for spacing
      }}
    />
  );
};

export default DarkStreetsLogo;
