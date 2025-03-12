import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import axios from 'axios';
import "./Dashboard.css"

const Dashboard = () => {
  // 프로그램 API
  const [totalPrograms, setTotalPrograms] = useState(0)
  const [latestProgramName, setLatestProgramName] = useState("없음")
  // 추천 채용 공고 API
  const [SuggestBoardCount, setSuggestBoardCount] = useState(0);
  const [latestSuggestTitle, setLatestSuggestTitle] = useState("없음");
  // 교내 채용 공고 API
  const [CompusBoardCount, setCompusBoardCount] = useState(0);
  const [latestCompusTitle, setLatestCompusTitle] = useState("없음");
  // 고용24 채용 공고 API
  const [WorkBoardCount, setWorkBoardCount] = useState(0);
  const [latestWorkTitle, setLatestWorkTitle] = useState("없음");


  useEffect(() => {
    fetchPrograms()
    fetchSuggestBoardStats();
    fetchCompusBoardStats();
    fetchWorkBoardStats();
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await fetch("http://localhost:8090/api/programs")
      if (!response.ok) throw new Error("프로그램 데이터를 불러오는 데 실패했습니다.")
      const data = await response.json()

      setTotalPrograms(data.length)
      if (data.length > 0) {
        const latestProgram = [...data].sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0]
        setLatestProgramName(latestProgram.name)
      }
    } catch (error) {
      console.error("프로그램 데이터 로드 오류:", error)
    }
  }

  const fetchSuggestBoardStats = async () => {
    try {
      const response = await axios.get('http://localhost:8090/api/suggest/board/search', {
        params: { page: 0, size: 1 },
      });
  
      const totalCount = response.data.totalElements; 
      const latestTitle = response.data.content.length > 0 ? response.data.content[0].title : "없음";
  
      setSuggestBoardCount(totalCount);
      setLatestSuggestTitle(latestTitle);
    } catch (error) {
      console.error("추천 공고 데이터 로드 오류:", error);
    }
  };

  const fetchCompusBoardStats = () => {
    axios.get('http://localhost:8090/api/campus/board/stats')
        .then((response) => {
          setCompusBoardCount(response.data.totalCount);
          setLatestCompusTitle(response.data.latestTitle);
        })
        .catch((error) => {
            console.error("교내 공고 데이터 로드 오류:", error);
        });
  };

  const fetchWorkBoardStats = () => {
    axios.get('http://localhost:8090/api/work/board/stats')
        .then((response) => {
          setWorkBoardCount(response.data.totalCount);
          setLatestWorkTitle(response.data.latestTitle);
        })
        .catch((error) => {
            console.error("고용24 공고 데이터 로드 오류:", error);
        });
  };

  // 이 데이터는 실제 구현에서는 API를 통해 가져와야 합니다
  const stats = {
    totalUsers: 1500,
    activeJobs: SuggestBoardCount + CompusBoardCount + WorkBoardCount,
    activePrograms: totalPrograms,
  }

  const recentActivities = [
    { id: 1, type: "user", name: "김철수", date: "2023-05-20" },
    { id: 2, type: "job", name: "소프트웨어 개발자", date: "2023-05-19" },
    { id: 3, type: "program", name: latestProgramName, date: "2023-05-18" },
  ]

  const monthlyData = [
    { name: "1월", users: 65 },
    { name: "2월", users: 80 },
    { name: "3월", users: 95 },
    { name: "4월", users: 110 },
    { name: "5월", users: 125 },
  ]

  return (
    <div className="dashboard">
      <h1 className="board_title">관리자 대시보드</h1>

      <div className="stats-container">
        <div className="stat-box">
          <h3>총 사용자 수</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-box">
          <h3>활성 채용 공고</h3>
          <p>{stats.activeJobs}</p>
        </div>
        <div className="stat-box">
          <h3>진행 중인 프로그램</h3>
          <p>{stats.activePrograms}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-activities">
          <h2>최근 활동</h2>
          <ul>
            {recentActivities.map((activity) => (
              <li key={activity.id}>
                {activity.type === "user" && "새 사용자: "}
                {activity.type === "job" && "새 채용 공고: "}
                {activity.type === "program" && "새 프로그램: "}
                {activity.name} ({activity.date})
              </li>
            ))}
          </ul>
        </div>

        <div className="quick-access">
          <h2>빠른 액세스</h2>
          <Link to="/admin/banners" className="quick-access-link">
            배너 관리
          </Link>
          <Link to="/jobs" className="quick-access-link">
            채용 정보 관리
          </Link>
          <Link to="/programs" className="quick-access-link">
            프로그램 관리
          </Link>
        </div>
      </div>

      <div className="chart-container">
        <h2>월별 신규 사용자 등록</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Dashboard