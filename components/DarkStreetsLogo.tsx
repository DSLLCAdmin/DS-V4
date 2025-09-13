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
      src="/DS-Logo-Bichrome.svg?v=6"
      alt={alt}
      width={400} // Base width for SVG
      height={80}  // Base height for SVG (5:1 ratio)
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: 'auto', // Maintain aspect ratio
        verticalAlign: 'middle', // Center vertically with text
        marginLeft: '0.2em', // Left spacing
        marginRight: '0.2em', // Right spacing
        transform: 'translateY(-0.1em)', // Fine-tune vertical position
      }}
    />
  );
};

export default DarkStreetsLogo;
