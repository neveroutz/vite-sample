import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { getPageConfig } from './config/layoutConfig.js';
import Header from './components/Header.jsx';
import SvgIcon from './components/SvgIcon.jsx';
import GoogleSheetsUsers from './components/GoogleSheetsUsers.jsx';
import GoogleSheetsControls from './components/GoogleSheetsControls.jsx';
import { useGoogleSheets } from './hooks/useGoogleSheets.js';
import Page1 from './Page1.jsx';
import Page2 from './Page2.jsx';
import BoardList from './BoardList.jsx';
import Tab from './Tab.jsx';


function App() {
  // GitHub Pages 배포를 위한 basename 설정
  const basename = process.env.NODE_ENV === 'production' ? '/vite-sample' : '';

  return (
    <ThemeProvider>
      <Router basename={basename}>
        <Layout />
      </Router>
    </ThemeProvider>
  );
}

function Layout() {
  const location = useLocation();
  const config = getPageConfig(location.pathname);

  return (
    <div className={`app ${config.layoutClass}`}>
      <Header />

      {config.showMainNav && (
        <nav className="main-nav">
          <Link to="/" className="nav-link">
            홈
          </Link>
          <Link to="/page1" className="nav-link">
            Page 1
          </Link>
          <Link to="/page2" className="nav-link">
            Page 2
          </Link>
          <Link to="/BoardList" className="nav-link">
            게시판
          </Link>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/BoardList" element={<BoardList />} />
      </Routes>

      {config.hasFooter && (
        <footer className="main-footer">
          <p>© 2025 Vite Sample App</p>
        </footer>
      )}
    </div>
  );
}

function HomePage() {
  const [count, setCount] = useState(0);

  // Google Sheets hook을 HomePage에서 관리
  const {
    users,
    loading,
    error,
    loadUsers,
    filterByLocation,
    searchUsers,
    totalUsers
  } = useGoogleSheets();

  // 컨트롤 핸들러들
  const handleSearch = (searchTerm) => {
    console.log('🎯 App.jsx에서 검색 요청 받음:', searchTerm); // 디버그 로그
    searchUsers(searchTerm);
  };

  const handleLocationFilter = (location) => {
    if (location) {
      filterByLocation(location);
    } else {
      loadUsers();
    }
  };

  const handleReset = () => {
    loadUsers();
  };
  // Google Sheets 컴포넌트로 대체되어 더 이상 필요하지 않음
  // const [displayedUsers, setDisplayedUsers] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage] = useState(10);
  // const [newlyAddedItems, setNewlyAddedItems] = useState(new Set());

  // const totalUsers = sampleData.users.length;
  // const totalPages = Math.ceil(totalUsers / itemsPerPage);

  // Google Sheets 컴포넌트로 대체되어 더 이상 필요하지 않음
  // useEffect(() => {
  //   // 초기 로드 시 첫 10개 항목 표시
  //   const initialUsers = sampleData.users.slice(0, itemsPerPage);
  //   setDisplayedUsers(initialUsers);
  //   // 초기 로드된 아이템들도 애니메이션 적용
  //   const initialIds = new Set(initialUsers.map(user => user.id));
  //   setNewlyAddedItems(initialIds);
  //   // 초기 애니메이션 후 상태 클리어
  //   setTimeout(() => {
  //     setNewlyAddedItems(new Set());
  //   }, 1200); // 애니메이션 시간 연장에 맞춰 조정
  // }, [itemsPerPage]);

  // const loadMoreUsers = () => {
  //   if (currentPage < totalPages) {
  //     const nextPage = currentPage + 1;
  //     const startIndex = 0;
  //     const endIndex = nextPage * itemsPerPage;
  //     const newUsers = sampleData.users.slice(startIndex, endIndex);
  //     // 새로 추가된 아이템들의 ID 찾기
  //     const previousUserIds = new Set(displayedUsers.map(user => user.id));
  //     const newlyAdded = new Set(
  //       newUsers.filter(user => !previousUserIds.has(user.id)).map(user => user.id)
  //     );
  //     setDisplayedUsers(newUsers);
  //     setCurrentPage(nextPage);
  //     setNewlyAddedItems(newlyAdded);
  //     // 애니메이션 완료 후 상태 클리어
  //     setTimeout(() => {
  //       setNewlyAddedItems(new Set());
  //     }, 1200); // 애니메이션 시간 연장에 맞춰 조정
  //   }
  // };

  return (
    <>
      <Tab />
      <div className="card">
        <p className="card-count">{count}</p>
        <div>
          <button onClick={() => setCount(count => count + 1)}>button</button>
          <button
            onClick={() => setCount(count => (count > 0 ? count - 1 : 0))}
            disabled={count === 0}
          >
            button
          </button>
        </div>
      </div>

      {/* Google Sheets 사용자 목록 */}
      <div className="google-sheets-section">
        {/* 고정된 컨트롤 영역 - 리렌더링되지 않음 */}
        <GoogleSheetsControls
          users={users}
          onSearch={handleSearch}
          onLocationFilter={handleLocationFilter}
          onReset={handleReset}
        />

        {/* 데이터만 렌더링하는 영역 */}
        {loading ? (
          <div className="google-sheets-loading">
            <p>📊 Google Sheets에서 데이터를 불러오는 중...</p>
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="google-sheets-error">
            <h3>❌ Google Sheets 연결 오류</h3>
            <p>{error}</p>
            <button onClick={handleReset} className="retry-btn">
              다시 시도
            </button>
          </div>
        ) : (
          <GoogleSheetsUsers users={users} totalUsers={totalUsers} />
        )}
      </div>

      {/* SVG Sprite 예제 테이블 */}
      <div className="svg-showcase">
        <h2 style={{ margin: 0, padding: 0, fontSize: '22px', color: '#000', display:'flex', alignItems:'center',justifyContent:'center' }}>
          SVG Sprite 아이콘 쇼케이스
        </h2>
        <div className="icon-grid">
          <div className="icon-item">
            <div className="icon-preview">
              <SvgIcon name="react" size={48} />
            </div>
            <div className="icon-info">
              <h3>React</h3>
              <code>icon-react</code>
            </div>
          </div>

          <div className="icon-item">
            <div className="icon-preview">
              <SvgIcon name="vite" size={48} />
            </div>
            <div className="icon-info">
              <h3>Vite</h3>
              <code>icon-vite</code>
            </div>
          </div>

          <div className="icon-item">
            <div className="icon-preview">
              <SvgIcon name="arrow-up" size={48} />
            </div>
            <div className="icon-info">
              <h3>Arrow Up</h3>
              <code>icon-arrow-up</code>
            </div>
          </div>

          <div className="icon-item">
            <div className="icon-preview">
              <SvgIcon name="arrow-down" size={48} />
            </div>
            <div className="icon-info">
              <h3>Arrow Down</h3>
              <code>icon-arrow-down</code>
            </div>
          </div>

          <div className="icon-item">
            <div className="icon-preview">
              <SvgIcon name="arrow-left" size={48} />
            </div>
            <div className="icon-info">
              <h3>Arrow Left</h3>
              <code>icon-arrow-left</code>
            </div>
          </div>

          <div className="icon-item">
            <div className="icon-preview">
              <SvgIcon name="arrow-right" size={48} />
            </div>
            <div className="icon-info">
              <h3>Arrow Right</h3>
              <code>icon-arrow-right</code>
            </div>
          </div>

          <div className="icon-item">
            <div className="icon-preview">
              <SvgIcon name="bookmark" size={48} />
            </div>
            <div className="icon-info">
              <h3>Bookmark</h3>
              <code>icon-bookmark</code>
            </div>
          </div>

          <div className="icon-item">
            <div className="icon-preview">
              <SvgIcon name="award" size={48} />
            </div>
            <div className="icon-info">
              <h3>Award</h3>
              <code>icon-award</code>
            </div>
          </div>

          <div className="icon-item">
            <div className="icon-preview">
              <SvgIcon name="bank" size={48} />
            </div>
            <div className="icon-info">
              <h3>Bank</h3>
              <code>icon-bank</code>
            </div>
          </div>

          <div className="icon-item">
            <div className="icon-preview">
              <SvgIcon name="audio" size={48} />
            </div>
            <div className="icon-info">
              <h3>Audio</h3>
              <code>icon-audio</code>
            </div>
          </div>

          <div className="icon-item">
            <div className="icon-preview">
              <SvgIcon name="archive" size={48} />
            </div>
            <div className="icon-info">
              <h3>Archive</h3>
              <code>icon-archive</code>
            </div>
          </div>

          <div className="icon-item">
            <div className="icon-preview">
              <SvgIcon name="chef" size={48} />
            </div>
            <div className="icon-info">
              <h3>Archive</h3>
              <code>icon-archive</code>
            </div>
          </div>
        </div>
      </div>

      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      <div className="page-links">
        <Link to="/page1" className="page-link">
          Page 1으로 이동
        </Link>
        <Link to="/page2" className="page-link">
          Page 2로 이동
        </Link>
      </div>
    </>
  );
}

export default App;
