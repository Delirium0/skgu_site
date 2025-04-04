// src/components/Schedule/Schedule.jsx
import React, { useState, useEffect } from 'react';
import styles from './Schedule.module.css'; // Импортируйте CSS Modules
import DesktopScheduleTable from './DesktopScheduleTable';
import MobileScheduleCards from './MobileScheduleCards'; // Import the new MobileScheduleCards component
import AccountBlock from '../AccountBlock';
import { ReactComponent as ScheduleSVG } from './../../assets/svg/calendar-days-svgrepo-com.svg';

const Schedule = () => {
    // **Важно:** В реальном приложении логин и пароль пользователя не должны быть жестко закодированы.
    // Их нужно получать безопасно, например, из состояния приложения после авторизации пользователя.
    const userLogin = 'IS3001'; // Замените на логин пользователя
    const userPass = '3kzs7s8n'; // Замените на пароль пользователя
    const apiUrl = `http://127.0.0.1:8000/schedule/schedule/?user_login=${userLogin}&user_pass=${userPass}`;
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
                    method: 'POST', // Используем POST запрос, как указано в роутере
                    headers: {
                        'Content-Type': 'application/json' // Указываем тип контента, хотя тело запроса пустое
                    },
                    body: JSON.stringify({}) // Тело запроса пустое, параметры передаются в query
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setScheduleData(data);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [apiUrl]);

    if (loading) {
        return <p className={styles.loading}>Загрузка расписания...</p>;
    }

    if (error) {
        return <p className={styles.error}>Ошибка загрузки расписания: {error.message}</p>;
    }

    if (!scheduleData || !scheduleData.results || scheduleData.results.length === 0) {
        return <p className={styles.noSchedule}>Расписание не найдено.</p>;
    }

    // Группировка расписания по дням недели
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