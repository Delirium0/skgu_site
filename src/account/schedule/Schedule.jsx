// src/components/Schedule/Schedule.jsx
import React, { useState, useEffect } from 'react';
import styles from './Schedule.module.css'; // Импортируйте CSS Modules
import DesktopScheduleTable from './DesktopScheduleTable';
import MobileScheduleCards from './MobileScheduleCards';
import AccountBlock from '../AccountBlock';
import { ReactComponent as ScheduleSVG } from './../../assets/svg/calendar-days-svgrepo-com.svg';
import { useAuth } from '../../auth/AuthProvider';
const Schedule = () => {
    const { user } = useAuth();
    const token = user?.token;
    console.log(token)
    const apiUrl = `${process.env.REACT_APP_API_URL}/schedule/schedule/`; // URL без параметров логина и пароля
    const link_actual_schedule =     { name: "Текущее занятие", linkTo: "/schedule_actual", SvgComponent: ScheduleSVG }
    const link_next_schedule =     { name: "Следующее занятие", linkTo: "/next_lesson", SvgComponent: ScheduleSVG }

    const [scheduleData, setScheduleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            setError(null);
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
                        // Если 401 Unauthorized, возможно, токен истек или недействителен
                        setError(new Error('Необходимо авторизоваться.'));
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
                const data = await response.json();
                setScheduleData(data);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        if (token) { // **Важно:** Запрос расписания только если есть токен
            fetchSchedule();
        } else {
            setError(new Error('Токен авторизации отсутствует.')); // Сообщение об ошибке, если нет токена
            setLoading(false);
        }
    }, [apiUrl, token]); // Добавьте token в зависимости useEffect

    if (loading) {
        return <p className={styles.loading}>Загрузка расписания...</p>;
    }

    if (error) {
        return <p className={styles.error}>Ошибка загрузки расписания: {error.message}</p>;
    }

    if (!scheduleData || !scheduleData.results || scheduleData.results.length === 0) {
        return <p className={styles.noSchedule}>Расписание не найдено.</p>;
    }

    // Группировка расписания по дням недели (остается без изменений)
    const scheduleByDay = {};
    const daysOfWeekOrder = ["ПОНЕДЕЛЬНИК", "ВТОРНИК", "СРЕДА", "ЧЕТВЕРГ", "ПЯТНИЦА", "СУББОТА", "ВОСКРЕСЕНЬЕ"];

    scheduleData.results.forEach(lesson => {
        const day = lesson['День недели'];
        if (!scheduleByDay[day]) {
            scheduleByDay[day] = [];
        }
        scheduleByDay[day].push(lesson);
    });

    return (
        <div className={`${styles.schedulePage} ${styles.page_block}`}>
            <div className={styles.schedule_next_and_actual}> <AccountBlock blockInfo ={link_actual_schedule}></AccountBlock>
        <AccountBlock blockInfo ={link_next_schedule}></AccountBlock>
</div>

            <div className={styles.page_content}>
                <h1 className={styles.scheduleHeader}>Расписание</h1>

                {/* Десктопная версия расписания */}
                <div className={styles.scheduleContainer}>
                    {daysOfWeekOrder.map(day => (
                        scheduleByDay[day] && scheduleByDay[day].length > 0 && (
                            <DesktopScheduleTable
                                key={day}
                                day={day}
                                daySchedule={scheduleByDay[day]}
                                styles={styles}
                            />
                        )
                    ))}
                </div>

                {/* Мобильная версия расписания */}
                <div className={styles.scheduleContainerMobile}>
                    {daysOfWeekOrder.map(day => (
                        scheduleByDay[day] && scheduleByDay[day].length > 0 && (
                            <MobileScheduleCards
                                key={day}
                                day={day}
                                daySchedule={scheduleByDay[day]}
                                styles={styles}
                            />
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Schedule;