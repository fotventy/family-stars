"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";

interface FamilyMember {
  id: string;
  name: string;
  role: string;
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
    
    if (!newMemberName || !newMemberRole) {
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
          role: newMemberRole
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

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "FAMILY_ADMIN": return "👑 Админ семьи";
      case "PARENT": return "👨‍👩‍👧‍👦 Родитель";
      case "CHILD": return "👶 Ребенок";
      default: return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🏠 Управление семьей">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Загрузка...</p>
          </div>
        ) : family ? (
          <>
            {/* Информация о семье */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">Информация о семье</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Название:</span>
                  <span className="ml-2 text-gray-900">{family.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Код семьи:</span>
                  <span className="ml-2 font-mono bg-white px-2 py-1 rounded border">
                    {family.inviteCode}
                  </span>
                  <button
                    onClick={() => copyToClipboard(family.inviteCode)}
                    className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                  >
                    📋 Копировать
                  </button>
                </div>
              </div>
            </div>

            {/* Результат добавления нового члена */}
            {newMemberResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">
                  ✅ Член семьи добавлен!
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Имя:</span> {newMemberResult.name}
                  </div>
                  <div>
                    <span className="font-medium">Временный пароль:</span>
                    <span className="ml-2 font-mono bg-white px-2 py-1 rounded border">
                      {newMemberResult.tempPassword}
                    </span>
                    <button
                      onClick={() => copyToClipboard(newMemberResult.tempPassword)}
                      className="ml-2 text-green-600 hover:text-green-800 text-xs"
                    >
                      📋 Копировать
                    </button>
                  </div>
                  <div>
                    <span className="font-medium">Ссылка для входа:</span>
                    <button
                      onClick={() => copyToClipboard(newMemberResult.firstLoginUrl)}
                      className="ml-2 text-green-600 hover:text-green-800 text-xs"
                    >
                      📋 Копировать ссылку
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setNewMemberResult(null)}
                  className="mt-3 text-xs text-gray-500 hover:text-gray-700"
                >
                  Скрыть
                </button>
              </div>
            )}

            {/* Кнопка добавления члена семьи */}
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                ➕ Добавить члена семьи
              </button>
            )}

            {/* Форма добавления члена семьи */}
            {showAddForm && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Добавить члена семьи</h4>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Имя
                    </label>
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Введите имя"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Роль
                    </label>
                    <select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="CHILD">👶 Ребенок</option>
                      <option value="PARENT">👨‍👩‍👧‍👦 Родитель</option>
                    </select>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={addingMember}
                      className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      {addingMember ? "Добавление..." : "Добавить"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Список членов семьи */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                Члены семьи ({family.members.length})
              </h3>
              <div className="space-y-3">
                {family.members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">
                            {member.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            {getRoleDisplay(member.role)}
                          </span>
                          {member.mustChangePassword && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Требует смены пароля
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>⭐ Звёзды: {member.points}</div>
                          {member.email && <div>📧 Email: {member.email}</div>}
                          <div>📅 Создан: {formatDate(member.createdAt)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">
              Семья не найдена. Возможно, вы не являетесь администратором семьи.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
} 