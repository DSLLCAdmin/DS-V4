import React from 'react';

interface DarkStreetsTextLogoProps {
  className?: string;
}

export const DarkStreetsTextLogo: React.FC<DarkStreetsTextLogoProps> = ({
  className = ''
}) => {
  return (
    <span className={`dark-streets-text-logo ${className}`}>
      <span className="dark-part">Dark</span>
      <span className="street-part">Street</span>
    </span>
  );
};

export default DarkStreetsTextLogo;
