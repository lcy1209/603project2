import { useEffect, useState } from "react";
import { MonthlyBarChart } from "./charts/BarChart";
import { CounselTypePieChart } from "./charts/PieChart";
import './css/CounselStatistics.css';
import { SERVER_URL } from "../../../api/serverURL";
import axios from "axios";

const CounselStatistics = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [monthlyCounselorData, setMonthlyCounselorData] = useState([]);

    // API 호출
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [monthlyData, counselorData] = await Promise.all([
                    axios.get(`${SERVER_URL}/api/counsel/stats/monthly`),
                    axios.get(`${SERVER_URL}/api/counsel/stats/monthlyCounselor`)
                ]);
    
                const formattedMonthlyData = monthlyData.data.map((item) => ({
                    month: `${parseInt(item.month.split('-')[1], 10)}월`,
                    count: item.count
                }));
    
                console.log("Formatted Monthly Data:", formattedMonthlyData);
                setMonthlyData(formattedMonthlyData);
    
                console.log("Fetched Monthly Counselor Data:", counselorData.data);
                setMonthlyCounselorData(counselorData.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
    
        fetchData();
    }, []);

    return(
        <div className="offline-statistics-container">
            {/* <a href="#">통계다운로드(보류)</a> */}
            <div className="offline-chart-row">
                <MonthlyBarChart data={monthlyData}/>
                <CounselTypePieChart data={monthlyCounselorData}/>
            </div>
        </div>
    );
};

export default CounselStatistics;