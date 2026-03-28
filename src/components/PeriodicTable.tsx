import { bands as initialBands, categories } from '@/data/bands';
import { MetalCell, CategoryLabel } from './MetalCell';
import { useState, useCallback, useEffect, useRef } from 'react';
import { MetalDetailsModal } from './MetalDetailsModal';
import { BandEditorForm } from './BandEditorForm';
import { Plus, Download, Edit3, Check, Menu, Moon, Sun, X } from 'lucide-react';
import type { Band } from '@/data/bands';

// Extracted: single source of truth for responsive scale calculation
function computeScale(containerWidth: number, gridHeight: number): number {
  const targetWidth = 1500; // Increased from 1200 for 25% larger base size
  let scale = 1;
  if (containerWidth < targetWidth) {
    scale = containerWidth / targetWidth;
  }
  // Height constraint for mobile landscape / portrait
  const headerOffset = containerWidth < 768 ? 80 : 70; 
  const availableHeight = window.innerHeight - headerOffset - 4; // Added 4px safety buffer to prevent flickering loops
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  // Close sidebar on click-away
  useEffect(() => {
    if (!isSidebarOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const sidebar = document.getElementById('sidebar-menu');
      const trigger = document.getElementById('sidebar-trigger');
      if (sidebar && !sidebar.contains(e.target as Node) && trigger && !trigger.contains(e.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [isSidebarOpen]);

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
    URL.revokeObjectURL(url);
    setIsSidebarOpen(false); // Close sidebar after export
    
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
    <div className="w-full h-full overflow-y-auto overflow-x-hidden p-2 md:p-3 bg-gray-50 dark:bg-[#0D0D0D] min-h-screen text-gray-900 dark:text-gray-200 transition-colors duration-300">
      {/* Sidebar Navigation */}
      <div 
        id="sidebar-menu"
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#111] border-r border-gray-200 dark:border-gray-800 z-[200] transform transition-transform duration-300 ease-in-out shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold tracking-tight">Menu</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            <button
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
                // setIsSidebarOpen(false); // keep open for quick toggle
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/50 hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-sm font-medium"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>

            <button
              onClick={() => {
                setIsEditMode(!isEditMode);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${isEditMode ? 'bg-blue-600 border-blue-400 text-white' : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/50 hover:bg-gray-100 dark:hover:bg-white/10'}`}
            >
              {isEditMode ? <Check size={18} /> : <Edit3 size={18} />}
              {isEditMode ? 'Finish Editing' : 'Enter Edit Mode'}
            </button>

            {isEditMode && (
              <button
                onClick={handleExport}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-600/10 dark:border-green-500/30 dark:text-green-400 dark:hover:bg-green-600/20 transition-all text-sm font-medium"
              >
                <Download size={18} />
                Export Data
              </button>
            )}
          </nav>

          <div className="mt-auto text-center text-[10px] text-gray-500 italic pb-4">
            Periodic Table of Metal v2.1
          </div>
        </div>
      </div>

      {/* Floating Sidebar Trigger */}
      <button 
        id="sidebar-trigger"
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 p-2 rounded-full border border-gray-300 bg-white/50 backdrop-blur-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:border-gray-800 dark:bg-black/40 dark:text-gray-400 dark:hover:text-white dark:hover:bg-black/60 transition-all shadow-sm z-[150]"
      >
        <Menu size={20} />
      </button>

      {/* Main Grid Wrapper - Responsive Scaling */}
      <div
        ref={wrapperRef}
        className="w-full relative flex justify-center mx-auto"
        style={{
          maxWidth: '2200px', // Increased from 1800px
          height: `${gridHeight * scale}px`,
        }}
      >
        <div
          style={{
            width: scale < 1 ? `${1500 * scale}px` : '100%', // Updated from 1200
            height: scale < 1 ? `${gridHeight * scale}px` : 'auto',
            position: 'relative',
          }}
        >
          <div
            ref={gridRef}
            className={`periodic-grid ${scale < 1 ? 'absolute top-0 left-0' : 'w-full relative px-2 md:px-6 md:py-2'}`}
            style={{
              width: scale < 1 ? '1500px' : '100%', // Updated from 1200
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

        {/* Title & Legend (Relocated to Gap Area) */}
        <div 
          className="flex flex-col items-center justify-center p-2 md:p-4 rounded-xl border border-gray-200/50 dark:border-white/5 bg-white/30 dark:bg-white/5 backdrop-blur-sm shadow-sm gap-y-2 md:gap-y-3 mx-2 overflow-hidden"
          style={{
            gridColumn: '3 / span 10',
            gridRow: '1 / span 2',
            alignSelf: 'center',
          }}
        >
          <h1 className="font-gothic text-lg sm:text-xl md:text-3xl lg:text-4xl text-center leading-none drop-shadow-sm dark:[text-shadow:0_0_20px_rgba(255,255,255,0.3)]">
            Periodic Table of Metal
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-2 md:gap-x-4 gap-y-1">
            {Object.entries(categories).map(([key, { name, color }]) => (
              <div key={key} className="flex items-center gap-1.5 whitespace-nowrap">
                <div
                  className="w-2 md:w-3 h-2 md:h-3 border shadow-sm"
                  style={{ borderColor: color, backgroundColor: `${color}20`, boxShadow: `0 0 8px ${color}30` }}
                />
                <span className="text-[8px] md:text-[10px] lg:text-[11px] font-semibold" style={{ color }}>{name}</span>
              </div>
            ))}
          </div>
        </div>

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

      {/* Legend removed from bottom move to grid area above */}

      {/* Footer (Reduced space) */}
      {isEditMode && (
        <div className="mt-2 text-center text-[9px] md:text-xs text-gray-400 dark:text-gray-600 italic">
          <p>
            EDITOR ACTIVE: Click any cell to edit or trash icon to add new ones. Changes are temporary until exported.
          </p>
        </div>
      )}

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
