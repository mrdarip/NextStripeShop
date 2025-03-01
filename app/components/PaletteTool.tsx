'use client';

import { useEffect } from 'react';

// Define palette configurations
const PALETTES = {
  //palettes
  pizzaplace: {
    //white and red
    '--palette-primary': 'Red',
    '--palette-secondary': 'White',
    '--palette-accent': 'Black',
    '--palette-background': 'White',
    '--palette-text': 'Black',
  },
  "black-red-white": {
    //black red and white
    '--palette-primary': 'Black',
    '--palette-secondary': 'Black',
    '--palette-accent': 'White',
    '--palette-background': 'Red',
    '--palette-text': 'White',
  },
  "clay": {
    //pastel brownish colors
    //beige and latte brown,
    '--palette-primary': 'Latte Brown',
    '--palette-secondary': 'Beige',
    '--palette-accent': '#3498db',
    '--palette-background': '#f5f0f0',
    '--palette-text': '#2c3e50', 
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
export class PaletteToolClass {
  /**
   * Changes the palette by directly modifying CSS variables in :root
   * @param paletteToSwitchTo - The name of the palette to apply or null to use default
   */
  static ChangePaletteTo(paletteToSwitchTo: string | null): void {
    if (typeof document === 'undefined') return; // Guard for SSR
    
    // Get the root element
    const rootElement = document.documentElement;
    
    // Reset to default palette by removing custom properties
    rootElement.style.removeProperty('--palette-primary');
    rootElement.style.removeProperty('--palette-secondary');
    rootElement.style.removeProperty('--palette-accent');
    rootElement.style.removeProperty('--palette-background');
    rootElement.style.removeProperty('--palette-text');
    
    // If a specific palette is requested, apply it
    if (paletteToSwitchTo && paletteToSwitchTo in PALETTES) {
      // Apply the selected palette variables
      const selectedPalette = PALETTES[paletteToSwitchTo as keyof typeof PALETTES];
      Object.entries(selectedPalette).forEach(([property, value]) => {
        rootElement.style.setProperty(property, value as string);
      });
    }
  }
}

interface PaletteToolProps {
  palette: string | null;
}

export default function PaletteTool({ palette }: PaletteToolProps) {
  useEffect(() => {
    PaletteToolClass.ChangePaletteTo(palette);
    
    // Cleanup when component unmounts
    return () => {
      PaletteToolClass.ChangePaletteTo(null);
    };
  }, [palette]);

  // This component doesn't render anything visible
  return null;
}