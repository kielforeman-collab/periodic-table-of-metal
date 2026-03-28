import { memo, useRef, useState } from 'react';
import type { Band } from '@/data/bands';
import { categories } from '@/data/bands';

interface MetalCellProps {
  band: Band;
  baseScale?: number;
  animationDelay?: number;
  onClick?: (band: Band) => void;
  hoveredPos?: { row: number; col: number } | null;
  onHoverChange?: (band: Band, pos: { row: number; col: number } | null) => void;
}

// Edge-aware transform-origin lookup (computed once per cell, stable across renders)
function getTransformOrigin(col: number, row: number): string {
  let originX = 'center';
  let originY = 'center';
  if (col === 1) originX = 'left';
  else if (col === 18) originX = 'right';
  else if (col <= 3) originX = '30%';
  else if (col >= 16) originX = '70%';
  if (row === 1) originY = 'top';
  else if (row >= 9) originY = 'bottom';
  return `${originX} ${originY}`;
}

export const MetalCell = memo(function MetalCell({
  band,
  baseScale = 1,
  animationDelay = 0,
  onClick,
  hoveredPos,
  onHoverChange,
}: MetalCellProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hoverStartTime = useRef(0);
  const categoryColor = categories[band.category].color;
  const staggerClass = `stagger-${Math.min(animationDelay + 1, 10)}`;
  const transformOrigin = getTransformOrigin(band.col, band.row);

  // Calculate magnification scale based on distance to hovered cell
  let dynamicScale = 1.0;
  let zIndex = 10;
  let glowOpacity = 0;

  if (hoveredPos) {
    const dRow = band.row - hoveredPos.row;
    const dCol = band.col - hoveredPos.col;
    const distSq = dRow * dRow + dCol * dCol;

    // Gaussian-like scaling for smooth "Apple Dock" feel
    const targetVisualScale = Math.max(1.6, 1.2 / baseScale);
    const maxExpansion = targetVisualScale - 1;
    const sigma = 0.8;
    const expansion = maxExpansion * Math.exp(-distSq / (2 * sigma * sigma));

    dynamicScale = 1 + expansion;
    glowOpacity = Math.exp(-distSq / 1.5);
    zIndex = Math.round(10 + (dynamicScale - 1) * 200);
  }

  const handleMouseEnter = () => {
    hoverStartTime.current = Date.now();
    setIsHovered(true);
    onHoverChange?.(band, { row: band.row, col: band.col });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange?.(band, null);
  };

  const handleClick = (e: React.MouseEvent) => {
    // On mobile: absorb first tap so user sees magnification before modal opens
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
        zIndex,
      }}
    >
      <div
        className="metal-cell relative bg-white dark:bg-[#0D0D0D] p-1 cursor-pointer w-full h-full"
        data-row={band.row}
        data-col={band.col}
        style={{
          '--category-color': categoryColor,
          transform: `scale(${dynamicScale})`,
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease-out, background-color 0.2s ease-out',
          transformOrigin,
        } as React.CSSProperties}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="flex flex-col h-full min-h-[100px] md:min-h-[70px] justify-between">
          <div>
            {/* Symbol */}
            <span
              className="text-base md:text-lg font-bold leading-tight"
              style={{ color: categoryColor }}
            >
              {band.symbol}
            </span>

            {/* Name */}
            <span className="text-[11px] md:text-[12px] text-gray-700 dark:text-gray-300 leading-tight truncate mt-0.5 md:mt-0 font-medium md:font-semibold block">
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
});

// Category label (memoized — props never change after mount)
interface CategoryLabelProps {
  name: string;
  color: string;
  row: number;
  col: number;
  colSpan?: number;
}

export const CategoryLabel = memo(function CategoryLabel({ name, color, row, col, colSpan = 1 }: CategoryLabelProps) {
  return (
    <div
      className="text-xs font-bold text-center flex items-center justify-center"
      style={{
        color,
        gridColumn: `${col} / span ${colSpan}`,
        gridRow: row,
        textShadow: `0 0 10px ${color}60`,
      }}
    >
      {name}
    </div>
  );
});
