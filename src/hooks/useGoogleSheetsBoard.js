import { useState, useEffect, useCallback } from 'react';
import { createBoardSheetsUrl, transformBoardData } from '../api/googleSheetsBoardConfig';

const useGoogleSheetsBoard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPosts, setTotalPosts] = useState(0);

  // 게시글 로드 함수
  const loadPosts = useCallback(async () => {
    console.log('📋 게시글 로딩 시작...');
    setLoading(true);
    setError(null);

    try {
      const url = createBoardSheetsUrl();
      console.log('🌐 게시판 API 호출 시작');

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 게시판 API 응답 데이터:', data);

      const transformedPosts = transformBoardData(data);
      console.log('🔄 변환된 게시글 데이터:', transformedPosts);

      setPosts(transformedPosts);
      setTotalPosts(transformedPosts.length);

      console.log(`✅ 게시글 로딩 완료: ${transformedPosts.length}개`);
    } catch (err) {
      console.error('❌ 게시글 로딩 실패:', err);
      setError(err.message);
      setPosts([]);
      setTotalPosts(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // 게시글 검색 함수
  const searchPosts = useCallback(async (searchTerm) => {
    console.log('🔍 게시글 검색:', searchTerm);

    if (!searchTerm.trim()) {
      return loadPosts(); // 검색어가 없으면 전체 로드
    }

    setLoading(true);
    setError(null);

    try {
      const url = createBoardSheetsUrl();
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      const allPosts = transformBoardData(data);

      // 제목, 내용, 작성자에서 검색
      const filteredPosts = allPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );

      console.log(`🔍 검색 결과: ${filteredPosts.length}개 (전체: ${allPosts.length}개)`);

      setPosts(filteredPosts);
      setTotalPosts(allPosts.length); // 전체 게시글 수는 유지

    } catch (err) {
      console.error('❌ 게시글 검색 실패:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadPosts]);

  // 게시글 ID로 개별 조회 함수
  const getPostById = useCallback((id) => {
    console.log('🔍 게시글 ID로 조회:', id);
    const post = posts.find(post => post.id === parseInt(id));
    console.log('📄 조회된 게시글:', post);
    return post;
  }, [posts]);

  // 이전/다음 게시글 조회 함수
  const getAdjacentPosts = useCallback((currentId) => {
    const currentIndex = posts.findIndex(post => post.id === parseInt(currentId));
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

    return { prevPost, nextPost };
  }, [posts]);

  // 초기 로드
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return {
    posts,
    loading,
    error,
    totalPosts,
    loadPosts,
    searchPosts,
    getPostById,
    getAdjacentPosts
  };
};

export default useGoogleSheetsBoard;
