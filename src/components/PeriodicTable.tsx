import { bands as initialBands, categories } from '@/data/bands';
import { MetalCell, CategoryLabel } from './MetalCell';
import { useState, useCallback, useEffect, useRef } from 'react';
import { MetalDetailsModal } from './MetalDetailsModal';
import { BandEditorForm } from './BandEditorForm';
import { Plus, Download, Edit3, Check, Menu, Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Band } from '@/data/bands';

// Extracted: single source of truth for responsive scale calculation
function computeScale(containerWidth: number, gridHeight: number): number {
  const targetWidth = 1000;
  let scale = 1;
  if (containerWidth < targetWidth) {
    scale = containerWidth / targetWidth;
  }
  // Height constraint for mobile landscape / portrait
  const headerOffset = containerWidth < 768 ? 180 : 200;
  const availableHeight = window.innerHeight - headerOffset;
  if (availableHeight > 100 && gridHeight * scale > availableHeight) {
    const heightScale = availableHeight / gridHeight;
    scale = Math.min(scale, Math.max(0.2, heightScale));
  }
  return scale;
}

export function PeriodicTable() {
  const [localBands, setLocalBands] = useState<Band[]>(initialBands);
  const [selectedBand, setSelectedBand] = useState<Band | null>(null);
  const [editingBand, setEditingBand] = useState<Band | Partial<Band> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hoveredPos, setHoveredPos] = useState<{ row: number; col: number } | null>(null);

  // Responsive Scaling state
  const [scale, setScale] = useState(1);
  const [gridHeight, setGridHeight] = useState(680);
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Theme persistence
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // ESC key to close modals
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedBand(null);
        setEditingBand(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Responsive scaling via ResizeObserver + window resize
  useEffect(() => {
    if (!wrapperRef.current) return;

    const updateScale = (containerWidth: number) => {
      const gHeight = gridRef.current?.offsetHeight || 680;
      setGridHeight(gHeight);
      setScale(computeScale(containerWidth, gHeight));
    };

    const observer = new ResizeObserver((entries) => {
      updateScale(entries[0].contentRect.width);
    });
    observer.observe(wrapperRef.current);

    const handleResize = () => {
      if (wrapperRef.current) {
        updateScale(wrapperRef.current.getBoundingClientRect().width);
      }
    };
    window.addEventListener('resize', handleResize);
    const timeout = setTimeout(handleResize, 100);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, []);

  // Stable hover handler — compatible with React.memo on MetalCell
  const handleHoverChange = useCallback((band: Band, pos: { row: number; col: number } | null) => {
    if (pos) {
      setHoveredPos(pos);
    } else {
      setHoveredPos(prev =>
        prev?.row === band.row && prev?.col === band.col ? null : prev
      );
    }
  }, []);

  const handleSaveBand = useCallback((updatedBand: Band) => {
    setLocalBands(prev => {
      const filtered = prev.filter(b => b.name !== updatedBand.name && (b.row !== updatedBand.row || b.col !== updatedBand.col));
      return [...filtered, updatedBand];
    });
    setEditingBand(null);
    setSelectedBand(null);
  }, []);

  const handleDeleteBand = useCallback((bandToDelete: Band) => {
    setLocalBands(prev => prev.filter(b => b.name !== bandToDelete.name));
    setEditingBand(null);
    setSelectedBand(null);
  }, []);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(localBands, null, 2);
    const blob = new Blob([`export const bands: Band[] = ${dataStr};`], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bands.ts';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Fix: prevent Blob URL memory leak

    console.log("BAND_DATA_EXPORT_START");
    console.log(dataStr);
    console.log("BAND_DATA_EXPORT_END");
    alert("Data exported! Check console or download for the updated bands.ts content.");
  }, [localBands]);

  const getBandAt = useCallback(
    (r: number, c: number) => localBands.find(b => b.row === r && b.col === c),
    [localBands]
  );

  const handleCellClick = isEditMode ? setEditingBand : setSelectedBand;

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden p-2 md:p-4 pb-12 md:pb-8 bg-gray-50 dark:bg-[#0D0D0D] min-h-screen text-gray-900 dark:text-gray-200 transition-colors duration-300">
      {/* Header & Controls */}
      <div className="relative flex items-center justify-center mb-4 md:mb-8 px-2 md:px-4 min-h-[3rem] md:min-h-[5rem]">
        <h1 className="font-gothic text-2xl sm:text-3xl md:text-5xl text-center drop-shadow-sm dark:[text-shadow:0_0_20px_rgba(255,255,255,0.3)]">
          Periodic Table of Metal
        </h1>

        {/* Controls Container (Desktop & Mobile) */}
        <div className="absolute right-2 md:right-4 flex items-center gap-3">
          {/* Desktop Controls */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center justify-center p-2 rounded-full border border-gray-300 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:border-gray-800 dark:bg-black/40 dark:text-gray-400 dark:hover:text-white dark:hover:bg-black/60 transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isEditMode ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:bg-black/40 dark:border-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-black/60'}`}
            >
              {isEditMode ? <Check size={20} /> : <Edit3 size={20} />}
              {isEditMode ? 'Finish Editing' : 'Edit Mode'}
            </button>
            {isEditMode && (
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-300 text-green-700 hover:bg-green-200 dark:bg-green-600/20 dark:border-green-500/50 dark:text-green-400 dark:hover:text-green-300 transition-all"
              >
                <Download size={20} />
                Export Data
              </button>
            )}
          </div>

          {/* Mobile Hamburger Controls */}
          <div className="md:hidden flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full border border-gray-300 bg-white text-gray-600 hover:text-gray-900 dark:border-gray-800 dark:bg-black/40 dark:text-gray-400 dark:hover:text-white focus:outline-none transition-colors">
                  <Menu size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-gray-200 text-gray-800 dark:bg-[#111] dark:border-gray-800 dark:text-gray-200 text-sm min-w-[160px]">
                <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="cursor-pointer">
                  {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditMode(!isEditMode)} className="cursor-pointer">
                  {isEditMode ? <Check className="mr-2 h-4 w-4" /> : <Edit3 className="mr-2 h-4 w-4" />}
                  {isEditMode ? 'Finish Editing' : 'Edit Mode'}
                </DropdownMenuItem>
                {isEditMode && (
                  <DropdownMenuItem onClick={handleExport} className="text-green-700 dark:text-green-400 cursor-pointer">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Grid Wrapper - Responsive Scaling */}
      <div
        ref={wrapperRef}
        className="w-full relative flex justify-center mx-auto"
        style={{
          maxWidth: '1400px',
          height: `${gridHeight * scale}px`,
        }}
      >
        <div
          style={{
            width: scale < 1 ? `${1000 * scale}px` : '100%',
            height: scale < 1 ? `${gridHeight * scale}px` : 'auto',
            position: 'relative',
          }}
        >
          <div
            ref={gridRef}
            className={`periodic-grid ${scale < 1 ? 'absolute top-0 left-0' : 'w-full relative'}`}
            style={{
              width: scale < 1 ? '1000px' : '100%',
              transform: scale < 1 ? `scale(${scale})` : 'none',
              transformOrigin: 'top left',
            }}
          >
        {/* Category Labels (Fixed Positions) */}
        <CategoryLabel name={categories.classic.name} color={categories.classic.color} row={1} col={1} colSpan={2} />
        <CategoryLabel name={categories.transition.name} color={categories.transition.color} row={3} col={3} colSpan={10} />
        <CategoryLabel name={categories.alternative.name} color={categories.alternative.color} row={1} col={13} colSpan={5} />
        <CategoryLabel name={categories.noble.name} color={categories.noble.color} row={1} col={18} colSpan={1} />
        <CategoryLabel name={categories.nu.name} color={categories.nu.color} row={5} col={13} colSpan={5} />
        <CategoryLabel name={categories.extreme.name} color={categories.extreme.color} row={8} col={1} colSpan={18} />

        {/* Grid Background/Add Buttons in Edit Mode */}
        {isEditMode && Array.from({ length: 10 }).map((_, r) =>
          Array.from({ length: 18 }).map((_, c) => {
            const row = r + 1;
            const col = c + 1;
            if (!getBandAt(row, col)) {
              return (
                <button
                  key={`add-${row}-${col}`}
                  onClick={() => setEditingBand({ row, col })}
                  className="group flex items-center justify-center border border-dashed border-gray-800 hover:border-blue-500/50 transition-colors rounded"
                  style={{ gridRow: row, gridColumn: col, minHeight: '60px' }}
                >
                  <Plus size={20} className="text-gray-700 group-hover:text-blue-500 transition-colors" />
                </button>
              );
            }
            return null;
          })
        )}

        {/* Render all band cells — uses .map index instead of mutable animationIndex */}
        {localBands.map((band, index) => (
          <MetalCell
            key={`${band.symbol}-${band.row}-${band.col}`}
            band={band}
            baseScale={scale}
            animationDelay={isEditMode ? 0 : index + 1}
            onClick={handleCellClick}
            hoveredPos={hoveredPos}
            onHoverChange={handleHoverChange}
          />
        ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 md:mt-8 flex flex-wrap justify-center gap-2 md:gap-6 text-[10px] md:text-sm">
        {Object.entries(categories).map(([key, { name, color }]) => (
          <div key={key} className="flex items-center gap-1 md:gap-2 font-medium">
            <div
              className="w-3 h-3 md:w-5 md:h-5 border shadow-lg"
              style={{ borderColor: color, backgroundColor: `${color}20`, boxShadow: `0 0 10px ${color}30` }}
            />
            <span style={{ color }}>{name}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 md:mt-6 text-center text-[9px] md:text-xs text-gray-600">
        <p>
          {isEditMode
            ? "EDITOR ACTIVE: Click any cell to edit or trash icon to add new ones. Changes are temporary until exported."
            : "Hover over elements for details • Click to explore"}
        </p>
      </div>

      {/* Detail Modal */}
      {selectedBand && (
        <MetalDetailsModal
          band={selectedBand}
          onClose={() => setSelectedBand(null)}
          onEdit={isEditMode ? setEditingBand : undefined}
        />
      )}

      {/* Editor Modal */}
      {editingBand && (
        <BandEditorForm
          band={editingBand}
          onSave={handleSaveBand}
          onDelete={handleDeleteBand}
          onCancel={() => setEditingBand(null)}
        />
      )}
    </div>
  );
}
