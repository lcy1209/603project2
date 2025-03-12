import { PieChart, Pie, Cell, Sector, Legend } from 'recharts';
import { useState, useEffect } from 'react';

export const CounselTypePieChart = ({ data }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const COLORS = ['#4e89d6', '#ee8b60', '#ffa7d1', '#b8e986', '#f38181'];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, percent, counselor, count } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                {/* <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                    {payload.name}
                </text> */}
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />

                {isMobile ? (
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontSize={10}>{`${counselor} - ${count}회`}</text>
                ) : (
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${counselor} - ${count}회`}</text>
                )}

                {isMobile ? (
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={10}>
                    {`(${(percent * 100).toFixed(2)}%)`}
                </text>
                ) : (
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(${(percent * 100).toFixed(2)}%)`}
                </text>
                )}
            </g>
        );
    };


    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    return (
        <div className='counsel-chart-container'>
            {isMobile ? (
            <div className='mobile-counsel-chart'>
                <h4>상담사별 상담 분포</h4>
                <div className='mobile-chart'>
                    <PieChart width={350} height={220}>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={0}
                            outerRadius={60}
                            fill="#8884d8"
                            nameKey="counselor"
                            dataKey="count"
                            onMouseEnter={onPieEnter}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Legend wrapperStyle={{fontSize: "0.7rem"}}/>
                    </PieChart>
                </div>
            </div>
            ) : (
            <div className='pc-counsel-chart'>
                <h3>상담사별 상담 분포</h3>
                <PieChart width={500} height={300}>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={80}
                        fill="#8884d8"
                        nameKey="counselor"
                        dataKey="count"
                        onMouseEnter={onPieEnter}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Legend />
                </PieChart>
            </div>
            )}
        </div>
    );
};