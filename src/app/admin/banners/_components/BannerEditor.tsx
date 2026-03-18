'use client';

import { useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ImageUploadOrUrl from './ImageUploadOrUrl';

/* ── Generic banner item (union of HeroSlide + PromoBanner fields) ── */
export interface BannerItem {
  id: number;
  image: string;
  href: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  alt?: string;
}

interface BannerEditorProps {
  label: string;
  description: string;
  items: BannerItem[];
  onChange: (items: BannerItem[]) => void;
  /** Which fields to show besides image + href */
  fields: ('title' | 'subtitle' | 'buttonText' | 'alt')[];
}

/* ── Sortable card wrapper ───────────────────────────────── */
function SortableCard({
  item,
  index,
  fields,
  onUpdate,
  onRemove,
}: {
  item: BannerItem;
  index: number;
  fields: BannerEditorProps['fields'];
  onUpdate: (index: number, partial: Partial<BannerItem>) => void;
  onRemove: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-zinc-900 border border-dark-border rounded-xl p-4 space-y-3"
    >
      {/* ── Header: drag handle + index + remove ── */}
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing text-neutral-500 hover:text-white transition-colors touch-none"
          {...attributes}
          {...listeners}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <circle cx="9" cy="5" r="1.5" />
            <circle cx="15" cy="5" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="19" r="1.5" />
            <circle cx="15" cy="19" r="1.5" />
          </svg>
        </button>

        <span className="text-neutral-500 text-xs font-mono">#{index + 1}</span>

        <div className="flex-1" />

        {/* Remove button */}
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1.5 rounded-md text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          title="Remove banner"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>

      {/* ── Image ── */}
      <div>
        <label className="block text-neutral-400 text-xs font-medium mb-1.5">Image</label>
        <ImageUploadOrUrl
          value={item.image}
          onChange={(url) => onUpdate(index, { image: url })}
        />
      </div>

      {/* ── Fields ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.includes('title') && (
          <div>
            <label className="block text-neutral-400 text-xs font-medium mb-1">Title</label>
            <input
              type="text"
              value={item.title ?? ''}
              onChange={(e) => onUpdate(index, { title: e.target.value })}
              placeholder="Banner title"
              className="w-full px-3 py-2 bg-zinc-800 border border-dark-border rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        )}

        {fields.includes('subtitle') && (
          <div>
            <label className="block text-neutral-400 text-xs font-medium mb-1">Subtitle</label>
            <input
              type="text"
              value={item.subtitle ?? ''}
              onChange={(e) => onUpdate(index, { subtitle: e.target.value })}
              placeholder="Optional subtitle"
              className="w-full px-3 py-2 bg-zinc-800 border border-dark-border rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        )}

        {fields.includes('buttonText') && (
          <div>
            <label className="block text-neutral-400 text-xs font-medium mb-1">Button Text</label>
            <input
              type="text"
              value={item.buttonText ?? ''}
              onChange={(e) => onUpdate(index, { buttonText: e.target.value })}
              placeholder="Shop Now"
              className="w-full px-3 py-2 bg-zinc-800 border border-dark-border rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        )}

        {fields.includes('alt') && (
          <div>
            <label className="block text-neutral-400 text-xs font-medium mb-1">Alt Text</label>
            <input
              type="text"
              value={item.alt ?? ''}
              onChange={(e) => onUpdate(index, { alt: e.target.value })}
              placeholder="Image alt text"
              className="w-full px-3 py-2 bg-zinc-800 border border-dark-border rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        )}

        {/* Link URL — always shown */}
        <div className="sm:col-span-2">
          <label className="block text-neutral-400 text-xs font-medium mb-1">Link URL</label>
          <input
            type="text"
            value={item.href}
            onChange={(e) => onUpdate(index, { href: e.target.value })}
            placeholder="https://example.com or /products/..."
            className="w-full px-3 py-2 bg-zinc-800 border border-dark-border rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

/* ── Main BannerEditor ───────────────────────────────────── */

export default function BannerEditor({
  label,
  description,
  items,
  onChange,
  fields,
}: BannerEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      onChange(arrayMove(items, oldIndex, newIndex));
    },
    [items, onChange],
  );

  const handleUpdate = useCallback(
    (index: number, partial: Partial<BannerItem>) => {
      const next = [...items];
      next[index] = { ...next[index], ...partial };
      onChange(next);
    },
    [items, onChange],
  );

  const handleRemove = useCallback(
    (index: number) => {
      onChange(items.filter((_, i) => i !== index));
    },
    [items, onChange],
  );

  const handleAdd = useCallback(() => {
    const maxId = items.reduce((max, i) => Math.max(max, i.id), 0);
    const newItem: BannerItem = {
      id: maxId + 1,
      image: '',
      href: '#',
      title: '',
      subtitle: '',
      buttonText: fields.includes('buttonText') ? 'Shop Now' : undefined,
      alt: fields.includes('alt') ? '' : undefined,
    };
    onChange([...items, newItem]);
  }, [items, onChange, fields]);

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">{label}</h3>
          <p className="text-neutral-500 text-xs mt-0.5">{description}</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add
        </button>
      </div>

      {/* Sortable list */}
      {items.length === 0 ? (
        <div className="bg-dark-card border border-dark-border border-dashed rounded-xl p-8 text-center">
          <p className="text-neutral-500 text-sm">No banners yet. Click &quot;Add&quot; to create one.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((item, index) => (
                <SortableCard
                  key={item.id}
                  item={item}
                  index={index}
                  fields={fields}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
