import { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import type { Band } from '@/data/bands';
import { categories } from '@/data/bands';

interface BandEditorFormProps {
  band?: Partial<Band>;
  onSave: (band: Band) => void;
  onDelete?: (band: Band) => void;
  onCancel: () => void;
}

export function BandEditorForm({ band, onSave, onDelete, onCancel }: BandEditorFormProps) {
  const [formData, setFormData] = useState<Partial<Band>>({
    symbol: '',
    name: '',
    origin: '',
    year: new Date().getFullYear(),
    category: 'classic',
    row: 1,
    col: 1,
    description: '',
    topAlbums: [],
    ...band,
  });

  const [albumInput, setAlbumInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.symbol && formData.name && formData.row && formData.col) {
      onSave(formData as Band);
    }
  };

  const addAlbum = () => {
    if (albumInput.trim()) {
      setFormData(prev => ({
        ...prev,
        topAlbums: [...(prev.topAlbums || []), { title: albumInput.trim() }]
      }));
      setAlbumInput('');
    }
  };

  const removeAlbum = (index: number) => {
    setFormData(prev => ({
      ...prev,
      topAlbums: prev.topAlbums?.filter((_, i) => i !== index)
    }));
  };

  const categoryColor = categories[formData.category as keyof typeof categories]?.color || '#fff';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-xl bg-[#0D0D0D] border-2 rounded-xl overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]"
        style={{ borderColor: `${categoryColor}40` }}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span 
                className="w-8 h-8 flex items-center justify-center border-2 rounded text-sm"
                style={{ borderColor: categoryColor, color: categoryColor }}
              >
                {formData.symbol || '?'}
              </span>
              {band?.symbol ? 'Edit Element' : 'Add New Element'}
            </h2>
            <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Symbol</label>
                <input 
                  type="text" 
                  maxLength={2}
                  className="w-full bg-black/50 border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  value={formData.symbol}
                  onChange={e => setFormData({ ...formData, symbol: e.target.value })}
                  placeholder="e.g. Lz"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-black/50 border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Band Name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Origin</label>
                <input 
                  type="text" 
                  className="w-full bg-black/50 border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  value={formData.origin}
                  onChange={e => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="Country"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Formation Year</label>
                <input 
                  type="number" 
                  className="w-full bg-black/50 border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category (Genre)</label>
              <select 
                className="w-full bg-black/50 border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors capitalize"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
              >
                {Object.entries(categories).map(([key, cat]) => (
                  <option key={key} value={key} className="bg-[#0D0D0D]">{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Row (1-10)</label>
                <input 
                  type="number" min={1} max={10}
                  className="w-full bg-black/50 border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  value={formData.row}
                  onChange={e => setFormData({ ...formData, row: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Column (1-18)</label>
                <input 
                  type="number" min={1} max={18}
                  className="w-full bg-black/50 border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  value={formData.col}
                  onChange={e => setFormData({ ...formData, col: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
              <textarea 
                className="w-full bg-black/50 border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors min-h-[80px]"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief history/style..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Top Albums</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-black/50 border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  value={albumInput}
                  onChange={e => setAlbumInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addAlbum())}
                  placeholder="Album Title"
                />
                <button 
                  type="button"
                  onClick={addAlbum}
                  className="px-4 py-2 border rounded border-gray-700 hover:bg-white/10 transition-colors text-white"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.topAlbums?.map((album, i) => (
                  <span key={i} className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-300">
                    {album.title}
                    <button type="button" onClick={() => removeAlbum(i)} className="hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-800">
              <button 
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded font-bold transition-all hover:scale-[1.02]"
                style={{ backgroundColor: categoryColor, color: '#fff' }}
              >
                <Save size={18} />
                Save Element
              </button>
              
              {band?.symbol && onDelete && (
                <button 
                  type="button"
                  onClick={() => onDelete(formData as Band)}
                  className="w-12 flex items-center justify-center rounded border border-red-900/50 text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Remove Element"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
