# 📊 Google Sheets API 설정 가이드

## 1단계: Google Sheets 생성 및 데이터 입력

### 1.1 새 스프레드시트 생성
1. [Google Sheets](https://sheets.google.com) 접속
2. 새 스프레드시트 생성
3. 제목을 원하는 이름으로 변경 (예: "vite-sample-users")
4. **🔥 중요**: 화면 **하단**에 있는 시트 탭 "시트1"을 우클릭 → "이름 바꾸기" → `sample-users-database`로 변경

![시트 탭 위치](하단에 "시트1"이라고 표시된 탭을 클릭하세요)

### 1.2 데이터 입력 구조
**필수 열 구조** (정확히 이 순서로 입력하세요):
```
A1: id    B1: name         C1: location    D1: phone
A2: 1     B2: 홍길동1      C2: 서울        D2: 010-1234-5678
A3: 2     B3: 김철수       C3: 부산        D3: 010-2345-6789
A4: 3     B4: 이영희       C4: 대구        D4: 010-3456-7890
A5: 4     B5: 박민수       C5: 인천        D5: 010-4567-8901
A6: 5     B6: 최지은       C6: 광주        D6: 010-5678-9012
```
... (50개 행까지)
```

### 1.3 시트 탭 이름 확인
- **화면 하단**에 있는 시트 탭 이름이 `sample-users-database`인지 확인
- 기본값은 "시트1"이므로 반드시 변경 필요
- 시트 탭 우클릭 → "이름 바꾸기"로 변경 가능

## 2단계: Google API 설정

### 2.1 Google Cloud Console 설정
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스 > 라이브러리** 클릭
4. 검색창에 "Google Sheets API" 입력
5. **Google Sheets API** 클릭 후 **"사용 설정"** 버튼 클릭
6. ✅ 활성화 완료 확인

### 2.2 API 키 생성
1. **API 및 서비스 > 사용자 인증 정보** 클릭
2. **"+ 사용자 인증 정보 만들기"** > **"API 키"** 선택
3. 생성된 API 키 복사 (나중에 .env 파일에 사용)

### 2.3 API 키 제한 설정 (권장)
1. 생성된 API 키 옆의 **편집 아이콘** 클릭
2. **"API 제한사항"** 섹션에서 **"키 제한"** 선택
3. 이제 **"Google Sheets API"**가 목록에 나타날 것입니다 ✅
4. **"Google Sheets API"** 체크박스 선택
5. **저장** 클릭

🚨 **중요**: 2.1단계에서 Google Sheets API를 먼저 활성화해야 2.3단계에서 선택할 수 있습니다!

## 3단계: 스프레드시트 공개 설정

### 3.1 스프레드시트 공유
1. Google Sheets에서 우측 상단 "공유" 버튼 클릭
2. "링크가 있는 모든 사용자" 선택
3. 권한: "뷰어" 선택
4. 완료

### 3.2 스프레드시트 ID 확인
- URL에서 스프레드시트 ID 복사
- 예시: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
- `[SPREADSHEET_ID]` 부분이 필요한 ID

## 4단계: 환경변수 설정

### 4.1 .env 파일 수정
```bash
# Google Sheets API 설정
VITE_GOOGLE_API_KEY=여기에_API_키_입력
VITE_GOOGLE_SHEET_ID=여기에_스프레드시트_ID_입력
VITE_GOOGLE_SHEET_NAME=sample-users-database
```

### 4.2 .env 파일 보안
- .env 파일을 .gitignore에 추가되어 있는지 확인
- API 키가 공개되지 않도록 주의

## 5단계: 개발 서버 실행

```bash
npm run dev
```

## 6단계: 확인 사항

### 6.1 Page 1 페이지 접속
- http://localhost:5173/page1 접속
- Google Sheets 사용자 목록이 표시되는지 확인

### 6.2 기능 테스트
- ✅ 사용자 목록 로드
- ✅ 이름으로 검색
- ✅ 지역별 필터링
- ✅ 새로고침 기능

## 🚨 문제 해결

### API 오류 시
1. API 키가 올바른지 확인
2. Google Sheets API가 활성화되어 있는지 확인
3. 스프레드시트가 공개되어 있는지 확인

### 데이터 로드 실패 시
1. 스프레드시트 ID가 정확한지 확인
2. 시트 탭 이름이 `sample-users-database`인지 확인 (하단 탭 이름)
3. 개발자 도구 Console에서 오류 메시지 확인

### API 키 제한 설정에서 Google Sheets API가 안 보일 때
1. **먼저 Google Sheets API가 활성화되어 있는지 확인**
2. API 및 서비스 > 라이브러리에서 Google Sheets API 검색
3. "사용 설정" 버튼을 클릭하여 활성화
4. 활성화 후 API 키 제한 설정에서 선택 가능

### CORS 오류 시
- Google Sheets API는 CORS를 지원하므로 일반적으로 문제없음
- 브라우저 캐시 클리어 후 재시도

## 📝 추가 기능 구현 가능

1. **데이터 추가**: POST 요청으로 새 사용자 추가
2. **데이터 수정**: PUT 요청으로 기존 사용자 정보 수정
3. **데이터 삭제**: DELETE 요청으로 사용자 삭제
4. **실시간 동기화**: WebSocket 또는 Polling으로 실시간 업데이트
5. **인증 시스템**: OAuth 2.0으로 사용자별 권한 관리

## 🎯 성공 기준

- ✅ Google Sheets 데이터가 React 앱에 표시됨
- ✅ 검색 및 필터링 기능 동작
- ✅ 에러 처리 및 로딩 상태 표시
- ✅ 반응형 디자인 적용
