import { Link } from 'react-router-dom';
import { useState, useMemo, useRef, useEffect } from 'react';
import useGoogleSheetsBoard from './hooks/useGoogleSheetsBoard';

function BoardList() {
  const { posts, loading, error, totalPosts, searchPosts } = useGoogleSheetsBoard();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const debounceTimer = useRef(null);
  const lastSearchValue = useRef(''); // 마지막 검색어 추적

  const POSTS_PER_PAGE = 10; // 페이지당 게시글 수

  // 페이징된 게시글 계산
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return posts.slice(startIndex, endIndex);
  }, [posts, currentPage]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  // 페이지 번호 배열 생성 (1~10 형태로 표시)
  const getPageNumbers = () => {
    const pageGroup = Math.ceil(currentPage / 10); // 현재 페이지 그룹 (1~10, 11~20, ...)
    const startPage = (pageGroup - 1) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 통합 검색 함수 (간소화된 로직)
  const performSearch = (value, immediate = false) => {
    console.log('🔍 게시글 검색 요청:', { value, immediate, lastValue: lastSearchValue.current });

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
      console.log('🚀 실제 게시글 검색 실행:', value);
      lastSearchValue.current = value;
      setCurrentPage(1); // 검색 시 첫 페이지로 이동
      searchPosts(value);
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
    console.log('⌨️ 게시글 onChange 이벤트:', value);
    setSearchTerm(value);
    performSearch(value, false);
  };

  // 한글 조합 시작 (compositionstart)
  const handleCompositionStart = () => {
    console.log('🎯 게시글 한글 조합 시작');
    // 기존 타이머 취소
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  };

  // 한글 조합 완료 (compositionend)
  const handleCompositionEnd = (e) => {
    const value = e.target.value;
    console.log('✅ 게시글 한글 조합 완료:', value);
    setSearchTerm(value);
    performSearch(value, true); // 즉시 검색
  };

  // 검색 핸들러 (페이지 초기화 포함) - 기존 함수는 제거하고 위의 handleSearch 사용

  // 페이지 이동 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // 페이지 상단으로 스크롤
  };

  // 페이지 그룹 이동
  const handlePageGroupMove = (direction) => {
    const currentGroup = Math.ceil(currentPage / 10);
    let newPage;

    if (direction === 'first') {
      newPage = 1;
    } else if (direction === 'prev') {
      newPage = Math.max(1, (currentGroup - 2) * 10 + 1);
    } else if (direction === 'next') {
      newPage = Math.min(totalPages, currentGroup * 10 + 1);
    } else if (direction === 'last') {
      newPage = totalPages;
    }

    handlePageChange(newPage);
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return dateString.split(' ')[0]; // 날짜 부분만 표시
  };

  if (error) {
    return (
      <div className="page wide">
        <div className="content">
          <div className="error-message">
            ❌ 게시판 로딩 실패: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page wide">
      <div className="content">
        {/* 검색 영역 */}
        <div className="board-controls" style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="제목, 내용, 작성자로 검색..."
            value={searchTerm}
            onChange={handleSearch}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              width: '300px'
            }}
          />
          <span style={{ marginLeft: '10px', color: '#666' }}>
            총 {totalPosts}개의 게시글 {posts.length !== totalPosts && `(검색결과: ${posts.length}개)`}
            {posts.length > 0 && ` | 현재 ${currentPage}/${totalPages} 페이지`}
          </span>
        </div>

        <div className="table-wrapper">
          <table>
            <colgroup>
              <col style={{width:'8%'}} />
              <col style={{width:'auto'}} />
              <col style={{width:'8%'}} />
              <col style={{width:'8%'}} />
              <col style={{width:'10%'}} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">제목</th>
                <th scope="col">작성자</th>
                <th scope="col">조회수</th>
                <th scope="col">등록일</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                    📋 게시글을 불러오는 중...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    {searchTerm ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.'}
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td className="l">
                      <Link to={`/board/${post.id}`} title={post.content}>
                        {post.title}
                      </Link>
                    </td>
                    <td>{post.author}</td>
                    <td>{post.views}</td>
                    <td>{formatDate(post.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이징 영역 */}
        {posts.length > 0 && (
          <div className="pagination" style={{
            marginTop: '30px',
            textAlign: 'center',
            padding: '20px 0'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              {/* 처음 버튼 */}
              <button
                onClick={() => handlePageGroupMove('first')}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  backgroundColor: currentPage === 1 ? '#f5f5f5' : '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  borderRadius: '4px'
                }}
              >
                처음
              </button>

              {/* 이전 그룹 버튼 */}
              <button
                onClick={() => handlePageGroupMove('prev')}
                disabled={currentPage <= 10}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  backgroundColor: currentPage <= 10 ? '#f5f5f5' : '#fff',
                  cursor: currentPage <= 10 ? 'not-allowed' : 'pointer',
                  borderRadius: '4px'
                }}
              >
                이전
              </button>

              {/* 페이지 번호들 */}
              {getPageNumbers().map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    backgroundColor: currentPage === pageNum ? '#007bff' : '#fff',
                    color: currentPage === pageNum ? '#fff' : '#333',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    fontWeight: currentPage === pageNum ? 'bold' : 'normal'
                  }}
                >
                  {pageNum}
                </button>
              ))}

              {/* 다음 그룹 버튼 */}
              <button
                onClick={() => handlePageGroupMove('next')}
                disabled={Math.ceil(currentPage / 10) >= Math.ceil(totalPages / 10)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  backgroundColor: Math.ceil(currentPage / 10) >= Math.ceil(totalPages / 10) ? '#f5f5f5' : '#fff',
                  cursor: Math.ceil(currentPage / 10) >= Math.ceil(totalPages / 10) ? 'not-allowed' : 'pointer',
                  borderRadius: '4px'
                }}
              >
                다음
              </button>

              {/* 마지막 버튼 */}
              <button
                onClick={() => handlePageGroupMove('last')}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  backgroundColor: currentPage === totalPages ? '#f5f5f5' : '#fff',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  borderRadius: '4px'
                }}
              >
                마지막
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardList;
