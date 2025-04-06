import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cl from './Account.module.css';
import Subject_container from './Subject_container';
import Footer from '../Components/Footer/Footer';
import { useAuth } from '../auth/AuthProvider';
const Subject_page = () => {
    const [subjectData, setSubjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth(); // Используем хук useAuth для получения информации о пользователе
    const token = user?.token; // Получаем токен пользователя
    console.log(token)
    useEffect(() => {
        const fetchSubjectData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/schedule/evaluations/`,
                    {}, // Тело запроса пустое
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`, // Добавляем заголовок Authorization с токеном
                            'Content-Type': 'application/json', // Явно указываем тип контента, хотя axios ставит его автоматически для POST с пустым body
                        },
                    }
                );
                setSubjectData(response.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError(new Error('Необходимо авторизоваться.')); // Обработка 401 ошибки
                } else {
                    setError(err); // Обработка других ошибок
                }
            } finally {
                setLoading(false);
            }
        };

        if (token) { // **Важно:** Запрос данных только если есть токен
            fetchSubjectData();
        } else {
            setError(new Error('Токен авторизации отсутствует.')); // Сообщение об ошибке, если нет токена
            setLoading(false);
        }
    }, [token]); // Добавляем token в зависимости useEffect

    if (loading) {
        return <div>Загрузка данных...</div>;
    }

    if (error) {
        console.error("Ошибка при загрузке данных:", error);
        return <div>Ошибка загрузки данных: {error.message}. Пожалуйста, обновите страницу.</div>;
    }

    if (!subjectData || subjectData.length === 0) { // Проверка на случай, если `subjectData` - массив
        return <div>Данные не получены.</div>;
    }

    return (
        <div className={cl.account_block}>
            {Array.isArray(subjectData) && subjectData.map(subject_info => ( // Безопасная проверка и итерация
                <Subject_container key={subject_info.subject_name} currentSubjectData={subject_info} />
            ))}
            <Footer></Footer>
        </div>
    );
};

export default Subject_page;