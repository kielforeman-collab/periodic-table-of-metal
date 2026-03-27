import type { Band } from '@/data/bands';
import { categories } from '@/data/bands';
import { useState } from 'react';

interface MetalCellProps {
  band: Band;
  animationDelay?: number;
  onClick?: (band: Band) => void;
}

export function MetalCell({ band, animationDelay = 0, onClick }: MetalCellProps) {
  const [isHovered, setIsHovered] = useState(false);
  const categoryColor = categories[band.category].color;
  
  const staggerClass = `stagger-${Math.min(animationDelay + 1, 10)}`;

  return (
    <div
      className={`metal-cell relative bg-[#0D0D0D] p-1 cursor-pointer animate-entrance ${staggerClass}`}
      style={{
        '--category-color': categoryColor,
        gridColumn: band.col,
        gridRow: band.row,
        animationDelay: `${animationDelay * 0.01}s`,
      } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(band)}
    >
      <div className="flex flex-col h-full min-h-[50px]">
        {/* Symbol */}
        <span 
          className="text-sm font-bold leading-tight"
          style={{ color: categoryColor }}
        >
          {band.symbol}
        </span>
        
        {/* Name */}
        <span className="text-[8px] text-gray-300 leading-tight truncate mt-0.5">
          {band.name}
        </span>
        
        {/* Origin & Year - Only visible on hover or if space permits */}
        <div className={`mt-auto transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
          <span className="text-[6px] text-gray-500 leading-none block truncate">
            {band.origin}
          </span>
          <span className="text-[6px] text-gray-500 leading-none block">
            {band.year}
          </span>
        </div>
      </div>
      
      {/* Hover glow effect overlay */}
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 10px ${categoryColor}40`,
          }}
        />
      )}
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
