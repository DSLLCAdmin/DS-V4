import { DarkStreetsTextLogo } from '@/components/DarkStreetsTextLogo';

/**
 * Utility function to render DarkStreet variations consistently with the logo component
 * Handles different variations like "Dark Street", "Dark Streets", "Dark Streeter", etc.
 */
export function renderDarkStreetText(text: string): React.ReactNode {
  // Common patterns to replace with the logo component
  const patterns = [
    { pattern: /Dark Streets?/gi, replacement: <DarkStreetsTextLogo /> },
    { pattern: /Dark Streeter/gi, replacement: <><DarkStreetsTextLogo />er</> },
    { pattern: /DarkStreets?/gi, replacement: <DarkStreetsTextLogo /> },
  ];

  let result: React.ReactNode = text;
  
  // Apply each pattern
  patterns.forEach(({ pattern, replacement }) => {
    if (typeof result === 'string' && pattern.test(result)) {
      const parts = result.split(pattern);
      const matches = result.match(pattern);
      
      if (matches && parts.length > 1) {
        const elements: React.ReactNode[] = [];
        for (let i = 0; i < parts.length; i++) {
          if (parts[i]) elements.push(parts[i]);
          if (i < matches.length) elements.push(replacement);
        }
        result = elements;
      }
    }
  });

  return result;
}

/**
 * Simple function to replace DarkStreet variations with the logo component
 * For use in JSX where you want to render text with embedded logos
 */
export function withDarkStreetLogo(text: string): React.ReactNode {
  return renderDarkStreetText(text);
}
