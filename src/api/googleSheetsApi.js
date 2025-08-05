import { createSheetsUrl, transformSheetData } from './googleSheetsConfig.js';

// 사용자 목록 조회
export const fetchUsers = async () => {
  try {
    const url = createSheetsUrl('A:D'); // A~D 컬럼 (id, name, location, phone)

    console.log('🚀 API 요청 시작...');
    const response = await fetch(url);

    console.log('📊 API 응답 상태:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API 오류 응답:', errorText);

      if (response.status === 403) {
        throw new Error('API 키가 유효하지 않거나 권한이 없습니다. Google Cloud Console에서 설정을 확인해주세요.');
      } else if (response.status === 404) {
        throw new Error('스프레드시트를 찾을 수 없습니다. 스프레드시트 ID와 공유 설정을 확인해주세요.');
      } else {
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log('📥 받은 데이터:', data);

    const users = transformSheetData(data);

    console.log('✅ 사용자 데이터 조회 성공:', users.length, '명');
    return users;

  } catch (error) {
    console.error('❌ 사용자 데이터 조회 실패:', error);

    // 네트워크 오류인 경우
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('네트워크 연결을 확인해주세요.');
    }

    // 기타 오류
    throw error;
  }
};// 특정 사용자 조회 (ID로)
export const fetchUserById = async (userId) => {
  try {
    const users = await fetchUsers();
    const user = users.find(user => user.id === parseInt(userId));

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return user;

  } catch (error) {
    console.error('❌ 사용자 조회 실패:', error);
    throw error;
  }
};

// 지역별 사용자 필터링
export const fetchUsersByLocation = async (location) => {
  try {
    const users = await fetchUsers();
    const filteredUsers = users.filter(user =>
      user.location.includes(location)
    );

    console.log(`✅ ${location} 지역 사용자:`, filteredUsers.length, '명');
    return filteredUsers;

  } catch (error) {
    console.error('❌ 지역별 사용자 조회 실패:', error);
    throw error;
  }
};

// 사용자 검색 (이름으로)
export const searchUsersByName = async (searchTerm) => {
  try {
    const users = await fetchUsers();
    const searchResults = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(`✅ "${searchTerm}" 검색 결과:`, searchResults.length, '명');
    return searchResults;

  } catch (error) {
    console.error('❌ 사용자 검색 실패:', error);
    throw error;
  }
};
