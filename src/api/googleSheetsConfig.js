// Google Sheets API 설정
export const GOOGLE_SHEETS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  sheetId: import.meta.env.VITE_GOOGLE_SHEET_ID,
  sheetName: import.meta.env.VITE_GOOGLE_SHEET_NAME || 'sample-users-database',
  baseUrl: 'https://sheets.googleapis.com/v4/spreadsheets'
};

// 환경변수 검증 함수
export const validateConfig = () => {
  const missing = [];

  if (!GOOGLE_SHEETS_CONFIG.apiKey) {
    missing.push('VITE_GOOGLE_API_KEY');
  }
  if (!GOOGLE_SHEETS_CONFIG.sheetId) {
    missing.push('VITE_GOOGLE_SHEET_ID');
  }

  if (missing.length > 0) {
    throw new Error(`환경변수가 설정되지 않았습니다: ${missing.join(', ')}`);
  }

  console.log('🔧 Google Sheets 설정:', {
    sheetId: GOOGLE_SHEETS_CONFIG.sheetId,
    sheetName: GOOGLE_SHEETS_CONFIG.sheetName,
    hasApiKey: !!GOOGLE_SHEETS_CONFIG.apiKey
  });
};

// API 엔드포인트 생성 함수
export const createSheetsUrl = (range = 'A:D') => {
  validateConfig(); // 설정 검증

  const { baseUrl, sheetId, sheetName } = GOOGLE_SHEETS_CONFIG;
  const url = `${baseUrl}/${sheetId}/values/${sheetName}!${range}?key=${GOOGLE_SHEETS_CONFIG.apiKey}`;

  console.log('📡 API URL 생성:', url.replace(GOOGLE_SHEETS_CONFIG.apiKey, 'API_KEY_HIDDEN'));
  return url;
};

// 데이터 변환 함수
export const transformSheetData = (response) => {
  if (!response.values || response.values.length === 0) {
    return [];
  }

  const [headers, ...rows] = response.values;

  return rows.map((row, index) => ({
    id: parseInt(row[0]) || index + 1,
    name: row[1] || '',
    location: row[2] || '',
    phone: row[3] || ''
  }));
};
