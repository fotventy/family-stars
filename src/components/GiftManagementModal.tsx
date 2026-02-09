"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useTranslation } from '@/contexts/LanguageContext';

interface GiftManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  gifts: any[];
  editingGift?: any;
  onCreateGift: (title: string, description: string, points: number, emoji?: string) => Promise<void>;
  onUpdateGift: (giftId: string, title: string, description: string, points: number, emoji?: string) => Promise<void>;
  onDeleteGift: (giftId: string) => Promise<void>;
}

export const GiftManagementModal: React.FC<GiftManagementModalProps> = ({
  isOpen,
  onClose,
  gifts,
  editingGift,
  onCreateGift,
  onUpdateGift,
  onDeleteGift
}) => {
  const { t } = useTranslation();
  const [newGiftTitle, setNewGiftTitle] = useState('');
  const [newGiftDescription, setNewGiftDescription] = useState('');
  const [newGiftPoints, setNewGiftPoints] = useState('');
  const [newGiftEmoji, setNewGiftEmoji] = useState('');
  
  // Состояние для редактирования
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPoints, setEditPoints] = useState('');
  const [editEmoji, setEditEmoji] = useState('');

  // Автоматический переход в режим редактирования при получении editingGift
  useEffect(() => {
    if (editingGift) {
      setEditTitle(editingGift.title);
      setEditDescription(editingGift.description || '');
      setEditPoints(editingGift.points.toString());
      setEditEmoji(editingGift.emoji || '');
    }
  }, [editingGift]);

  const handleCreateGift = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateGift(newGiftTitle, newGiftDescription, parseInt(newGiftPoints), newGiftEmoji || undefined);
    setNewGiftTitle('');
    setNewGiftDescription('');
    setNewGiftPoints('');
    setNewGiftEmoji('');
    onClose();
  };

  const handleUpdateGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGift) {
      await onUpdateGift(editingGift.id, editTitle, editDescription, parseInt(editPoints), editEmoji || undefined);
      setEditTitle('');
      setEditDescription('');
      setEditPoints('');
      setEditEmoji('');
      onClose();
    }
  };

  const cancelEdit = () => {
    setEditTitle('');
    setEditDescription('');
    setEditPoints('');
    setEditEmoji('');
    onClose();
  };

  const modalTitle = editingGift ? `✏️ ${t("gifts.editGift")}` : `🎁 ${t("gifts.newGift")}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <div style={{ color: 'white' }}>
        {/* Форма создания нового подарка */}
        {!editingGift && (
          <form onSubmit={handleCreateGift}>
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
                🏷️ {t("gifts.giftName")}
              </label>
              <input 
                type="text" 
                value={newGiftTitle}
                onChange={(e) => setNewGiftTitle(e.target.value)}
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
                placeholder={t("gifts.placeholderTitle")}
                required 
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
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
                📝 {t("gifts.description")}
              </label>
              <textarea 
                value={newGiftDescription}
                onChange={(e) => setNewGiftDescription(e.target.value)}
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
                placeholder={t("gifts.placeholderDescription")}
                rows={3}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div style={{ marginBottom: '24px', textAlign: 'left' }}>
              <label style={{ 
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                textAlign: 'left'
              }}>
                ⭐ {t("common.costInStars")}
              </label>
              <input 
                type="number" 
                value={newGiftPoints}
                onChange={(e) => setNewGiftPoints(e.target.value)}
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
                placeholder={t("common.pointsPlaceholder")}
                min="1"
                required 
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            {/* Поле выбора эмодзи */}
            <div style={{ marginBottom: '24px', textAlign: 'left' }}>
              <label style={{ 
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                textAlign: 'left'
              }}>
                🎁 {t("gifts.giftIconOptional")}
              </label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(6, 1fr)', 
                gap: '8px',
                marginBottom: '12px'
              }}>
                {['🎮', '📺', '🍭', '🥤', '🍕', '🎬', '📱', '🧱', '😴', '🎥', '🍟', '🎧', '🖱️', '🏊‍♂️', '🎯', '🎪'].map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setNewGiftEmoji(emoji)}
                    style={{
                      padding: '12px',
                      fontSize: '24px',
                      background: newGiftEmoji === emoji 
                        ? 'rgba(255, 255, 255, 0.3)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      border: '2px solid ' + (newGiftEmoji === emoji 
                        ? 'rgba(255, 255, 255, 0.5)' 
                        : 'rgba(255, 255, 255, 0.2)'),
                      borderRadius: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <input 
                type="text" 
                value={newGiftEmoji}
                onChange={(e) => setNewGiftEmoji(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 0,
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
                placeholder={t("gifts.placeholderEmoji")}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {newGiftEmoji && (
                <button
                  type="button"
                  onClick={() => setNewGiftEmoji('')}
                  style={{
                    marginTop: '8px',
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 0,
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  ❌ {t("gifts.clear")}
                </button>
              )}
            </div>
            
            <button 
              type="submit" 
              className="game-button"
              style={{ width: '100%' }}
            >
              ➕ {t("gifts.addGift")}
            </button>
          </form>
        )}

        {/* Форма редактирования подарка */}
        {editingGift && (
          <form onSubmit={handleUpdateGift}>
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
                🏷️ {t("gifts.giftName")}
              </label>
              <input 
                type="text" 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 0,
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
                placeholder={t("gifts.placeholderTitle")}
                required 
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
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
                📝 {t("gifts.description")}
              </label>
              <textarea 
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 0,
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
                placeholder="Дополнительная информация о подарке"
                rows={3}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div style={{ marginBottom: '24px', textAlign: 'left' }}>
              <label style={{ 
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                textAlign: 'left'
              }}>
                ⭐ {t("common.costInStars")}
              </label>
              <input 
                type="number" 
                value={editPoints}
                onChange={(e) => setEditPoints(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 0,
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
                placeholder={t("common.pointsPlaceholder")}
                min="1"
                required 
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            {/* Поле выбора эмодзи для редактирования */}
            <div style={{ marginBottom: '24px', textAlign: 'left' }}>
              <label style={{ 
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                textAlign: 'left'
              }}>
                🎁 {t("gifts.giftIconOptional")}
              </label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(6, 1fr)', 
                gap: '8px',
                marginBottom: '12px'
              }}>
                {['🎮', '📺', '🍭', '🥤', '🍕', '🎬', '📱', '🧱', '😴', '🎥', '🍟', '🎧', '🖱️', '🏊‍♂️', '🎯', '🎪'].map(emoji => (
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
                      border: '2px solid ' + (editEmoji === emoji 
                        ? 'rgba(255, 255, 255, 0.5)' 
                        : 'rgba(255, 255, 255, 0.2)'),
                      borderRadius: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <input 
                type="text" 
                value={editEmoji}
                onChange={(e) => setEditEmoji(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 0,
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
                placeholder={t("gifts.placeholderEmoji")}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {editEmoji && (
                <button
                  type="button"
                  onClick={() => setEditEmoji('')}
                  style={{
                    marginTop: '8px',
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 0,
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  ❌ {t("gifts.clear")}
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="submit" 
                className="game-button"
                style={{ flex: 1, borderRadius: 0 }}
              >
                💾 {t("gifts.save")}
              </button>
              <button 
                type="button"
                onClick={async () => {
                  if (editingGift && confirm(t("common.delete") + '?')) {
                    await onDeleteGift(editingGift.id);
                    onClose();
                  }
                }}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #DC3545 0%, #C82333 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🗑️ {t("common.delete")}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}; 