import React, { useState } from "react";
import ScheduleCalendar from "./ScheduleCalendar";
import CounselStatistics from "./CounselStatistics";
import './css/OfflineCounsel.css';

const offlineDescription = "등록되어 있는 상담일정을 클릭하여 예약 가능하며 당일 예약은 불가능합니다.\n상담 예약 시 취소가 불가능하오니 주의바랍니다."

const OfflineCounsel = () => {
    const [activeTab, setActiveTab] = useState('schedule');

    return (
        <div className="offline-counsel-main">
            <h1 className="font-bold">오프라인 상담</h1>
            <p>{offlineDescription}</p>
            <div className="offline-tab-container">
                <button
                    className={`offline-tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
                    onClick={() => setActiveTab('schedule')}
                >
                    일정/예약
                </button>
                <button
                    className={`offline-tab-button ${activeTab === 'statistics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('statistics')}
                >
                    상담통계
                </button>
            </div>

            <div className="offline-counsel-content-container">
                {activeTab === 'schedule' ? (
                    <ScheduleCalendar />
                ) : (
                    <CounselStatistics />
                )}
            </div>
        </div>
    );
};

export default OfflineCounsel;