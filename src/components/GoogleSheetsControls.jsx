import { useState, useRef, useMemo, useEffect } from 'react';

function GoogleSheetsControls({
  users,
  onSearch,
  onLocationFilter,
  onReset
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const debounceTimer = useRef(null);
  const lastSearchValue = useRef(''); // 마지막 검색어 추적

  // 지역 목록 (고유값) - useMemo로 최적화
  const locations = useMemo(() => {
    return [...new Set(users.map(user => user.location))].filter(Boolean).sort();
  }, [users]);

  // 통합 검색 함수 (간소화된 로직)
  const performSearch = (value, immediate = false) => {
    console.log('🔍 검색 요청:', { value, immediate, lastValue: lastSearchValue.current });
    
    // 중복 검색 방지
    if (value === lastSearchValue.current) {
      console.log('⏭️ 중복 검색 방지');
      return;
    }

    // 기존 타이머 제거
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const executeSearch = () => {
      console.log('🚀 실제 검색 실행:', value);
      lastSearchValue.current = value;
      onSearch(value);
    };

    if (immediate) {
      executeSearch();
    } else {
      // 적응적 디바운싱: 삭제 시 빠르게, 입력 시 적당히
      const delay = value.length < searchTerm.length ? 150 : 300;
      debounceTimer.current = setTimeout(executeSearch, delay);
    }
  };

  // 검색 핸들러 (onChange)
  const handleSearch = (e) => {
    const value = e.target.value;
    console.log('⌨️ onChange 이벤트:', value);
    setSearchTerm(value);
    performSearch(value, false);
  };

  // 한글 조합 시작 (compositionstart)
  const handleCompositionStart = () => {
    console.log('🎯 한글 조합 시작');
    // 기존 타이머 취소
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  };

  // 한글 조합 완료 (compositionend)
  const handleCompositionEnd = (e) => {
    const value = e.target.value;
    console.log('✅ 한글 조합 완료:', value);
    setSearchTerm(value);
    performSearch(value, true); // 즉시 검색
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

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

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
    </div>
  );
}

export default GoogleSheetsControls;
