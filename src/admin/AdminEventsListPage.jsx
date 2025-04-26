// src/admin/events/AdminEventsListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider'; 
import { getAllEventsAdmin, deleteEventAdmin, approveEventAdmin} from './eventAdminService'; 
import styles from './AdminEvents.module.css';

const AdminEventsListPage = () => {
    const { user } = useAuth();
    const token = user?.token;
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    const fetchEvents = useCallback(async () => {
        if (!token) return; // Не делаем запрос без токена

        setLoading(true);
        setError(null);
        try {
            const data = await getAllEventsAdmin(token);
            setEvents(data || []); // Устанавливаем данные или пустой массив
        } catch (err) {
            console.error("Ошибка загрузки событий:", err);
            setError(err.message || "Не удалось загрузить список событий.");
            setEvents([]); // Сбрасываем события в случае ошибки
        } finally {
            setLoading(false);
        }
    }, [token]); // Зависимость от токена

    useEffect(() => {
         fetchEvents();
    }, [fetchEvents]);

    const handleDelete = async (eventId, eventName) => {
        if (!token) return;

        // Запрос подтверждения
        if (window.confirm(`Вы уверены, что хотите удалить событие "${eventName}" (ID: ${eventId})?`)) {
            setLoading(true); // Можно использовать отдельный state для удаления
            try {
                await deleteEventAdmin(eventId, token);
                // Обновляем список после удаления (простой вариант - перезапросить все)
                await fetchEvents();
                // Альтернатива: удалить из локального state
                // setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
            } catch (err) {
                console.error("Ошибка удаления события:", err);
                setError(err.message || "Не удалось удалить событие.");
                setLoading(false); // Сбросить isLoading, если используется общий
            }
            // setLoading(false) должен быть в finally, если используется общий loading
        }
    };
    const handleApproveFromAdminList = async (eventId) => {
        if (!token || processingId) return; // Проверяем токен и не обрабатывается ли уже что-то
        setProcessingId(eventId); // Устанавливаем ID обрабатываемого события
        setError(null); // Сбрасываем предыдущие ошибки

        try {
            
            // Вызываем API для одобрения
            const updatedEvent = await approveEventAdmin(eventId, token); // API вернет обновленное событие

            // Обновляем состояние списка событий:
            // Находим событие по ID и меняем его статус is_moderate на true
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === eventId
                        ? { ...event, is_moderate: true } // Обновляем статус у нужного события
                        : event // Остальные оставляем как есть
                )
            );
            // Или можно использовать данные из updatedEvent, если API его возвращает:
            // setEvents(prevEvents =>
            //     prevEvents.map(event =>
            //         event.id === eventId ? updatedEvent : event
            //     )
            // );

        } catch (err) {
            console.error(`Ошибка одобрения события ${eventId} из списка:`, err);
            setError(`Не удалось одобрить событие ID ${eventId}: ${err.message}`);
        } finally {
            setProcessingId(null); // Снимаем флаг обработки в любом случае
        }
    };
    // --- Рендеринг ---
    if (loading && events.length === 0) { // Показываем лоадер только при первой загрузке
        return <div className={styles.statusMessage}>Загрузка событий...</div>;
    }

    if (error) {
        return <div className={`${styles.statusMessage} ${styles.error}`}>Ошибка: {error}</div>;
    }

    return (
        <div className={styles.adminPageContainer}>
            <h1 className={styles.adminPageTitle}>Управление Событиями</h1>

            <Link to="/admin/events/new" className={styles.createButton}>
                + Создать новое событие
            </Link>

            {events.length === 0 && !loading ? (
                <div className={styles.statusMessage}>События не найдены.</div>
            ) : (
                <table className={styles.adminTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Время</th>
                        <th>Создатель</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td>{event.id}</td>
                            <td>{event.event_name}</td>
                            <td>{new Date(event.event_time).toLocaleString()}</td>
                            <td>
                                {event.event_creator_name || event.creator?.login || 'N/A'}
                                {event.creator_id && ` (ID: ${event.creator_id})`}
                            </td>
                            <td> {/* <-- Статус модерации */}
                                {event.is_moderate
                                  ? <span className={styles.statusApproved}>Одобрено</span>
                                  : <span className={styles.statusPending}>Ожидает</span>
                                }
                                {/* Если админ может менять статус прямо здесь, добавить кнопку/переключатель */}
                                {/* <button onClick={() => handleToggleModerate(event.id, !event.is_moderate)}>Изменить</button> */}
                            </td>
                            <td className={styles.actionsCell}>
                               {/* ... кнопки Редактировать / Удалить ... */}
                               {/* Можно добавить кнопку "Одобрить", если не одобрено */}
                               {!event.is_moderate && (
                                   <button
                                       onClick={() => handleApproveFromAdminList(event.id)} // Нужна новая функция-обработчик
                                       className={`${styles.actionButton} ${styles.approveButton}`}
                                       disabled={loading}
                                    >
                                       Одобрить
                                   </button>
                               )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
             {/* Можно добавить индикатор загрузки при удалении, если используется отдельный state */}
             {/* {isDeleting && <div className={styles.statusMessage}>Удаление...</div>} */}
        </div>
    );
};

export default AdminEventsListPage;