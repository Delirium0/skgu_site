import React from 'react';
import Link from './Link'; // Импортируем компонент Link
import { ReactComponent as ScheduleIcon } from './../../assets/svg/arrow_down.svg'; // Путь к иконке расписания
import { ReactComponent as DiplomaIcon } from './../../assets/svg/arrow_down.svg';   // Путь к иконке диплома
import { ReactComponent as ResourcesIcon } from './../../assets/svg/arrow_down.svg'; // Путь к иконке ресурсов (пример)
import styles from './Links.module.css'; // Импорт стилей

const Links = () => {
    // Массив объектов с данными для ссылок
    const linksData = [
        {
            icon: ScheduleIcon,
            href: "https://is.ku.edu.kz/methodpages/ldolmatova/%D0%A3%D1%88%D0%B0%D0%BA%D0%BE%D0%B2%D0%B0%20%D0%95.%D0%92.%20%D0%94%D0%BE%D0%BB%D0%BC%D0%B0%D1%82%D0%BE%D0%B2%D0%B0%20%D0%9B.%D0%92.rar",
            text: "Методические указания оформления word",
        },
        {
            icon: DiplomaIcon,
            href: "URL_ДЛЯ_СКАЧИВАНИЯ_ШАБЛОНА", // Замените на реальный URL
            text: "Шаблон оформления \n дипломной работы", // Используйте \n для переноса строки
        },
        {
            icon: ResourcesIcon,
            href: "URL_ДЛЯ_ДРУГИХ_РЕСУРСОВ", // Замените на реальный URL
            text: "Полезные ресурсы \n для студентов", // Используйте \n для переноса строки
        },
        // Добавьте другие ссылки сюда, по аналогии
    ];

    return (
        <div className={styles.main_block}>
            <div className={styles.account_container}>
                {/* Используем map для рендеринга компонентов Link на основе массива linksData */}
                {linksData.map((link, index) => (
                    <Link
                        key={index} // Важно добавить key при использовании map в React
                        icon={link.icon}
                        href={link.href}
                        text={link.text}
                    />
                ))}
            </div>
        </div>
    );
};

export default Links;