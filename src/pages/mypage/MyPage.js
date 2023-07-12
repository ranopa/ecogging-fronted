import { Route, Routes } from "react-router";
import Temp from "../../components/main/Temp";
import MyPageTab from "../../components/mypage/MyPageTab";
import '../../styles/mypage/MyPage.css';
import MyPageReview from "../../components/mypage/MyPageReview";
import MyPageShare from "../../components/mypage/MyPageShare";
import MyPageRecommend from "../../components/mypage/MyPageRecommend";
import MyPageForumScrap from "../../components/mypage/MyPageForumScrap";
import MyPageMessages from "../../components/mypage/MyPageMessages";

export default function MyPage() {
  return (
    <div className="MyPage">
      <MyPageTab />
      <div className="MyPageContent">
        <Routes>
          <Route path="/temp2" element={<Temp />}></Route>
          <Route path="/messages" element={<MyPageMessages />}></Route>

          {/* 플로깅 */}
          <Route path="/reviews" element={<MyPageReview />}></Route>

          {/* 나의 커뮤니티 */}
          <Route path="/shares" element={<MyPageShare />}></Route>
          <Route path="/recommendations" element={<MyPageRecommend />}></Route>
          <Route path="/forumscraps" element={<MyPageForumScrap />}></Route>
        </Routes>
      </div>

    </div>
  );
}