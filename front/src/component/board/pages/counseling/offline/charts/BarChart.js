import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';

export const MonthlyBarChart = ({ data }) => {

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className='counsel-chart-container'>
            {isMobile ? (
                <div className='mobile-counsel-chart'>
                    <h4>월간 상담 통계</h4>
                    <div className='mobile-chart'>
                        <BarChart width={300} height={150} data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" style={{ fontSize: "0.7rem" }} />
                            <YAxis style={{ fontSize: "0.7rem" }} width={20}/>
                            <Tooltip />
                            <Bar dataKey="count" fill="#82ca9d" name="상담수" />
                        </BarChart>
                    </div>
                </div>
            ) : (
                <div className='pc-counsel-chart'>
                    <h3>월간 상담 통계</h3>
                    <BarChart width={500} height={300} data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis width={30}/>
                        <Tooltip />
                        <Bar dataKey="count" fill="#82ca9d" name="상담수" />
                    </BarChart>
                </div>
            )}
        </div>
    );
};