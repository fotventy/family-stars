"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Валидация
    if (newPassword && newPassword !== confirmPassword) {
      setError("Новые пароли не совпадают");
      setLoading(false);
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError("Новый пароль должен быть не менее 6 символов");
      setLoading(false);
      return;
    }

    try {
      const updateData: any = {
        userId: session?.user?.id,
        name: name.trim()
      };

      if (newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      console.log("=== FRONTEND DEBUG ===");
      console.log("Session:", session);
      console.log("Session user ID:", session?.user?.id);
      console.log("Update data:", updateData);

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData)
      });

      console.log("Response status:", response.status);

      const result = await response.json();

      if (response.ok) {
        setSuccess("Профиль успешно обновлён!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        // Обновляем сессию если изменилось имя
        if (name !== session?.user?.name) {
          await update({ name });
        }
        
        setTimeout(() => {
          onClose();
          setSuccess("");
        }, 2000);
      } else {
        setError(result.error || "Ошибка при обновлении профиля");
      }
    } catch (error) {
      setError("Произошла ошибка при обновлении профиля");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName(session?.user?.name || "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    onClose();
  };

  // Обновляем имя при открытии модального окна
  React.useEffect(() => {
    if (isOpen && session?.user?.name) {
      setName(session.user.name);
    }
  }, [isOpen, session?.user?.name]);

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: none;
          border-radius: 0;
          padding: 40px 40px 40px 40px;
          max-width: 480px;
          width: calc(100% - 40px);
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.4s ease;
          margin: 0 auto;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          opacity: 1;
        }

        .modal-header {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .modal-title {
          color: white;
          font-size: 24px;
          font-weight: 800;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .close-button {
          background: rgba(255, 69, 58, 0.9);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 0;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: rgba(255, 69, 58, 1);
          transform: scale(1.1);
        }

        .form-content {
          position: relative;
          z-index: 1;
        }

        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }

        .form-label {
          display: block;
          color: white;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          text-align: left;
        }

        .form-input {
          width: 100%;
          padding: 14px 18px;
          border: none;
          border-radius: 0;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s ease;
          box-sizing: border-box;
          margin: 0;
          display: block;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .password-section {
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding-top: 20px;
          margin-top: 20px;
          text-align: left;
        }

        .section-title {
          color: white;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 16px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 8px;
        }

        .error-message {
          background: rgba(255, 69, 58, 0.9);
          color: white;
          padding: 12px 16px;
          border-radius: 0;
          text-align: center;
          font-weight: 600;
          margin-bottom: 20px;
          border: none;
          backdrop-filter: blur(10px);
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
        }

        .success-message {
          background: rgba(0, 200, 81, 0.9);
          color: white;
          padding: 12px 16px;
          border-radius: 0;
          text-align: center;
          font-weight: 600;
          margin-bottom: 20px;
          border: none;
          backdrop-filter: blur(10px);
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          justify-content: flex-start;
          width: 100%;
        }

        .premium-button {
          flex: 1 !important;
          padding: 18px 24px !important;
          border: none !important;
          border-radius: 0 !important;
          font-size: 17px !important;
          font-weight: bold !important;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px;
          min-height: 56px !important;
          width: auto !important;
          font-family: 'Fortnite Battlefest', 'Inter', sans-serif !important;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .premium-button.save {
          background: linear-gradient(135deg, #28A745 0%, #1E7E34 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .premium-button.save:hover:not(:disabled) {
          transform: translateY(-1px);
          background: linear-gradient(135deg, #34CE57 0%, #28A745 100%);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .premium-button.cancel {
          background: linear-gradient(135deg, #6C757D 0%, #495057 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .premium-button.cancel:hover {
          transform: translateY(-1px);
          background: linear-gradient(135deg, #7C8589 0%, #5A6268 100%);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .premium-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .help-text {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-top: 8px;
          margin-bottom: 16px;
          font-style: italic;
          text-align: left;
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 8px auto;
            padding: 16px;
            width: calc(100% - 16px);
            max-width: calc(100% - 16px);
          }

          .form-input {
            max-width: 100%;
            padding: 8px 12px;
            font-size: 14px;
          }

          .form-actions {
            flex-direction: column;
            gap: 8px;
          }

          .modal-title {
            font-size: 16px;
          }

          .form-label {
            font-size: 13px;
          }

          .help-text {
            font-size: 12px;
            margin-top: 4px;
            margin-bottom: 12px;
          }

          .premium-button {
            min-height: 48px !important;
            font-size: 15px !important;
            padding: 14px 18px !important;
          }

          .section-title {
            font-size: 14px;
          }

          .form-group {
            margin-bottom: 12px;
          }

          .password-section {
            margin-top: 16px;
          }
        }
      `}</style>

      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title fortnite-title">
              <span>👤</span>
              Настройки профиля
            </h2>
            <button className="close-button" onClick={handleClose}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form-content">
            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                ✅ {success}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                📝 Имя пользователя
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="Введите новое имя"
                required
              />
            </div>

            <div className="password-section">
              <div className="section-title">
                <span>🔒</span>
                Изменение пароля
              </div>
              <p className="help-text">
                Оставьте поля пустыми, если не хотите менять пароль
              </p>

              <div className="form-group">
                <label htmlFor="currentPassword" className="form-label">
                  🔑 Текущий пароль
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="form-input"
                  placeholder="Введите текущий пароль"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">
                  🆕 Новый пароль
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  placeholder="Введите новый пароль"
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  ✅ Подтвердите новый пароль
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  placeholder="Повторите новый пароль"
                  minLength={6}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleClose}
                className="premium-button cancel"
              >
                ❌ Отмена
              </button>
              <button
                type="submit"
                disabled={loading}
                className="premium-button save"
              >
                {loading ? '⏳ Сохранение...' : '💾 Сохранить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 