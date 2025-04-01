import React from 'react';
import cl from './Account.module.css'
import Subject_container from './Subject_container';
const Account = () => {

    const test_data = [
        {'subject_name': 'Информационная безопасность', 'teacher': 'преподаватель: Кухаренко Евгения Владимировна',
         '1': '100', '2': '100', '3': '80', '4': '100', '5': '100', '6': '100', '7': '', '8': '', '9': '',
         '10': '100|100',
         '11': '', '12': '', '13': '', '14': '', '15': '', 'average_grade': '98'},
        {'subject_name': 'Проектирование программного обеспечения',
         'teacher': 'преподаватель: Ушакова Екатерина Вячеславовна', '1': '', '2': '', '3': '95|85|84', '4': '',
         '5': '',
         '6': '70|70|70|90', '7': '', '8': '', '9': '70|90|75|75|58', '10': '', '11': '', '12': '', '13': '', '14': '',
         '15': '', 'average_grade': '78'},
        {'subject_name': 'Системы искусственного интеллекта',
         'teacher': 'преподаватель: Астапенко Наталья Владимировна',
         '1': '', '2': '', '3': '91|70|88|68', '4': '', '5': '', '6': '90|85|100|100', '7': '', '8': '',
         '9': '81|100|100|100', '10': '', '11': '', '12': '', '13': '', '14': '', '15': '', 'average_grade': '89'},
        {'subject_name': 'Теория и практика создания интерактивных приложений',
         'teacher': 'преподаватель: Куликов Владимир Павлович', '1': '', '2': '', '3': '100|0', '4': '', '5': '',
         '6': '99|100', '7': '', '8': '', '9': '100|100', '10': '', '11': '', '12': '', '13': '', '14': '', '15': '',
         'average_grade': '83'},
        {'subject_name': 'Тестирование и обеспечение качества программного обеспечения',
         'teacher': 'преподаватель: Лисянов Владимир Валерьевич', '1': '', '2': '', '3': '', '4': '0', '5': '',
         '6': '100|100', '7': '95', '8': '94|96', '9': '95', '10': '97', '11': '91', '12': '', '13': '', '14': '',
         '15': '',
         'average_grade': '85'}
    ]
    return (
        <div className={cl.account_block}>
             {test_data.map(subject_info => ( 
                 <Subject_container key={subject_info.subject_name} currentSubjectData={subject_info}></Subject_container>
             ))}
             </div>
    );
};

export default Account;