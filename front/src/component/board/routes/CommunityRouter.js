import { Route, Outlet, Navigate } from 'react-router-dom';
import Board from '../pages/community/Board';
import PostWriteForm from '../pages/community/PostWriteForm';
import PostDetailView from '../pages/community/PostDetailView';

const CommunityRouter = (
  <Route path="/community" element={<Outlet/>}>
    <Route index element={<Board type="notice"/>}/>
    <Route path="notice" element={<Board type="notice" />} />
    <Route path="archive" element={<Board type="archive" />} />
    <Route path="faq" element={<Board type="faq" />} />
    <Route path=":type/write" element={<PostWriteForm />} />
    <Route path=":type/edit/:id" element={<PostWriteForm />} />
    <Route path=":type/detail/:id" element={<PostDetailView />} />
    {/* 주소변경 */}
    <Route path="상담" element={<Navigate to="/counsel" replace/>} />
  </Route>
);

export default CommunityRouter;