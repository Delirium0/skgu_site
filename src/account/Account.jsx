import React, { useState, useEffect } from 'react'; // Импортируем useState и useEffect
import axios from 'axios'; // Импортируем axios
import cl from './Account.module.css'
import Subject_container from './Subject_container';

const Account = () => {
    const [subjectData, setSubjectData] = useState(null); // useState для хранения данных с сервера, изначально null
    const [loading, setLoading] = useState(true); // useState для отслеживания состояния загрузки
    const [error, setError] = useState(null); // useState для хранения ошибок

    useEffect(() => {
        const fetchSubjectData = async () => {
            setLoading(true); // Устанавливаем loading в true перед запросом
            setError(null); // Сбрасываем ошибку перед новым запросом
            try {
             
                const userLogin = 'ваш_логин'; // Замени на реальный логин
                const userPass = 'ваш_пароль'; // Замени на реальный пароль

                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/schedule/evaluations/`, // Используем POST, как указано в эндпоинте
                    {}, // Тело запроса пустое, так как параметры передаются через query
                    {
                        params: { // Передаем параметры user_login и user_pass как query параметры
                            user_login: userLogin,
                            user_pass: userPass,
                        },
                    }
                );
                setSubjectData(response.data); // Обновляем состояние данными, полученными от сервера
            } catch (err) {
                setError(err); // В случае ошибки записываем её в состояние error
            } finally {
                setLoading(false); // В любом случае, после запроса устанавливаем loading в false
            }
        };

        fetchSubjectData(); // Вызываем функцию для запроса данных при монтировании компонента
    }, []); // Пустой массив зависимостей означает, что useEffect выполнится только один раз при монтировании

    if (loading) {
        return <div>Загрузка данных...</div>; // Отображаем сообщение о загрузке, пока данные не загружены
    }

    if (error) {
        console.error("Ошибка при загрузке данных:", error); // Логируем ошибку в консоль для отладки
        return <div>Ошибка загрузки данных. Пожалуйста, обновите страницу.</div>; // Отображаем сообщение об ошибке пользователю
    }

    if (!subjectData) {
        return <div>Данные не получены.</div>; // Сообщение, если данные не были получены (например, пустой ответ от сервера)
    }

    return (
        <div className={cl.account_block}>
            {subjectData.map(subject_info => (
                <Subject_container key={subject_info.subject_name} currentSubjectData={subject_info} />
            ))}
            
        </div>
    );
};

export default Account;