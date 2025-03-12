import React from 'react';
import './App.css'
import { Routes, Route } from 'react-router-dom';

// [ login ]
import User from './component/login/security/pages/User';
import Login from './component/login/security/pages/Login';
import Join from './component/login/security/pages/Join';
import Find from './component/login/security/pages/Find';
import KakaoLogin from './component/login/security/components/kakao/KakaoLogin';
import KakaoRedirect from './component/login/security/components/kakao/KakaoRedirect';

// [ mypage ]
import Counsel from './component/mypage/counsel/Counsel';
import Edit from './component/mypage/edit/Edit';
import Program from './component/mypage/program/Program';
import Secession from './component/mypage/secession/Secession';
import Employment from './component/mypage/employment/Employment';

// [ main ]
import Header from './component/mainpage/components/Header'
import Footer from './component/mainpage/components/Footer';
import MainPage from './component/mainpage/mainpage/MainPage';
import ProtectedRoute from "./component/mainpage/components/ProtectedRoute"
// [ main - admin ]
import AdminLayout from "./component/mainpage/pages/Admin/AdminLayout"
import Dashboard from './component/mainpage/pages/Admin/Dashboard';
import UserManagement from "./component/mainpage/pages/Admin/UserManagement"
// [ main - about ]
import AboutLayout from "./component/mainpage/pages/About/AboutLayout"
import DepartmentIntro from "./component/mainpage/pages/About/DepartmentIntro"
import CareerRoadmap from "./component/mainpage/pages/About/CareerRoadmap"
import CareerProgram from "./component/mainpage/pages/About/CareerProgram"

// [ board ]
import CommunityRouter from './component/board/routes/CommunityRouter';
import CounselingRouter from './component/board/routes/CounselingRouter';

// [ recruitment ]
import MainRecruitment from './component/recruitment/MainPage/MainRecruitment';
import BbsDetail from './component/recruitment/RecruitmentBoard/BbsDetail';
import CampusBoard from './component/recruitment/RecruitmentBoard/CampusBoard';
import JobPostingBoard from './component/recruitment/RecruitmentBoard/JobPostingBoard';
import SuggestBoard from './component/recruitment/RecruitmentBoard/SuggestBoard';
import WorkBoard from './component/recruitment/RecruitmentBoard/WorkBoard';
import SuggestWrite from './component/recruitment/write/SuggestWrite';
import CampusWrite from './component/recruitment/write/CampusWrite';
import WorkBoardDetail from './component/recruitment/RecruitmentBoard/board/WorkBoardDetail';

import Board from "./component/recruitment/RecruitmentBoard/board/Board";
import BoardDetail from "./component/recruitment/RecruitmentBoard/board/BoardDetail";
import BoardEdit from './component/recruitment/RecruitmentBoard/board/BoardEdit';
import BoardWrite from "./component/recruitment/RecruitmentBoard/board/BoardWrite";
import CampusBoardDetail from './component/recruitment/RecruitmentBoard/board/CampusBoardDetail';
import CampusBoardEdit from './component/recruitment/RecruitmentBoard/board/CampusBoardEdit';
import SuggestBoardDetail from './component/recruitment/RecruitmentBoard/board/SuggestBoardDetail';
import SuggestBoardEdit from './component/recruitment/RecruitmentBoard/board/SuggestBoardEdit';

// [ job ]
import AdminPage from "./component/job/AdminPage"; 
import JobProgram from "./component/job/JobProgram";
import JobDetail from "./component/job/JobDetail";
import ApplicationsList from "./component/job/ApplicationsList";

function App() {



  return (
      <div className="app-container">
        {/* 헤더의 높이만큼 여백을 확보 */}
        <div style={{ height: '135px' }}></div>
        <Header />
        <main>
          <Routes>
            {/* login */}
            <Route path="/login" element={<Login />} />
            <Route path="/find/:id" element={<Find />} />
            <Route path="/join" element={<Join />} />
            <Route path="/user" element={<User />} />
            <Route path="/kakao-login" element={<KakaoLogin />} />
            <Route path="/oauth/kakao/callback" element={<KakaoRedirect />} />

            {/* mypage */}
            <Route path='/myCounsel' element={<Counsel />} />
            <Route path='/myEdit' element={<Edit />} />
            <Route path='/myProgram' element={<Program />} />
            <Route path='/mySecession' element={<Secession />} />
            <Route path='/myEmployment' element={<Employment />} />

            {/* job */}
            <Route path="/programs" element={<JobProgram />} /> {/* JobProgram 내에 ProgramView 포함 */}
            <Route path="/adminPage" element={<AdminPage />} /> {/* 관리자 페이지 */}
            <Route path="/programs/:programId" element={<JobDetail />} /> {/* JobDetail 컴포넌트 경로 */}
            <Route path="/programs/job" element={<JobProgram />} /> {/* 취업 프로그램 */}
            <Route path="/programs/startup" element={<JobProgram />} /> {/* 창업 프로그램 */}
            <Route path="/programs/career" element={<JobProgram />} /> {/* 진로 프로그램 */}
            <Route path="/programs/applicationslist" element={<ApplicationsList />} />


            {/* recruitment */}
            <Route path='/mainRecruitment' element={<MainRecruitment />} />
            <Route path='/suggestBoard' element={<SuggestBoard />} />
            <Route path='/suggest_board/suggestWrite' element={<SuggestWrite />} />
            <Route path='/campusBoard' element={<CampusBoard />} />
            <Route path='/campus_board/campusWrite' element={<CampusWrite />} />
            <Route path='/workBoard' element={<WorkBoard />} />

            <Route path='/jobPostingBoard' element={<JobPostingBoard />} />
            <Route path='/bbsDetail' element={<BbsDetail />} />

            <Route path="/board" element={<Board />} />
            <Route path="/board/write" element={<BoardWrite />} />
            <Route path="/board/detail/:boardId" element={<BoardDetail />} />
            <Route path="/board/edit/:boardId" element={<BoardEdit />} />
            <Route path="/campus_board/CampusBoardDetail/:boardId" element={<CampusBoardDetail />} />
            <Route path="/campus_board/CampusBoardEdit/:boardId" element={<CampusBoardEdit />} />
            <Route path="/suggest_board/SuggestBoardDetail/:boardId" element={<SuggestBoardDetail />} />
            <Route path="/suggest_board/SuggestBoardEdit/:boardId" element={<SuggestBoardEdit />}  />
            <Route path="/work_board/WorkBoardDetail/:id" element={<WorkBoardDetail />} />


             {/* main */}
             <Route path="/" element={<MainPage />} />
            
            {/* About 페이지 라우팅 수정 */}
            <Route path="/about" element={<AboutLayout />}>
              <Route path="department-intro" element={<DepartmentIntro />} />
              <Route path="career-roadmap" element={<CareerRoadmap />} />
              <Route path="career-program" element={<CareerProgram />} />
            </Route>
            <Route path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
            
            {/* board */}
            {CommunityRouter}
            {CounselingRouter}

          </Routes>
        </main>
        <Footer />
      </div>
  );
}

export default App;
