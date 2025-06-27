"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  gender?: string;
  points: number;
  email?: string;
  mustChangePassword: boolean;
  createdAt: string;
}

interface Family {
  id: string;
  name: string;
  inviteCode: string;
  members: FamilyMember[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function FamilyManagementModal({ isOpen, onClose }: Props) {
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Форма добавления члена семьи
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("CHILD");
  const [newMemberGender, setNewMemberGender] = useState("сын");
  const [addingMember, setAddingMember] = useState(false);
  const [newMemberResult, setNewMemberResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      loadFamily();
    }
  }, [isOpen]);

  const loadFamily = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/manage-family");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка загрузки семьи");
      }

      setFamily(data.family);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMemberName || !newMemberRole || !newMemberGender) {
      setError("Заполните все поля");
      return;
    }

    setAddingMember(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/manage-family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMemberName,
          role: newMemberRole,
          gender: newMemberGender
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка добавления члена семьи");
      }

      setSuccess(data.message);
      setNewMemberResult(data.member);
      setNewMemberName("");
      setNewMemberRole("CHILD");
      setNewMemberGender("сын");
      setShowAddForm(false);
      
      // Перезагружаем семью
      await loadFamily();
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка добавления");
    } finally {
      setAddingMember(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Скопировано в буфер обмена!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const getRoleDisplay = (role: string, gender?: string) => {
    switch (role) {
      case "FAMILY_ADMIN": 
        return gender === "мама" ? "👑👩 Мама-админ" : "👑👨 Папа-админ";
      case "PARENT": 
        return gender === "мама" ? "👩 Мама" : "👨 Папа";
      case "CHILD": 
        return gender === "дочь" ? "👧 Дочь" : "👦 Сын";
      default: return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🏠 Управление семьей">
      <style jsx>{`
        .premium-family-content {
          color: white;
        }

        .premium-alert {
          padding: 16px 20px;
          border-radius: 0;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
          border: none;
          font-weight: 600;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .premium-alert.error {
          background: rgba(244, 67, 54, 0.9);
          color: white;
          box-shadow: 0 8px 25px rgba(244, 67, 54, 0.3);
        }

        .premium-alert.success {
          background: rgba(76, 175, 80, 0.9);
          color: white;
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }

        .premium-loading {
          text-align: center;
          padding: 40px 20px;
          color: white;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid #FFD700;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .family-info-card {
          background: rgba(102, 126, 234, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 0;
          padding: 24px;
          margin-bottom: 24px;
        }

        .family-info-title {
          color: white;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 16px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
          font-family: 'Fortnite Battlefest', 'Inter', sans-serif !important;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .family-info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding: 8px 0;
        }

        .family-info-label {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
        }

        .family-info-value {
          color: white;
          font-family: 'Monaco', 'Menlo', monospace;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 12px;
          border-radius: 0;
          font-weight: 600;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .copy-button {
          background: linear-gradient(135deg, #FF6B35, #F7931E);
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 0;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-left: 8px;
          font-family: 'Fortnite Battlefest', 'Inter', sans-serif !important;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .copy-button:hover {
          background: linear-gradient(135deg, #FF8A65, #FFB74D);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.6);
        }

        .member-result-card {
          background: rgba(76, 175, 80, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(76, 175, 80, 0.3);
          border-radius: 0;
          padding: 24px;
          margin-bottom: 24px;
        }

        .member-result-title {
          color: white;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 16px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .member-result-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .member-result-label {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          min-width: 120px;
        }

        .member-result-value {
          color: white;
          font-family: 'Monaco', 'Menlo', monospace;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 12px;
          border-radius: 0;
          font-weight: 600;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .hide-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 0;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 16px;
        }

        .hide-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .add-member-button {
          width: 100%;
          background: linear-gradient(135deg, #28A745, #1E7E34);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 0;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 24px;
          font-family: 'Fortnite Battlefest', 'Inter', sans-serif !important;
        }

        .add-member-button:hover {
          background: linear-gradient(135deg, #34CE57, #28A745);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
        }

        .add-form-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0;
          padding: 24px;
          margin-bottom: 24px;
        }

        .add-form-title {
          color: white;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
          font-family: 'Fortnite Battlefest', 'Inter', sans-serif !important;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          color: white;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .form-input {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 0;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input:focus {
          border-color: #FFD700;
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-select {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 0;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-select:focus {
          border-color: #FFD700;
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .form-select option {
          background: #333;
          color: white;
        }

        .form-buttons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .submit-button {
          flex: 1;
          background: linear-gradient(135deg, #28A745, #1E7E34);
          color: white;
          border: none;
          padding: 14px 20px;
          border-radius: 0;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: 'Fortnite Battlefest', 'Inter', sans-serif !important;
        }

        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #34CE57, #28A745);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
        }

        .submit-button:disabled {
          background: linear-gradient(135deg, #ccc, #999);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .cancel-button {
          flex: 1;
          background: rgba(108, 117, 125, 0.9);
          color: white;
          border: none;
          padding: 14px 20px;
          border-radius: 0;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: 'Fortnite Battlefest', 'Inter', sans-serif !important;
        }

        .cancel-button:hover {
          background: rgba(108, 117, 125, 1);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(108, 117, 125, 0.4);
        }

        .members-section {
          margin-top: 32px;
        }

        .members-title {
          color: white;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 20px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
          font-family: 'Fortnite Battlefest', 'Inter', sans-serif !important;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .member-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0;
          padding: 20px;
          margin-bottom: 16px;
          transition: all 0.3s ease;
        }

        .member-card:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .member-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .member-name {
          color: white;
          font-size: 16px;
          font-weight: 700;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .member-role {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 600;
        }

        .password-badge {
          background: linear-gradient(135deg, #FFC107, #E0A800);
          color: white;
          padding: 4px 8px;
          border-radius: 0;
          font-size: 11px;
          font-weight: 600;
        }

        .member-info {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          line-height: 1.6;
        }

        .member-info div {
          margin-bottom: 4px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: white;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 600;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        @media (max-width: 768px) {
          .family-info-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .member-result-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .member-result-label {
            min-width: auto;
          }

          .form-buttons {
            flex-direction: column;
          }

          .family-info-card {
            padding: 16px;
          }

          .member-result-card {
            padding: 16px;
          }

          .add-form-card {
            padding: 16px;
          }

          .member-card {
            padding: 16px;
          }
        }
      `}</style>

      <div className="premium-family-content">
        {error && (
          <div className="premium-alert error">
            {error}
          </div>
        )}

        {success && (
          <div className="premium-alert success">
            {success}
          </div>
        )}

        {loading ? (
          <div className="premium-loading">
            <div className="loading-spinner"></div>
            <p>Загрузка информации о семье...</p>
          </div>
        ) : family ? (
          <>
            {/* Информация о семье */}
            <div className="family-info-card">
              <h3 className="family-info-title">Информация о семье</h3>
              <div className="family-info-item">
                <span className="family-info-label">Название:</span>
                <span className="family-info-value">{family.name}</span>
              </div>
              <div className="family-info-item">
                <span className="family-info-label">Код семьи:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="family-info-value">{family.inviteCode}</span>
                  <button
                    onClick={() => copyToClipboard(family.inviteCode)}
                    className="copy-button"
                  >
                    📋 Копировать
                  </button>
                </div>
              </div>
            </div>

            {/* Результат добавления нового члена */}
            {newMemberResult && (
              <div className="member-result-card">
                <h4 className="member-result-title">
                  ✅ Член семьи добавлен!
                </h4>
                <div className="member-result-item">
                  <span className="member-result-label">Имя:</span>
                  <span className="member-result-value">{newMemberResult.name}</span>
                </div>
                <div className="member-result-item">
                  <span className="member-result-label">Временный пароль:</span>
                  <span className="member-result-value">{newMemberResult.tempPassword}</span>
                  <button
                    onClick={() => copyToClipboard(newMemberResult.tempPassword)}
                    className="copy-button"
                  >
                    📋 Копировать
                  </button>
                </div>
                <div className="member-result-item">
                  <span className="member-result-label">Ссылка для входа:</span>
                  <button
                    onClick={() => copyToClipboard(newMemberResult.firstLoginUrl)}
                    className="copy-button"
                  >
                    📋 Копировать ссылку
                  </button>
                </div>
                <button
                  onClick={() => setNewMemberResult(null)}
                  className="hide-button"
                >
                  Скрыть
                </button>
              </div>
            )}

            {/* Кнопка добавления члена семьи */}
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="add-member-button"
              >
                ➕ Добавить члена семьи
              </button>
            )}

            {/* Форма добавления члена семьи */}
            {showAddForm && (
              <div className="add-form-card">
                <h4 className="add-form-title">Добавить члена семьи</h4>
                <form onSubmit={handleAddMember}>
                  <div className="form-group">
                    <label className="form-label">
                      Имя
                    </label>
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="form-input"
                      placeholder="Введите имя"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Роль
                    </label>
                    <select
                      value={newMemberRole}
                      onChange={(e) => {
                        setNewMemberRole(e.target.value);
                        // Автоматически устанавливаем пол по умолчанию
                        if (e.target.value === "PARENT") {
                          setNewMemberGender("папа");
                        } else {
                          setNewMemberGender("сын");
                        }
                      }}
                      className="form-select"
                    >
                      <option value="CHILD">👶 Ребенок</option>
                      <option value="PARENT">👨‍👩‍👧‍👦 Родитель</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Пол
                    </label>
                    <select
                      value={newMemberGender}
                      onChange={(e) => setNewMemberGender(e.target.value)}
                      className="form-select"
                    >
                      {newMemberRole === "PARENT" ? (
                        <>
                          <option value="папа">👨 Папа</option>
                          <option value="мама">👩 Мама</option>
                        </>
                      ) : (
                        <>
                          <option value="сын">👦 Сын</option>
                          <option value="дочь">👧 Дочь</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="form-buttons">
                    <button
                      type="submit"
                      disabled={addingMember}
                      className="submit-button"
                    >
                      {addingMember ? "Добавление..." : "Добавить"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="cancel-button"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Список членов семьи */}
            <div className="members-section">
              <h3 className="members-title">
                Члены семьи ({family.members.length})
              </h3>
              <div>
                {family.members.map((member) => (
                  <div key={member.id} className="member-card">
                    <div className="member-header">
                      <span className="member-name">
                        {member.name}
                      </span>
                      <span className="member-role">
                        {getRoleDisplay(member.role, member.gender)}
                      </span>
                      {member.mustChangePassword && (
                        <span className="password-badge">
                          Требует смены пароля
                        </span>
                      )}
                    </div>
                    <div className="member-info">
                      <div>⭐ Звёзды: {member.points}</div>
                      {member.email && <div>📧 Email: {member.email}</div>}
                      <div>📅 Создан: {formatDate(member.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p className="empty-title">
              Семья не найдена. Возможно, вы не являетесь администратором семьи.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
} 