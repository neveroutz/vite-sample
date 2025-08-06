const fs = require('fs');

const csvHeader = 'ID,제목,내용,작성자,조회수,등록일\n';

const topics = [
  {
    title: "웹팩 설정 완전 정복",
    content: "복잡한 웹팩 설정을 이해하고 프로젝트에 맞는 최적화된 빌드 환경을 구성해봅시다.\n\n기본 설정:\nmodule.exports = {\n  entry: './src/index.js',\n  output: {\n    path: __dirname + '/dist',\n    filename: 'bundle.js'\n  },\n  module: {\n    rules: [\n      {\n        test: /\\.js$/,\n        exclude: /node_modules/,\n        use: 'babel-loader'\n      },\n      {\n        test: /\\.css$/,\n        use: ['style-loader', 'css-loader']\n      }\n    ]\n  }\n};\n\n최적화 설정:\n- 코드 스플리팅\n- 트리 셰이킹\n- 미니파이케이션\n- 소스맵 생성\n\n개발 환경과 프로덕션 환경을 분리하여 효율적인 빌드 파이프라인을 구축할 수 있습니다.",
    author: "웹팩왕",
    views: 98,
    date: "2025-01-25"
  },
  {
    title: "Docker 컨테이너 기초",
    content: "개발 환경 통일을 위한 Docker 컨테이너 기초 개념과 실제 활용 사례를 알아봅니다.\n\nDockerfile 작성:\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]\n\n컨테이너 실행:\ndocker build -t my-app .\ndocker run -p 3000:3000 my-app\n\nDocker Compose:\nversion: '3.8'\nservices:\n  web:\n    build: .\n    ports:\n      - \"3000:3000\"\n  db:\n    image: postgres:13\n    environment:\n      POSTGRES_DB: myapp\n\n컨테이너화를 통해 일관된 개발 환경을 구축하고 배포를 단순화할 수 있습니다.",
    author: "도커맨",
    views: 221,
    date: "2025-01-26"
  }
];

