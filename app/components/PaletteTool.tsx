// Server-side palette utilities
// Define palette configurations
export const PALETTES = {
  //palettes
  pizzaplace: {
    //white and red
    '--palette-primary': '#cf3a3a',
    '--palette-secondary': '#ea9090',
    '--palette-accent': '#e85e5e',
    '--palette-background': '#fbf4f4',
    '--palette-text': '#1a0a0a'
  },
  "black-red-white": {
    //black red and white
    '--palette-primary': '#df3831',
    '--palette-secondary': '#ecd985',
    '--palette-accent': '#d9e453',
    '--palette-background': '#fefbfa',
    '--palette-text': '#0f0202'
  },
  "clay": {
    //pastel brownish colors
    //beige and latte brown,
    '--palette-primary': '#c87650',
    '--palette-secondary': '#e4b19a',
    '--palette-accent': '#d9825a',
    '--palette-background': '#F7E6DE',
    '--palette-text': '#120b07'
  }
  // Additional palettes
};

//palete hex colors
/*
Dark Green	#68724D
Beige	#F7E6DE
Lilac Purple	#AE96D4
Ice Blue	#A3D8E1
Marine Blue	#0078BF
Sakura Pink	#E8AFCF
Latte Brown	#D3B7A7	
Red	#FF0000
Black	#000000
White	#FFFFFF
*/

/**
 * Generate CSS variables string for a palette that can be used server-side
 * @param paletteToUse - The name of the palette to use
 * @returns CSS style string that can be used in a style tag
 */
export function getPaletteStyles(paletteToUse: string | null): string {
  if (!paletteToUse || !(paletteToUse in PALETTES)) {
    return ''; // Return empty string for default or invalid palettes
  }

  const selectedPalette = PALETTES[paletteToUse as keyof typeof PALETTES];
  let styleString = ':root {';
  
  Object.entries(selectedPalette).forEach(([property, value]) => {
    styleString += `${property}: ${value}; `;
  });
  
  styleString += '}';
  return styleString;
}

/**
 * Generate inline style object for a palette (useful for dynamic styling in server components)
 * @param paletteToUse - The name of the palette to use
 * @returns Object with CSS variable key-value pairs
 */
export function getPaletteStyleObject(paletteToUse: string | null): Record<string, string> {
  if (!paletteToUse || !(paletteToUse in PALETTES)) {
    return {}; // Return empty object for default or invalid palettes
  }

  return PALETTES[paletteToUse as keyof typeof PALETTES];
}

/**
 * Get the names of all available palettes
 * @returns Array of palette names
 */
export function getAvailablePalettes(): string[] {
  return Object.keys(PALETTES);
}