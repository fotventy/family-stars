"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';

interface DragDropItem {
  id: string;
  title: string;
  description?: string;
  points: number;
  emoji?: string;
  isActive: boolean;
}

interface DragDropListProps {
  items: DragDropItem[];
  type: 'tasks' | 'gifts';
  onReorder: (items: DragDropItem[]) => void;
  onEdit?: (item: DragDropItem) => void;
  onDelete?: (itemId: string) => void;
  renderItem?: (item: DragDropItem, isDragging: boolean) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const DragDropList: React.FC<DragDropListProps> = ({
  items,
  type,
  onReorder,
  onEdit,
  onDelete,
  renderItem,
  emptyTitle,
  emptyDescription,
}) => {
  const { t } = useTranslation();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', itemId);
    
    // Находим карточку (может быть вложенный элемент)
    let target = e.target as HTMLElement;
    while (target && !target.classList.contains('draggable-item')) {
      target = target.parentElement as HTMLElement;
    }
    
    if (target) {
      target.style.opacity = '0.7';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null);
    setDragOverItem(null);
    
    // Находим карточку и возвращаем нормальный стиль
    let target = e.target as HTMLElement;
    while (target && !target.classList.contains('draggable-item')) {
      target = target.parentElement as HTMLElement;
    }
    
    if (target) {
      target.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(targetItemId);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetItemId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const draggedIndex = items.findIndex(item => item.id === draggedItem);
    const targetIndex = items.findIndex(item => item.id === targetItemId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Создаем новый массив с перемещенным элементом
    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);

    onReorder(newItems);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const getItemEmoji = (item: DragDropItem) => {
    if (item.emoji) return item.emoji;
    
    if (type === 'tasks') {
      const title = item.title.toLowerCase();
      if (title.includes('кровать')) return '🛏️';
      if (title.includes('зарядк')) return '💪';
      if (title.includes('зуб')) return '🦷';
      if (title.includes('убра')) return '🧹';
      if (title.includes('задан')) return '📚';
      if (title.includes('посуд')) return '🍽️';
      if (title.includes('мусор')) return '🗑️';
      if (title.includes('готовк')) return '👩‍🍳';
      return '✨';
    } else {
      const title = item.title.toLowerCase();
      if (title.includes('fortnite') || title.includes('minecraft')) return '🎮';
      if (title.includes('youtube')) return '📺';
      if (title.includes('чупа')) return '🍭';
      if (title.includes('кола')) return '🥤';
      if (title.includes('фильм')) return '🎥';
      if (title.includes('отбой')) return '😴';
      if (title.includes('телефон')) return '📱';
      if (title.includes('макдоналдс')) return '🍟';
      if (title.includes('пицца')) return '🍕';
      if (title.includes('кино')) return '🎬';
      if (title.includes('мышк')) return '🖱️';
      if (title.includes('лего')) return '🧱';
      if (title.includes('наушники')) return '🎧';
      if (title.includes('аквапарк')) return '🏊‍♂️';
      return '🎁';
    }
  };

  const defaultRenderItem = (item: DragDropItem, isDragging: boolean) => (
    <div className="card-content">
      <div style={{textAlign: 'center'}}>
        <div className="card-emoji" style={{fontSize: type === 'gifts' ? '64px' : '40px', marginBottom: '16px'}}>
          {getItemEmoji(item)}
        </div>
        <h3 className="card-title fortnite-text">{item.title}</h3>
        {item.description && (
          <p className="card-description">{item.description}</p>
        )}
        <div className="points-badge" style={{marginBottom: '16px'}}>
          <span>⭐</span>
          {item.points} {t("common.stars")}
        </div>
        <div className="card-actions">
          {onEdit && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="premium-button edit"
            >
              <span>✏️</span>
              {t("common.edit")}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style jsx>{`
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          padding: 0;
          margin: 0;
        }

        @media (min-width: 768px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1200px) {
          .cards-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
        }

        .drag-handle {
          cursor: grab;
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          padding: 6px 8px;
          font-size: 14px;
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 10;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
        }

        .draggable-item:hover .drag-handle {
          opacity: 1;
        }

        .drag-handle:hover {
          opacity: 1 !important;
          cursor: grabbing;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .draggable-item {
          position: relative;
          transition: all 0.3s ease;
          cursor: grab;
        }

        .draggable-item:active {
          cursor: grabbing;
        }

        .draggable-item.dragging {
          transform: rotate(3deg) scale(1.05);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          z-index: 1000;
          opacity: 0.9;
        }

        .draggable-item.drag-over {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 15px 35px rgba(255, 255, 255, 0.15);
        }

        .drag-placeholder {
          border: 2px dashed rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
          margin: 8px 0;
          transition: all 0.3s ease;
        }

        .drag-placeholder:hover {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.1);
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.7);
        }

        .empty-emoji {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.9);
        }

        .empty-description {
          font-size: 16px;
          opacity: 0.8;
        }

        .premium-button {
          color: white !important;
          font-size: 13px !important;
          padding: 10px 18px !important;
          border-radius: 0 !important;
          border: 1px solid rgba(255, 255, 255, 0.4) !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }

        .premium-button.edit {
          background: rgba(255, 255, 255, 0.2) !important;
          color: white !important;
          backdrop-filter: blur(10px);
        }

        .premium-button.edit:hover {
          background: rgba(255, 255, 255, 0.3) !important;
          border-color: rgba(255, 255, 255, 0.6) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .card-actions {
          display: flex !important;
          gap: 8px !important;
          justify-content: center !important;
          margin-top: 12px !important;
        }

        .premium-card {
          background: rgba(255, 255, 255, 0.15) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        .card-content {
          color: #1f2937 !important;
        }

        .card-title {
          color: #1f2937 !important;
          font-weight: 700 !important;
          text-shadow: none !important;
        }

        .card-description {
          color: #374151 !important;
        }

        .points-badge {
          color: #1f2937 !important;
          background: rgba(255, 255, 255, 0.8) !important;
          border-radius: 12px !important;
          padding: 4px 12px !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 4px !important;
          font-weight: 600 !important;
        }
      `}</style>

      <div className="cards-grid">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`premium-card draggable-item ${
              draggedItem === item.id ? 'dragging' : ''
            } ${
              dragOverItem === item.id ? 'drag-over' : ''
            }`}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, item.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, item.id)}
          >
            <div className="drag-handle" title="Зажмите и перетащите для изменения порядка">
              ⋮⋮
            </div>
            {renderItem ? renderItem(item, draggedItem === item.id) : defaultRenderItem(item, draggedItem === item.id)}
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="empty-state" style={{gridColumn: '1 / -1'}}>
            <div className="empty-emoji">
              {type === 'tasks' ? '📋' : '🏪'}
            </div>
            <h3 className="empty-title">
              {emptyTitle ?? (type === 'tasks' ? 'No tasks' : 'Gift store is empty')}
            </h3>
            <p className="empty-description">
              {emptyDescription ?? (type === 'tasks' ? 'Add the first tasks for children' : 'Add the first gifts to motivate children')}
            </p>
          </div>
        )}
      </div>
    </>
  );
}; 