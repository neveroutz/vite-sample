import { Link } from 'react-router-dom';
import Tab from './Tab.jsx';

function Page1() {
  return (
    <div className="page">
      <h1>Page 1</h1>
      <p>이것은 첫 번째 페이지입니다.</p>
      <Tab />

      <div className="navigation">
        <Link to="/" className="nav-link">
          홈으로
        </Link>
        <Link to="/page2" className="nav-link">
          Page 2로 이동
        </Link>
      </div>
      <div className="content">
        <h2>Page 1 컨텐츠</h2>
        <p>여기에 Page 1의 고유한 내용을 작성할 수 있습니다.</p>
        <ul>
          <li>첫 번째 기능</li>
          <li>두 번째 기능</li>
          <li>세 번째 기능</li>
        </ul>

        <div className="page1-info">
          <h3>📋 Google Sheets 데이터</h3>
          <p>Google Sheets 사용자 목록은 <Link to="/">홈 페이지</Link>에서 확인하실 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
}

export default Page1;
