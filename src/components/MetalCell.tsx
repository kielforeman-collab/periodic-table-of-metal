import type { Band } from '@/data/bands';
import { categories } from '@/data/bands';
import { useState, useRef } from 'react';

interface MetalCellProps {
  band: Band;
  baseScale?: number;
  animationDelay?: number;
  onClick?: (band: Band) => void;
  hoveredPos?: { row: number; col: number } | null;
  onHoverChange?: (pos: { row: number; col: number } | null) => void;
}

export function MetalCell({ band, baseScale = 1, animationDelay = 0, onClick, hoveredPos, onHoverChange }: MetalCellProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hoverStartTime = useRef(0);
  const categoryColor = categories[band.category].color;
  
  const staggerClass = `stagger-${Math.min(animationDelay + 1, 10)}`;

  // Calculate magnification scale based on distance to hovered cell
  let dynamicScale = 1.0;
  let zIndex = 10;
  let glowOpacity = 0;

  if (hoveredPos) {
    const dRow = Math.abs(band.row - hoveredPos.row);
    const dCol = Math.abs(band.col - hoveredPos.col);
    const distance = Math.sqrt(dRow * dRow + dCol * dCol);

    // Continuous Gaussian-like scaling function for a smooth "Apple Dock" feel
    // Increase magnification intensity slightly on small screens so they remain visible
    const targetVisualScale = Math.max(1.6, 1.2 / baseScale);
    const maxExpansion = targetVisualScale - 1; 
    const sigma = 0.8;
    const expansion = maxExpansion * Math.exp(-(distance * distance) / (2 * sigma * sigma));
    
    dynamicScale = 1 + expansion;
    
    // Smooth glow based on proximity
    glowOpacity = Math.exp(-(distance * distance) / (1.5));
    
    // Manage stacking: closer items should be on top
    zIndex = Math.round(10 + (dynamicScale - 1) * 200);
  }

  const handleMouseEnter = () => {
    hoverStartTime.current = Date.now();
    setIsHovered(true);
    onHoverChange?.({ row: band.row, col: band.col });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange?.(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    // On mobile screens, iOS fires mouseenter milliseconds before click on the first tap.
    // We absorb this first tap so the user can see the magnification before opening the modal.
    // A second tap won't fire mouseenter, so the time difference will be > 250ms, allowing the click.
    if (baseScale < 1 && Date.now() - hoverStartTime.current < 250) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(band);
  };

  return (
    <div
      className={`animate-entrance ${staggerClass}`}
      style={{
        gridColumn: band.col,
        gridRow: band.row,
        animationDelay: `${animationDelay * 0.01}s`,
        zIndex: zIndex,
      }}
    >
      <div
        className="metal-cell relative bg-[#0D0D0D] p-1 cursor-pointer w-full h-full"
        data-row={band.row}
        data-col={band.col}
        style={{
          '--category-color': categoryColor,
          transform: `scale(${dynamicScale})`,
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease-out, background-color 0.2s ease-out',
          backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.95)' : undefined,
          transformOrigin: 'center center',
        } as React.CSSProperties}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="flex flex-col h-full min-h-[100px] md:min-h-[50px] justify-between">
          <div>
            {/* Symbol */}
            <span 
              className="text-base md:text-sm font-bold leading-tight"
              style={{ color: categoryColor }}
            >
              {band.symbol}
            </span>
            
            {/* Name */}
            <span className="text-[11px] md:text-[10px] text-gray-300 leading-tight truncate mt-0.5 md:mt-0 font-medium md:font-normal block">
              {band.name}
            </span>
          </div>
          
          {/* Origin & Year */}
          <div className={`mt-auto transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
            <span className="text-[8px] md:text-[7.5px] text-gray-500 md:leading-none block truncate">
              {band.origin}
            </span>
            <span className="text-[8px] md:text-[7.5px] text-gray-500 md:leading-none block">
              {band.year}
            </span>
          </div>
        </div>
        
        {/* Hover glow effect overlay */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            boxShadow: `inset 0 0 15px ${categoryColor}${Math.round(glowOpacity * 60).toString(16).padStart(2, '0')}`,
            opacity: glowOpacity > 0 ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}

// Empty cell for spacing
export function EmptyCell({ row, col }: { row: number; col: number }) {
  return (
    <div 
      className="bg-transparent"
      style={{
        gridColumn: col,
        gridRow: row,
      }}
    />
  );
}

// Category label
interface CategoryLabelProps {
  name: string;
  color: string;
  row: number;
  col: number;
  colSpan?: number;
}

export function CategoryLabel({ name, color, row, col, colSpan = 1 }: CategoryLabelProps) {
  return (
    <div
      className="text-xs font-bold text-center flex items-center justify-center"
      style={{
        color: color,
        gridColumn: `${col} / span ${colSpan}`,
        gridRow: row,
        textShadow: `0 0 10px ${color}60`,
      }}
    >
      {name}
    </div>
  );
}
