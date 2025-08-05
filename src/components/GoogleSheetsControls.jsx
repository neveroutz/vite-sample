import { useState, useRef, useMemo } from 'react';

function GoogleSheetsControls({ 
  users, 
  onSearch, 
  onLocationFilter, 
  onReset, 
  onRefresh 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const debounceTimer = useRef(null);

  // 지역 목록 (고유값) - useMemo로 최적화
  const locations = useMemo(() => {
    return [...new Set(users.map(user => user.location))].filter(Boolean).sort();
  }, [users]);

  // 디바운싱된 검색 함수
  const debouncedSearch = (value) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (!isComposing) {
        onSearch(value);
      }
    }, 300);
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

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
    onLocationFilter(location);
    setSearchTerm(''); // 검색어 초기화
  };

  // 초기화 핸들러
  const handleReset = () => {
    setSearchTerm('');
    setSelectedLocation('');
    onReset();
  };

  return (
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

      <button onClick={onRefresh} className="refresh-btn">
        새로고침
      </button>
    </div>
  );
}

export default GoogleSheetsControls;
