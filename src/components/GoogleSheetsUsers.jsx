import { useState, useEffect, useRef } from 'react';
import { useGoogleSheets } from '../hooks/useGoogleSheets.js';

function GoogleSheetsUsers() {
  const {
    users,
    loading,
    error,
    loadUsers,
    filterByLocation,
    searchUsers,
    totalUsers
  } = useGoogleSheets();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isComposing, setIsComposing] = useState(false); // 한글 조합 상태
  const debounceTimer = useRef(null);

  // 지역 목록 (고유값)
  const locations = [...new Set(users.map(user => user.location))].sort();

  // 디바운싱된 검색 함수
  const debouncedSearch = (value) => {
    // 기존 타이머 제거
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // 새 타이머 설정 (300ms 후 검색 실행)
    debounceTimer.current = setTimeout(() => {
      if (!isComposing) {
        searchUsers(value);
      }
    }, 300);
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // 한글 조합 중이 아닐 때만 디바운스 검색 실행
    if (!isComposing) {
      debouncedSearch(value);
    }
  };

  // 한글 조합 시작
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // 한글 조합 완료
  const handleCompositionEnd = (e) => {
    setIsComposing(false);
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // 지역 필터 핸들러
  const handleLocationFilter = (e) => {
    const location = e.target.value;
    setSelectedLocation(location);

    if (location) {
      filterByLocation(location);
    } else {
      loadUsers();
    }
    setSearchTerm(''); // 검색어 초기화
  };

  // 초기화 핸들러
  const handleReset = () => {
    setSearchTerm('');
    setSelectedLocation('');
    loadUsers();
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="google-sheets-loading">
        <p>📊 Google Sheets에서 데이터를 불러오는 중...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="google-sheets-error">
        <h3>❌ Google Sheets 연결 오류</h3>
        <p>{error}</p>

        <div className="error-help">
          <h4>🔧 해결 방법:</h4>
          <ol>
            <li>.env 파일에 API 키와 스프레드시트 ID가 설정되어 있는지 확인</li>
            <li>Google Sheets가 "링크가 있는 모든 사용자"로 공유되어 있는지 확인</li>
            <li>Google Cloud Console에서 Sheets API가 활성화되어 있는지 확인</li>
            <li>브라우저 개발자 도구 Console에서 자세한 오류 확인</li>
          </ol>
        </div>

        <div className="error-actions">
          <button onClick={loadUsers} className="retry-btn">
            다시 시도
          </button>
          <button
            onClick={() => window.open('https://console.cloud.google.com', '_blank')}
            className="help-btn"
          >
            Google Cloud Console 열기
          </button>
        </div>

        <div className="fallback-note">
          <small>💡 현재 샘플 데이터가 표시되고 있습니다.</small>
        </div>
      </div>
    );
  }

  return (
    <div className="google-sheets-users">
      <div className="users-header">
        <h2>👥 Google Sheets DB</h2>
        <p className="users-count">총 {totalUsers}명의 사용자</p>
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="users-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="이름으로 검색..."
            value={searchTerm}
            onChange={handleSearch}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            className="search-input"
          />
        </div>

        <div className="filter-box">
          <select
            value={selectedLocation}
            onChange={handleLocationFilter}
            className="location-filter"
          >
            <option value="">전체 지역</option>
            {locations.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleReset} className="reset-btn">
          초기화
        </button>

        <button onClick={loadUsers} className="refresh-btn">
          새로고침
        </button>
      </div>

      {/* 사용자 목록 */}
      {users.length === 0 ? (
        <div className="no-users">
          <p>조건에 맞는 사용자가 없습니다.</p>
        </div>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-id">#{user.id}</div>
              <div className="user-info">
                <h3 className="user-name">{user.name}</h3>
                <p className="user-location">📍 {user.location}</p>
                <p className="user-phone">📞 {user.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 데이터 소스 표시 */}
      <div className="data-source">
        <small>📊 데이터 출처: Google Sheets API</small>
      </div>
    </div>
  );
}

export default GoogleSheetsUsers;
