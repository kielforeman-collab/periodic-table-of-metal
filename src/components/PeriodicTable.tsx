import { bands as initialBands, categories } from '@/data/bands';
import { MetalCell, CategoryLabel } from './MetalCell';
import { useState, useCallback, useEffect, useRef } from 'react';
import { MetalDetailsModal } from './MetalDetailsModal';
import { BandEditorForm } from './BandEditorForm';
import { Plus, Download, Edit3, Check } from 'lucide-react';
import type { Band } from '@/data/bands';

export function PeriodicTable() {
  const [localBands, setLocalBands] = useState<Band[]>(initialBands);
  const [selectedBand, setSelectedBand] = useState<Band | null>(null);
  const [editingBand, setEditingBand] = useState<Band | Partial<Band> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hoveredPos, setHoveredPos] = useState<{ row: number; col: number } | null>(null);
  
  // Responsive Scaling state
  const [scale, setScale] = useState(1);
  const [gridHeight, setGridHeight] = useState(680); // Initial estimate
  const wrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      const containerWidth = entries[0].contentRect.width;
      const targetWidth = 1000;
      
      let gHeight = 680;
      if (gridRef.current) {
        gHeight = gridRef.current.offsetHeight;
        setGridHeight(gHeight);
      }
      
      let computedScale = 1;
      if (containerWidth < targetWidth) {
        computedScale = containerWidth / targetWidth;
      }

      // Height constraint (especially for landscape view on mobile)
      // Ensure the grid fits within the visible vertical window (subtracting ~200px for headers/footers)
      const availableHeight = window.innerHeight - 200;
      if (availableHeight > 100 && (gHeight * computedScale > availableHeight)) {
        const heightScale = availableHeight / gHeight;
        computedScale = Math.min(computedScale, Math.max(0.2, heightScale));
      }
      
      setScale(computedScale);
    });

    observer.observe(wrapperRef.current);
    
    // Also listen to window resize to catch height changes explicitly since wrapperRef width might not change on vertical resize
    const handleResize = () => {
      if (wrapperRef.current) {
        // Force a re-evaluation of the resize logic by accessing the dimensions
        const rect = wrapperRef.current.getBoundingClientRect();
        // The observer loop will naturally catch width changes, but we explicitly trigger scale updates here for height
        let gHeight = gridRef.current?.offsetHeight || 680;
        let computedScale = 1;
        if (rect.width < 1000) computedScale = rect.width / 1000;
        const availableHeight = window.innerHeight - 200;
        if (availableHeight > 100 && (gHeight * computedScale > availableHeight)) {
           const heightScale = availableHeight / gHeight;
           computedScale = Math.min(computedScale, Math.max(0.2, heightScale));
        }
        setScale(computedScale);
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

  let animationIndex = 0;

  const handleSaveBand = useCallback((updatedBand: Band) => {
    setLocalBands(prev => {
      // If it exists but is a different band (repositioning), we should handle that
      // For now, let's just filter out the old version of the band by unique symbol/name or position
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

  const handleExport = () => {
    const dataStr = JSON.stringify(localBands, null, 2);
    const blob = new Blob([`export const bands: Band[] = ${dataStr};`], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bands.ts';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Also log to console for the agent to read if needed
    console.log("BAND_DATA_EXPORT_START");
    console.log(dataStr);
    console.log("BAND_DATA_EXPORT_END");
    alert("Data exported! Check console or download for the updated bands.ts content.");
  };

  // Helper to find band at position
  const getBandAt = (r: number, c: number) => localBands.find(b => b.row === r && b.col === c);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element) {
      const cell = element.closest('.metal-cell');
      if (cell) {
        const row = parseInt(cell.getAttribute('data-row') || '0', 10);
        const col = parseInt(cell.getAttribute('data-col') || '0', 10);
        if (row && col && (!hoveredPos || hoveredPos.row !== row || hoveredPos.col !== col)) {
          setHoveredPos({ row, col });
        }
      } else {
        setHoveredPos(null);
      }
    }
  }, [hoveredPos]);

  const handleTouchEnd = useCallback(() => {
    setHoveredPos(null);
  }, []);

  return (
    <div className="w-full h-full overflow-auto p-4 bg-[#0D0D0D] min-h-screen">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-4 gap-4">
        <div className="flex-1" />
        <h1 className="font-gothic text-4xl md:text-5xl text-gray-200" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
          Periodic Table of Metal
        </h1>
        <div className="flex-1 flex justify-end gap-3">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isEditMode ? 'bg-blue-600 border-blue-400 text-white' : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'}`}
          >
            {isEditMode ? <Check size={20} /> : <Edit3 size={20} />}
            {isEditMode ? 'Finish Editing' : 'Edit Mode'}
          </button>
          {isEditMode && (
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/20 border border-green-500/50 text-green-400 hover:text-green-300 transition-all"
            >
              <Download size={20} />
              Export Data
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Wrapper - Responsive Scaling */}
      <div 
        ref={wrapperRef}
        className="w-full relative flex justify-center mx-auto"
        style={{
          maxWidth: '1400px',
          height: `${gridHeight * scale}px`, // Reserves dynamic scaled height in document flow
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
              touchAction: 'pan-y', // Allow vertical scroll, but prevent mobile browser horizontal swiping while dragging
            }}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchMove} // Trigger hover immediately on touch start
            onTouchEnd={handleTouchEnd}
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

        {/* Render all band cells */}
        {localBands.map((band, index) => {
          animationIndex++;
          return (
            <MetalCell 
              key={`${band.symbol}-${index}`} 
              band={band} 
              baseScale={scale}
              animationDelay={isEditMode ? 0 : animationIndex}
              onClick={isEditMode ? setEditingBand : setSelectedBand}
              hoveredPos={hoveredPos}
              onHoverChange={(pos) => {
                if (pos) {
                  setHoveredPos(pos);
                } else {
                  // Only clear if we were the ones who set it
                  setHoveredPos(prev => 
                    prev?.row === band.row && prev?.col === band.col ? null : prev
                  );
                }
              }}
            />
          );
        })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
        {Object.entries(categories).map(([key, { name, color }]) => (
          <div key={key} className="flex items-center gap-2 font-medium">
            <div 
              className="w-5 h-5 border shadow-lg"
              style={{ borderColor: color, backgroundColor: `${color}20`, boxShadow: `0 0 10px ${color}30` }}
            />
            <span style={{ color }}>{name}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-600">
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
