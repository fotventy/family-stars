import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

interface TaskManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: any[];
  editingTask?: any;
  onCreateTask: (title: string, description: string, points: number, emoji?: string) => Promise<void>;
  onUpdateTask: (taskId: string, title: string, description: string, points: number, emoji?: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

const taskEmojis = ['💪', '🧹', '🍽️', '📚', '🦷', '🛏️', '🗑️', '👩‍🍳', '🌱', '📖', '🏃‍♂️', '🚿'];

export const TaskManagementModal: React.FC<TaskManagementModalProps> = ({
  isOpen,
  onClose,
  tasks,
  editingTask,
  onCreateTask,
  onUpdateTask,
  onDeleteTask
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState('');
  const [newTaskEmoji, setNewTaskEmoji] = useState('');
  
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPoints, setEditPoints] = useState('');
  const [editEmoji, setEditEmoji] = useState('');

  useEffect(() => {
    if (editingTask) {
      setEditTitle(editingTask.title || '');
      setEditDescription(editingTask.description || '');
      setEditPoints(editingTask.points?.toString() || '');
      setEditEmoji(editingTask.emoji || '');
    }
  }, [editingTask]);

  const getTaskEmoji = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('зарядк')) return '💪';
    if (lowerTitle.includes('убра') || lowerTitle.includes('чист')) return '🧹';
    if (lowerTitle.includes('посуд')) return '🍽️';
    if (lowerTitle.includes('урок') || lowerTitle.includes('домаш')) return '📚';
    if (lowerTitle.includes('зуб')) return '🦷';
    if (lowerTitle.includes('кроват')) return '🛏️';
    if (lowerTitle.includes('мусор')) return '🗑️';
    if (lowerTitle.includes('готов')) return '👩‍🍳';
    return '✨';
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskPoints) return;
    
    await onCreateTask(newTaskTitle, newTaskDescription, parseInt(newTaskPoints), newTaskEmoji);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPoints('');
    setNewTaskEmoji('');
    onClose();
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editPoints || !editingTask) return;
    
    await onUpdateTask(editingTask.id, editTitle, editDescription, parseInt(editPoints), editEmoji);
    setEditTitle('');
    setEditDescription('');
    setEditPoints('');
    setEditEmoji('');
    onClose();
  };

  const cancelEdit = () => {
    setEditTitle('');
    setEditDescription('');
    setEditPoints('');
    setEditEmoji('');
    onClose();
  };

  const modalTitle = editingTask ? "✏️ Редактирование задания" : "➕ Новое задание";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <div style={{ color: 'white' }}>
        {/* Форма создания нового задания */}
        {!editingTask && (
          <form onSubmit={handleCreateTask}>
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ 
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                textAlign: 'left'
              }}>
                🏷️ Название задания
              </label>
              <input 
                type="text" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: 'none',
                  borderRadius: '0',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  margin: '0',
                  display: 'block',
                  outline: 'none'
                }}
                placeholder="Например: Сделать утреннюю зарядку"
                required 
              />
            </div>
            
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ 
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                textAlign: 'left'
              }}>
                📝 Описание
              </label>
              <textarea 
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: 'none',
                  borderRadius: '0',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  margin: '0',
                  display: 'block',
                  outline: 'none',
                  height: '80px',
                  resize: 'none'
                }}
                placeholder="Дополнительная информация о задании"
                rows={3}
              />
            </div>

            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ 
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                textAlign: 'left'
              }}>
                ⭐ Количество звёзд
              </label>
              <input 
                type="number" 
                value={newTaskPoints}
                onChange={(e) => setNewTaskPoints(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: 'none',
                  borderRadius: '0',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  margin: '0',
                  display: 'block',
                  outline: 'none'
                }}
                placeholder="Например: 10"
                min="1"
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '12px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}>
                😊 Выберите эмодзи
              </label>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px',
                justifyContent: 'flex-start'
              }}>
                {taskEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setNewTaskEmoji(emoji)}
                    style={{
                      padding: '12px',
                      fontSize: '24px',
                      background: newTaskEmoji === emoji 
                        ? 'rgba(255, 255, 255, 0.3)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      minWidth: '48px',
                      minHeight: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end',
              marginTop: '32px'
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '14px 28px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={!newTaskTitle.trim() || !newTaskPoints}
                className="game-button complete"
                style={{
                  padding: '14px 28px',
                  fontSize: '16px',
                  fontWeight: '600',
                  opacity: (!newTaskTitle.trim() || !newTaskPoints) ? 0.5 : 1,
                  cursor: (!newTaskTitle.trim() || !newTaskPoints) ? 'not-allowed' : 'pointer'
                }}
              >
                ✨ Создать задание
              </button>
            </div>
          </form>
        )}

        {/* Форма редактирования задания */}
        {editingTask && (
          <form onSubmit={handleUpdateTask}>
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ 
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                textAlign: 'left'
              }}>
                🏷️ Название задания
              </label>
              <input 
                type="text" 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: 'none',
                  borderRadius: '0',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  margin: '0',
                  display: 'block',
                  outline: 'none'
                }}
                placeholder="Например: Сделать утреннюю зарядку"
                required 
              />
            </div>
            
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ 
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                textAlign: 'left'
              }}>
                📝 Описание
              </label>
              <textarea 
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: 'none',
                  borderRadius: '0',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  margin: '0',
                  display: 'block',
                  outline: 'none',
                  height: '80px',
                  resize: 'none'
                }}
                placeholder="Дополнительная информация о задании"
                rows={3}
              />
            </div>

            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ 
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                textAlign: 'left'
              }}>
                ⭐ Количество звёзд
              </label>
              <input 
                type="number" 
                value={editPoints}
                onChange={(e) => setEditPoints(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: 'none',
                  borderRadius: '0',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  margin: '0',
                  display: 'block',
                  outline: 'none'
                }}
                placeholder="Например: 10"
                min="1"
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '12px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}>
                😊 Выберите эмодзи
              </label>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px',
                justifyContent: 'flex-start'
              }}>
                {taskEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setEditEmoji(emoji)}
                    style={{
                      padding: '12px',
                      fontSize: '24px',
                      background: editEmoji === emoji 
                        ? 'rgba(255, 255, 255, 0.3)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      minWidth: '48px',
                      minHeight: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end',
              marginTop: '32px'
            }}>
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  padding: '14px 28px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={!editTitle.trim() || !editPoints}
                className="game-button complete"
                style={{
                  padding: '14px 28px',
                  fontSize: '16px',
                  fontWeight: '600',
                  opacity: (!editTitle.trim() || !editPoints) ? 0.5 : 1,
                  cursor: (!editTitle.trim() || !editPoints) ? 'not-allowed' : 'pointer'
                }}
              >
                💾 Сохранить изменения
              </button>
            </div>
          </form>
        )}

        {/* Список существующих заданий */}
        {!editingTask && tasks.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              📋 Существующие задания
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    borderRadius: '0',
                    padding: '20px',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '24px' }}>
                        {task.emoji || getTaskEmoji(task.title)}
                      </span>
                      <h4 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                        {task.title}
                      </h4>
                    </div>
                    {task.description && (
                      <p style={{ fontSize: '14px', opacity: 0.8, margin: '4px 0' }}>
                        {task.description}
                      </p>
                    )}
                    <div style={{ 
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '0',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginTop: '8px'
                    }}>
                      ⭐ {task.points} звёзд
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #DC3545 0%, #C82333 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}; 