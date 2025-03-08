// Server-side palette utilities
// Define palette configurations
export const PALETTES = {
  //palettes
  pizzaplace: {
    //white and red
    //https://www.realtimecolors.com/?colors=1a0a0a-fbf4f4-cf3a3a-ea9090-e85e5e&fonts=Inter-Inter
    'primary': '#cf3a3a',
    'secondary':'#ea9090',
    'accent': '#e85e5e',
    'background': '#fbf4f4',
    'background1': '#f1dada',
    'background2': '#ebc7c7',
    'text': '#1a0a0a'
  },
  "black-red-white": {
    //black red and white
    //https://www.realtimecolors.com/?colors=0f0202-fefbfa-df3831-ecd985-d9e453&fonts=Inter-Inter
    'primary': '#df3831',
    'secondary':'#ecd985',
    'accent': '#d9e453',
    'background': '#fefbfa',
    'background1': '#f7ddd4',
    'background2': '#f2ccbf',
    'text': '#0f0202'
  },
  "clay": {
    //pastel brownish colors
    //beige and latte brown,
    //https://www.realtimecolors.com/?colors=120b07-faf7f6-c87650-ebb291-d9825a&fonts=Inter-Inter
    'primary': '#c87650',
    'secondary':'#ebb291',
    'accent': '#d9825a',
    'background': '#faf7f6',
    'background1': '#ede2de',
    'background2': '#e4d3ce',
    'text': '#120b07'
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
    styleString += `--palette-${property}: ${value}; `;
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