import React, { useEffect, useState } from "react";
import axios from "axios";
import Map from "../../home/map/Map";
import Search_results from "../../search/search_results/Search_results";
import styles from './Schedule.module.css';
import Footer from "../../Components/Footer/Footer";

const NextLessonRoute = () => {
    const userLogin = 'IS3001';
    const userPass = '3kzs7s8n';
    const apiUrl = `http://127.0.0.1:8000/schedule/schedule/?user_login=${userLogin}&user_pass=${userPass}`;

    const [scheduleData, setScheduleData] = useState(null);
    const [loadingSchedule, setLoadingSchedule] = useState(true);
    const [scheduleError, setScheduleError] = useState(null);

    const [floorsData, setFloorsData] = useState([]);
    const [point, setPoint] = useState(null);
    const [centerPoint, setCenterPoint] = useState(null);
    const start = "1_entrance";
    const [nextLessonRoom, setNextLessonRoom] = useState(null); // Renamed state to nextLessonRoom

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoadingSchedule(true);
            setScheduleError(null);
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setScheduleData(data);
            } catch (e) {
                setScheduleError(e);
            } finally {
                setLoadingSchedule(false);
            }
        };

        fetchSchedule();
    }, [apiUrl]);

    const getNextLessonRoom = () => {
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

        let nextLesson = null;
        let minStartTime = Infinity; // Initialize with a large value

        for (const lesson of lessonsToday) {
            const timeParts = lesson['Время'].split(' - ');
            const startTimeStr = timeParts[0];

            const [startHour, startMinute] = startTimeStr.split('.').map(Number);
            const lessonStartTime = startHour * 60 + startMinute;

            console.log("Время занятия:", lesson['Время'], "Старт:", lessonStartTime);
            console.log("Текущее время:", currentTime);

            if (lessonStartTime > currentTime) { // Check if lesson starts in the future
                if (lessonStartTime < minStartTime) { // Find the earliest next lesson
                    minStartTime = lessonStartTime;
                    const classroom = lesson['Аудитория'];
                    const classroomParts = classroom ? classroom.split('/') : null;
                    const roomNumber = classroomParts ? classroomParts[0] : null;
                    const buildingNumber = classroomParts && classroomParts.length > 1 ? classroomParts[1] : null;

                    nextLesson = {
                        roomNumber: roomNumber,
                        building: buildingNumber,
                    };
                }
            } else {
                console.log("Занятие уже прошло или идет:", lesson['Время']);
            }
        }

        return nextLesson; // Returns the earliest next lesson, or null if no next lesson today
    };

    useEffect(() => {
        if (!scheduleData || loadingSchedule || scheduleError) return;
        const nextLessonInfo = getNextLessonRoom(); // Renamed to nextLessonInfo
        console.log(nextLessonInfo);

        setNextLessonRoom(nextLessonInfo); // Set state with nextLessonInfo

        if (nextLessonInfo && nextLessonInfo.roomNumber) {
            axios
                .get(`${process.env.REACT_APP_API_URL}/search/route_suggestions`, {
                    params: {
                        start: start,
                        target: nextLessonInfo.roomNumber,
                        building: nextLessonInfo.building || '6',
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
                        console.warn("No valid location data found for next lesson.");
                        setPoint(null);
                        setCenterPoint(null);
                    }

                    const sortedFloors = [...images].sort((a, b) => {
                        return parseInt(a.floor, 10) - parseInt(b.floor, 10);
                    });

                    setFloorsData(sortedFloors);
                })
                .catch((error) => {
                    console.error("Error fetching route for next lesson:", error);
                    setPoint(null);
                    setCenterPoint(null);
                    setFloorsData([]);
                });
        } else {
            console.log("No next lesson found for today or no room defined.");
            setPoint(null);
            setCenterPoint(null);
            setFloorsData([]);
        }
    }, [scheduleData, loadingSchedule, scheduleError]);


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
            <h2>Маршрут к следующему занятию</h2> {/* Updated heading */}
            {nextLessonRoom ? ( // Updated to use nextLessonRoom state
                <>
                    <p>
                        Следующее занятие в кабинете: {nextLessonRoom?.roomNumber}
                        {nextLessonRoom?.building && ` (корпус ${nextLessonRoom.building})`}
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
                <p>Нет следующих занятий на сегодня или не удалось определить кабинет.</p>
            )}
            <Footer />
        </div>
    );
};

export default NextLessonRoute;