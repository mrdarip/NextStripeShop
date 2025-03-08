import { getPaletteStyles } from './PaletteTool';

interface ServerPaletteProps {
  palette: string | null;
}

/**
 * Server Component that injects palette styles directly in the page HTML
 * This ensures styles are applied immediately without client-side JavaScript
 */
export default function ServerPalette({ palette }: ServerPaletteProps) {
  // Get CSS variables for the selected palette
  const styleContent = getPaletteStyles(palette);
  
  return (
    <style dangerouslySetInnerHTML={{ __html: styleContent }} />
  );
}