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
      src="/DS-Logo-Bichrome.svg?v=8"
      alt={alt}
      width={400} // Base width for SVG
      height={80}  // Base height for SVG (5:1 ratio)
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: 'auto', // Maintain aspect ratio
        verticalAlign: 'baseline', // Align with text baseline
        marginLeft: '0.2em', // Space after last word
        marginRight: '0.2em', // Space before next word
        display: 'inline-block',
        position: 'relative',
        top: '0', // Baseline alignment
      }}
    />
  );
};

export default DarkStreetsLogo;