// 더 많은 주제들을 동적으로 생성
const additionalTopics = [];
const techStacks = [
  { name: "AWS 클라우드 서비스 입문", author: "아마존", content: "Amazon Web Services의 주요 서비스들과 클라우드 아키텍처 설계 기초를 학습합니다." },
  { name: "GraphQL vs REST API", author: "그래프큐엘", content: "전통적인 REST API와 현대적인 GraphQL의 장단점을 비교하고 선택 기준을 제시합니다." },
  { name: "Next.js SSR과 SSG 이해하기", author: "넥스트", content: "Next.js의 서버사이드 렌더링과 정적 사이트 생성 기능을 깊이 있게 알아봅시다." },
  { name: "Sass와 Less 전처리기 활용", author: "사스리스", content: "CSS 전처리기의 강력한 기능들을 활용한 효율적인 스타일 개발 방법을 소개합니다." },
  { name: "Jest를 활용한 단위 테스트", author: "제스트", content: "JavaScript 애플리케이션의 안정성을 위한 Jest 단위 테스트 작성법을 배워봅시다." },
  { name: "Cypress E2E 테스트 자동화", author: "사이프레스", content: "엔드투엔드 테스트 자동화를 위한 Cypress 도구 사용법과 베스트 프랙티스를 다룹니다." },
  { name: "Redux Toolkit 상태 관리", author: "리덕스", content: "복잡한 React 애플리케이션을 위한 Redux Toolkit을 활용한 효율적인 상태 관리 방법입니다." },
  { name: "Styled Components 스타일링", author: "스타일드", content: "CSS-in-JS 라이브러리인 Styled Components를 활용한 컴포넌트 기반 스타일링을 알아봅시다." },
  { name: "Zustand 경량 상태 관리", author: "주스탄드", content: "Redux의 대안으로 주목받는 Zustand를 활용한 간단하고 효율적인 상태 관리 방법입니다." },
  { name: "Storybook 컴포넌트 문서화", author: "스토리북", content: "UI 컴포넌트의 개발과 문서화를 위한 Storybook 도구 활용법을 상세히 알아봅시다." },
  { name: "ESLint와 Prettier 설정", author: "린터", content: "코드 품질과 일관성을 위한 ESLint와 Prettier 설정 가이드와 팀 개발 규칙 수립 방법입니다." },
  { name: "Vite 빌드 도구 활용법", author: "비트", content: "차세대 프론트엔드 빌드 도구 Vite의 특징과 기존 도구 대비 장점을 알아봅시다." },
  { name: "PWA 개발 완전 가이드", author: "피더블유에이", content: "Progressive Web App 개발을 위한 서비스 워커 매니페스트 파일 작성법을 다룹니다." },
  { name: "WebSocket 실시간 통신", author: "웹소켓", content: "웹 애플리케이션에서 실시간 양방향 통신을 위한 WebSocket 기술 활용법을 알아봅시다." },
  { name: "OAuth 2.0 인증 구현", author: "오어스", content: "안전한 사용자 인증을 위한 OAuth 2.0 프로토콜의 이해와 실제 구현 방법을 다룹니다." },
  { name: "JWT 토큰 인증 시스템", author: "제이더블유티", content: "JSON Web Token을 활용한 stateless 인증 시스템 구축과 보안 고려사항을 알아봅시다." },
  { name: "Nginx 웹 서버 설정", author: "엔진엑스", content: "고성능 웹 서버 Nginx의 기본 설정부터 로드 밸런싱까지 실무 활용법을 다룹니다." },
  { name: "Redis 캐싱 전략", author: "레디스", content: "In-memory 데이터베이스 Redis를 활용한 효율적인 캐싱 전략과 성능 개선 방법입니다." },
  { name: "MySQL 쿼리 최적화", author: "마이에스큐엘", content: "대용량 데이터베이스에서의 쿼리 성능 최적화 기법과 인덱스 활용 방법을 알아봅시다." },
  { name: "PostgreSQL 고급 기능", author: "포스트그레", content: "오픈소스 관계형 데이터베이스 PostgreSQL의 고급 기능과 최적화 기법을 다룹니다." },
  { name: "ElasticSearch 검색 엔진", author: "일래스틱", content: "대용량 데이터 검색을 위한 ElasticSearch 구축과 검색 쿼리 최적화 방법을 알아봅시다." },
  { name: "Kubernetes 컨테이너 오케스트레이션", author: "쿠버네티스", content: "마이크로서비스 아키텍처를 위한 Kubernetes 클러스터 관리와 배포 자동화를 다룹니다." },
  { name: "CI/CD 파이프라인 구축", author: "시아이시디", content: "지속적 통합과 배포를 위한 GitHub Actions Jenkins를 활용한 자동화 파이프라인 구축법입니다." },
  { name: "Terraform 인프라 관리", author: "테라폼", content: "코드로 인프라를 관리하는 Infrastructure as Code Terraform 활용법을 알아봅시다." },
  { name: "Monitoring과 Logging", author: "모니터링", content: "애플리케이션 모니터링과 로그 관리를 위한 Prometheus Grafana ELK 스택 활용법입니다." },
  { name: "마이크로서비스 아키텍처", author: "마이크로", content: "대규모 시스템을 위한 마이크로서비스 아키텍처 설계 원칙과 구현 전략을 다룹니다." },
  { name: "DDD 도메인 주도 설계", author: "디디디", content: "복잡한 비즈니스 로직을 효과적으로 관리하기 위한 Domain Driven Design 방법론을 알아봅시다." },
  { name: "TDD 테스트 주도 개발", author: "티디디", content: "테스트를 먼저 작성하는 TDD 개발 방법론과 실제 적용 사례를 통해 학습해봅시다." },
  { name: "Clean Code 작성법", author: "클린코드", content: "읽기 쉽고 유지보수가 용이한 클린 코드 작성을 위한 원칙과 실제 리팩토링 사례입니다." },
  { name: "SOLID 객체지향 원칙", author: "솔리드", content: "객체지향 프로그래밍의 5가지 핵심 원칙 SOLID를 이해하고 실제 코드에 적용해봅시다." },
  { name: "디자인 패턴 활용법", author: "패턴왕", content: "소프트웨어 개발에서 자주 사용되는 디자인 패턴들의 개념과 JavaScript에서의 구현 방법입니다." },
  { name: "함수형 프로그래밍 기초", author: "함수형", content: "JavaScript에서의 함수형 프로그래밍 패러다임과 불변성 순수함수의 중요성을 알아봅시다." },
  { name: "비동기 프로그래밍 마스터", author: "비동기", content: "Promise async/await를 활용한 효율적인 비동기 프로그래밍 패턴과 에러 처리 방법입니다." },
  { name: "웹 접근성 가이드라인", author: "접근성", content: "모든 사용자가 접근 가능한 웹 개발을 위한 WCAG 가이드라인과 실제 구현 방법을 다룹니다." },
  { name: "반응형 웹 디자인", author: "반응형", content: "다양한 디바이스에서 최적화된 사용자 경험을 제공하는 반응형 웹 디자인 기법을 알아봅시다." },
  { name: "SEO 최적화 전략", author: "에스이오", content: "검색 엔진 최적화를 위한 메타 태그 구조화된 데이터 사이트맵 최적화 방법입니다." },
  { name: "웹 보안 기초", author: "보안왕", content: "XSS CSRF SQL Injection 등 주요 웹 보안 취약점과 방어 기법을 알아봅시다." },
  { name: "HTTPS와 SSL/TLS", author: "에이치티티피에스", content: "웹 통신 보안을 위한 HTTPS 프로토콜과 SSL/TLS 인증서 설정 방법을 다룹니다." },
  { name: "Chrome DevTools 활용법", author: "크롬툴", content: "웹 개발과 디버깅을 위한 Chrome 개발자 도구의 고급 기능과 활용 팁을 소개합니다." },
  { name: "VS Code 확장 프로그램", author: "브이에스코드", content: "개발 생산성 향상을 위한 Visual Studio Code 필수 확장 프로그램과 설정 방법입니다." },
  { name: "Git 고급 명령어", author: "깃마스터", content: "기본적인 Git 사용법을 넘어서는 고급 명령어와 복잡한 상황에서의 문제 해결 방법입니다." },
  { name: "Linux 서버 관리", author: "리눅스", content: "개발자를 위한 Linux 서버 기초 관리와 쉘 스크립트 작성 방법을 알아봅시다." },
  { name: "API 문서 자동화", author: "스웨거", content: "Swagger OpenAPI를 활용한 REST API 문서 자동화와 API 테스트 환경 구축법입니다." },
  { name: "Postman API 테스트", author: "포스트맨", content: "API 개발과 테스트를 위한 Postman 도구 활용법과 자동화된 테스트 작성 방법입니다." },
  { name: "WebRTC 실시간 미디어", author: "웹알티씨", content: "웹 브라우저 간 실시간 음성 영상 통신을 위한 WebRTC 기술 활용법을 알아봅시다." },
  { name: "WebAssembly 성능 최적화", author: "웹어셈블리", content: "웹에서 네이티브 성능을 제공하는 WebAssembly 기술과 C/C++ Rust 연동 방법입니다." },
  { name: "Service Worker 활용", author: "서비스워커", content: "오프라인 기능과 백그라운드 동기화를 위한 Service Worker API 활용법을 다룹니다." },
  { name: "Web Components 표준", author: "웹컴포넌트", content: "재사용 가능한 커스텀 엘리먼트 개발을 위한 Web Components 표준 기술을 알아봅시다." },
  { name: "Intersection Observer API", author: "인터섹션", content: "무한 스크롤과 레이지 로딩 구현을 위한 Intersection Observer API 활용법입니다." },
  { name: "Canvas API 그래픽", author: "캔버스", content: "HTML5 Canvas를 활용한 2D 그래픽과 애니메이션 구현 기법을 상세히 알아봅시다." }
];

