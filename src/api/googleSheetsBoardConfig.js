// Google Sheets Board API 설정
export const GOOGLE_SHEETS_BOARD_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  sheetId: import.meta.env.VITE_GOOGLE_SHEET_ID,
  sheetName: 'sample-bbs', // 게시판 시트명
  baseUrl: 'https://sheets.googleapis.com/v4/spreadsheets'
};

// 환경변수 검증 함수
export const validateBoardConfig = () => {
  const missing = [];

  if (!GOOGLE_SHEETS_BOARD_CONFIG.apiKey) {
    missing.push('VITE_GOOGLE_API_KEY');
  }
  if (!GOOGLE_SHEETS_BOARD_CONFIG.sheetId) {
    missing.push('VITE_GOOGLE_SHEET_ID');
  }

  if (missing.length > 0) {
    throw new Error(`환경변수가 설정되지 않았습니다: ${missing.join(', ')}`);
  }

  // 🔒 개발 환경에서만 상세 로그 출력
  if (import.meta.env.DEV) {
    console.log('🔧 Google Sheets Board 설정:', {
      sheetId: GOOGLE_SHEETS_BOARD_CONFIG.sheetId,
      sheetName: GOOGLE_SHEETS_BOARD_CONFIG.sheetName,
      hasApiKey: !!GOOGLE_SHEETS_BOARD_CONFIG.apiKey,
      apiKeyLength: GOOGLE_SHEETS_BOARD_CONFIG.apiKey ? GOOGLE_SHEETS_BOARD_CONFIG.apiKey.length : 0
    });
  }
};

// API 엔드포인트 생성 함수 (게시판용)
export const createBoardSheetsUrl = (range = 'A:F') => {
  validateBoardConfig(); // 설정 검증

  const { baseUrl, sheetId, sheetName, apiKey } = GOOGLE_SHEETS_BOARD_CONFIG;
  const url = `${baseUrl}/${sheetId}/values/${sheetName}!${range}?key=${apiKey}`;

  // 🔒 개발 환경에서만 마스킹된 URL 로그 출력
  if (import.meta.env.DEV) {
    const maskedUrl = url.replace(apiKey, `***${apiKey.slice(-4)}`);
    console.log('📡 Board API URL 생성:', maskedUrl);
  }

  return url;
};

// 게시판 데이터 변환 함수
export const transformBoardData = (response) => {
  if (!response.values || response.values.length === 0) {
    return [];
  }

  const [headers, ...rows] = response.values;
  
  // 🔍 디버깅: 원본 데이터 확인
  console.log('🔍 Google Sheets 원본 데이터:');
  console.log('헤더:', headers);
  console.log('첫 번째 행 데이터:', rows[0]);
  if (rows[0] && rows[0][2]) {
    console.log('첫 번째 행 내용 컬럼 (인덱스 2):', rows[0][2]);
    console.log('내용 길이:', rows[0][2].length);
  }

  return rows.map((row, index) => ({
    id: parseInt(row[0]) || index + 1,
    title: row[1] || '',
    content: row[2] || '',
    author: row[3] || '',
    views: parseInt(row[4]) || 0,
    createdAt: row[5] || ''
  }));
};
