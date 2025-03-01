'use client';

import { useEffect } from 'react';

// Define palette configurations
const PALETTES = {
  blue: {
    '--palette-primary': '#3498db',
    '--palette-secondary': '#2980b9',
    '--palette-accent': '#1abc9c',
    '--palette-background': '#ecf0f1',
    '--palette-text': '#2c3e50',
  },
  green: {
    '--palette-primary': '#2ecc71',
    '--palette-secondary': '#27ae60',
    '--palette-accent': '#f39c12',
    '--palette-background': '#f0f5f0',
    '--palette-text': '#333333',
  },
  red: {
    '--palette-primary': '#e74c3c',
    '--palette-secondary': '#c0392b',
    '--palette-accent': '#3498db',
    '--palette-background': '#f5f0f0',
    '--palette-text': '#2c3e50',
  },
  // Additional palettes
};

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