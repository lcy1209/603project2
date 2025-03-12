import React, { useEffect, useState, useContext } from 'react';
import './css/ScheduleCalendar.css';
import '../../common/css/Button.css';
import { useNavigate } from 'react-router-dom';
import useIsAdmin from '../../../hooks/useIsAdmin';
import ScheduleModal from './ScheduleModal';
import axios from 'axios';
import { SERVER_URL } from '../../../api/serverURL';
import { LoginContext } from '../../../../login/security/contexts/LoginContextProvider';

const ScheduleCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [schedules, setSchedules] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isAdmin = useIsAdmin(); // 관리자 체크
    const navigate = useNavigate();
    const { isName } = useContext(LoginContext);

    // console.log(isAdmin);

    // 일정 데이터 가져오기
    const fetchSchedules = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/api/counsel/schedule`);
            const groupedSchedules = response.data.reduce((acc, schedule) => {
                const day = new Date(schedule.counsel_date).getDate();
                if (!acc[day]) acc[day] = [];
                acc[day].push(schedule);
                return acc;
            }, {});
            setSchedules(groupedSchedules);
        } catch (error) {
            console.error("Error fetching schedules:", error);
        }
    };

    useEffect(() => {
        fetchSchedules(); // 컴포넌트 로드 시 일정 가져오기
    }, [currentDate]);

    // 월 이동 함수
    const moveMonth = (direction) => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    // 모달 닫기 핸들러
    const handleModalClose = () => {
        setIsModalOpen(false);
        fetchSchedules(); // 일정 데이터 갱신
    };

    // 달력 날짜 데이터 생성
    const generateCalendarData = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        const calendar = [];
        let week = [];

        // 첫 주 빈 칸
        for (let i = 0; i < firstDay; i++) {
            week.push(null);
        }

        // 날짜 채우기
        for (let day = 1; day <= lastDate; day++) {
            week.push(day);
            if (week.length === 7) {
                calendar.push(week);
                week = [];
            }
        }

        // 마지막 주 빈 칸
        if (week.length > 0) {
            while (week.length < 7) {
                week.push(null);
            }
            calendar.push(week);
        }

        return calendar;
    };

    // 스케줄 렌더링
    const renderSchedule = (day) => {
        if (!day || !schedules[day]) return null; // 유효하지 않은 day, 해당 날짜에 스케줄이 없으면 건너뜁니다.
    
        // 현재 연도와 월
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); // 0-indexed (0 = 1월)

       
    
        return (
            <div className="offline-schedule-container">
                {schedules[day]
                    .filter(schedule => {
                        // 백엔드에서 가져온 데이터의 counsel_date (예: 2025-02-02)
                        const scheduleDate = new Date(schedule.counsel_date);
                        return (
                            scheduleDate.getFullYear() === currentYear &&
                            scheduleDate.getMonth() === currentMonth
                        );
                    })
                    .sort((a, b) => {
                        // counsel_time의 앞 두 글자를 숫자로 변환하여 비교
                        const timeA = parseInt(a.counsel_time.slice(0, 2), 10); // "09:00" -> 9
                        const timeB = parseInt(b.counsel_time.slice(0, 2), 10); // "10:00" -> 10
    
                        return timeA - timeB; // 오름차순 정렬
                    })
                    .map((schedule, index) => (
                        <div
                            key={index}
                            className={`offline-schedule ${schedule.reserve_status ? "reserved" : "available"}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleScheduleClick(schedule);
                            }}
                        >
                            {schedule.counselor}
                            {schedule.reserve_status && " - 예약됨"}
                            <div className='offline-counsel-time'>{schedule.counsel_time}</div>
                        </div>
                    ))}
            </div>
        );
    };
    

    // 일정 클릭 처리
    const handleScheduleClick = async (schedule) => {

        const clientName = isName;
        const today = new Date();

        if (schedule.reserve_status) {
            alert("이미 예약된 일정입니다.");
            return;
        }

        if(new Date(schedule.counsel_date).toDateString() == today.toDateString()) {
            alert("당일 예약은 불가능합니다.");
            return;
        }

        if(new Date(schedule.counsel_date) < today) {
            alert("예약 기간이 지난 일정입니다.");
            return;
        }
        
        if(window.confirm(
            `
            상담일 : ${schedule.counsel_date}\n
            시간 : ${schedule.counsel_time}\n
            예약하시겠습니까?\n
            예약 시 취소가 불가능합니다!
            `.replace(/^\s+/gm, '')
        )) {

            try {
                await axios.patch(`${SERVER_URL}/api/counsel/schedule/${schedule.id}/reserve`, clientName, {
                    headers: { 'Content-Type': 'text/plain' } // 단순 문자열 전송
                });
                alert("예약이 완료되었습니다.");
                fetchSchedules(); // 일정 갱신
            } catch (error) {
                console.error("Error during reservation:", error.response?.data || error);
                alert("예약에 실패했습니다.");
            }
        }
        
    };
    

    return (
        <div className="offline-schedule-calendar">
            <div className="offline-calendar-header">
                <button onClick={() => moveMonth(-1)}>◀</button>
                <h3>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h3>
                <button onClick={() => moveMonth(1)}>▶</button>
            </div>
            <table className="offline-calendar">
                <thead>
                    <tr>
                        <th className="sun">SUN</th>
                        <th>MON</th>
                        <th>TUE</th>
                        <th>WED</th>
                        <th>THU</th>
                        <th>FRI</th>
                        <th className="sat">SAT</th>
                    </tr>
                </thead>
                <tbody>
                    {generateCalendarData().map((week, i) => (
                        <tr key={i}>
                            {week.map((day, j) => (
                                <td key={j}>
                                    <div className="cell-content">
                                        {day && <div className="cal-day">{day}</div>}
                                        {renderSchedule(day)}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {isAdmin && (
                <div className="common-button-container">
                    <button onClick={() => setIsModalOpen(true)}>일정 등록</button>
                    <button onClick={() => navigate("/counsel/offline/schedule/manage")}>일정 관리</button>
                </div>
            )}

            {/* 일정 등록 모달 */}
            <ScheduleModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />
        </div>
    );
};

export default ScheduleCalendar;
