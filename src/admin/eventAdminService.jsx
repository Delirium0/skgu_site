// src/api/admin/eventAdminService.js

const API_URL = process.env.REACT_APP_API_URL; // Убедись, что переменная настроена

// --- Хелпер для выполнения fetch запросов ---
const fetchAdminAPI = async (endpoint, token, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers, // Позволяет переопределить или добавить заголовки
    };

    const config = {
        ...options,
        headers: headers,
    };

    try {
        const response = await fetch(url, config);

        // Обработка ответа без тела (например, 204 No Content для DELETE)
        if (response.status === 204) {
            return null; // Или можно вернуть { success: true }
        }

        const data = await response.json(); // Пытаемся парсить JSON

        if (!response.ok) {
            // Если есть detail в ошибке FastAPI, используем его
            const errorDetail = data?.detail || `Ошибка HTTP: ${response.status}`;
            throw new Error(errorDetail);
        }

        return data; // Возвращаем данные в случае успеха
    } catch (error) {
        console.error(`Ошибка API запроса к ${url}:`, error);
        // Пробрасываем ошибку дальше, чтобы компонент мог ее обработать
        throw error;
    }
};

// --- Функции для работы с событиями ---

export const getAllEventsAdmin = (token) => {
    return fetchAdminAPI('/events/all', token, { method: 'GET' }); // <-- ИЗМЕНЕН ЭНДПОИНТ
};
export const getUnmoderatedEventsAdmin = (token) => {
    return fetchAdminAPI('/events/unmoderated', token, { method: 'GET' });
};

export const getEventByIdAdmin = (eventId, token) => {
    return fetchAdminAPI(`/events/${eventId}`, token, { method: 'GET' });
};

export const createEventAdmin = (eventData, token) => {
    // Убедимся, что обязательные поля из EventCreate присутствуют
    // (дополнительная клиентская проверка)
    if (!eventData.event_name || !eventData.event_time || !eventData.image_background || !eventData.event_creator_name) {
        return Promise.reject(new Error("Не заполнены все обязательные поля для создания события."));
    }
    return fetchAdminAPI('/events/', token, {
        method: 'POST',
        body: JSON.stringify(eventData),
    });
};

export const updateEventAdmin = (eventId, eventData, token) => {
    // eventData должно соответствовать EventUpdate схеме
    return fetchAdminAPI(`/events/${eventId}`, token, {
        method: 'PUT',
        body: JSON.stringify(eventData),
    });
};
export const getAllFeedbacksAdmin = (token, skip = 0, limit = 100) => {
    const endpoint = `/feedbacks/?skip=${skip}&limit=${limit}`;
    return fetchAdminAPI(endpoint, token, { method: 'GET' });
};
export const deleteFeedbackAdmin = (feedbackId, token) => {
    return fetchAdminAPI(`/feedbacks/${feedbackId}`, token, { method: 'DELETE' });
};
export const deleteEventAdmin = (eventId, token) => {
    return fetchAdminAPI(`/events/${eventId}`, token, { method: 'DELETE' });
};

export const approveEventAdmin = (eventId, token) => {
    return fetchAdminAPI(`/events/${eventId}/moderate`, token, { method: 'PATCH' }); // Используем PATCH
};
export { fetchAdminAPI };
