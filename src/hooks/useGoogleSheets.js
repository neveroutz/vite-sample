import { useState, useEffect } from 'react';
import { fetchUsers, fetchUsersByLocation, searchUsersByName } from '../api/googleSheetsApi.js';

// 기본 샘플 데이터 (환경변수가 없을 때 사용)
const sampleUsers = [
  { id: 1, name: '홍길동', location: '서울', phone: '010-0000-0000' },
  { id: 2, name: '김길동', location: '경기', phone: '010-1234-1234' },
  { id: 3, name: '이영희', location: '부산', phone: '010-2345-2345' }
];

// Google Sheets 데이터 관리 훅
export const useGoogleSheets = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 사용자 목록 로드
  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // 환경변수 체크
      const hasApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      const hasSheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;

      if (!hasApiKey || !hasSheetId) {
        console.warn('⚠️ Google Sheets 환경변수가 설정되지 않았습니다. 샘플 데이터를 사용합니다.');
        setUsers(sampleUsers);
        return;
      }

      const userData = await fetchUsers();
      setUsers(userData);
    } catch (err) {
      console.error('사용자 로드 실패:', err);
      setError(err.message);

      // 오류 발생 시 샘플 데이터로 폴백
      console.log('🔄 샘플 데이터로 폴백합니다.');
      setUsers(sampleUsers);
    } finally {
      setLoading(false);
    }
  };  // 지역별 필터링
  const filterByLocation = async (location) => {
    setLoading(true);
    setError(null);

    try {
      const filteredUsers = await fetchUsersByLocation(location);
      setUsers(filteredUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 이름으로 검색
  const searchUsers = async (searchTerm) => {
    if (!searchTerm.trim()) {
      loadUsers();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchResults = await searchUsersByName(searchTerm);
      setUsers(searchResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    loadUsers,
    filterByLocation,
    searchUsers,
    totalUsers: users.length
  };
};
