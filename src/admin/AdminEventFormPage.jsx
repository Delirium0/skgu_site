// src/admin/events/AdminEventFormPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { getEventByIdAdmin, createEventAdmin, updateEventAdmin } from './eventAdminService';
import styles from './AdminEvents.module.css';

const AdminEventFormPage = () => {
    const { eventId } = useParams(); // Получаем ID из URL, если он есть (для редактирования)
    const isEditMode = Boolean(eventId); // Определяем режим: true - редактирование, false - создание
    const navigate = useNavigate();
    const { user } = useAuth();
    const token = user?.token;

    // Состояние формы
    const [formData, setFormData] = useState({
        event_name: '',
        event_description: '',
        event_time: '', // Будет в формате YYYY-MM-DDTHH:mm
        image_background: '', // URL
        event_creator_name: '', // Имя создателя (как в модели)
        event_creator_image: '', // URL аватарки создателя (как в модели)
        contact_phone: '',
        contact_email: '',
        // event_rating не редактируем вручную? Оно вычисляется?
        // creator_id устанавливается бэкендом
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null); // Ошибки валидации формы

    // Загрузка данных для редактирования
    useEffect(() => {
        if (isEditMode && eventId && token) {
            setLoading(true);
            setError(null);
            getEventByIdAdmin(eventId, token)
                .then(data => {
                    // Форматируем дату для input[type=datetime-local]
                    const formattedDate = data.event_time
                        ? new Date(new Date(data.event_time).getTime() - new Date().getTimezoneOffset() * 60000)
                            .toISOString().slice(0, 16)
                        : '';

                    setFormData({
                        event_name: data.event_name || '',
                        event_description: data.event_description || '',
                        event_time: formattedDate,
                        image_background: data.image_background || '',
                        event_creator_name: data.event_creator_name || '',
                        event_creator_image: data.event_creator_image || '',
                        contact_phone: data.contact_phone || '',
                        contact_email: data.contact_email || '',
                    });
                })
                .catch(err => {
                    console.error("Ошибка загрузки события для редактирования:", err);
                    setError(err.message || "Не удалось загрузить данные события.");
                })
                .finally(() => setLoading(false));
        }
        // Если режим создания, форма остается с начальными пустыми значениями
    }, [isEditMode, eventId, token]);

    // Обработчик изменений в полях формы
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormError(null); // Сбрасываем ошибку формы при изменении
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError("Отсутствует токен авторизации.");
            return;
        }
        setLoading(true);
        setError(null);
        setFormError(null);

        // Подготовка данных для отправки
        // Преобразуем дату обратно в ISO строку с учетом UTC (или как ожидает бэк)
        // Важно: input datetime-local возвращает строку без информации о таймзоне.
        // Бэкенд должен быть готов парсить такую строку (FastAPI обычно справляется).
        // Или нужно добавить 'Z' или смещение вручную перед отправкой, если бэк требует ISO 8601.
        const dataToSend = { ...formData };
        // Если event_time пустой, не отправляем его или отправляем null, зависит от бэкенда
        if (!dataToSend.event_time) {
           delete dataToSend.event_time; // Или dataToSend.event_time = null;
        }

        try {
            if (isEditMode) {
                // Режим редактирования (PUT)
                // Отправляем только те поля, которые есть в EventUpdate схеме
                const updateData = {
                    event_name: dataToSend.event_name,
                    event_description: dataToSend.event_description,
                    event_time: dataToSend.event_time, // Отправляем строку как есть
                    image_background: dataToSend.image_background,
                    event_creator_name: dataToSend.event_creator_name,
                    event_creator_image: dataToSend.event_creator_image,
                    contact_phone: dataToSend.contact_phone,
                    contact_email: dataToSend.contact_email,
                    // Рейтинг не обновляем через форму
                };
                await updateEventAdmin(eventId, updateData, token);
                alert('Событие успешно обновлено!');
                navigate('/admin/events'); // Возвращаемся к списку
            } else {
                // Режим создания (POST)
                // Отправляем поля, которые есть в EventCreate схеме
                const createData = {
                    event_name: dataToSend.event_name,
                    event_description: dataToSend.event_description,
                    event_time: dataToSend.event_time, // Отправляем строку как есть
                    image_background: dataToSend.image_background,
                    event_creator_name: dataToSend.event_creator_name,
                    event_creator_image: dataToSend.event_creator_image,
                    contact_phone: dataToSend.contact_phone,
                    contact_email: dataToSend.contact_email,
                    // creator_id устанавливается бэком
                };
                const newEvent = await createEventAdmin(createData, token);
                alert('Событие успешно создано!');
                navigate('/admin/events'); // Возвращаемся к списку (или на страницу редактирования?)
                // navigate(`/admin/events/${newEvent.id}/edit`);
            }
        } catch (err) {
            console.error("Ошибка сохранения события:", err);
            // Попытка отобразить специфическую ошибку валидации от бэка
            if (err.message.includes("Не заполнены")) { // Проверка на нашу клиентскую ошибку
                 setFormError(err.message);
            } else {
                setError(err.message || "Не удалось сохранить событие.");
            }

        } finally {
            setLoading(false);
        }
    };

    // --- Рендеринг ---
    if (loading && isEditMode) {
        return <div className={styles.statusMessage}>Загрузка данных события...</div>;
    }

    if (error) {
        return <div className={`${styles.statusMessage} ${styles.error}`}>Ошибка: {error}</div>;
    }

    return (
        <div className={styles.adminPageContainer}>
            <h1 className={styles.adminPageTitle}>
                {isEditMode ? `Редактировать событие (ID: ${eventId})` : 'Создать новое событие'}
            </h1>

            <form onSubmit={handleSubmit} className={styles.adminForm}>
                {/* Поле Название */}
                <div className={styles.formGroup}>
                    <label htmlFor="event_name">Название события *</label>
                    <input
                        type="text"
                        id="event_name"
                        name="event_name"
                        value={formData.event_name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                {/* Поле Описание */}
                <div className={styles.formGroup}>
                    <label htmlFor="event_description">Описание</label>
                    <textarea
                        id="event_description"
                        name="event_description"
                        value={formData.event_description}
                        onChange={handleChange}
                        rows="5"
                        disabled={loading}
                    />
                </div>

                 {/* Поле Время события */}
                 <div className={styles.formGroup}>
                    <label htmlFor="event_time">Время события *</label>
                    <input
                        type="datetime-local"
                        id="event_time"
                        name="event_time"
                        value={formData.event_time}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                 </div>

                 {/* Поле URL Фона */}
                <div className={styles.formGroup}>
                    <label htmlFor="image_background">URL фонового изображения *</label>
                    <input
                        type="url"
                        id="image_background"
                        name="image_background"
                        value={formData.image_background}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        required
                        disabled={loading}
                    />
                </div>

                 {/* Поле Имя создателя (события, не пользователя) */}
                <div className={styles.formGroup}>
                    <label htmlFor="event_creator_name">Имя организатора *</label>
                    <input
                        type="text"
                        id="event_creator_name"
                        name="event_creator_name"
                        value={formData.event_creator_name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                 {/* Поле URL Аватарки создателя (события) */}
                <div className={styles.formGroup}>
                    <label htmlFor="event_creator_image">URL изображения организатора</label>
                    <input
                        type="url"
                        id="event_creator_image"
                        name="event_creator_image"
                        value={formData.event_creator_image}
                        onChange={handleChange}
                        placeholder="https://example.com/avatar.jpg"
                        disabled={loading}
                    />
                </div>

                {/* Поле Контактный телефон */}
                <div className={styles.formGroup}>
                    <label htmlFor="contact_phone">Контактный телефон</label>
                    <input
                        type="tel"
                        id="contact_phone"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>

                {/* Поле Контактный Email */}
                <div className={styles.formGroup}>
                    <label htmlFor="contact_email">Контактный Email</label>
                    <input
                        type="email"
                        id="contact_email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>


                {/* Сообщение об ошибке формы */}
                {formError && <p className={styles.formError}>{formError}</p>}
                {/* Общее сообщение об ошибке API */}
                {error && <p className={styles.formError}>{error}</p>}


                {/* Кнопки управления */}
                <div className={styles.formActions}>
                     <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Сохранение...' : (isEditMode ? 'Сохранить изменения' : 'Создать событие')}
                    </button>
                    <Link to="/admin/events" className={styles.cancelButton}>
                        Отмена
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default AdminEventFormPage;