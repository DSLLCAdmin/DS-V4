import React from 'react';

interface BrandTextLogoProps {
  firstHalf: string;
  secondHalf: string;
}

export function BrandTextLogo({ firstHalf, secondHalf }: BrandTextLogoProps) {
  return (
    <span className="brand-text-logo">
      <span className="first-half">{firstHalf}</span>
      <span className="second-half">{secondHalf}</span>
    </span>
  );
}

// Pre-configured brand logos for common use cases
export function DarkStreetLogo() {
  return <BrandTextLogo firstHalf="Dark" secondHalf="Street" />;
}

export function StreetStoreLogo() {
  return <BrandTextLogo firstHalf="Street" secondHalf="Store" />;
}

export function StreetCircleLogo() {
  return <BrandTextLogo firstHalf="Street" secondHalf="Circle" />;
}
