import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Фон с размытием - фиксированный на весь экран */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={onClose}
      >
        {/* Модальное окно */}
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            borderRadius: '0',
            padding: '40px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="fortnite-title" style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: 'white', 
              margin: 0,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              {title}
            </h2>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '28px',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: '5px',
                borderRadius: '0',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#ff6b6b';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ✕
            </button>
          </div>
          
          {/* Контент */}
          <div style={{ maxHeight: '70vh', overflow: 'auto', paddingRight: '8px' }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}; 