let csvContent = csvHeader;

// 기존 10개 항목
const existingItems = [
  'React 개발 환경 설정 가이드,"React 프로젝트를 시작하기 위한 개발 환경 설정 방법을 알아보겠습니다.',
  'JavaScript ES6+ 신기능 정리,"ES6부터 최신 JavaScript까지의 새로운 기능들을 정리했습니다.',
  'CSS Grid와 Flexbox 비교,"레이아웃을 위한 CSS Grid와 Flexbox의 차이점과 언제 어떤 것을 사용해야 하는지 알아봅시다.',
  'Node.js API 서버 구축하기,"Express.js를 사용한 RESTful API 서버 구축 과정을 단계별로 설명합니다.',
  'Git 브랜치 전략 가이드,"효율적인 Git 브랜치 관리를 위한 Git Flow와 GitHub Flow 전략을 비교 분석합니다.',
  'TypeScript 기본부터 고급까지,"TypeScript는 JavaScript에 정적 타입을 추가한 언어로, 대규모 애플리케이션 개발에 필수적인 도구입니다.',
  'Vue.js 3 Composition API 활용법,"Vue 3의 Composition API는 로직 재사용성과 타입 추론을 개선한 새로운 API입니다.',
  '웹 성능 최적화 기법,"웹 애플리케이션의 성능을 향상시키기 위한 다양한 최적화 기법들을 알아봅시다.',
  'MongoDB 데이터 모델링,"NoSQL 데이터베이스인 MongoDB의 효율적인 데이터 모델링 패턴을 학습합니다.',
  'React Hooks 심화 가이드,"React Hooks의 고급 활용법과 커스텀 훅 개발 방법을 상세히 알아봅시다.'
];

// 나머지 240개 항목 생성
for (let i = 11; i <= 250; i++) {
  const topicIndex = (i - 11) % techStacks.length;
  const topic = techStacks[topicIndex];
  const randomViews = Math.floor(Math.random() * 300) + 50;
  const date = new Date('2025-01-01');
  date.setDate(date.getDate() + i - 1);
  const formattedDate = date.toISOString().split('T')[0];

  const detailedContent = `${topic.content} 주요 특징: 현대적인 개발 방법론 적용, 실무 중심의 실용적 접근, 단계별 상세 가이드 제공, 최신 트렌드 반영. 구현 방법: 1. 기본 개념 이해 2. 실습 환경 구성 3. 핵심 기능 구현 4. 최적화 및 배포. 실제 프로젝트에서 이러한 기술들을 적용하면 더 효율적이고 유지보수가 용이한 코드를 작성할 수 있습니다.`;

  csvContent += `${i},"${topic.name} ${i}","${detailedContent}",${topic.author},${randomViews},${formattedDate}\n`;
}

fs.writeFileSync('sample-bbs-data-full.csv', csvContent, 'utf8');
console.log('250개 항목이 포함된 CSV 파일이 생성되었습니다.');
