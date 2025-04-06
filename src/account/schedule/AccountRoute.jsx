// src/components/AccountRoute.jsx (предположительно, путь к файлу, исходя из структуры Schedule)
import React, { useEffect, useState } from "react";
import axios from "axios";
import Map from "../../home/map/Map";
import Search_results from "../../search/search_results/Search_results";
import styles from './Schedule.module.css'; // Убедитесь, что путь к стилям верный
import Footer from "../../Components/Footer/Footer";
import { useAuth } from '../../auth/AuthProvider'; // Импортируем useAuth

const AccountRoute = () => {
    const { user } = useAuth(); // Используем хук useAuth для получения информации о пользователе
    const token = user?.token; // Получаем токен пользователя
    console.log(token)

    const apiUrl = `${process.env.REACT_APP_API_URL}/schedule/schedule/`; // URL без параметров логина и пароля

    const [scheduleData, setScheduleData] = useState(null);
    const [loadingSchedule, setLoadingSchedule] = useState(true);
    const [scheduleError, setScheduleError] = useState(null);

    const [floorsData, setFloorsData] = useState([]);
    const [point, setPoint] = useState(null);
    const [centerPoint, setCenterPoint] = useState(null);
    const start = "1_entrance";
    const [currentLessonRoom, setCurrentLessonRoom] = useState(null); // Состояние теперь будет хранить объект currentLessonInfo

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoadingSchedule(true);
            setScheduleError(null);
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Добавляем заголовок Authorization с токеном
                    },
                    body: JSON.stringify({})
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        setScheduleError(new Error('Необходимо авторизоваться.'));
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
                const data = await response.json();
                setScheduleData(data);
            } catch (e) {
                setScheduleError(e);
            } finally {
                setLoadingSchedule(false);
            }
        };

        if (token) { // **Важно:** Запрос расписания только если есть токен
            fetchSchedule();
        } else {
            setScheduleError(new Error('Токен авторизации отсутствует.'));
            setLoadingSchedule(false);
        }
    }, [apiUrl, token]); // Добавляем token в зависимости useEffect

    const getCurrentLessonRoom = () => {
        if (!scheduleData || !scheduleData.results || scheduleData.results.length === 0) {
            return null;
        }
        console.log(scheduleData)
        const now = new Date();
        const currentDayOfWeek = now.toLocaleDateString('ru-RU', { weekday: 'long' }).toUpperCase();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        console.log("Текущий день недели:", currentDayOfWeek);

        const lessonsToday = scheduleData.results.filter(lesson => lesson['День недели'].toUpperCase() === currentDayOfWeek);
        console.log("Уроки на сегодня:", lessonsToday);

        if (lessonsToday.length === 0) {
            return null;
        }

        for (const lesson of lessonsToday) {
            const timeParts = lesson['Время'].split(' - ');
            const startTimeStr = timeParts[0];
            const endTimeStr = timeParts[1];

            const [startHour, startMinute] = startTimeStr.split('.').map(Number);
            const [endHour, endMinute] = endTimeStr.split('.').map(Number);

            const lessonStartTime = startHour * 60 + startMinute;
            const lessonEndTime = endHour * 60 + endMinute;

            console.log("Время занятия:", lesson['Время'], "Старт:", lessonStartTime, "Конец:", lessonEndTime);
            console.log("Текущее время:", currentTime);

            if (currentTime >= lessonStartTime && currentTime < lessonEndTime) {
                console.log("Условие выполнено!");
                const classroom = lesson['Аудитория'];
                const classroomParts = classroom ? classroom.split('/') : null;
                const roomNumber = classroomParts ? classroomParts[0] : null;
                const buildingNumber = classroomParts && classroomParts.length > 1 ? classroomParts[1] : null;

                return {
                    roomNumber: roomNumber,
                    building: buildingNumber,
                };
            } else {
                console.log("Условие не выполнено для занятия:", lesson['Время']);
            }
        }

        return null;
    };

    useEffect(() => {
        if (!scheduleData || loadingSchedule || scheduleError) return;
        const currentLessonInfo = getCurrentLessonRoom();
        console.log(currentLessonInfo);

        setCurrentLessonRoom(currentLessonInfo); // Теперь сохраняем весь объект currentLessonInfo

        if (currentLessonInfo && currentLessonInfo.roomNumber) {
            axios
                .get(`${process.env.REACT_APP_API_URL}/search/route_suggestions`, {
                    params: {
                        start: start,
                        target: currentLessonInfo.roomNumber,
                        building: currentLessonInfo.building || '6',
                    },
                })
                .then((response) => {
                    const images = response.data.images.map((imgData) => ({
                        floor: imgData.floor,
                        image: `data:image/png;base64,${imgData.image}`,
                    }));

                    if (
                        response.data.location &&
                        (response.data.location.bounds?.length > 0 ||
                            (response.data.location.lat && response.data.location.lng))
                    ) {
                        setPoint([response.data.location]);
                        setCenterPoint(response.data.location.bounds?.[0] || null);
                        console.log(response.data.location);
                    } else {
                        console.warn("No valid location data found for current lesson.");
                        setPoint(null);
                        setCenterPoint(null);
                    }

                    const sortedFloors = [...images].sort((a, b) => {
                        return parseInt(a.floor, 10) - parseInt(b.floor, 10);
                    });

                    setFloorsData(sortedFloors);
                })
                .catch((error) => {
                    console.error("Error fetching route for current lesson:", error);
                    setPoint(null);
                    setCenterPoint(null);
                    setFloorsData([]);
                });
        } else {
            console.log("No current lesson found or no room defined.");
            setPoint(null);
            setCenterPoint(null);
            setFloorsData([]);
        }
    }, [scheduleData, loadingSchedule, scheduleError, token]); // Важно добавить token в зависимости useEffect


    if (loadingSchedule) {
        return <p className={styles.loading}>Загрузка расписания...</p>;
    }

    if (scheduleError) {
        return <p className={styles.error}>Ошибка загрузки расписания: {scheduleError.message}</p>;
    }

    if (!scheduleData || !scheduleData.results || scheduleData.results.length === 0) {
        return <p className={styles.noSchedule}>Расписание не найдено.</p>;
    }


    return (
        <div className={`${styles.schedulePage} ${styles.page_block}`}>
            <h2>Маршрут к текущему занятию</h2>
            {currentLessonRoom ? (
                <>
                    <p>
                        Текущее занятие в кабинете: {currentLessonRoom?.roomNumber}
                        {currentLessonRoom?.building && ` (корпус ${currentLessonRoom.building})`}
                    </p>
                    {point !== null && (
                        <Map
                            points={point}
                            center_points={centerPoint}
                            zoom_size={17}
                        />
                    )}
                    <Search_results floorsData={floorsData} />
                </>
            ) : (
                <p>Нет текущих занятий или не удалось определить кабинет.</p>
            )}
            <Footer />
        </div>
    );
};

export default AccountRoute;