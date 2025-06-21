import React, { useState } from 'react';

interface DragDropItem {
  id: string;
  title: string;
  description?: string;
  points: number;
  emoji?: string;
  isActive?: boolean;
}

interface DragDropListProps {
  items: DragDropItem[];
  type: 'tasks' | 'gifts';
  onReorder: (items: DragDropItem[]) => void;
  onEdit?: (item: DragDropItem) => void;
  onDelete?: (itemId: string) => void;
  renderItem?: (item: DragDropItem, isDragging: boolean) => React.ReactNode;
}

export const DragDropList: React.FC<DragDropListProps> = ({
  items,
  type,
  onReorder,
  onEdit,
  onDelete,
  renderItem
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', itemId);
    
    // Добавляем стиль для перетаскиваемого элемента
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null);
    setDragOverItem(null);
    
    // Возвращаем нормальный стиль
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
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
        <div className="card-emoji" style={{fontSize: '64px', marginBottom: '16px'}}>
          {getItemEmoji(item)}
        </div>
        <h3 className="card-title fortnite-text">{item.title}</h3>
        {item.description && (
          <p className="card-description">{item.description}</p>
        )}
        <div className="points-badge" style={{marginBottom: '16px'}}>
          <span>⭐</span>
          {item.points} {type === 'tasks' ? 'звёзд' : 'звёзд'}
        </div>
        <div className="card-actions" style={{justifyContent: 'center'}}>
          {onEdit && (
            <button 
              onClick={() => onEdit(item)}
              className="premium-button edit"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(item.id)}
              className="premium-button delete"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style jsx>{`
        .drag-handle {
          cursor: grab;
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 8px;
          font-size: 16px;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        .drag-handle:hover {
          opacity: 1;
          cursor: grabbing;
        }

        .draggable-item {
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .draggable-item.dragging {
          transform: rotate(5deg) scale(1.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          z-index: 1000;
        }

        .draggable-item.drag-over {
          transform: translateY(-8px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
        }

        .drag-placeholder {
          border: 2px dashed rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 18px;
          margin: 8px 0;
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
            <div className="drag-handle">
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
              {type === 'tasks' ? 'Нет заданий' : 'Магазин подарков пуст'}
            </h3>
            <p className="empty-description">
              {type === 'tasks' 
                ? 'Добавьте первые задания для детей'
                : 'Добавьте первые подарки для мотивации детей'
              }
            </p>
          </div>
        )}
      </div>
    </>
  );
}; 