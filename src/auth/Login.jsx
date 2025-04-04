// Login.js
import React from 'react';
import styles from './AuthPage.module.css'; // Импортируем CSS Module

const Login = () => {
    const handleLogin = (event) => {
        event.preventDefault(); // Предотвращаем стандартную отправку формы
        const login = event.target.login.value;
        const password = event.target.password.value;

        if (!login || !password) {
            alert('Пожалуйста, заполните все поля для входа.');
            return;
        }

        // Заглушка запроса авторизации
        console.log('Выполнен POST запрос на авторизацию:');
        console.log('Эндпоинт:', `${process.env.REACT_APP_API_URL}/schedule/evaluations/`); // Предполагаемый эндпоинт
        console.log('Query параметры:', { user_login: login, user_pass: password });

        // Здесь будет реальный запрос к API и обработка ответа
        alert('Авторизация выполнена (заглушка). Смотрите детали запроса в консоли.');
    };

    return (
        <div className={styles.authForm}>
            <form onSubmit={handleLogin}>
                <div className={styles.inputGroup}>
                    <label htmlFor="login">Логин</label>
                    <input type="text" id="login" name="login" placeholder="Введите логин" />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password">Пароль</label>
                    <input type="password" id="password" name="password" placeholder="Введите пароль" />
                </div>
                <button type="submit" className={styles.authButton}>Войти</button>
            </form>
        </div>
    );
};

export default Login;