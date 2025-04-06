import React, { createContext, useState, useContext, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Или начальное значение из localStorage

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Сохраняем в localStorage
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user'); // Удаляем из localStorage
  }, []);

  // При загрузке приложения, пытаемся восстановить данные из localStorage
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Ошибка при парсинге user из localStorage:", error);
        localStorage.removeItem('user'); // Очищаем, если произошла ошибка
      }
    }
  }, []);

  const value = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};