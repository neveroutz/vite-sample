import { Link } from 'react-router-dom';

function Page2() {
  return (
    <>
      <nav className="page2-nav">
        <div className="nav-brand">
          <h2>Page 2 전용 네비게이션</h2>
        </div>
        <div className="nav-links">
          <Link to="/" className="page2-nav-link">
            🏠 홈
          </Link>
          <Link to="/page1" className="page2-nav-link">
            📄 Page 1
          </Link>
          <Link to="/page2" className="page2-nav-link active">
            ⭐ Page 2
          </Link>
        </div>
      </nav>

      <div className="page page2-content">
        <h1>Page 2</h1>
        <p>이것은 두 번째 페이지입니다. (고유한 네비게이션 포함)</p>
        <div className="navigation">
          <Link to="/" className="nav-link">
            홈으로
          </Link>
          <Link to="/page1" className="nav-link">
            Page 1로 이동
          </Link>
        </div>
        <div className="content">
          <h2>Page 2 컨텐츠</h2>
          <p>여기에 Page 2의 고유한 내용을 작성할 수 있습니다.</p>
          <div className="features">
            <div className="feature-card">
              <h3>특별한 기능 A</h3>
              <p>이 기능에 대한 설명</p>
            </div>
            <div className="feature-card">
              <h3>특별한 기능 B</h3>
              <p>이 기능에 대한 설명</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page2;
