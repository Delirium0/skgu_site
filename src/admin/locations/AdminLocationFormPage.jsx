// src/admin/locations/AdminLocationFormPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { getLocationByIdAdmin, createLocationAdmin, updateLocationAdmin } from '../eventAdminService';
import AdminInteractiveMap from './AdminInteractiveMap'; // Импортируем карту
import styles from '../AdminEvents.module.css'; // Используем общие стили

const AdminLocationFormPage = () => {
    const { locationId } = useParams();
    const isEditMode = Boolean(locationId);
    const navigate = useNavigate();
    const { user } = useAuth();
    const token = user?.token;

    // Состояние для обычных полей формы
    const [formData, setFormData] = useState({
        lat: 54.8754, // Начальный центр карты по умолчанию
        lng: 69.1351,
        title: '',
        type: '', // Тип локации (например, 'building', 'landmark')
        address: '',
        time_start: '',
        time_end: '',
        main_icon: '',
        building_type: '',
        building_type_name_ru: '',
    });
    // Состояние для границ (массив массивов [lat, lng])
    const [bounds, setBounds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);

    // Загрузка данных для редактирования
    useEffect(() => {
        if (isEditMode && locationId && token) {
            setLoading(true);
            setError(null);
            setFormError(null);
            getLocationByIdAdmin(locationId, token)
                .then(data => {
                    setFormData({
                        lat: data.lat || 54.8754,
                        lng: data.lng || 69.1351,
                        title: data.title || '',
                        type: data.type || '',
                        address: data.address || '',
                        time_start: data.time_start || '',
                        time_end: data.time_end || '',
                        main_icon: data.main_icon || '',
                        building_type: data.building_type || '',
                        building_type_name_ru: data.building_type_name_ru || '',
                    });
                    setBounds(data.bounds || []); // Устанавливаем границы из полученных данных
                })
                .catch(err => {
                    console.error("Ошибка загрузки локации для редактирования:", err);
                    setError(err.message || "Не удалось загрузить данные локации.");
                })
                .finally(() => setLoading(false));
        } else {
            // Сбрасываем bounds при переходе в режим создания
             setBounds([]);
        }
    }, [isEditMode, locationId, token]);

    // Обработчик изменений в полях формы
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
        setFormError(null);
    };

    // Обработчик изменения границ с карты
    const handleBoundsChange = useCallback((newBounds) => {
        setBounds(newBounds);
        setError(null);
        setFormError(null);
    }, []);

    // Очистка границ
    const clearBounds = () => {
        setBounds([]);
         setError(null);
        setFormError(null);
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError("Отсутствует токен авторизации.");
            return;
        }

        // Валидация: проверяем, что есть хотя бы 3 точки для bounds (если это не точка)
        if (formData.type !== 'point' && bounds.length > 0 && bounds.length < 3) {
            setFormError("Для полигональной локации необходимо указать минимум 3 точки границ.");
            return;
        }
         // Проверка на пустые bounds (если не тип 'point')
         if (formData.type !== 'point' && bounds.length === 0) {
            setFormError("Укажите границы локации на карте.");
            return;
         }


        setLoading(true);
        setError(null);
        setFormError(null);

        // Собираем все данные для отправки
        const dataToSend = {
            ...formData,
            // Убедимся, что lat/lng - числа
            lat: parseFloat(formData.lat) || 0,
            lng: parseFloat(formData.lng) || 0,
            // Добавляем актуальные границы
            bounds: bounds,
             // Очищаем пустые необязательные поля, чтобы отправить null
             time_start: formData.time_start || null,
             time_end: formData.time_end || null,
             main_icon: formData.main_icon || null,
             building_type: formData.building_type || null,
             building_type_name_ru: formData.building_type_name_ru || null,
        };

        try {
            if (isEditMode) {
                await updateLocationAdmin(locationId, dataToSend, token);
                alert('Локация успешно обновлена!');
            } else {
                await createLocationAdmin(dataToSend, token);
                alert('Локация успешно создана!');
            }
            navigate('/admin/locations'); // Возвращаемся к списку
        } catch (err) {
            console.error("Ошибка сохранения локации:", err);
            setError(err.message || "Не удалось сохранить локацию.");
        } finally {
            setLoading(false);
        }
    };

    // --- Рендеринг ---
    if (loading && isEditMode) {
        return <div className={styles.statusMessage}>Загрузка данных локации...</div>;
    }

    // Не показываем общую ошибку API, если есть ошибка формы
    if (error && !formError) {
        return <div className={`${styles.statusMessage} ${styles.error}`}>Ошибка: {error}</div>;
    }

    return (
        <div className={styles.adminPageContainer}>
            <h1 className={styles.adminPageTitle}>
                {isEditMode ? `Редактировать локацию (ID: ${locationId})` : 'Создать новую локацию'}
            </h1>

            <form onSubmit={handleSubmit} className={styles.adminForm}>
                {/* Разделим на две колонки для удобства? Или просто подряд */}

                {/* Основные данные */}
                 <div className={styles.formGroup}>
                    <label htmlFor="title">Название *</label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required disabled={loading} />
                </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="address">Адрес *</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required disabled={loading} />
                </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="type">Тип (англ.) *</label>
                    <input type="text" id="type" name="type" value={formData.type} onChange={handleChange} required disabled={loading} placeholder="building, landmark, square..." />
                </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="building_type">Тип здания (англ., опционально)</label>
                    <input type="text" id="building_type" name="building_type" value={formData.building_type} onChange={handleChange} disabled={loading} placeholder="academic_building, dormitory..." />
                </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="building_type_name_ru">Название типа здания (рус., опционально)</label>
                    <input type="text" id="building_type_name_ru" name="building_type_name_ru" value={formData.building_type_name_ru} onChange={handleChange} disabled={loading} placeholder="Учебный корпус, Общежитие..." />
                </div>

                 {/* Координаты Центра (можно сделать их тоже выбираемыми на карте или оставить для ручного ввода) */}
                 <div style={{ display: 'flex', gap: '15px' }}>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label htmlFor="lat">Широта (центр) *</label>
                        <input type="number" step="any" id="lat" name="lat" value={formData.lat} onChange={handleChange} required disabled={loading} />
                    </div>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label htmlFor="lng">Долгота (центр) *</label>
                        <input type="number" step="any" id="lng" name="lng" value={formData.lng} onChange={handleChange} required disabled={loading} />
                    </div>
                 </div>

                 {/* Время работы и иконка */}
                 <div style={{ display: 'flex', gap: '15px' }}>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label htmlFor="time_start">Время начала работы</label>
                        <input type="text" id="time_start" name="time_start" value={formData.time_start} onChange={handleChange} disabled={loading} placeholder="ПН-ПТ 09:00" />
                    </div>
                    <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label htmlFor="time_end">Время конца работы</label>
                        <input type="text" id="time_end" name="time_end" value={formData.time_end} onChange={handleChange} disabled={loading} placeholder="18:00" />
                    </div>
                 </div>
                <div className={styles.formGroup}>
                    <label htmlFor="main_icon">URL Главной иконки</label>
                    <input type="url" id="main_icon" name="main_icon" value={formData.main_icon} onChange={handleChange} disabled={loading} placeholder="https://.../icon.svg" />
                </div>


                 {/* Карта для выбора Bounds */}
                 <div className={styles.formGroup}>
                     <label>Границы на карте (кликните для добавления точек)</label>
                     <AdminInteractiveMap
                         // Передаем текущие bounds для отрисовки
                         initialBounds={bounds}
                         // Передаем callback для обновления состояния bounds в этой форме
                         onBoundsChange={handleBoundsChange}
                         // Передаем центр карты из состояния формы для начального вида
                         center={[formData.lat, formData.lng]}
                         // Можно добавить key={locationId || 'new'} чтобы карта пересоздавалась при смене ID
                         key={locationId || 'new'}
                     />
                     <button type="button" onClick={clearBounds} className={styles.clearButton} disabled={loading || bounds.length === 0}>
                         Очистить границы
                     </button>
                     <small>Кликните по карте для добавления точек полигона. Минимум 3 точки для создания.</small>
                 </div>

                {/* Сообщение об ошибке формы */}
                {formError && <p className={styles.formError}>{formError}</p>}
                {/* Общее сообщение об ошибке API */}
                {error && <p className={styles.formError}>{error}</p>}

                {/* Кнопки управления */}
                <div className={styles.formActions}>
                     <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Сохранение...' : (isEditMode ? 'Сохранить изменения' : 'Создать локацию')}
                    </button>
                    <Link to="/admin/locations" className={styles.cancelButton}>
                        Отмена
                    </Link>
                </div>
            </form>
        </div>
    );
};

// Добавь стиль для кнопки очистки, например:
// .clearButton { background-color: #f44336; color: white; /* ... */ }

export default AdminLocationFormPage;