import { Outlet, Route } from 'react-router-dom';
import CounselingList from '../pages/counseling/CounselingList';
import CounselBoard from '../pages/counseling/online/CounselBoard';
import CounselWriteForm from '../pages/counseling/online/CounselWriteForm';
import CounselDetailView from '../pages/counseling/online/CounselDetailView';
import CounselAnswerForm from '../pages/counseling/online/CounselAnswerForm';
import OfflineCounsel from '../pages/counseling/offline/OfflineCounsel';
import ScheduleManage from '../pages/counseling/offline/ScheduleManage';
import CounselorList from '../pages/counseling/realTime/CounselorList';
import ChatRoom from '../pages/counseling/realTime/ChatRoom';
import CounselorDashboard from '../pages/counseling/realTime/CounselorDashboard';



const CounselingRouter = (
  <Route path="/counsel" element={<Outlet/>}>
    <Route index element={<CounselingList/>}/>
    <Route path="online" element={<CounselBoard/>}/>
    <Route path="online/write" element={<CounselWriteForm/>}/>
    <Route path="online/edit/:id" element={<CounselWriteForm />} />
    <Route path="online/detail/:id" element={<CounselDetailView />} />
    <Route path="online/answer/:id" element={<CounselAnswerForm />} />
    <Route path="online/answer/edit/:id" element={<CounselAnswerForm />} />
    <Route path="offline" element={<OfflineCounsel />} />
    <Route path="offline/schedule/manage" element={<ScheduleManage />} />
    <Route path="realtime" element={<CounselorList />} />
    <Route path="realtime/dashboard" element={<CounselorDashboard />} />
    <Route path="realtime/chat/:roomId" element={<ChatRoom />} />
  </Route>
);

export default CounselingRouter;