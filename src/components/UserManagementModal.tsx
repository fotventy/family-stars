import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: any[];
  editingUser?: any;
  onCreateUser: (name: string, password: string, role: string) => Promise<void>;
  onUpdateUser: (userId: string, name: string, password?: string) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  users,
  editingUser,
  onCreateUser,
  onUpdateUser,
  onDeleteUser
}) => {
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('CHILD');
  
  // Состояние для редактирования
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');

  // Автоматический переход в режим редактирования при получении editingUser
  useEffect(() => {
    if (editingUser) {
      setEditName(editingUser.name);
      setEditPassword(''); // Пароль не показываем из соображений безопасности
    }
  }, [editingUser]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateUser(newUserName, newUserPassword, newUserRole);
    setNewUserName('');
    setNewUserPassword('');
    setNewUserRole('CHILD');
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      await onUpdateUser(editingUser.id, editName, editPassword || undefined);
      setEditName('');
      setEditPassword('');
      onClose();
    }
  };

  const cancelEdit = () => {
    setEditName('');
    setEditPassword('');
    onClose();
  };

  const getUserEmoji = (role: string) => {
    if (role === 'PARENT') return '👨‍👩‍👧‍👦';
    return '👶';
  };

  const getRoleText = (role: string) => {
    if (role === 'PARENT') return 'Родитель';
    return 'Ребёнок';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingUser ? `✏️ Редактирование: ${editingUser.name}` : "➕ Добавить ребенка"}>
      <div style={{ color: 'white' }}>
        {/* Форма создания нового пользователя */}
        {!editingUser && (
          <form onSubmit={handleCreateUser} style={{ marginBottom: '32px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                color: 'white', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                fontSize: '16px'
              }}>
                👤 Имя пользователя
              </label>
              <input 
                type="text" 
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '14px 18px',
                  border: 'none',
                  borderRadius: '0',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
                onFocus={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                placeholder="Например: Алёна"
                required 
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                color: 'white', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                fontSize: '16px'
              }}>
                🔒 Пароль
              </label>
              <input 
                type="password" 
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '14px 18px',
                  border: 'none',
                  borderRadius: '0',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
                onFocus={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                placeholder="Введите пароль"
                required 
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                color: 'white', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                fontSize: '16px'
              }}>
                🏷️ Роль
              </label>
              <select 
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '14px 18px',
                  border: 'none',
                  borderRadius: '0',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
                onFocus={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <option value="CHILD" style={{ background: '#333', color: 'white' }}>👶 Ребёнок</option>
                <option value="PARENT" style={{ background: '#333', color: 'white' }}>👨‍👩‍👧‍👦 Родитель</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="game-button"
              style={{ width: '100%' }}
            >
              ➕ Добавить пользователя
            </button>
          </form>
        )}

        {/* Форма редактирования пользователя */}
        {editingUser && (
          <form onSubmit={handleUpdateUser} style={{ marginBottom: '32px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                color: 'white', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                fontSize: '16px'
              }}>
                👤 Имя пользователя
              </label>
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '14px 18px',
                  border: 'none',
                  borderRadius: '0',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
                onFocus={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                placeholder="Например: Алёна"
                required 
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                color: 'white', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                fontSize: '16px'
              }}>
                🔒 Новый пароль (оставьте пустым, чтобы не менять)
              </label>
              <input 
                type="password" 
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
                onFocus={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                placeholder="Новый пароль (необязательно)"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="submit" 
                className="game-button"
                style={{ flex: 1 }}
              >
                💾 Сохранить
              </button>
              <button 
                type="button"
                onClick={cancelEdit}
                className="game-button"
                style={{ 
                  flex: 1,
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                }}
              >
                ❌ Отмена
              </button>
            </div>
          </form>
        )}


      </div>
    </Modal>
  );
}; 